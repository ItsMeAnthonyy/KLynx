import { useState, useEffect } from 'react';
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

import { getYearlyOverview } from '../api/reportsApi';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DiseaseReports() {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");
    const { toast } = useToast();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [viewMode, setViewMode] = useState('yearly');
    // const [selectedYear, setSelectedYear] = useState(currentYear);
    // const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    // const [filterBarangay, setFilterBarangay] = useState('');
    // const [filterSex, setFilterSex] = useState('');
    // const [barangays, setBarangays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [reportData, setReportData] = useState(null);
    const [yearlyData, setYearlyData] = useState(null);
    // const [expandedMonth, setExpandedMonth] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    // useEffect(() => {
    //     loadBarangays();
    // }, []);

    useEffect(() => {
        if (viewMode === 'monthly') {
            // loadMonthlyData();
        } else {
            loadYearlyData();
        }
    }, [/*viewMode, selectedYear, selectedMonth, filterBarangay, filterSex*/]);

    // const loadBarangays = async () => {
    //     const brgys = await getUniqueBarangays();
    //     setBarangays(brgys);
    // };

    const loadMonthlyData = async () => {
        setIsLoading(true);
        try {
            const visits = await getDiseaseReportData(selectedYear, selectedMonth);
            const processed = processDiseaseData(visits, filterBarangay || null, filterSex || null);
            setReportData(processed);
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

    const loadYearlyData = async () => {
        setIsLoading(true);
        try {
            const overview = await getYearlyOverview(2026);
            setYearlyData(overview);
            
            const visits = await getDiseaseReportData(2026);
            const processed = processDiseaseData(visits, filterBarangay || null, filterSex || null);
            setReportData(processed);
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

    // Chart data for yearly overview
    const getYearlyChartData = () => {
        if (!yearlyData) return null;
    
        const data = MONTHS.map((_, index) => yearlyData[index + 1]?.totalCases || 0);
    
        return {
            labels: MONTHS,
            datasets: [{
                label: 'Cases',
                data: data,
                backgroundColor: 'hsl(221, 83%, 53%)',
                borderColor: 'hsl(221, 83%, 43%)',
                borderWidth: 1,
                borderRadius: 4,
            }]
        };
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
                <div className={styles.actionSection}>
                    <button className={styles.downloadButton} /*onClick={handleDiseaseDownload}*/>
                        <BiDownload size={20} />
                        Download Medical Report
                    </button>
                </div>

                <div className={styles.chartSection}>
                    {getYearlyChartData() && (
                        <div className={styles.chartWrapper} style={{ height: '350px' }}>
                            <Bar 
                                data={getYearlyChartData()}
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
                
                <div className={styles.chartSection}>

                </div>

            </main>
        </div>
    );
}