import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import './ConsultationDetail.css';
import { BiError, BiArrowBack, BiShow } from 'react-icons/bi';
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import ProfileDropdown from '../../../components/ProfileDropdown';
import AddRecordModal from '../../../modules/admin/popups/AddRecordModal';
import { generatePrescriptionPDF } from '../../../../Utility/PrescriptionPDF';



// Mock initial data
const MOCK_PATIENT_DATA = {
    id: 'P001',
    name: 'Maria Santos',
    age: '28',
    gender: 'Female',
    bloodType: 'O+',
    phone: '0944-464-6546',
    email: 'maria.santos@email.com',
    address: 'Karangalan Village, Cainta, Rizal',
    dateOfBirth: '1996-03-15',
    emergencyContact: 'Juan Santos',
};

const MOCK_INITIAL_RECORDS = [
    // General Checkup Records
    {
        id: 'GEN001',
        type: 'general',
        date: '2024-10-15',
        doctor: 'Dr. Jane Smith',
        age: '28',
        bloodPressure: '120/80',
        pulseRate: '72',
        temperature: '36.5°C',
        height: '164.7cm',
        weight: '55kg',
        diagnosis: 'Common cold, prescribed rest and medication',
    },
    {
        id: 'GEN002',
        type: 'general',
        date: '2024-09-10',
        doctor: 'Dr. Smith',
        age: '28',
        bloodPressure: '118/78',
        pulseRate: '70',
        temperature: '36.6°C',
        height: '164.7cm',
        weight: '54kg',
        diagnosis: 'Annual checkup - healthy',
    },
    // Prenatal Records
    {
        id: 'PRE001',
        type: 'prenatal',
        date: '2024-10-10',
        doctor: 'Dr. Brown',
        aog: '20 weeks',
        bloodPressure: '115/75',
        temperature: '36.5°C',
        height: '164.7cm',
        weight: '58kg',
        diagnosis: 'Normal pregnancy progression',
    },
    // Dental Records
    {
        id: 'DEN001',
        type: 'dental',
        date: '2024-09-20',
        Procedure: 'Teeth Cleaning',
        Diagnosis: 'Mild plaque buildup',
        TeethNumber: '12, 13',
        TreatmentPlan: 'Regular cleaning recommended every 6 months',
    },
    // Animal Bite Records
    {
        id: 'AB001',
        type: 'animalBite',
        date: '2024-08-15',
        siteOfBite: 'Left forearm',
        categoryOfExposure: 'Category II',
        placeBitten: 'Home',
        antibioticsGiven: 'Amoxicillin',
        typeOfAnimal: 'Dog',
    },
    // Immunization Records
    {
        id: 'IMM001',
        type: 'immunization',
        date: '2024-07-20',
        antigen: 'Tetanus Toxoid',
        ageInMonths: '336',
        vaccinatorName: 'Nurse Garcia',
        nextVisit: '2025-07-20',
        remarks: 'Booster dose administered',
    },
    // Prescription Records
    {
        id: 'PRESC001',
        type: 'prescription',
        datePresc: '2024-10-15',
        prescriptionDetails: 'Upper Respiratory Tract Infection (Common Cold)',
        medicationName: 'Paracetamol 500mg, Amoxicillin 500mg, Cetirizine 10mg',
        prescdosage: '1 tablet, 1 capsule, 1 tablet',
        prescfrequency: 'Every 6 hours, Every 8 hours, Once daily at bedtime',
        prescduration: '5 days',
        prescribedBy: 'Dr. Jane Smith, MD',
        followUpDate: '2024-10-22',
        specialInstructions: 'Take Paracetamol and Amoxicillin with food. Complete the full course of antibiotics even if symptoms improve. Drink plenty of fluids and get adequate rest. Avoid cold drinks and spicy foods.',
    },
    {
        id: 'PRESC002',
        type: 'prescription',
        datePresc: '2024-09-05',
        prescriptionDetails: 'Hypertension (High Blood Pressure)',
        medicationName: 'Amlodipine 5mg, Losartan 50mg',
        prescdosage: '1 tablet, 1 tablet',
        prescfrequency: 'Once daily in the morning, Once daily in the morning',
        prescduration: '30 days (maintenance)',
        prescribedBy: 'Dr. Roberto Cruz, MD',
        followUpDate: '2024-10-05',
        specialInstructions: 'Take medications at the same time daily. Monitor blood pressure regularly. Reduce salt intake and maintain healthy diet. Exercise regularly.',
    },
];

