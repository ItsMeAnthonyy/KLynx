    import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import EmergencyButton from '../../components/EmergencyButton';
import ProfileDropdown from '../../components/ProfileDropdown';
import styles from './DashboardAlt.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend, BarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const DashboardAlt = () => {
    const [patientCount, setPatientCount] = useState(0);
    const [upcomingAppts] = useState(10);
    const [todaysAppts] = useState(5);
    const [medicalStaff, setMedicalStaff] = useState(0);
    const [chartView, setChartView] = useState('month'); // 'month' or 'year'
    const [selectedDisease, setSelectedDisease] = useState('all'); // For disease filter
    const navigate = useNavigate();

    // Disease data for different conditions
    const diseaseData = {
        all: {
            month: [12, 19, 15, 25],
            year: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90]
        },
        hypertension: {
            month: [5, 8, 6, 10],
            year: [25, 22, 30, 28, 20, 18, 15, 18, 22, 25, 30, 35]
        },
        diabetes: {
            month: [3, 10, 4, 17],
            year: [18, 15, 22, 20, 15, 12, 10, 12, 15, 18, 22, 25]
        },
        respiratory: {
            month: [4, 6, 5, 8],
            year: [22, 22, 28, 33, 21, 25, 15, 15, 23, 27, 33, 30]
        }
    };

    const data = {
        labels: chartView === 'month' 
            ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: selectedDisease === 'all' ? 'All Disease Cases' : 
                       selectedDisease === 'hypertension' ? 'Hypertension Cases' :
                       selectedDisease === 'diabetes' ? 'Diabetes Cases' : 'Respiratory Cases',
                data: chartView === 'month' 
                    ? diseaseData[selectedDisease].month
                    : diseaseData[selectedDisease].year,
                backgroundColor: '#07598D',
                borderColor: '#27374D',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        // Fetch patient count
        axios.get('http://localhost/api/Patient.php')
            .then((res) => {
                const data = res.data;
                setPatientCount(data.length);
            })
            .catch((err) => {
                console.error('Error fetching patients:', err);
            });

        // Fetch medical staff count
        axios.get('http://localhost/api/Staff.php')
            .then((res) => {
                const data = res.data;
                setMedicalStaff(data.length);
            })
            .catch((err) => {
                console.error('Error fetching staff:', err);
                // Set default if API doesn't exist
                setMedicalStaff(15);
            });
    }, []);

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>DASHBOARD</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <EmergencyButton />
                        <ProfileDropdown 
                            email="admin@klynx.com"
                            name="Admin User"
                        />
                    </div>
                </div>

                {/* Stats Cards Row */}
                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <div className={styles.statCardTitle}>
                            Total Number of Patients
                        </div>
                        <div className={styles.statCardNumber}>
                            {patientCount}
                        </div>
                        <div className={styles.statCardButton}>
                            <button onClick={() => navigate('/Patient')}>More</button>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardTitle}>
                            Medical Staff
                        </div>
                        <div className={styles.statCardNumber}>
                            {medicalStaff}
                        </div>
                        <div className={styles.statCardButton}>
                            <button onClick={() => navigate('/Staff')}>More</button>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardTitle}>
                            Today&apos;s Appointments
                        </div>
                        <div className={styles.statCardNumber}>
                            {todaysAppts}
                        </div>
                        <div className={styles.statCardButton}>
                            <button onClick={() => navigate('/Calendar')}>More</button>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statCardTitle}>
                            Upcoming Appointments
                        </div>
                        <div className={styles.statCardNumber}>
                            {upcomingAppts}
                        </div>
                        <div className={styles.statCardButton}>
                            <button onClick={() => navigate('/Calendar')}>More</button>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className={styles.chartsRow}>
                    {/* Disease Statistics Chart */}
                    <div className={styles.chartCard}>
                        <div className={styles.chartCardHeader}>
                            <h3 className={styles.chartCardTitle}>Disease Statistics</h3>
                            <div className={styles.chartButtonContainer}>
                                <select 
                                    value={selectedDisease}
                                    onChange={(e) => setSelectedDisease(e.target.value)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#07598D',
                                        border: '2px solid #07598D',
                                        borderRadius: '6px',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        marginRight: '8px'
                                    }}
                                >
                                    <option value="all">All Diseases</option>
                                    <option value="hypertension">Hypertension</option>
                                    <option value="diabetes">Diabetes</option>
                                    <option value="respiratory">Respiratory</option>
                                </select>
                                <button 
                                    className={`${styles.chartButton} ${chartView === 'month' ? styles.active : ''}`}
                                    onClick={() => setChartView('month')}
                                >
                                    Month
                                </button>
                                <button 
                                    className={`${styles.chartButton} ${chartView === 'year' ? styles.active : ''}`}
                                    onClick={() => setChartView('year')}
                                >
                                    Year
                                </button>
                            </div>
                        </div>
                        <div className={styles.chartWrapper}>
                            <Bar data={data} options={options} />
                        </div>
                        <button className={styles.moreButton} onClick={() => navigate('/GeoMap')}>
                            More
                        </button>
                    </div>

                    {/* Quick Access Panel */}
                    <div className={styles.quickAccessCard}>
                        <h3 className={styles.quickAccessTitle}>Quick Access</h3>
                        <div className={styles.quickAccessButtons}>
                            <button 
                                className={styles.quickAccessButton}
                                onClick={() => navigate('/Patient')}
                            >
                                Add New Patient
                            </button>
                            <button 
                                className={styles.quickAccessButton}
                                onClick={() => navigate('/Calendar')}
                            >
                                Schedule Appointment
                            </button>
                            <button 
                                className={styles.quickAccessButton}
                                onClick={() => navigate('/DiseaseReport')}
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>

                     {/* Report Cards Section */}
                <div className={styles.reportsSection}>
                    {/* Top Row - 3 Report Cards */}
                    <div className={styles.reportsRow}>
                        <div className={styles.reportCard}>
                            <h3 className={styles.reportCardTitle}>Prenatal Report</h3>
                            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>Distribution by trimester</p>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'First Trimester', value: 32 },
                                                { name: 'Second Trimester', value: 41 },
                                                { name: 'Third Trimester', value: 27 }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name.split(' ')[0]} Trimester: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#3b82f6" />
                                            <Cell fill="#4ade80" />
                                            <Cell fill="#22c55e" />
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <button 
                                className={styles.reportMoreButton}
                                onClick={() => navigate('/MaternalReport')}
                            >
                                MORE
                            </button>
                        </div>

                        <div className={styles.reportCard}>
                            <h3 className={styles.reportCardTitle}>Antepartum & Postpartum</h3>
                            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>Monthly comparison</p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart
                                        data={[
                                            { month: 'Jan', Antepartum: 12, Postpartum: 8 },
                                            { month: 'Feb', Antepartum: 15, Postpartum: 10 },
                                            { month: 'Mar', Antepartum: 18, Postpartum: 12 },
                                            { month: 'Apr', Antepartum: 14, Postpartum: 9 },
                                            { month: 'May', Antepartum: 16, Postpartum: 11 },
                                            { month: 'Jun', Antepartum: 20, Postpartum: 14 }
                                        ]}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                                        <YAxis style={{ fontSize: '12px' }} />
                                        <RechartsTooltip />
                                        <RechartsLegend wrapperStyle={{ fontSize: '12px' }} />
                                        <RechartsBar dataKey="Antepartum" fill="#3b82f6" />
                                        <RechartsBar dataKey="Postpartum" fill="#4ade80" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <button 
                                className={styles.reportMoreButton}
                                onClick={() => navigate('/MaternalReport')}
                            >
                                MORE
                            </button>
                        </div>

                        <div className={styles.reportCard}>
                            <h3 className={styles.reportCardTitle}>Animal Bite Report</h3>
                            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>Cases by animal type</p>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Dogs', value: 45 },
                                                { name: 'Cats', value: 25 },
                                                { name: 'Rats', value: 15 },
                                                { name: 'Others', value: 15 }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#3b82f6" />
                                            <Cell fill="#4ade80" />
                                            <Cell fill="#22c55e" />
                                            <Cell fill="#facc15" />
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <button 
                                className={styles.reportMoreButton}
                                onClick={() => navigate('/AnimalBiteReport')}
                            >
                                MORE
                            </button>
                        </div>

                        <div className={styles.reportCard}>
                            <h3 className={styles.reportCardTitle}>Bite Location</h3>
                            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>Distribution by body part</p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart
                                        data={[
                                            { location: 'Arm', cases: 25 },
                                            { location: 'Leg', cases: 36 },
                                            { location: 'Hand', cases: 20 },
                                            { location: 'Other', cases: 15 }
                                        ]}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="location" style={{ fontSize: '12px' }} />
                                        <YAxis style={{ fontSize: '12px' }} />
                                        <RechartsTooltip />
                                        <RechartsBar dataKey="cases" fill="#22c55e" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <button 
                                className={styles.reportMoreButton}
                                onClick={() => navigate('/AnimalBiteReport')}
                            >
                                MORE
                            </button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default DashboardAlt;