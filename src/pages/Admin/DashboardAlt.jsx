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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const DashboardAlt = () => {
    const [patientCount, setPatientCount] = useState(0);
    const [upcomingAppts] = useState(10);
    const [todaysAppts] = useState(5);
    const [medicalStaff, setMedicalStaff] = useState(0);
    const [chartView, setChartView] = useState('month'); // 'month' or 'year'
    const navigate = useNavigate();

    const data = {
        labels: chartView === 'month' 
            ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Disease Cases',
                data: chartView === 'month' 
                    ? [12, 19, 15, 25]
                    : [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
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
                            <div className={styles.reportCardData}>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Total Patients:</span>
                                    <span className={styles.reportDataValue}>45</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>This Month:</span>
                                    <span className={styles.reportDataValue}>12</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>High Risk:</span>
                                    <span className={styles.reportDataValue}>8</span>
                                </div>
                            </div>
                            <button 
                                className={styles.reportMoreButton}
                                onClick={() => navigate('/MaternalReport')}
                            >
                                MORE
                            </button>
                        </div>

                        <div className={styles.reportCard}>
                            <h3 className={styles.reportCardTitle}>Antepartum</h3>
                            <div className={styles.reportCardData}>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Active Cases:</span>
                                    <span className={styles.reportDataValue}>28</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Check-ups Today:</span>
                                    <span className={styles.reportDataValue}>5</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Complications:</span>
                                    <span className={styles.reportDataValue}>3</span>
                                </div>
                            </div>
                            <button 
                                className={styles.reportMoreButton}
                                onClick={() => navigate('/MaternalReport')}
                            >
                                MORE
                            </button>
                        </div>

                        <div className={styles.reportCard}>
                            <h3 className={styles.reportCardTitle}>Postpartum</h3>
                            <div className={styles.reportCardData}>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Recent Deliveries:</span>
                                    <span className={styles.reportDataValue}>18</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Follow-ups Due:</span>
                                    <span className={styles.reportDataValue}>7</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Recovery Rate:</span>
                                    <span className={styles.reportDataValue}>95%</span>
                                </div>
                            </div>
                            <button 
                                className={styles.reportMoreButton}
                                onClick={() => navigate('/MaternalReport')}
                            >
                                MORE
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row - 2 Report Cards */}
                    <div className={styles.reportsRow}>
                        <div className={styles.reportCard}>
                            <h3 className={styles.reportCardTitle}>Animal Bite Report</h3>
                            <div className={styles.reportCardData}>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Total Cases:</span>
                                    <span className={styles.reportDataValue}>32</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>This Week:</span>
                                    <span className={styles.reportDataValue}>6</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Rabies Vaccine Given:</span>
                                    <span className={styles.reportDataValue}>29</span>
                                </div>
                            </div>
                            <button 
                                className={styles.reportMoreButton}
                                onClick={() => navigate('/AnimalBiteReport')}
                            >
                                MORE
                            </button>
                        </div>

                        <div className={styles.reportCard}>
                            <h3 className={styles.reportCardTitle}>Animal Bite Location Report</h3>
                            <div className={styles.reportCardData}>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Barangay Areas:</span>
                                    <span className={styles.reportDataValue}>12</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>High Risk Zones:</span>
                                    <span className={styles.reportDataValue}>4</span>
                                </div>
                                <div className={styles.reportDataItem}>
                                    <span className={styles.reportDataLabel}>Dog Population:</span>
                                    <span className={styles.reportDataValue}>Est. 250</span>
                                </div>
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