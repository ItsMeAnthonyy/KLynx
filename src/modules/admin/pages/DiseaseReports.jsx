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
import { BiDownload } from 'react-icons/bi';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import useAuth from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/use-toast';

import { getDiseaseReportData, processDiseaseData, processDiseaseForms, getDiseaseBarangays, getYearlyOverview } from '../api/reportsApi';
import styles from './DiseaseReports.module.css';
import Sidebar from '../../../components/Sidebar';
import EmergencyButton from '../../../components/EmergencyButton';
import ProfileDropdown from '../../../components/ProfileDropdown';
import { exportFile } from '../api/reportsApi';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const QUARTERS = [
    { value: 1, label: 'Q1 (Jan - Mar)', months: [1, 2, 3] },
    { value: 2, label: 'Q2 (Apr - Jun)', months: [4, 5, 6] },
    { value: 3, label: 'Q3 (Jul - Sep)', months: [7, 8, 9] },
    { value: 4, label: 'Q4 (Oct - Dec)', months: [10, 11, 12] },
];
const ROWS_PER_PAGE = 10;


export default function DiseaseReports() {
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
    const [yearlyData, setYearlyData] = useState(null);
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [rawVisits, setRawVisits] = useState([]);
    const [formsPage, setFormsPage] = useState(1);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [exportLoading, setExportLoading] = useState({
        filteredExcel: false,
        filteredPdf: false,
    });

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
    }, [viewMode, selectedYear, selectedMonth, selectedQuarter, filterBarangay, filterSex]);

    const loadBarangays = async () => {
        const brgys = await getDiseaseBarangays();
        setBarangays(brgys);
    };

    const loadMonthlyData = async () => {
        setIsLoading(true);
        try {
            const visits = await getDiseaseReportData(selectedYear, selectedMonth);
            const processed = processDiseaseData(visits, filterBarangay || null, filterSex || null);
            setReportData(processed);
            setRawVisits(visits);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load disease report data',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const loadQuarterlyData = async () => {
        setIsLoading(true);
        try {
            const quarterMonths = QUARTERS.find(q => q.value === selectedQuarter)?.months || [1, 2, 3];
            let allVisits = [];
            for (const m of quarterMonths) {
                const visits = await getDiseaseReportData(selectedYear, m);
                console.log(`Visits for month ${m}:`, visits);
                allVisits = allVisits.concat(visits);
                console.log('All visits so far:', allVisits);
            }
            const processed = processDiseaseData(allVisits, filterBarangay || null, filterSex || null);
            setReportData(processed);
            setRawVisits(allVisits);

            // Build per-month data for the quarter
            const quarterlyOverview = {};
            for (const m of quarterMonths) {
                const monthVisits = allVisits.filter(v => {
                    const visitMonth = new Date(v.visit_date_time).getMonth() + 1;
                    return visitMonth === m;
                });
                const monthProcessed = processDiseaseData(monthVisits, filterBarangay || null, filterSex || null);
                quarterlyOverview[m] = {
                    top10: monthProcessed.top10Diseases,
                    totalCases: monthProcessed.totalCases,
                    byAgeGroup: monthProcessed.diseaseByAgeGroup,
                    byBarangay: monthProcessed.diseaseByBarangay,
                    bySex: monthProcessed.diseaseBySex
                };
            }
            setYearlyData(quarterlyOverview);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load quarterly report data', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }

    const loadYearlyData = async () => {
        setIsLoading(true);
        try {
            const overview = await getYearlyOverview(selectedYear, filterBarangay || null, filterSex || null);
            setYearlyData(overview);
            
            const visits = await getDiseaseReportData(selectedYear);
            const processed = processDiseaseData(visits, filterBarangay || null, filterSex || null);
            setReportData(processed);
            setRawVisits(visits);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load yearly overview',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Forms report data
    const formsData = useMemo(() => processDiseaseForms(rawVisits, filterBarangay || null, filterSex || null), [rawVisits, filterBarangay, filterSex]);
    const totalFormsPages = Math.max(1, Math.ceil(formsData.length / ROWS_PER_PAGE));
    const paginatedForms = formsData.slice((formsPage - 1) * ROWS_PER_PAGE, formsPage * ROWS_PER_PAGE);
    
    const today = new Date();
    const todayLabel = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const monthYearLabel = `${MONTHS_FULL[selectedMonth - 1]} ${selectedYear}`;
    const quarterLabel = `${QUARTERS.find(q => q.value === selectedQuarter)?.label} ${selectedYear}`;

    const getPeriodLabel = () => {
        if (viewMode === 'monthly') return monthYearLabel;
        if (viewMode === 'quarterly') return quarterLabel;
        return `Year ${selectedYear}`;
    };

    // Chart data for Top 10 Diseases (horizontal bar)
    const getTop10ChartData = () => {
        if (!reportData?.top10Diseases?.length) return null;
    
        return {
            labels: reportData.top10Diseases.map(d => 
                d.name.length > 25 ? d.name.substring(0, 25) + '...' : d.name
            ),
            datasets: [{
                label: 'Cases',
                data: reportData.top10Diseases.map(d => d.count),
                backgroundColor: 'hsl(221, 83%, 53%)',
                borderColor: 'hsl(221, 83%, 43%)',
                borderWidth: 1,
                borderRadius: 4,
            }]
        };
    }

    // Chart data for yearly/quarterly overview
    const getOverviewChartData = () => {
        if (!yearlyData) return null;
    
        if (viewMode === 'quarterly') {
            const quarterMonths = QUARTERS.find(q => q.value === selectedQuarter)?.months || [1, 2, 3];
            console.log("QUARTERLY YEARLY DATA: ", yearlyData);
            return {
                labels: quarterMonths.map(m => MONTHS[m - 1]),
                datasets: [{
                    label: 'Cases',
                    data: quarterMonths.map(m => yearlyData[m]?.totalCases || 0),
                    backgroundColor: 'hsl(221, 83%, 53%)',
                    borderColor: 'hsl(221, 83%, 43%)',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            };
        }

        return {
            labels: MONTHS,
            datasets: [{
                label: 'Cases',
                data: MONTHS.map((_, index) => yearlyData[index + 1]?.totalCases || 0),
                backgroundColor: 'hsl(221, 83%, 53%)',
                borderColor: 'hsl(221, 83%, 43%)',
                borderWidth: 1,
                borderRadius: 4,
            }]
        };
    };



    const getPieChartData = () => {
        if (!reportData?.top10Diseases?.length) return null;

        return {
            labels: reportData.top10Diseases.map(d => 
                d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name
            ),
            datasets: [{
                data: reportData.top10Diseases.map(d => d.count),
                backgroundColor: COLORS,
                borderColor: COLORS.map(c => c),
                borderWidth: 2,
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 12 },
                    padding: 15,
                }
            },
            tooltip: {
                backgroundColor: 'hsl(0, 0%, 100%)',
                titleColor: 'hsl(0, 0%, 10%)',
                bodyColor: 'hsl(0, 0%, 20%)',
                borderColor: 'hsl(0, 0%, 80%)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                ticks: { font: { size: 11 } },
                grid: { display: false }
            },
            y: {
                ticks: { font: { size: 11 } },
                grid: { color: 'hsl(0, 0%, 90%)' }
            }
        }
    };

    const horizontalBarOptions = {
        ...chartOptions,
        indexAxis: 'y',
        plugins: { ...chartOptions.plugins, legend: { display: false } },
        scales: {
            x: { ticks: { font: { size: 11 } }, grid: { color: 'hsl(0, 0%, 90%)' } },
            y: { ticks: { font: { size: 11 } }, grid: { display: false } }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

    const handleBarClick = (event, elements) => {
        if (elements.length > 0 && viewMode === 'yearly') {
            const monthIndex = elements[0].index;
            setExpandedMonth(monthIndex + 1);
        }
    };
    

    const handleFilteredPdf = async () => {
        try {
            setExportLoading(prev => ({
                ...prev,
                filteredPdf: true,
            }));

            await exportFile({
                endpoint: "export_disease_report_pdf.php",
                filename: `Disease_Report_${viewMode}.pdf`,
                params: {
                    scope: "filtered",

                    viewMode,

                    year: selectedYear,

                    month: selectedMonth,

                    quarter: selectedQuarter,

                    barangay: filterBarangay,

                    sex: filterSex,
                },
            });

            toast({
                title: "Success",
                description: "Disease report exported successfully.",
            });

        } catch (error) {
            toast({
                title: "Export Failed",
                description: "Unable to export PDF.",
                variant: "destructive",
            });
        } finally {
            setExportLoading(prev => ({
                ...prev,
                filteredPdf: false,
            }));
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>MEDICAL REPORT</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <EmergencyButton />
                        <ProfileDropdown 
                            email="admin@klynx.com"
                            name="Admin User"
                        />
                    </div>
                </div>

                {message.text && (
                    <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
                        {message.text}
                    </div>
                )}

                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'monthly' ? styles.toggleActive : ''}`}
                        onClick={() => { setViewMode('monthly'); setExpandedMonth(null); }}
                    >
                        Monthly
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'quarterly' ? styles.toggleActive : ''}`}
                        onClick={() => { setViewMode('quarterly'); setExpandedMonth(null); }}
                    >
                        Quarterly
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'yearly' ? styles.toggleActive : ''}`}
                        onClick={() => { setViewMode('yearly'); setExpandedMonth(null); }}
                    >
                        Yearly
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

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Sex</label>
                        <select value={filterSex} onChange={(e) => setFilterSex(e.target.value)} className={styles.filterSelect}>
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* <ReportExportButton
                        reportType="disease"
                        year={selectedYear}
                        month={viewMode === 'monthly' ? selectedMonth : null}
                        data={reportData}
                    /> */}
                </div>

                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading report data...</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.actionSection}>
                            <button className={styles.downloadButton} /*onClick={handleDiseaseDownload}*/>
                                <BiDownload size={20} />
                                Download Medical Report
                            </button>
                        </div>
                        <div className={styles.summaryCards}>
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryIcon}>📋</div>
                                <div className={styles.summaryContent}>
                                    <span className={styles.summaryValue}>{reportData?.totalCases || 0}</span>
                                    <span className={styles.summaryLabel}>Total Cases</span>
                                </div>
                            </div>
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryIcon}>🏥</div>
                                <div className={styles.summaryContent}>
                                    <span className={styles.summaryValue}>{reportData?.top10Diseases?.length || 0}</span>
                                    <span className={styles.summaryLabel}>Unique Diagnoses</span>
                                </div>
                            </div>
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryIcon}>📍</div>
                                <div className={styles.summaryContent}>
                                    <span className={styles.summaryValue}>
                                    {Object.keys(reportData?.diseaseByBarangay || {}).length > 0 
                                        ? Object.values(reportData.diseaseByBarangay).reduce((acc, brgy) => 
                                            Math.max(acc, Object.keys(brgy).length), 0)
                                        : 0}
                                    </span>
                                    <span className={styles.summaryLabel}>Barangays Affected</span>
                                </div>
                            </div>
                        </div>

                        {viewMode === 'monthly' ? (
                            <>
                                {/* Monthly Top 10 Diseases */}
                                <div className={styles.chartSection}>
                                    <h3 className={styles.chartTitle}>🏆 Top 10 Diseases — {MONTHS[selectedMonth - 1]} {selectedYear}</h3>
                                    {getTop10ChartData() ? (
                                        <div className={styles.chartWrapper} style={{ height: '400px' }}>
                                            <Bar data={getTop10ChartData()} options={horizontalBarOptions} />
                                        </div>
                                    ) : (
                                        <div className={styles.noData}>
                                            <span className={styles.noDataIcon}>📭</span>
                                            <p>No disease data available for the selected period</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Quarterly / Yearly Bar Graph */}
                                <div className={styles.chartSection}>
                                    <h3 className={styles.chartTitle}>
                                        📈 {viewMode === 'quarterly' ? `Monthly Cases — ${quarterLabel}` : `Monthly Cases Overview — ${selectedYear}`}
                                    </h3>
                                    {getOverviewChartData() && (
                                        <div className={styles.chartWrapper} style={{ height: '350px' }}>
                                            <Bar 
                                                data={getOverviewChartData()}
                                                options={{
                                                    ...chartOptions,
                                                    onClick: handleBarClick,
                                                    plugins: {
                                                        ...chartOptions.plugins,
                                                        legend: { display: false }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                    <p className={styles.chartHint}>💡 Click on a bar to see top 10 diseases for that month</p>
                                </div>

                                {/* Expanded Month Details */}
                                {expandedMonth && yearlyData?.[expandedMonth] && (
                                    <div className={styles.expandedSection}>
                                        <div className={styles.expandedHeader}>
                                            <h3>🔍 Top 10 Diseases - {MONTHS[expandedMonth - 1]} {selectedYear}</h3>
                                            <button 
                                                className={styles.closeBtn}
                                                onClick={() => setExpandedMonth(null)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.chartSection}>
                                    <h3 className={styles.chartTitle}>
                                        🏆 Top 10 Diseases — {viewMode === 'quarterly' ? quarterLabel : `Full Year ${selectedYear}`}
                                    </h3>
                                    {getPieChartData() ? (
                                        <div className={styles.chartWrapper} style={{ height: '400px' }}>
                                            <Pie data={getPieChartData()} options={pieOptions} />
                                        </div>
                                    ) : (
                                        <div className={styles.noData}>
                                            <span className={styles.noDataIcon}>📭</span>
                                            <p>No disease data available for the selected year</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
    

                        {/* Forms Report Section */}
                        <div className={styles.formsSection}>
                            <div className={styles.formsHeader}>
                                <h3 className={styles.formsTitle}>📝 Forms Report - Diagnosis Breakdown - {getPeriodLabel()} </h3>
                                <button className={styles.formsPdfBtn} onClick={handleFilteredPdf} /*disabled={formsData.length === 0}*/>
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
                                                    <th>Diagnosis Name</th>
                                                    <th>Age 0-17</th>
                                                    <th>Age 18-40</th>
                                                    <th>Age 41-59</th>
                                                    <th>Age 60+</th>
                                                    <th>New Cases<br/><small>(as of {todayLabel})</small></th>
                                                    <th>Total Cases<br/><small>(as of {getPeriodLabel()})</small></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedForms.map((d, i) => (
                                                    <tr key={d.name}>
                                                        <td>{(formsPage - 1) * ROWS_PER_PAGE + i + 1}</td>
                                                        <td>{d.name}</td>
                                                        <td>{d['0-17']}</td>
                                                        <td>{d['18-40']}</td>
                                                        <td>{d['41-59']}</td>
                                                        <td>{d['60+']}</td>
                                                        <td className={styles.newCases}>{d.newCases}</td>
                                                        <td><strong>{d.total}</strong></td>
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
                                    <span className={styles.noDataIcon}>📝</span>
                                    <p>No diagnosis data available for the selected period</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}