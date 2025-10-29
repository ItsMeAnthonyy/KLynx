import { useEffect, useState } from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Sidebar from '../../components/Navbar';
import './consult.css';
import '../../components/css/GlobalContainer.css';
import '../../components/css/DashboardAlt.css';
import '../../components/css/FileMaintenance.css'
import { BiError } from 'react-icons/bi';
import ProfileDropdown from '../../components/ProfileDropdown';
import { Bar } from 'react-chartjs-2';
import PieChartExample from '../../components/piechart';  
import PrenatalPie from '../../components/prenatal-pie';
import AnimalPie from '../../components/animal-pie';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// Set up Axios Mock Adapter
const mock = new MockAdapter(axios);

// Mock endpoints and responses
mock.onGet('/api/top-diseases').reply(200, ["Flu", "Cold", "Malaria","Leptospirosis","Tubercolosis","Fever","COVID","Monkey Pox","Pneumonia","Rabies"]);
mock.onGet('/api/total-patients').reply(200, 1500);
mock.onGet('/api/consultations').reply(200, 300);
mock.onGet('/api/appointments').reply(200, [
  { id: 1, time: "10:00 AM", doctor: "Dr. Smith" },
  { id: 2, time: "11:00 AM", doctor: "Dr. Jane" },
]);
mock.onGet('/api/disease-statistics').reply(200, {
    "Flu": 300,
    "Cold": 250,
    "Malaria": 100,
    "Leptospirosis": 50,
   "Tubercolosis" : 250,
    "Fever" : 150,
    "COVID" : 100,
    "Monkey Pox" : 160,
   "Pneumonia" : 50,
    "Rabies" : 10
  });
mock.onGet('/api/upcoming-appointment').reply(200, [
    { id: 1, time: "3:00 PM", patient: "John Doe" },
    { id: 2, time: "4:00 PM", patient: "Jane Smith" }
  ]);
mock.onGet('/api/prescriptions').reply(200, [
  { medicine: "Paracetamol", dosage: "500mg", frequency: "3x/day", doctor: "Dr. Smith" },
  { medicine: "Amoxicillin", dosage: "250mg", frequency: "2x/day", doctor: "Dr. Jane" },
]);
mock.onGet('/api/notes').reply(200, [
    {PatientName: "Coleen Sanchez", doctor: "Dr. Smith", note: "Follow up with patients who missed their appointments." },
    {PatientName: "Rie Mabitado", doctor: "Dr. Jane", note: "Review lab results for all malaria cases." }
  ]);
mock.onPost('/api/notes').reply((config) => {
    const newNote = JSON.parse(config.data);
    return [200, newNote];
  });

mock.onGet('/api/intrapartum').reply(200, {

    "Teen":76,
   "Adult":25

});
mock.onGet('/api/postpartum').reply(200, {
  "Teen" : 35,
   "Adult": 80
});

mock.onGet('/api/animalBite').reply(200,{
     "Dog" : 400,
     "Cat" : 260,
     "Monkey" : 10

})