const ConsultationDetail = () => {

  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if coming from Visits page with specific visit data
  const fromVisits = location.state?.fromVisits;
  const visitData = location.state?.visitData;
  const consultationType = location.state?.consultationType;
  const patientDataFromVisits = location.state?.patientData;
  const isArchived = location.state?.isArchived || false;
  const archiveInfo = location.state?.archiveInfo || null;

  // Debug logging
  console.log('ConsultationDetail - Location State:', location.state);
  console.log('ConsultationDetail - isArchived:', isArchived);
  console.log('ConsultationDetail - archiveInfo:', archiveInfo);

    const [patientData, setPatientData] = useState(null);
    const [consultationRecords, setConsultationRecords] = useState([]);
    const [archivedRecords, setArchivedRecords] = useState([]);
    const [currentVisitRecord, setCurrentVisitRecord] = useState(null); // Store visit data separately
   
    const [activeTab, setActiveTab] = useState('general');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showArchives, setShowArchives] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [recordToArchive, setRecordToArchive] = useState(null);

    // Initialize mock data from localStorage or use defaults
    const initializeMockData = () => {
        const storedPatient = localStorage.getItem('mockPatientData');
        const storedRecords = localStorage.getItem('mockConsultationRecords');
        const storedArchives = localStorage.getItem('mockArchivedRecords');

        if (storedPatient) {
            setPatientData(JSON.parse(storedPatient));
        } else {
            setPatientData(MOCK_PATIENT_DATA);
            localStorage.setItem('mockPatientData', JSON.stringify(MOCK_PATIENT_DATA));
        }

        if (storedRecords) {
            setConsultationRecords(JSON.parse(storedRecords));
        } else {
            setConsultationRecords(MOCK_INITIAL_RECORDS);
            localStorage.setItem('mockConsultationRecords', JSON.stringify(MOCK_INITIAL_RECORDS));
        }

        if (storedArchives) {
            setArchivedRecords(JSON.parse(storedArchives));
        } else {
            setArchivedRecords([]);
            localStorage.setItem('mockArchivedRecords', JSON.stringify([]));
        }
    };

    useEffect(() => {
        // If coming from Visits page, use that data instead
        const calculateAge = (birthdate) => {
          if (!birthdate) return 'N/A';
          const today = new Date();
          const birthDate = new Date(birthdate);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();
          // Adjust if birthday hasn't occurred yet this year
          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
          }
          return age;
        };

        if (fromVisits && patientDataFromVisits) {
            const formattedPatient = {
                id: patientDataFromVisits.PatientID,
                name: `${patientDataFromVisits.FirstName} ${patientDataFromVisits.MiddleName} ${patientDataFromVisits.LastName}`,
                age: calculateAge(patientDataFromVisits.Birthdate),
                gender: patientDataFromVisits.Sex,
                phone: patientDataFromVisits.ContactNumber || 'N/A',
                dateOfBirth: patientDataFromVisits.Birthdate || 'N/A',
                emergencyContact: 'N/A'
            };
            setPatientData(formattedPatient);
            
            // Set active tab based on consultation type
            if (consultationType) {
                setActiveTab(consultationType === 'animal-bite' ? 'animalBite' : consultationType);
            }
            
            // If there's specific visit data, store it separately (don't add to consultation records)
            if (visitData) {
                setCurrentVisitRecord(visitData);
            }
            
            // Initialize empty consultation records when coming from Visits
            setConsultationRecords([]);
        } else {
            initializeMockData();
        }
    }, [fromVisits, visitData, consultationType, patientDataFromVisits]);

    const handleAddRecord = (recordData) => {
        if (isArchived) {
            setMessage({ type: 'error', text: 'Cannot modify records for archived patients.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }
        try {
            if (editingRecord) {
                // Update existing record
                const updatedRecords = consultationRecords.map(record => 
                    record.id === editingRecord.id 
                        ? { ...recordData, id: editingRecord.id, type: editingRecord.type }
                        : record
                );
                setConsultationRecords(updatedRecords);
                localStorage.setItem('mockConsultationRecords', JSON.stringify(updatedRecords));
                
                setShowAddModal(false);
                setEditingRecord(null);
                setMessage({ type: 'success', text: 'Record updated successfully!' });
            } else {
                // Add new record
                const typePrefix = {
                    general: 'GEN',
                    prenatal: 'PRE',
                    dental: 'DEN',
                    animalBite: 'AB',
                    immunization: 'IMM',
                    prescription: 'PRESC',
                };

                const prefix = typePrefix[recordData.type] || 'REC';
                const timestamp = Date.now();
                const newId = `${prefix}${timestamp}`;

                const newRecord = {
                    ...recordData,
                    id: newId,
                    date: new Date().toISOString().split('T')[0],
                };

                const updatedRecords = [...consultationRecords, newRecord];
                setConsultationRecords(updatedRecords);
                localStorage.setItem('mockConsultationRecords', JSON.stringify(updatedRecords));
                
                setShowAddModal(false);
                setMessage({ type: 'success', text: 'Record added successfully!' });
            }
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (err) {
            setMessage({ type: 'error', text: editingRecord ? 'Failed to update record.' : 'Failed to add record.' });
            console.error(err);
        }
    };

    const handleEditRecord = (record) => {
        if (isArchived) {
            setMessage({ type: 'error', text: 'Cannot edit records for archived patients.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }
        setEditingRecord(record);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingRecord(null);
    };

    const handleDownloadPrescription = (record) => {
        try {
            generatePrescriptionPDF(record, patientData);
            setMessage({ type: 'success', text: 'Prescription downloaded successfully!' });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to download prescription.' });
            console.error(err);
        }
    };

    const handleArchiveRecord = (record) => {
        if (isArchived) {
            setMessage({ type: 'error', text: 'Cannot archive records for archived patients.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }
        // Show confirmation dialog
        setRecordToArchive(record);
        setShowDeleteConfirm(true);
    };

    const confirmArchive = () => {
        if (!recordToArchive) return;

        try {
            // Add archive timestamp
            const archivedRecord = {
                ...recordToArchive,
                archivedAt: new Date().toISOString(),
                archivedBy: 'Admin User' // You can replace this with actual user info
            };

            // Remove from active records
            const updatedRecords = consultationRecords.filter(r => r.id !== recordToArchive.id);
            setConsultationRecords(updatedRecords);
            localStorage.setItem('mockConsultationRecords', JSON.stringify(updatedRecords));

            // Add to archived records
            const updatedArchives = [...archivedRecords, archivedRecord];
            setArchivedRecords(updatedArchives);
            localStorage.setItem('mockArchivedRecords', JSON.stringify(updatedArchives));

            setMessage({ type: 'success', text: 'Record archived successfully! You can restore it from Archives.' });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to archive record.' });
            console.error(err);
        } finally {
            // Close confirmation dialog and reset
            setShowDeleteConfirm(false);
            setRecordToArchive(null);
        }
    };

    const cancelArchive = () => {
        setShowDeleteConfirm(false);
        setRecordToArchive(null);
    };

    const handleRestoreRecord = (record) => {
        try {
            // Remove archive metadata (archivedAt, archivedBy are intentionally unused)
            // eslint-disable-next-line no-unused-vars
            const { archivedAt, archivedBy, ...restoredRecord } = record;

            // Remove from archived records
            const updatedArchives = archivedRecords.filter(r => r.id !== record.id);
            setArchivedRecords(updatedArchives);
            localStorage.setItem('mockArchivedRecords', JSON.stringify(updatedArchives));

            // Add back to active records
            const updatedRecords = [...consultationRecords, restoredRecord];
            setConsultationRecords(updatedRecords);
            localStorage.setItem('mockConsultationRecords', JSON.stringify(updatedRecords));

            setMessage({ type: 'success', text: 'Record restored successfully!' });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to restore record.' });
            console.error(err);
        }
    };

    const filteredRecords = consultationRecords.filter(
        record => record.type === activeTab
    );

     const handleBackToPatientList = () => {
        // If coming from Visits, go back to Visits page
        if (fromVisits && patientData?.id) {
            navigate(`/patient/${patientData.id}/visits`, {
                state: { 
                    patient: patientDataFromVisits || patientData,
                    isArchived: isArchived,
                    archiveInfo: archiveInfo
                }
            });
        } else if (patientData?.id) {
            // Navigate back to the patient's visit list using the patient ID from patientData
            navigate(`/patient/${patientData.id}/visits`, {
                state: {
                    patient: patientData,
                    isArchived: isArchived,
                    archiveInfo: archiveInfo
                }
            });
        } else {
            // Fallback based on archived state
            if (isArchived) {
                navigate('/Archives');
            } else {
                navigate('/Patients');
            }
        }
    };

  return (
    <div className="FileMaintenance-Container">
      <Sidebar />
      <main className="FileMaintenance-Content">
        <div className="FileMaintenance-Header">
          <div className="FileMaintenance-HeaderTitle">
            <h1>Visit Details</h1>
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

        {/* Success/Error Message Display */}
        {message.text && (
          <div className={`message-banner ${message.type}`} style={{
            padding: '12px 20px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            fontSize: '14px',
            fontWeight: '500',
          }}>
            {message.text}
          </div>
        )}
        
        {/* Archived Patient Warning Banner */}
        {isArchived && (
          <div style={{
            padding: '16px 24px',
            marginBottom: '20px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '15px',
            fontWeight: '500',
            color: '#856404'
          }}>
            <BiShow style={{ fontSize: '24px', flexShrink: 0 }} />
            <div>
              <div>This patient is archived. All visit actions are disabled. Only viewing is allowed.</div>
              {archiveInfo && (
                <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.8 }}>
                  Archived on {archiveInfo.archivedOn} • Reason: {archiveInfo.reason}
                </div>
              )}
            </div>
          </div>
        )}

         <button onClick={handleBackToPatientList} className="Details-BackButton">
            <BiArrowBack /> Back to Visit List
          </button>

        {/* Patient Header Card */}
        <div className="patient-header-card">
         
          <div className="patient-avatar-large">
            {patientData?.name ? patientData.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="patient-header-info">
            <h1 className="patient-name">{patientData?.name?.toUpperCase() || 'UNKNOWN'}</h1>
            <div className="patient-info-grid">
              <div className="info-item">
                <span className="info-label">Age:</span>
                <span className="info-value">{patientData?.age || '0'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">DOB:</span>
                <span className="info-value">{patientData?.dateOfBirth || 'Not specified'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sex:</span>
                <span className="info-value">{patientData?.gender || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value">Married</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Visit:</span>
                <span className="info-value">October 21, 2024</span>
              </div>
              {/* <div className="info-item">
                <span className="info-label">BP:</span>
                <span className="info-value">120/80</span>
              </div>
              <div className="info-item">
                <span className="info-label">Height/Weight:</span>
                <span className="info-value">164.7cm / 55kg</span>
              </div> */}
            </div>
          </div>
          <div className="patient-header-actions">
            <button className="add-to-queue-button">+ Add to Queue</button>
            {/* <button 
              className="add-to-queue-button" 
              style={{ backgroundColor: '#6c757d', marginLeft: '10px' }}
              onClick={() => setShowArchives(true)}
            >
              📦 View Archives ({archivedRecords.length})
            </button> */}
          </div>
        </div>

        {/* Emergency Contact Section - Separate from Medical Tabs */}
        <div className="emergency-contact-section">
          <div className="emergency-contact-container">
            <div className="emergency-contact-card">
              <h3>📞 Emergency Contact Information</h3>
              <div className="emergency-details">
                <div className="emergency-info-row">
                  <span className="emergency-label">Primary Contact Name:</span>
                  <span className="emergency-value">{patientData?.emergencyContact || 'Not specified'}</span>
                </div>
                <div className="emergency-info-row">
                  <span className="emergency-label">Relationship:</span>
                  <span className="emergency-value">Spouse</span>
                </div>
                <div className="emergency-info-row">
                  <span className="emergency-label">Phone Number:</span>
                  <span className="emergency-value">{patientData?.phone || 'Not specified'}</span>
                </div>
                <div className="emergency-info-row">
                  <span className="emergency-label">Alternative Phone:</span>
                  <span className="emergency-value">+63 912 345 6789</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Information Section - Only shown when coming from Visits */}
        {fromVisits && currentVisitRecord && (
          <div className="emergency-contact-section">
            <div className="emergency-contact-container">
              <div className="emergency-contact-card">
                <h3>📋 Visit Information</h3>
                <div className="emergency-details">
                  <div className="emergency-info-row">
                    <span className="emergency-label">Date:</span>
                    <span className="emergency-value">{currentVisitRecord.consultation_date || 'N/A'}</span>
                  </div>
                  <div className="emergency-info-row">
                    <span className="emergency-label">Time:</span>
                    <span className="emergency-value">{currentVisitRecord.consultation_time || 'N/A'}</span>
                  </div>
                  <div className="emergency-info-row">
                    <span className="emergency-label">Attending Provider:</span>
                    <span className="emergency-value">{currentVisitRecord.attending_provider || 'N/A'}</span>
                  </div>
                  <div className="emergency-info-row">
                    <span className="emergency-label">Chief Complaint:</span>
                    <span className="emergency-value">{currentVisitRecord.chief_complaint || 'N/A'}</span>
                  </div>
                  <div className="emergency-info-row">
                    <span className="emergency-label">Nature of Visit:</span>
                    <span className="emergency-value">{currentVisitRecord.nature_of_visit || 'N/A'}</span>
                  </div>
                  <div className="emergency-info-row">
                    <span className="emergency-label">Consultation Type:</span>
                    <span className="emergency-value">{currentVisitRecord.consultation_type || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Records Tabs */}
        {fromVisits ? (
          /* Show only specific consultation type tab when coming from Visits */
          <div className="consultation-tabs-new">
            <button 
              className={`tab-item ${activeTab !== 'prescription' ? 'active' : ''}`}
              onClick={() => setActiveTab(consultationType)}
              style={{ flex: 1 }}
            >
              <span className="tab-icon">
                {consultationType === 'general' ? '📋' : 
                 consultationType === 'prenatal' ? '🤰' :
                 consultationType === 'dental' ? '🦷' :
                 consultationType === 'animalBite' ? '🐕' :
                 consultationType === 'immunization' ? '💉' : '📋'}
              </span>
              <div className="tab-content">
                <div className="tab-title">
                  {consultationType === 'general' ? 'General Checkup' : 
                   consultationType === 'prenatal' ? 'Prenatal' :
                   consultationType === 'dental' ? 'Dental' :
                   consultationType === 'animalBite' ? 'Animal Bite' :
                   consultationType === 'immunization' ? 'Immunization' : 'Consultation'}
                </div>
                <div className="tab-subtitle">
                  {consultationType === 'general' ? 'Medical records' : 
                   consultationType === 'prenatal' ? 'Maternal care' :
                   consultationType === 'dental' ? 'Oral health' :
                   consultationType === 'animalBite' ? 'Bite treatment' :
                   consultationType === 'immunization' ? 'Vaccine records' : 'Medical records'}
                </div>
              </div>
            </button>
            
            <button 
              className={`tab-item ${activeTab === 'prescription' ? 'active' : ''}`}
              onClick={() => setActiveTab('prescription')}
              style={{ flex: 1 }}
            >
              <span className="tab-icon">📝</span>
              <div className="tab-content">
                <div className="tab-title">Doctor&apos;s Prescription</div>
                <div className="tab-subtitle">Prescription records</div>
              </div>
            </button>
          </div>
        ) : (
          /* Show all tabs for normal use */
          <div className="consultation-tabs-new">
            <button 
              className={`tab-item ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <span className="tab-icon">📋</span>
              <div className="tab-content">
                <div className="tab-title">General Checkup</div>
                <div className="tab-subtitle">Medical records</div>
              </div>
            </button>
            
            <button 
              className={`tab-item ${activeTab === 'prenatal' ? 'active' : ''}`}
              onClick={() => setActiveTab('prenatal')}
            >
              <span className="tab-icon">🤰</span>
              <div className="tab-content">
                <div className="tab-title">Prenatal</div>
                <div className="tab-subtitle">Maternal care</div>
              </div>
            </button>
            
            <button 
              className={`tab-item ${activeTab === 'dental' ? 'active' : ''}`}
              onClick={() => setActiveTab('dental')}
            >
              <span className="tab-icon">🦷</span>
              <div className="tab-content">
                <div className="tab-title">Dental</div>
                <div className="tab-subtitle">Oral health</div>
              </div>
            </button>

            <button 
              className={`tab-item ${activeTab === 'animalBite' ? 'active' : ''}`}
              onClick={() => setActiveTab('animalBite')}
            >
              <span className="tab-icon">🐕</span>
              <div className="tab-content">
                <div className="tab-title">Animal Bite</div>
                <div className="tab-subtitle">Bite treatment</div>
              </div>
            </button>

            <button 
              className={`tab-item ${activeTab === 'immunization' ? 'active' : ''}`}
              onClick={() => setActiveTab('immunization')}
            >
              <span className="tab-icon">💉</span>
              <div className="tab-content">
                <div className="tab-title">Immunization</div>
                <div className="tab-subtitle">Vaccine records</div>
              </div>
            </button>

            <button 
              className={`tab-item ${activeTab === 'prescription' ? 'active' : ''}`}
              onClick={() => setActiveTab('prescription')}
            >
              <span className="tab-icon">📝</span>
              <div className="tab-content">
                <div className="tab-title">Doctor&apos;s Prescription</div>
                <div className="tab-subtitle">Prescription records</div>
              </div>
            </button>
          </div>
        )}

        <div className="ConsultationDetail-Content">

        {activeTab === 'general' && (
            <div className="add-record-container">
              <button 
                className="add-record-button"
                onClick={() => setShowAddModal(true)}
                disabled={isArchived}
                style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={isArchived ? 'Cannot add records for archived patients' : 'Add New Record'}
              >
                Add New Record
              </button>
        
          <div className="records-container">
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Blood Pressure</th>
                  <th>Pulse Rate</th>
                  <th>Temperature</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>Diagnosis</th>
                  <th colSpan="2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.doctor}</td>
                    <td>{record.bloodPressure}</td>
                    <td>{record.pulseRate}</td>
                    <td>{record.temperature}</td>
                    <td>{record.height}</td>
                    <td>{record.weight}</td>
                    <td>{record.diagnosis}</td>
                    
                    <td>
                      <button 
                        className="edit-button" 
                        title={isArchived ? 'Cannot edit records for archived patients' : 'Edit'}
                        onClick={() => handleEditRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td>
                      <button 
                        className='delete-button' 
                        title={isArchived ? 'Cannot archive records for archived patients' : 'Archive'}
                        onClick={() => handleArchiveRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaTrash />
                      </button>
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
                disabled={isArchived}
                style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={isArchived ? 'Cannot add records for archived patients' : 'Add New Record'}
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
                  <th>Chief Complaint</th>
                  <th>Nurse&apos;s/Midwife Notes</th>  
                  <th colSpan='2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.dateVisit}</td>
                    <td>{record.doc}</td>
                    <td>{record.AOG}</td>
                    <td>{record.BPS}</td>
                    <td>{record.PR}</td>
                    <td>{record.HT}</td>
                    <td>{record.WT}</td>
                    <td>{record.Temp}</td>
                    <td>{record.ccomplaint}</td>
                    <td>{record.MidwifeNotes}</td>
                    
                    <td>
                      <button 
                        className="edit-button" 
                        title={isArchived ? 'Cannot edit records for archived patients' : 'Edit'}
                        onClick={() => handleEditRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td>
                      <button 
                        className='delete-button' 
                        title={isArchived ? 'Cannot archive records for archived patients' : 'Archive'}
                        onClick={() => handleArchiveRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaTrash />
                      </button>
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
                disabled={isArchived}
                style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={isArchived ? 'Cannot add records for archived patients' : 'Add New Record'}
              >
                Add New Record
              </button>
           
          <div className="records-container">
          
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Procedure</th>
                  <th>Teeth Number</th>
                  <th>Treatment Plan</th>
                  <th>Dentist&apos;s Name</th>
                  <th>Next Visit</th>
                  <th colSpan="2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.dateVisitDental}</td>
                    <td>{record.procedureDental}</td>
                    <td>{record.toothNumber}</td>
                    <td>{record.treatmentPlanDental}</td>
                    <td>{record.dentistName}</td>
                    <td>{record.nextVisitDental}</td>
                    
                    <td>
                      <button 
                        className="edit-button" 
                        title={isArchived ? 'Cannot edit records for archived patients' : 'Edit'}
                        onClick={() => handleEditRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td>
                      <button 
                        className='delete-button' 
                        title={isArchived ? 'Cannot archive records for archived patients' : 'Archive'}
                        onClick={() => handleArchiveRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

         {activeTab === 'animalBite' && (
            
            <div className="add-record-container">
              <button 
                className="add-record-button"
                onClick={() => setShowAddModal(true)}
                disabled={isArchived}
                style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={isArchived ? 'Cannot add records for archived patients' : 'Add New Record'}
              >
                Add New Record
              </button>

              <div className="records-container">
          
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Site of Bite</th>
                  <th>Category of Exposure</th>
                  <th>Place Bitten</th>
                  <th>Antibiotics Given</th>
                  <th>Type of Animal</th>
                  <th colSpan='2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.dateOfBite}</td>
                    <td>{record.specificLocation}</td>
                    <td>{record.categExpo}</td>
                    <td>{record.placeBitten}</td>
                    <td>{record.AntiBioticsGiven}</td>
                    <td>{record.typeOfAnimal}</td>

                     
                    <td>
                      <button 
                        className="edit-button" 
                        title={isArchived ? 'Cannot edit records for archived patients' : 'Edit'}
                        onClick={() => handleEditRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td>
                      <button 
                        className='delete-button' 
                        title={isArchived ? 'Cannot archive records for archived patients' : 'Archive'}
                        onClick={() => handleArchiveRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {activeTab === 'immunization' && (
            
            <div className="add-record-container">
              <button 
                className="add-record-button"
                onClick={() => setShowAddModal(true)}
                disabled={isArchived}
                style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={isArchived ? 'Cannot add records for archived patients' : 'Add New Record'}
              >
                Add New Record
              </button>

              <div className="records-container">
          
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                   <th>Vaccine Type</th>
                  <th>Healthcare Provider</th>
                  <th>Next Visit</th>
             
                  <th colSpan='2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.Recdate}</td>
                      <td>{record.antigen}</td>
                    <td>{record.vaccinatorName}</td>
                    <td>{record.nextVisitImmune}</td>
                   
                    <td>
                      <button 
                        className="edit-button" 
                        title={isArchived ? 'Cannot edit records for archived patients' : 'Edit'}
                        onClick={() => handleEditRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td>
                      <button 
                        className='delete-button' 
                        title={isArchived ? 'Cannot archive records for archived patients' : 'Archive'}
                        onClick={() => handleArchiveRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {activeTab === 'prescription' && (
          <div className='add-record-container'>
              <button 
                className="add-record-button"
                onClick={() => setShowAddModal(true)}
                disabled={isArchived}
                style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={isArchived ? 'Cannot add records for archived patients' : 'Add New Record'}
              >
                Add New Record
              </button>              <div className="records-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Prescribed by</th>
                  <th>Diagnosis</th>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Follow-up Visit</th>
                  <th>Special Instructions</th>
              
                  <th colSpan='3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.datePresc}</td>
                    <td>{record.prescribedBy}</td>
                    <td>{record.prescriptionDetails}</td>
                    <td>{record.medicationName}</td>
                    <td>{record.prescdosage}</td>
                    <td>{record.prescfrequency}</td>
                    <td>{record.followUpDate}</td>
                    <td>{record.specialInstructions}</td>
                   
                    
                    <td>
                      <button 
                        className="download-button" 
                        title="Download Prescription"
                        onClick={() => handleDownloadPrescription(record)}
                      >
                        <FaDownload />
                      </button>
                    </td>
                    <td>
                      <button 
                        className="edit-button" 
                        title={isArchived ? 'Cannot edit records for archived patients' : 'Edit'}
                        onClick={() => handleEditRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td>
                      <button 
                        className='delete-button' 
                        title={isArchived ? 'Cannot archive records for archived patients' : 'Archive'}
                        onClick={() => handleArchiveRecord(record)}
                        disabled={isArchived}
                        style={isArchived ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        <FaTrash />
                      </button>
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
                        onClose={handleCloseModal}
                        onSubmit={handleAddRecord}
                        recordType={activeTab}
                        patientId={patientData?.id}
                        editingRecord={editingRecord}
                    />
                )}   

                {/* Archives Modal */}
                {showArchives && (
                    
                    <div className="addRecord-modal-overlay" onClick={() => setShowArchives(false)}>

                        <div className="addRecord-modal-content" onClick={(e) => e.stopPropagation()}>

                            <div className="addRecord-modal-header">
                                <h3 className='addRecord-modal-title'>Archived Records</h3>
                                <button 
                                    onClick={() => setShowArchives(false)}
                                    className='close-button'
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="records-container">
                            
                                {archivedRecords.length === 0 ? (
                                    <div>
                                        <p>No archived records found.</p>
                                        <p>Records you archive will appear here.</p>
                                    </div>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th >Type</th>
                                                <th>Date</th>
                                                <th>Details</th>
                                                <th>Archived At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                      
                                            {archivedRecords.map((record) => (
                                                <tr key={record.id}>
                                                    <td >
                                                        <span>
                                                            {record.type}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {record.date || record.datePresc || record.dateVisit || 'N/A'}
                                                    </td>
                                                    <td >
                                                        {record.diagnosis || record.prescriptionDetails || record.MidwifeNotes || record.procedureDental || 'No details'}
                                                    </td>
                                                    <td>
                                                        {new Date(record.archivedAt).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleRestoreRecord(record)}
                                              
                                                        >
                                                          Restore
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="addRecord-modal-overlay" onClick={cancelArchive}>
                        <div 
                            className="addRecord-modal-content" 
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: '500px' }}
                        >
                            <div className="addRecord-modal-header" style={{ borderBottom: '2px solid #e0e0e0', paddingBottom: '15px', marginBottom: '20px' }}>
                                <h3 className='addRecord-modal-title' style={{ color: '#dc3545' }}>⚠️ Confirm Archive</h3>
                                <button 
                                    onClick={cancelArchive}
                                    className='close-button'
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div style={{ padding: '20px 0' }}>
                                <p style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>
                                    Are you sure you want to archive this record?
                                </p>
                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                                    <strong>Record Type:</strong> {recordToArchive?.type}
                                </p>
                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                                    The record will be moved to archives and can be restored later.
                                </p>
                                
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={cancelArchive}
                                        style={{
                                            padding: '10px 24px',
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmArchive}
                                        style={{
                                            padding: '10px 24px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                                    >
                                        Yes, Archive
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
              
            </main>
        </div>

  )
}

export default ConsultationDetail;