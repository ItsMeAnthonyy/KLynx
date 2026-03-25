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
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getAnimalBiteReportData, processAnimalBiteData, getAnimalBiteBarangays } from '../api/reportsApi';
import useAuth from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/use-toast';
import styles from './DiseaseReports.module.css';
import Sidebar from '../../../components/Sidebar';
import EmergencyButton from '../../../components/EmergencyButton';
import ProfileDropdown from '../../../components/ProfileDropdown';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const AGE_GROUPS = ['0-17', '18-40', '41-59', '60+'];
const QUARTERS = [
    { value: 1, label: 'Q1 (Jan - Mar)', months: [1, 2, 3] },
    { value: 2, label: 'Q2 (Apr - Jun)', months: [4, 5, 6] },
    { value: 3, label: 'Q3 (Jul - Sep)', months: [7, 8, 9] },
    { value: 4, label: 'Q4 (Oct - Dec)', months: [10, 11, 12] },
];
const ROWS_PER_PAGE = 10;

export default function AnimalBiteReports() {
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
    const [filterAgeGroup, setFilterAgeGroup] = useState('');
    const [barangays, setBarangays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [yearlyData, setYearlyData] = useState(null);
    const [formsPage, setFormsPage] = useState(1);

    useEffect(() => {
        loadBarangays();
    }, []);

    useEffect(() => {
        if (viewMode === 'monthly') {
            loadMonthlyData();
        } else if (viewMode === 'quarterly') {
            loadQuarterlyData();
        } else {
            loadYearlyData();
        }
        setFormsPage(1);
    }, [viewMode, selectedYear, selectedMonth, selectedQuarter, filterBarangay, filterSex, filterAgeGroup]);

    const loadBarangays = async () => {
        const brgys = await getAnimalBiteBarangays();
        setBarangays(brgys);
    };

    const loadMonthlyData = async () => {
        setIsLoading(true);
        try {
            const records = await getAnimalBiteReportData(selectedYear, selectedMonth);
            const processed = processAnimalBiteData(records, filterBarangay || null, filterSex || null, filterAgeGroup || null);
            setReportData(processed);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load animal bite report data', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const loadQuarterlyData = async () => {
        setIsLoading(true);
        try {
            const quarterMonths = QUARTERS.find(q => q.value === selectedQuarter)?.months || [1, 2, 3];
            let allRecords = [];
        for (const m of quarterMonths) {
            const records = await getAnimalBiteReportData(selectedYear, m);
            console.log(`Records for month ${m}:`, records);
            allRecords = allRecords.concat(records);
        }
        const processed = processAnimalBiteData(allRecords, filterBarangay || null, filterSex || null, filterAgeGroup || null);
        setReportData(processed);
        console.log("ALL RECORDS FOR QUARTER:", allRecords);

        // Build per-month trend for the quarter
        const monthlyTrend = {};
        for (const m of quarterMonths) {
            const monthRecords = allRecords.filter(r => {
                const date = new Date(r.date_of_bite || r.visit_date_time);
                console.log(`Filtering for month ${m}: record date ${date}`);
                return date.getMonth() + 1 === m;
            });
            //monthlyTrend[m] = processAnimalBiteData(monthRecords);
            const monthProcessed = processAnimalBiteData(monthRecords, filterBarangay || null, filterSex || null, filterAgeGroup || null);
            monthlyTrend[m] = {
                byAnimalType: monthProcessed.byAnimalType,
                byAgeGroup: monthProcessed.byAgeGroup,
                totalCases: monthProcessed.totalCases
            };
        }
        setYearlyData(monthlyTrend);
        console.log("QUARTERLY TREND??", monthlyTrend);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load quarterly animal bite data', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const loadYearlyData = async () => {
        setIsLoading(true);
        try {
            const records = await getAnimalBiteReportData(selectedYear);
            const processed = processAnimalBiteData(records, filterBarangay || null, filterSex || null, filterAgeGroup || null);
            setReportData(processed);

            const monthlyTrend = {};
            for (let m = 1; m <= 12; m++) {
                const monthRecords = records.filter(r => {
                    const date = new Date(r.date_of_bite || r.visit_date_time);
                    return date.getMonth() + 1 === m;
                });
                monthlyTrend[m] = processAnimalBiteData(monthRecords, filterBarangay || null, filterSex || null, filterAgeGroup || null);
            }
            setYearlyData(monthlyTrend);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load yearly animal bite data', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const quarterLabel = `${QUARTERS.find(q => q.value === selectedQuarter)?.label} ${selectedYear}`;

    const getPeriodLabel = () => {
        if (viewMode === 'monthly') return `${MONTHS[selectedMonth - 1]} ${selectedYear}`;
        if (viewMode === 'quarterly') return quarterLabel;
        return `Year ${selectedYear}`;
    };

    const getAnimalTypeChartData = () => {
        if (!reportData?.byAnimalType) return [];
            return Object.entries(reportData.byAnimalType).map(([name, data]) => ({
                name, total: data.total, newCases: data.newCases, underTreatment: data.underTreatment, recovered: data.recovered, deaths: data.deaths
        }));
    };

    // Forms report data with pagination
    const formsData = useMemo(() => getAnimalTypeChartData(), [reportData]);
    const totalFormsPages = Math.max(1, Math.ceil(formsData.length / ROWS_PER_PAGE));
    const paginatedForms = formsData.slice((formsPage - 1) * ROWS_PER_PAGE, formsPage * ROWS_PER_PAGE);

    // Chart data functions
    const getPieChartData = () => {
        const data = getAnimalTypeChartData();
        if (!data.length) return null;
        return {
            labels: data.map(d => d.name),
            datasets: [{ data: data.map(d => d.total), backgroundColor: COLORS.slice(0, data.length), borderColor: COLORS.slice(0, data.length), borderWidth: 2 }]
        };
    };

    const getAgeGroupChartData = () => {
        if (!reportData?.byAgeGroup) return null;
        const data = AGE_GROUPS.map(group => reportData.byAgeGroup[group] || 0);
        if (data.every(d => d === 0)) return null;
        return {
            labels: AGE_GROUPS,
            datasets: [{ label: 'Cases', data, backgroundColor: 'hsl(221, 83%, 53%)', borderColor: 'hsl(221, 83%, 43%)', borderWidth: 1, borderRadius: 4 }]
        };
    };

    const getMonthlyTrendChartData = () => {
        if (!yearlyData) return null;

        // Collect all unique animal types across months
        const allAnimalTypes = new Set();
        const monthKeys = viewMode === 'quarterly'
            ? (QUARTERS.find(q => q.value === selectedQuarter)?.months || [1, 2, 3])
            : Array.from({ length: 12 }, (_, i) => i + 1);
      
        monthKeys.forEach(m => {
            const types = yearlyData[m]?.byAnimalType;
            if (types) Object.keys(types).forEach(t => allAnimalTypes.add(t));
        });

        const animalTypes = Array.from(allAnimalTypes);
        if (!animalTypes.length) return null;

        const LINE_COLORS = ['#FF6B6B', '#FFB347', '#9B59B6', '#2C3E50', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7DC6F'];

        const datasets = animalTypes.map((type, idx) => ({
            label: type,
            data: monthKeys.map(m => yearlyData[m]?.byAnimalType?.[type]?.total || 0),
            borderColor: LINE_COLORS[idx % LINE_COLORS.length],
            backgroundColor: LINE_COLORS[idx % LINE_COLORS.length],
            borderWidth: 2.5,
            tension: 0.4,
            fill: false,
            pointBackgroundColor: '#fff',
            pointBorderColor: LINE_COLORS[idx % LINE_COLORS.length],
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
        }));

        return {
            labels: monthKeys.map(m => MONTHS[m - 1]),
            datasets,
        };
    };

    const chartOptions = {
        indexAxis: 'y',
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 12 }, padding: 15 } },
            tooltip: { backgroundColor: 'hsl(0, 0%, 100%)', titleColor: 'hsl(0, 0%, 10%)', bodyColor: 'hsl(0, 0%, 20%)', borderColor: 'hsl(0, 0%, 80%)', borderWidth: 1, padding: 12, cornerRadius: 8 }
        },
        scales: {
            x: { 
                ticks: { 
                    font: { size: 11 }, 
                    stepSize: 1
                }, 
                grid: { display: false } },
            y: { ticks: { font: { size: 11 } }, grid: { color: 'hsl(0, 0%, 90%)' } }
        }
    };

    const lineChartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 12 }, padding: 15 } },
            tooltip: { backgroundColor: 'hsl(0, 0%, 100%)', titleColor: 'hsl(0, 0%, 10%)', bodyColor: 'hsl(0, 0%, 20%)', borderColor: 'hsl(0, 0%, 80%)', borderWidth: 1, padding: 12, cornerRadius: 8 }
        },
        scales: {
            x: { ticks: { font: { size: 11 } }, grid: { display: false } },
            y: { 
                ticks: { 
                    font: { size: 11 },
                    stepSize: 1
                }, 
                grid: { color: 'hsl(0, 0%, 90%)' } }
        }
    };

    const pieOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { font: { size: 12 }, padding: 15, boxWidth: 15 } },
            tooltip: { backgroundColor: 'hsl(0, 0%, 100%)', titleColor: 'hsl(0, 0%, 10%)', bodyColor: 'hsl(0, 0%, 20%)', borderColor: 'hsl(0, 0%, 80%)', borderWidth: 1, padding: 12, cornerRadius: 8 }
        }
    };

    const lineOptions = { ...lineChartOptions, plugins: { ...lineChartOptions.plugins, legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 15, usePointStyle: true, pointStyle: 'circle' } } } };

    const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>ANIMAL BITE REPORTS</h1>
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
                            {barangays.map((brgy, index) => (
                                <option key={index} value={brgy}>
                                    {brgy}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Age Group</label>
                        <select value={filterAgeGroup} onChange={(e) => setFilterAgeGroup(e.target.value)} className={styles.filterSelect}>
                            <option value="">All Ages</option>
                            {AGE_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                        </select>
                    </div> */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Sex</label>
                        <select value={filterSex} onChange={(e) => setFilterSex(e.target.value)} className={styles.filterSelect}>
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading report data...</p>
                    </div>
                ) : (
                   <>
                        {/* Summary Cards */}
                        <div className={styles.summaryCards}>
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryIcon}>🐕</div>
                                <div className={styles.summaryContent}>
                                    <span className={styles.summaryValue}>{reportData?.totalCases || 0}</span>
                                    <span className={styles.summaryLabel}>Total Cases</span>
                                </div>
                            </div>
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryIcon}>🦊</div>
                                <div className={styles.summaryContent}>
                                    <span className={styles.summaryValue}>{Object.keys(reportData?.byAnimalType || {}).length}</span>
                                    <span className={styles.summaryLabel}>Animal Types</span>
                                </div>
                            </div>
                        </div>

                        {/* Trend Chart (quarterly & yearly) */}
                        {viewMode !== 'monthly' && (
                            <div className={styles.chartSection}>
                                <h3 className={styles.chartTitle}>
                                    📈 {viewMode === 'quarterly' ? `Monthly Trend — ${quarterLabel}` : `Monthly Trend — ${selectedYear}`}
                                </h3>
                                {(viewMode === 'yearly' || viewMode === 'quarterly') && getMonthlyTrendChartData() ? (
                                    <div className={styles.chartWrapper} style={{ height: '300px' }}>
                                        <Line data={getMonthlyTrendChartData()} options={lineOptions} />
                                    </div>
                                ) : (
                                    <div className={styles.noData}>
                                        <span className={styles.noDataIcon}>📭</span>
                                        <p>No disease data available for the selected period</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Charts Row */}
                        <div className={styles.chartsRow}>
                            <div className={styles.chartHalf}>
                                <h3 className={styles.chartTitle}>📊 Distribution by Animal Type</h3>
                                {getPieChartData() ? (
                                    <div className={styles.chartWrapper} style={{ height: '300px' }}>
                                        <Pie data={getPieChartData()} options={pieOptions} />
                                    </div>
                                ) : (
                                    <div className={styles.noDataSmall}>No data available</div>
                                )}
                            </div>
                            <div className={styles.chartHalf}>
                                <h3 className={styles.chartTitle}>👥 Cases by Age Group</h3>
                                {getAgeGroupChartData() ? (
                                    <div className={styles.chartWrapper} style={{ height: '300px' }}>
                                        <Bar data={getAgeGroupChartData()} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
                                    </div>
                                ) : (
                                    <div className={styles.noDataSmall}>No data available</div>
                                )}
                            </div>
                        </div>

                        {/* Forms Report Section */}
                        <div className={styles.formsSection}>
                            <div className={styles.formsHeader}>
                                <h3 className={styles.formsTitle}>📝 Forms Report — Animal Bite Cases — {getPeriodLabel()}</h3>
                                <button className={styles.formsPdfBtn} /*onClick={exportFormsPDF}*/ disabled={formsData.length === 0}>
                                    📄 Export / Download PDF
                                </button>
                            </div>

                            {formsData.length > 0 ? (
                                <>
                                    <div className={styles.tableWrapper}>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Animal Type</th>
                                                    <th>Total Cases</th>
                                                    <th>New Cases</th>
                                                    <th>Under Treatment</th>
                                                    <th>Recovered</th>
                                                    <th>Deaths</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedForms.map((d, i) => (
                                                    <tr key={d.name}>
                                                        <td>{(formsPage - 1) * ROWS_PER_PAGE + i + 1}</td>
                                                        <td>
                                                            <span className={styles.animalBadge}>
                                                                {d.name === 'Dog' ? '🐕' : d.name === 'Cat' ? '🐱' : d.name === 'Monkey' ? '🐒' : '🐾'} {d.name}
                                                            </span>
                                                        </td>
                                                        <td><strong>{d.total}</strong></td>
                                                        <td className={styles.newCases}>{d.newCases}</td>
                                                        <td className={styles.underTreatment}>{d.underTreatment}</td>
                                                        <td className={styles.recovered}>{d.recovered}</td>
                                                        <td className={styles.deaths}>{d.deaths}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles.pagination}>
                                        <button className={styles.pageBtn} onClick={() => setFormsPage(1)} disabled={formsPage === 1}>« First</button>
                                        <button className={styles.pageBtn} onClick={() => setFormsPage(p => p - 1)} disabled={formsPage === 1}>‹ Prev</button>
                                        <span className={styles.pageInfo}>Page {formsPage} of {totalFormsPages} ({formsData.length} entries)</span>
                                        <button className={styles.pageBtn} onClick={() => setFormsPage(p => p + 1)} disabled={formsPage === totalFormsPages}>Next ›</button>
                                        <button className={styles.pageBtn} onClick={() => setFormsPage(totalFormsPages)} disabled={formsPage === totalFormsPages}>Last »</button>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.noData}>
                                    <span className={styles.noDataIcon}>🐾</span>
                                    <p>No animal bite data available for the selected period</p>
                                </div>
                            )}
                        </div>
                   </> 
                )}
            </main>


        </div>
    );
}