function Dashboard() {

 

  //Settings state
   const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
   const [showManageAccount, setShowManageAccount] = useState(false);
       const [showTerms, setShowTerms] = useState(false);
       const [showAddAdmin, setShowAddAdmin] = useState(false);

         // State for general details
     const [generalDetails, setGeneralDetails] = useState({
      name: 'John Doe',
      username: 'John123',
      contact: '+1234567890',
      password: '123456'
    });

    //Mock data for total patients
//  const totalPatients = [
//     { label: 'Vaccinated', count: 3 },
//     { label: 'Senior', count: 3 },
//     { label: 'Adult', count: 12 },
//     { label: 'Minor', count: 3 },
//     { label: 'Infant', count: 0 },
//     { label: 'PWD', count: 2 },
//     { label: 'Pregnant', count: 2 },
//   ];
   

  // Edit account state
  // Load account details from local storage on component mount
  useEffect(() => {
      const savedDetails = JSON.parse(localStorage.getItem('accountDetails'));
      if (savedDetails) {
          setGeneralDetails(savedDetails);
      }
  }, []);


  const handleSave = () => {
      // Save the updated details to local storage
      localStorage.setItem('accountDetails', JSON.stringify(generalDetails));
      alert('Account details saved successfully!');
      setShowManageAccount(false);
  };

 // Admin Account Management
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminAccounts, setAdminAccounts] = useState([]);

  const HandleAddAdmin = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost/OneCaintaRecord/insertAdminAccount.php', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.text();
        console.log(result);
        // Optionally, update the adminAccounts state to reflect the new admin account
        setAdminAccounts([...adminAccounts, { fullName, username }]);
        // Clear the form fields
        setFullName('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        console.error('Failed to add admin');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setGeneralDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };



  const [topDiseases, setTopDiseases] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [consultations, setConsultations] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [diseaseStats, setdiseaseStats] = useState([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [intrapartumReport, setIntrapartumReport] = useState([]);
  const [postpartumReport, setPostpartumReport] = useState([]);
  const [animalCases, setAnimalCases] = useState([]);

        //  const [newNote, setNewNote] = useState({ doctor: '', note: '' });

  useEffect(() => {
    // Fetch data from mock APIs
    const fetchData = async () => {
      try {
        const diseasesResponse = await axios.get('/api/top-diseases');
        setTopDiseases(diseasesResponse.data);

        const patientsResponse = await axios.get('/api/total-patients');
        setTotalPatients(patientsResponse.data);

        const consultationsResponse = await axios.get('/api/consultations');
        setConsultations(consultationsResponse.data);

        const appointmentsResponse = await axios.get('/api/appointments');
        setAppointments(appointmentsResponse.data);

        const statsResponse = await axios.get('/api/disease-statistics');
        setdiseaseStats(statsResponse.data);

        const upcomingResponse = await axios.get('/api/upcoming-appointment');
        setUpcomingAppointment(upcomingResponse.data);

        const prescriptionsResponse = await axios.get('/api/prescriptions');
        setPrescriptions(prescriptionsResponse.data);

        const intrapartumResponse = await axios.get('/api/intrapartum');
        setIntrapartumReport(intrapartumResponse.data);

        const postpartumResponse = await axios.get('/api/postpartum');
        setPostpartumReport(postpartumResponse.data);

        const notesResponse = await axios.get('/api/notes');
        setNotes(notesResponse.data);

        const animalBiteResponse = await axios.get('/api/animalBite');
        setAnimalCases(animalBiteResponse.data);
      } 
      catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

        // const handleNoteSubmit = async (e) => {
        //     e.preventDefault();
        //     try {
        //     const response = await axios.post('/api/notes', newNote);
        //     setNotes((prevNotes) => [...prevNotes, response.data]);
        //     setNewNote({ doctor: '', note: '' });
        //     } catch (error) {
        //     console.error("Error submitting note:", error);
        //     }
        // };

        const diseaseChartData = {
            labels: Object.keys(diseaseStats),
            datasets: [
              {
                label: 'Number of Cases',
                data: Object.values(diseaseStats),
                backgroundColor: '#1114a3',
                borderColor: '#2023cf',
                borderWidth: 1,
              },
            ],
          };

          const diseaseChartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: '',
              },
            },
          };

          const IntrapartumChartData = {
            labels: Object.keys(intrapartumReport),
            datasets: [
              {
                label: 'Number of Cases',
                data: Object.values(intrapartumReport),
                backgroundColor: '#1114a3',
                borderColor: '#2023cf',
                borderWidth: 1,
              },
            ],
          };

          const IntrapartumChartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: '',
              },
            },
          };

          const PostpartumChartData = {
            labels: Object.keys(postpartumReport),
            datasets: [
              {
                label: 'Number of Cases',
                data: Object.values(postpartumReport),
                backgroundColor: '#1114a3',
                borderColor: '#2023cf',
                borderWidth: 1,
              },
            ],
          };

          const PostpartumChartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: '',
              },
            },
          };

          const AnimalChartData = {
            labels: Object.keys(animalCases),
            datasets: [
              {
                label: 'Number of Cases',
                data: Object.values(animalCases),
                backgroundColor: '#1114a3',
                borderColor: '#2023cf',
                borderWidth: 1,
              },
            ],
          };

          const AnimalChartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: '',
              },
            },
          };
  return (
    <div className="container">
      
        <Sidebar />
    

      <main className="main-content">
        <div className="FileMaintenance-Header">
                 <div className="FileMaintenance-HeaderTitle">
                   <h1>Notifications</h1>
                 </div>
       
                 <div className="FileMaintenance-HeaderSetting">
                   <button className="emergency-button">
                     <BiError/>EMERGENCY MODE
                   </button>
                   <ProfileDropdown 
                     email="admin@klynx.com"
                     name="Admin User"
                   />
                 </div>
               </div>
          <div className='container'>
          {showManageAccount && (
                       <div className="modal">
                       <div className="modal-content">
                           <h2>Manage Account</h2>
                           <button className="close" onClick={() => setShowManageAccount(false)}>
                               &times;
                           </button>
                           <div className="modal-section">
                               <h3>General Details</h3>
                               <form>
                                   <label>
                                       Complete Name:
                                       <input
                                           type="text"
                                           name="name"
                                           value={generalDetails.name}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Username:
                                       <input
                                           type="text"
                                           name="username"
                                           value={generalDetails.username}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Contact NO.:
                                       <input
                                           type="text"
                                           name="contact"
                                           value={generalDetails.contact}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                                   <label>
                                       Password:
                                       <input
                                           type="password"
                                           name="password"
                                           value={generalDetails.password}
                                           onChange={handleInputChange}
                                       />
                                   </label>
                               </form>
                                <button className="cancel" onClick={() => setShowManageAccount(false)}>Cancel</button>
                               <button className="save" onClick={handleSave}>Save Changes</button>
                           </div>
                       </div>
                   </div>



      )}

      {showAddAdmin && (
        <div className="modal">
          <div className="modal-content">

            <h3>Add Admin Account</h3>
                <button className="close"
                  onClick={() => setShowAddAdmin(false)}
                >
                  &times;
                </button>
          <div className="modal-section">

            <input type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} 
            placeholder="Full Name"
             required 
             />

            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 

             />
            <button onClick={HandleAddAdmin}>Add Admin</button>

            Sample output para makita if nag sasave yung admin account
            <h3>Admin Accounts(Sample lang to check if nag aadd)</h3>
            <ul>
                {adminAccounts.map((account, index) => (
                    <li key={index}>{account.username}</li>
                ))}
            </ul>


              </div>

              </div>
            </div>
            )}  

      {showTerms && (
            <div className="modal">
              <div className="modal-content">
                <h2>Terms & Conditions</h2>
                <button className="close"
                  onClick={() => setShowTerms(false)}
                >
                  &times;
                </button>
                <div className="modal-section">
                  <p>
                    By using this system, you agree to our terms and conditions...
                  </p>
                </div>
              </div>
            </div>
          )}

          </div>
        <div className="container">
        <div className="stat-card">
            <h3>Total Patient Number</h3>
            <div className="totpatient-placeholder">{totalPatients}</div>
            <a href="/TotPatient">
              <button className="buton">More</button>
            </a>

          </div>
        
          <div className="stat-card">
            <h3>Consultations</h3>
            <div className="totpatient-placeholder">{consultations}</div>
            <a href="/Consultation">
            <button className="buton">More</button>
            </a>
          </div>
          <div className="stat-card">
            <h3>Upcoming Appointments</h3>
            <div className="consult-placeholder">{consultations}</div>
            <a href="/upcomingAppt">
    
                <button className="buton">More</button>
         
            </a>
          </div>
          <div className="stat-card">
            <h3>Today&apos;s Appointment</h3>
            <div className="treatment">
            <ul>
              {appointments.map((appt) => (
                <li key={appt.id}>
                  {appt.time} with {appt.doctor}
                </li>
              ))}
            </ul>
            </div>
            <button className="buton">More</button>
          </div>
        </div>  

        <div className="container2">
            <div className="analytics"> 
              <div>   
                <button className='button'>Month</button>
                <button className='button'>Year</button>
              </div> 
                <h3>Disease Statistics</h3>
                <Bar data={diseaseChartData} options={diseaseChartOptions} />
            </div>

            <div className="appoint">

                <h3>Top 10 Diseases</h3>
               

                    <PieChartExample/>
        
             

            </div>
       </div>     


        <div className="container3">
          <div className="Prescription">
            <h3>Doctor&apos;s Prescription</h3>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Doctor&apos;s Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription, index) => (
                  <tr key={index}>
                    <td>{prescription.medicine}</td>
                    <td>{prescription.dosage}</td>
                    <td>{prescription.frequency}</td>
                    <td>{prescription.doctor}</td>
                    <td><button className='prescript-btn'>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
            <div className='container3'>
               <div className="notes">
            <h3>Doctor&apos;s Notes</h3>
          <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor&apos;s name</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {notes.map((notes, index) => (
                  <tr key={index}>
                    <td>{notes.PatientName}</td>
                    <td>{notes.doctor}</td>
                    <td>{notes.note}</td>
                    <td><button className='notes-btn'>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            </div>
            </div>
        <div className="container4">
            <div className="report">  
                <h3>Prenatal Report</h3>  
               <PrenatalPie/>
            </div>

            <div className="report1">
              <h3>Intrapartum</h3>
                 <Bar data={IntrapartumChartData} options={IntrapartumChartOptions} />



            <h3>Postpartum</h3>

               <Bar data={PostpartumChartData} options={PostpartumChartOptions} />
            </div>


            </div>

            <div className='container5'>
                <div className='report2'>
                  <h3>
                    Animal Biting Incident Report
                  </h3>
                    <div className='animal-placeholder'>
                       <AnimalPie/>

                    </div>
                </div>

                <div className='report2'>

                  <h3>
                    Animal Biting Incident Cases
                  </h3>

                  <div className='animal-placeholder'>
                  <Bar data={AnimalChartData} options={AnimalChartOptions} />
                  </div>

                </div>

            </div>

      </main>
    </div>
  );
}

export default Dashboard;