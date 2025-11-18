import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../components/css/GlobalContainer.css';
import '../../components/css/DashboardAlt.css';
import { BiError } from 'react-icons/bi';
import ProfileDropdown from '../../components/ProfileDropdown';
import '../../components/css/FileMaintenance.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';



import PieChartExample from '../../components/piechart';
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
    const data = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
        {
        label: 'Disease Cases',
        data: [1, 1, 3, 5],
        backgroundColor: '#1114a3',
        },
    ],
    };

    const options = {
    responsive: true,
    plugins: {
        legend: {
        display: false,
        },
    },
    };

  
const DashboardAlt = () => {

    const [patientCount, setPatientCount] = useState(0);
    const [consultCount, setConsultCount] = useState(0);
    const navigate = useNavigate();

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { auth } = useAuth();

    useEffect(() => {
        const todayISO = new Date().toISOString();
        const dateParam = todayISO.split('T')[0];
        const monthParam = dateParam.slice(0, 7);

        fetch(`http://localhost/api/fetchHealthReport.php?date=${dateParam}&month=${monthParam}`)
        .then(res => res.json())
        .then(data => {
            setChartData(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Failed to fetch diagnosis data:', error);
            setLoading(false);
        });

  }, []);


    useEffect(() => {
        axios.get('http://localhost/api/Patient.php') // Replace with your actual endpoint
            .then((res) => {
            const data = res.data;
            setPatientCount(data.length); // Count how many patients are in the list
            })
                .catch((err) => {
                console.error('Error fetching patients:', err);
            });

        axios.get('http://localhost/api/Patient_Consult_Visits.php') // Replace with your actual endpoint
        .then((res) => {
        const data = res.data;
        setConsultCount(data.length); // Count how many patients are in the list
        })
            .catch((err) => {
            console.error('Error fetching patients:', err);
        });

    }, []);

    return (
        <div className="FileMaintenance-Container">
            <Sidebar />
            <main className="FileMaintenance-Content">
                 <div className="FileMaintenance-Header">
                          <div className="FileMaintenance-HeaderTitle">
                            <h1>Dashboard</h1>
                          </div>
                
                          <div className="FileMaintenance-HeaderSetting">
                            <button className="emergency-button">
                              <BiError/>EMERGENCY MODE
                            </button>
                            <ProfileDropdown 
                              email={auth.userEmail || "Email"}
                              name= {auth.userFirstName + " " + auth.userLastName || "User"}
                            />
                          </div>
                        </div>
                <hr></hr>
                <div className="DashboardAlt-Cards-Container">
                    <div className="DashboardAlt-Card">
                        <div className="DashboardAlt-CardTitle">
                            <h4>Total Number of Patients</h4>
                        </div>
                        <div className="DashboardAlt-CardNumber">
                            <h1>{patientCount}</h1>
                        </div>
                        <div className="DashboardAlt-CardButton">
                            <button onClick={() => navigate('/Patient')}>More</button>
                        </div>
                    </div>
                    <div className="DashboardAlt-Card">
                        <div className="DashboardAlt-CardTitle">
                            <h4>Consultations</h4>
                        </div>
                        <div className="DashboardAlt-CardNumber">
                            <h1>{consultCount}</h1>
                        </div>
                        <div className="DashboardAlt-CardButton">
                            <button onClick={() => navigate('/Consultation')}>More</button>
                        </div>
                    </div>
                    <div className="DashboardAlt-Card">
                        <div className="DashboardAlt-CardTitle">
                            <h4>Upcoming Appointments</h4>
                        </div>
                        <div className="DashboardAlt-CardNumber">
                            <h1>10</h1>
                        </div>
                        <div className="DashboardAlt-CardButton">
                            <button>More</button>
                        </div>
                    </div>
                    <div className="DashboardAlt-Card">
                        <div className="DashboardAlt-CardTitle">
                            <h4>Today&apos;s Appointments</h4>
                        </div>
                        <div className="DashboardAlt-CardNumber">
                            <h1>5</h1>
                        </div>
                        <div className="DashboardAlt-CardButton">
                            <button>More</button>
                        </div>
                    </div>
                </div>
                <div className="DashboardAlt-CardsRow2">
                    <div className="DashboardAlt-CardRow2Column1">
                        <div className="DashboardAlt-CardTitle">
                            <h4>Disease Statistics</h4>
                        </div>
                        <div className="DashboardAlt-CardButtonContainers">
                            <div className="DashboardAlt-CardButton">
                                <button>Month</button>
                            </div>
                            <div className="DashboardAlt-CardButton">
                                <button>Year</button>
                            </div>    
                        </div>
                        <div className="DashboardAlt-BarChart">
                                <Bar data={data} options={options} />
                        </div>
                    </div>
                    <div className="DashboardAlt-CardRow2Column2">
                        <div className="DashboardAlt-CardTitle">
                            <h4>Top 10 Diseases</h4>
                        </div>
                        <div className="DashboardAlt-CardNumber">
                             {loading ? <p>Loading...</p> : <PieChartExample data={chartData} />}
                        </div>
                        <div className="DashboardAlt-CardButton">
                            <Link to="/GeoMap">
                                  <button>More</button>
                              </Link>
                        </div>
                    </div>    
                </div>
            </main>
        </div>
    );
}

export default DashboardAlt;