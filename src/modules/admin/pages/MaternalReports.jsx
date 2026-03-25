import { useState, useEffect, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getPrenatalReportData, processPrenatalData,/* processPrenatalForms,*/ getMaternalBarangays } from '../api/reportsApi';
import useAuth from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/use-toast';
// import ReportExportButton from './ReportExportButton';
import styles from './DiseaseReports.module.css';
import Sidebar from '../../../components/Sidebar';
import EmergencyButton from '../../../components/EmergencyButton';
import ProfileDropdown from '../../../components/ProfileDropdown';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    PointElement, 
    LineElement
);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const AGE_GROUPS = ['Under 18', '18-25', '26-30', '31-35', '36+'];
const QUARTERS = [
    { value: 1, label: 'Q1 (Jan - Mar)', months: [1, 2, 3] },
    { value: 2, label: 'Q2 (Apr - Jun)', months: [4, 5, 6] },
    { value: 3, label: 'Q3 (Jul - Sep)', months: [7, 8, 9] },
    { value: 4, label: 'Q4 (Oct - Dec)', months: [10, 11, 12] },
];
const ROWS_PER_PAGE = 10;

export default function MaternalReports() {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");
    const { toast } = useToast();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentQuarter = Math.ceil(currentMonth / 3);

    const [viewMode, setViewMode] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter);
    const [filterBarangay, setFilterBarangay] = useState('');
    const [filterSex, setFilterSex] = useState('');
    const [barangays, setBarangays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [yearlyTrend, setYearlyTrend] = useState(null);
    const [allVisits, setAllVisits] = useState([]);
    const [formsPage, setFormsPage] = useState(1);

    useEffect(() => { 
        loadBarangays(); 
    }, []);

    useEffect(() => {
        if (viewMode === 'monthly') loadMonthlyData();
        else if (viewMode === 'quarterly') loadQuarterlyData();
        else loadYearlyData();
        setFormsPage(1);
    }, [viewMode, selectedYear, selectedMonth, selectedQuarter, filterBarangay, filterSex]);

    const loadBarangays = async () => {
        const brgys = await getMaternalBarangays();
        setBarangays(brgys);
    };

    const loadMonthlyData = async () => {
        setIsLoading(true);
        try {
            const visits = await getPrenatalReportData(selectedYear, selectedMonth);
            setAllVisits(visits);
            console.log("Raw Visits: ", visits);
            const processed = processPrenatalData(visits, filterBarangay || null, filterSex || null);
            console.log("Processed Data: ", processed);
            setReportData(processed);
            setYearlyTrend(null);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load prenatal report data', variant: 'destructive' });
        } finally { 
            setIsLoading(false);
        }
    };

    const loadQuarterlyData = async () => {
        setIsLoading(true);
        try {
            const quarterMonths = QUARTERS.find(q => q.value === selectedQuarter)?.months || [1, 2, 3];
            let all = [];
            for (const m of quarterMonths) {
                const visits = await getPrenatalReportData(selectedYear, m);
                console.log(`Raw Visits for ${MONTHS[m-1]}: `, visits);
                all = all.concat(visits);
            }
            setAllVisits(all);
            const processed = processPrenatalData(all, filterBarangay || null, filterSex || null);
            setReportData(processed);
            console.log("ALL RECORDS FOR QUARTERS: ", all, "PROCESSED QUARTERLY DATA: ",processed);

            const trend = {};
            for (const m of quarterMonths) {
                const monthVisits = all.filter(v => new Date(v.visit_date_time).getMonth() + 1 === m);
                trend[m] = processPrenatalData(monthVisits, filterBarangay || null, filterSex || null);
            }
            setYearlyTrend(trend);
            console.log("QUARTERLY TREND??", trend);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load quarterly prenatal data', variant: 'destructive' });
        } finally { 
            setIsLoading(false); 
        }
    };

    const loadYearlyData = async () => {
        setIsLoading(true);
        try {
            const visits = await getPrenatalReportData(selectedYear);
            setAllVisits(visits);
            const processed = processPrenatalData(visits, filterBarangay || null, filterSex || null);
            setReportData(processed);

            const trend = {};
            for (let m = 1; m <= 12; m++) {
                const monthVisits = visits.filter(v => new Date(v.visit_date_time).getMonth() + 1 === m);
                trend[m] = processPrenatalData(monthVisits, filterBarangay || null, filterSex || null);
            }
            setYearlyTrend(trend);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load yearly prenatal data', variant: 'destructive' });
        } finally { 
            setIsLoading(false); 
        }
    };

    const getPeriodLabel = () => {
        if (viewMode === 'monthly') return `${FULL_MONTHS[selectedMonth - 1]} ${selectedYear}`;
        if (viewMode === 'quarterly') return `${QUARTERS.find(q => q.value === selectedQuarter)?.label} ${selectedYear}`;
        return `Year ${selectedYear}`;
    };

    // Charts
    const getAgeGroupChartData = () => {
        if (!reportData?.byAgeGroup) return null;
        const data = AGE_GROUPS.map(g => reportData.byAgeGroup[g] || 0);
        if (data.every(d => d === 0)) return null;
        return {
            labels: AGE_GROUPS,
            datasets: [{
                label: ' Number of Patients',
                data,
                backgroundColor: ['#FF6B8A', '#E91E8C', '#AB47BC', '#7E57C2', '#5C6BC0'],
                borderColor: ['#E0537A', '#C4187A', '#8E24AA', '#5E35B1', '#3F51B5'],
                borderWidth: 1,
                borderRadius: 6,
            }]
        };
    };

    const getTrendChartData = () => {
        if (!yearlyTrend) return null;
        const monthKeys = viewMode === 'quarterly'
            ? (QUARTERS.find(q => q.value === selectedQuarter)?.months || [1, 2, 3])
            : Array.from({ length: 12 }, (_, i) => i + 1);

        const data = monthKeys.map(m => yearlyTrend[m]?.totalCheckups || 0);
        if (data.every(d => d === 0)) return null;

        return {
            labels: monthKeys.map(m => MONTHS[m - 1]),
            datasets: [{
                label: 'Prenatal Checkups',
                data,
                borderColor: '#E91E8C',
                backgroundColor: '#E91E8C',
                borderWidth: 2.5,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#E91E8C',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        };
    };

    const chartOptions = {
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 12 }, padding: 15 } },
            tooltip: { backgroundColor: 'hsl(0, 0%, 100%)', titleColor: 'hsl(0, 0%, 10%)', bodyColor: 'hsl(0, 0%, 20%)', borderColor: 'hsl(0, 0%, 80%)', borderWidth: 1, padding: 12, cornerRadius: 8 }
        },
        scales: {
            x: { ticks: { font: { size: 11 } }, grid: { display: false } },
            y: { 
                ticks: { 
                    font: { size: 11 },
                    stepSize: 1,
                }, grid: { color: 'hsl(0, 0%, 90%)' } }
        }
    };

    const lineOptions = { ...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 15, usePointStyle: true, pointStyle: 'circle' } } } };

    const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>MATERNAL REPORTS</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <EmergencyButton />
                        <ProfileDropdown 
                            email="admin@klynx.com"
                            name="Admin User"
                        />
                    </div>
                </div>

                <div className={styles.viewToggle}>
                    <button 
                        className={`${styles.toggleBtn} ${viewMode === 'monthly' ? styles.toggleActive : ''}`} 
                        onClick={() => setViewMode('monthly')}
                    >
                        📅 Monthly
                    </button>
                    <button 
                        className={`${styles.toggleBtn} ${viewMode === 'quarterly' ? styles.toggleActive : ''}`} 
                        onClick={() => setViewMode('quarterly')}
                    >
                        📆 Quarterly
                    </button>
                    <button 
                        className={`${styles.toggleBtn} ${viewMode === 'yearly' ? styles.toggleActive : ''}`} 
                        onClick={() => setViewMode('yearly')}
                    >
                        📊 Yearly
                    </button>
                </div>

                {/* Filters */}
                <div className={styles.filterSection}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Year</label>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className={styles.filterSelect}>
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>

                    {viewMode === 'monthly' && (
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Month</label>
                            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className={styles.filterSelect}>
                                {MONTHS.map((month, index) => <option key={index} value={index + 1}>{month}</option>)}
                            </select>
                        </div>
                    )}

                    {viewMode === 'quarterly' && (
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Quarter</label>
                            <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(parseInt(e.target.value))} className={styles.filterSelect}>
                                {QUARTERS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                            </select>
                        </div>
                    )}

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Barangay</label>
                        <select value={filterBarangay} onChange={(e) => setFilterBarangay(e.target.value)} className={styles.filterSelect}>
                            <option value="">All Barangays</option>
                            {barangays.map(brgy => <option key={brgy} value={brgy}>{brgy}</option>)}
                        </select>
                    </div>
                    {/* <ReportExportButton reportType="disease" year={selectedYear} month={viewMode === 'monthly' ? selectedMonth : null} data={exportData} /> */}
                </div>

                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading prenatal report data...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Card */}
                        <div className={styles.summaryCards}>
                            <div className={styles.summaryCard} style={{ borderLeft: '4px solid #E91E8C' }}>
                                <div className={styles.summaryIcon}>🤰</div>
                                <div className={styles.summaryContent}>
                                    <span className={styles.summaryLabel}>PRENATAL CHECKUPS</span>
                                    <span className={styles.summaryValue}>{reportData?.totalCheckups || 0}</span>
                                </div>
                            </div>
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryIcon}>📍</div>
                                <div className={styles.summaryContent}>
                                    <span className={styles.summaryValue}>{Object.keys(reportData?.byBarangay || {}).length}</span>
                                    <span className={styles.summaryLabel}>Barangays</span>
                                </div>
                            </div>
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryIcon}>👩‍⚕️</div>
                                <div className={styles.summaryContent}>
                                    <span className={styles.summaryValue}>{AGE_GROUPS.filter(g => (reportData?.byAgeGroup?.[g] || 0) > 0).length}</span>
                                    <span className={styles.summaryLabel}>Age Groups Served</span>
                                </div>
                            </div>
                        </div>

                        {/* Age Group Distribution */}
                        <div className={styles.chartSection}>
                            <h3 className={styles.chartTitle}>👶 Age Group Distribution — {getPeriodLabel()}</h3>
                            {getAgeGroupChartData() ? (
                                <div className={styles.chartWrapper} style={{ height: '300px' }}>
                                    <Bar data={getAgeGroupChartData()} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
                                </div>
                            ) : (
                                <div className={styles.noDataSmall}>No data available</div>
                            )}
                        </div>

                        {viewMode !== 'monthly' && (
                            <div className={styles.chartSection}>
                                <h3 className={styles.chartTitle}>
                                    📈 Prenatal Care Trends — {getPeriodLabel()}
                                </h3>
                                {(viewMode === 'yearly' || viewMode === 'quarterly') && getTrendChartData() ? (
                                    <div className={styles.chartWrapper} style={{ height: '300px' }}>
                                        <Line data={getTrendChartData()} options={lineOptions} />
                                    </div>
                                ) : (
                                    <div className={styles.noData}>
                                        <span className={styles.noDataIcon}>📭</span>
                                        <p>No disease data available for the selected period</p>
                                    </div>
                                )}
                            </div>
                            
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

