
import React from 'react';  
import Consultation2 from './pages/Admin/Consultation2'
import Consultation from './pages/Admin/Consultation'
import Patientrecord from './pages/Admin/Patientrecord' 
/*import Dashboard from './pages/Admin/Dashboard'*/
import { BrowserRouter, Routes, Route} from 'react-router-dom'
//import Maps from './pages/Admin/GeoMapAdd'

import Appointment from './pages/Patient/Appointment'
import Dashboard2 from './pages/Patient/Dashboard2'
import Patientrecord2 from './pages/Patient/Patient-Record'
import GeoMap from './pages/Patient/GeoMap'
//import Calendar from './pages/Admin/Calendar'

import Register from './pages/Facepage/register'
import Login from './pages/Facepage/login'
import Logintwo from './pages/Facepage/logintwo'
import ForgotPassword from './pages/Facepage/ForgotPassword'
import Resetpass from './pages/Facepage/resetpass'  
import Entercode from './pages/Facepage/entercode'
import Setnewpass from './pages/Facepage/setnewpass'
import About from './pages/Facepage/about'
import Contact from './pages/Facepage/contact'
import Home from './pages/Facepage/Frontpage'
import Unauthorized from './components/Unauthorized'
import RequireAuth from './components/RequireAuth'
import PrenatalRie from './pages/Patient/PrenatalRie'

import UpcomingAppointment from './pages/Admin/upcomingAppt'
//import TotalPatient from './pages/Admin/TotPatient'

import Doctors from './pages/Admin/Doctors'

import Patient1 from './pages/Admin/patientPage'
import Staff1 from './pages/Patient/staffPage'
import Nurse1 from './pages/Admin/nursePage'

import DashboardAlt from './pages/Admin/DashboardAlt'
import Prenatal from './pages/Admin/Prenatal';
import Immunization from './pages/Admin/Immunization';
import Calendar from './pages/Admin/Calendar';
import Staff from './pages/Admin/Staff';
import Nurse from './pages/Admin/Nurse';
import Patient from './pages/Admin/Patient';
import AnimalBite from './pages/Admin/AnimalBite';

import ConsultationDetail from './Modules/Admin/Pages/ConsultationDetail';

import Notifications from './pages/Admin/Notifications';
import Settings from './pages/Admin/Settings';
//import TotalPatients from './pages/Admin/TotalPatients';
//import Notes from './pages/Admin/Note';
//import Prescription from './pages/Admin/Prescription'
import Prenatal2 from './pages/Patient/Prenatal';
import DiseaseReport from './pages/Reports/Diseasereport';
import AnimalBiteReport from './pages/Reports/AnimalBiteReport';
import MaternalReport from './pages/Reports/MaternalReport';
const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}
/*
import MaternalReport from '../Reports/Maternalreport.jsx'
import DiseaseReport from '../Reports/Diseasereport.jsx'
import AnimalBiteReport from '../Reports/AnimalBiteReport.jsx'
*/

import TestPage from './pages/Admin/TestPage'

import GeoMaps from './pages/Admin/GeoMap';
import IcdManager from './pages/Admin/IcdManager';
import IcdManager2 from './pages/Admin/IcdManager2';
import NurseNotes from './pages/Admin/NurseNotes';
import UserManagement from './modules/admin/pages/UserManagement';
import StaffHealthRecord from './modules/admin/pages/StaffHealthRecord';

function App() {
  return (
    <div>

          <BrowserRouter>

            <Routes>



              <Route path='/Patientrecord' element={<Patientrecord />} />
              <Route path='/Prenatal2' element={<Prenatal2 />}/>
              

              <Route path='/Appointment' element={<Appointment />} />
              <Route path='/Patient-Dashboard' element={<Dashboard2/>} />
              <Route path='/Patient-Record' element={<Patientrecord2/>} />

              <Route path='/Register' element={<Register/>} />
              <Route path='/Login' element={<Login/>} />
              <Route path='/Logintwo' element={<Logintwo/>} />
              <Route path='/Forgot-Password' element={<ForgotPassword/>} />
              <Route path='/resetpass' element={<Resetpass/>} />
              <Route path='/entercode' element={<Entercode/>} />
              <Route path='/setnewpass' element={<Setnewpass/>} />
              <Route path='/About' element={<About/>} />
              <Route path='/Contact' element={<Contact/>} />
              <Route path='/Home' element={<Home/>} />
              <Route path='/Register' element={<Register/>} />
              <Route path="/Unauthorized" element={<Unauthorized />} />

  
              
              
              <Route path='/PrenatalRie' element={<PrenatalRie/>} />

              {/* <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}> */}
                <Route path='/IcdManager' element={<IcdManager />} />
                <Route path='/IcdManager2' element={<IcdManager2 />} />
                <Route path='/NurseNotes' element={<NurseNotes />} />
                <Route path='/UserManagement' element={<UserManagement />} />
                <Route path='/Notifications' element={<Notifications />} />
                  <Route path='/Settings' element={<Settings />} />

                <Route path='/GeoMap' element={<GeoMaps />} />              
                <Route path='/DashboardAlt' element={<DashboardAlt/>} />

                <Route path='/Immunization' element={<Immunization/>} />
                <Route path='/Prenatal' element={<Prenatal/>} />
                <Route path='/Consultation' element={<Consultation />} />
                <Route path='/ConsultationDetail' element={<ConsultationDetail />} />
                <Route path='/StaffHealthRecord' element={<StaffHealthRecord />} />
                
                <Route path='/Staff' element={<Staff/>} />
                <Route path='/Nurse' element={<Nurse/>} />
                <Route path='/Doctors' element={<Doctors/>} />
                <Route path='/Patient' element={<Patient/>} />

                <Route path='/AnimalBite' element={<AnimalBite/>} />

                <Route path='/Patientrecord' element={<Patientrecord />} />
                <Route path='/Calendar' element={<Calendar />} />
                
                <Route path='/DiseaseReport' element={<DiseaseReport />} />
                <Route path='/AnimalBiteReport' element={<AnimalBiteReport />} />
                <Route path='/MaternalReport' element={<MaternalReport />} />
                {/*<Route path='/Dashboard' element={<Dashboard />} />  */}


           {/* //   </Route> */}

              <Route path='/Appointment' element={<Appointment />} />
              <Route path='/Patient-Dashboard' element={<Dashboard2/>} />
              <Route path='/Patient-Record' element={<Patientrecord2/>} />
        
             
              <Route path='/TestPage' element={<TestPage/>}/>

              <Route path="*" element={<Home />} />
               <Route path="/" element={<Home />} />
              
              <Route path='/upcomingAppt' element={<UpcomingAppointment/>} />
              
                <Route path='/patientPage' element={<Patient1/>} />
                 <Route path='/staffPage1' element={<Staff1/>} />
                  <Route path='/nursePage' element={<Nurse1/>} />
              
              </Routes>
          </BrowserRouter>
    </div>
  )
}

export default App;