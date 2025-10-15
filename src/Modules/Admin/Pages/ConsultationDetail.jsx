import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import './../../../components/css/FileMaintenance.css';
import './ConsultationDetail.css';
import { BiError } from 'react-icons/bi';
import ProfileDropdown from '../../../components/ProfileDropdown';
import AddRecordModal from '../../Admin/Popups/AddRecordModal';
import axios from 'axios';

const API_URL = 'http://localhost/api/ConsultationDetail.php';

const ConsultationDetail = () => {
    const [patientData, setPatientData] = useState(null);
    const [consultationRecords, setConsultationRecords] = useState([]);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [activeTab, setActiveTab] = useState('general'); // 'general', 'prenatal', 'dental'
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchRecords = async () => {
        setLoadingRecords(true);
        try {
            const res = await axios.get(API_URL);
            if (res.data && res.data.patient) {
                setPatientData({
                    id: res.data.patient.patient_id || '',
                    name: res.data.patient.name || '',
                    age: res.data.patient.age || '',
                    gender: res.data.patient.sex || '',
                    bloodType: res.data.patient.blood_type || 'O+',
                    phone: res.data.patient.contact || '',
                    email: res.data.patient.email || '',
                    address: res.data.patient.address || '',
                    dateOfBirth: res.data.patient.date_of_birth || '',
                    emergencyContact: res.data.patient.emergency_contact || '',
                });

                setConsultationRecords(
                    Array.isArray(res.data.consultations) 
                        ? res.data.consultations.map(consultation => ({
                            id: consultation.id || '',
                            date: consultation.date || '',
                            bloodPressure: consultation.blood_pressure || '',
                            temperature: consultation.temperature || '',
                            pulse: consultation.pulse || '',
                            symptoms: consultation.symptoms || '',
                            diagnosis: consultation.diagnosis || '',
                            type: consultation.type || 'general',
                        }))
                        : []
                );
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load records.' });
            console.error(err);
            
        } finally {
            setLoadingRecords(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleAddRecord = async (recordData) => {
        try {
            await axios.post(API_URL, recordData);
            await fetchRecords();
            setShowAddModal(false);
            setMessage({ type: 'success', text: 'Record added successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to add record.' });
            console.error(err);
        }
    };

    const filteredRecords = consultationRecords.filter(
        record => record.type === activeTab
    );

  return (
    <div className="FileMaintenance-Container">
      <Sidebar />
      <main className="FileMaintenance-Content">
        <div className="FileMaintenance-Header">
          <div className="FileMaintenance-HeaderTitle">
            <h1>Consultation Details</h1>
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

        <div className="FileMaintenance-TableContainer">        
          <div className="FileMaintenance-TableTitle">
            <h2>Patient Details</h2>
          </div>
           <div className="patient-card">
          <div className="patient-header">
            <div className="patient-avatar">
              {patientData?.name ? patientData.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="patient-basic-info">
              <h2>{patientData?.name || 'Unknown'}</h2>
              <div className="patient-identifiers">
                <span className="patient-id">Patient ID: {patientData?.id || 'N/A'}</span>
                <span className="blood-type">{patientData?.bloodType || 'O+'}</span>
                <span className="gender">{patientData?.gender || 'Unknown'}</span>
                <span className="age">{patientData?.age || '0'} years old</span>
              </div>
            </div>
          </div>
          
          <div className="patient-details-grid">
            <div className="detail-item">
              <span className="detail-label">Date of Birth</span>
              <span className="detail-value">{patientData?.dateOfBirth || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{patientData?.phone || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{patientData?.email || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Address</span>
              <span className="detail-value">{patientData?.address || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Emergency Contact</span>
              <span className="detail-value">{patientData?.emergencyContact || 'Not specified'}</span>
            </div>
          </div>
        </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Age</th>
                <th>Attending Provider</th>
                <th>Chief Complaint</th>
                <th>Mode of Transaction</th>
                <th>Consultation for follow up</th>
              </tr>
            </thead>
            <tbody>
              {loadingRecords ? (
                <tr><td colSpan="9">Loading...</td></tr>
              ) : !patientData ? (
                <tr><td colSpan="9">No records found.</td></tr>
              ) : (
                <tr>
                  <td>{patientData.date || ''}</td>
                  <td>{patientData.age || ''}</td>
                  <td>{patientData.provider || ''}</td>
                  <td>{patientData.complaint || ''}</td>
                  <td>{patientData.mode || ''}</td>
                  <td>{patientData.followup || ''}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

       

        <div className="ConsultationDetail-Content">
          <div className="FileMaintenance-TableTitle">
            <h2>Consultation Records</h2>
          </div>

          <div className="consultation-tabs">
          
            <button 
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General Checkup
            </button>
            <button 
              className={`tab-button ${activeTab === 'prenatal' ? 'active' : ''}`}
              onClick={() => setActiveTab('prenatal')}
            >
              Prenatal
            </button>
            <button 
              className={`tab-button ${activeTab === 'dental' ? 'active' : ''}`}
              onClick={() => setActiveTab('dental')}
            >
              Dental
            </button>

          </div>

        {activeTab === 'general' && (
            <div className="add-record-container">
              <button 
                className="add-record-button"
                onClick={() => setShowAddModal(true)}
              >
                Add New Record
              </button>
        
          <div className="records-container">
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Age</th>
                  <th>Blood Pressure</th>
                  <th>Pulse Rate</th>
                  <th>Temperature</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>Diagnosis</th>
                  <th colSpan="3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.age}</td>
                    <td>{record.bloodPressure}</td>
                    <td>{record.pulseRate}</td>
                    <td>{record.temperature}</td>
                    <td>{record.height}</td>
                    <td>{record.weight}</td>
                    <td>{record.diagnosis}</td>
                    <td>
                      <td><button className="view-button">View</button></td>
                      <td><button className="edit-button">Edit</button></td>
                      <td><button className='delete-button'>Delete</button></td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

         {activeTab === 'prenatal' && (
            
            <div className="add-record-container">
              <button 
                className="add-record-button"
                onClick={() => setShowAddModal(true)}
              >
                Add New Record
              </button>
           
          <div className="records-container">
          
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>AOG</th>
                  <th>Blood Pressure</th>
                  <th>Pulse Rate</th>
                  <th>Temperature</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>Diagnosis</th>
                  <th colSpan='3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.doctor}</td>
                    <td>{record.aog}</td>
                    <td>{record.bloodPressure}</td>
                    <td>{record.temperature}</td>
                    <td>{record.height}</td>
                    <td>{record.weight}</td>
                    <td>{record.diagnosis}</td>
                    <td>
                       <td><button className="view-button">View</button></td>
                      <td><button className="edit-button">Edit</button></td>
                      <td><button className='delete-button'>Delete</button></td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

         {activeTab === 'dental' && (

            <div className="add-record-container">
              <button 
                className="add-record-button"
                onClick={() => setShowAddModal(true)}
              >
                Add New Record
              </button>
          
          <div className="records-container">
          
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Procedure</th>
                  <th>Diagnosis</th>
                  <th>Teeth Number</th>
                  <th>Treatment Plan</th>
                  <th colSpan="3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.Procedure}</td>
                    <td>{record.Diagnosis}</td>
                    <td>{record.TeethNumber}</td>
                    <td>{record.TreatmentPlan}</td>
                    <td>
                       <td><button className="view-button">View</button></td>
                      <td><button className="edit-button">Edit</button></td>
                      <td><button className='delete-button'>Delete</button></td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>  
        </div>
        
        )}

        </div>

                {showAddModal && (
                    <AddRecordModal
                        isOpen={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        onSubmit={handleAddRecord}
                        recordType={activeTab}
                        patientId={patientData?.id}
                    />
                )}   
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </main>
        </div>

  )
}

export default ConsultationDetail;