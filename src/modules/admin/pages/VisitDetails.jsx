import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import useAuth from '../../../hooks/useAuth';
import ProfileDropdown from '../../../components/ProfileDropdown';
import './ConsultationDetail.css';
import { BiError, BiArrowBack, BiShow } from 'react-icons/bi';
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';

import { getPatientById } from '../api/patientApi';
import { getVisitsByPatientId } from '../api/visitApi';
import VitalSignsForm from './VitalSignsForm';
import PhysicalExamForm from './PhysicalExamForm';
import DoctorsOrderForm from './DoctorsOrderForm';
import AnimalBiteForm from './AnimalBiteForm';
import PrenatalForm from './PrenatalForm';

export const basicTabs = [
    { id: 'vital-signs', label: 'Vital Signs', subLabel: 'Patient\'s vital signs', icon: '🩺' },
    //{ id: 'physical-exam', label: 'Physical Exam', subLabel: 'Body examination details', icon: '👁️' },
    //{ id: 'system-review', label: 'System Review', subLabel: 'Review of body systems', icon: '📋' },
    { id: 'doctors-order', label: "Doctor's Order", subLabel: 'Prescriptions and orders', icon: '📝' },
];

export const getConsultationTabs = (consultationType) => {
    switch (consultationType) {
        case 'animal_bite':
            return [{ id: 'animal-bite', label: 'Animal Bite', subLabel: 'Animal bite details', icon: '🐾' }];
        case 'prenatal':
            return [{ id: 'prenatal', label: 'Prenatal', subLabel: 'Pregnancy care', icon: '🤰' }];
        default:
            return [];
    }
}

const VisitDetails = () => {
    const { patientId, visitId } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(location.state?.patient || null);
    const [visit, setVisit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');
    const { auth } = useAuth();
    const isPatientArchived = location.state?.isPatientArchived || patient?.archived;
    const isCompleted = visit?.status === 'completed';
    const isReadOnly = isPatientArchived || isCompleted;

    useEffect(() => {
        fetchData();
    }, [patientId, visitId]);
    
    const formatPatient = (patient) => {
        const calculateAge = (birthdate) => {
            if (!birthdate) return 'N/A';

            const today = new Date();
            const birthDate = new Date(birthdate);

            
            // let age = today.getFullYear() - birthDate.getFullYear();

            // const monthDiff = today.getMonth() - birthDate.getMonth();
            // const dayDiff = today.getDate() - birthDate.getDate();

            // if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            //     age--;
            // }

            // return age;

            let years = today.getFullYear() - birthDate.getFullYear(); 
            let months = today.getMonth() - birthDate.getMonth(); 
            let days = today.getDate() - birthDate.getDate();

            if (days < 0) {
                months--; 
                const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); 
                days += prevMonth.getDate();
            }

            if (months < 0) {
                years--; 
                months += 12;
            }

            return { years, months, days };
        };

        const formatDateMMDDYYYY = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);

            const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();

            return `${month}-${day}-${year}`;
        }

        const ageBreakdown = calculateAge(patient.Birthdate);

        return {
            id: patient.PatientID,
            fullName: `${patient.FirstName} ${patient.MiddleName} ${patient.LastName}`,
            ageYears: ageBreakdown ? ageBreakdown.years : 'N/A',
            ageMonths: ageBreakdown ? ageBreakdown.months : 'N/A',
            ageDays: ageBreakdown ? ageBreakdown.days : 'N/A',
            sex: patient.Sex,
            phone: patient.PhoneNumber || 'Not specified',
            dateOfBirth: patient.Birthdate ? formatDateMMDDYYYY(patient.Birthdate) : 'N/A',
            emergencyContact: 'Not specified',
            civilStatus: patient.CivilStatus || 'N/A',
            status: patient.status
        };
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [patientResponse, visitsResponse] = await Promise.all([
                getPatientById(patientId),
                getVisitsByPatientId(patientId)
            ]);
    
            if (patientResponse.success && patientResponse.data) {
                const formattedPatient = formatPatient(patientResponse.data);
                setPatient(formattedPatient);
            }
    
            if (visitsResponse.success && visitsResponse.data) {
                console.log("CHECK",visitsResponse.data);
                const foundVisit = visitsResponse.data.find(
                    v => v.visitId === Number(visitId)
                );          
                if (foundVisit) {
                    setVisit(foundVisit);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // EDIT THIS PERO NOT PRIORITY MUNA
    if (isLoading) {
        return (
            <div /*className={styles.container}*/>
                <div /*className={styles.loadingState}*/>
                    {/* <CalendarIcon size={64} /> */}
                    <p>Loading visit details...</p>
                </div>
            </div>
        );
    }

    const handleBackToPatientList = () => {
        if (patientId) {
            navigate(`/patient/${patientId}/visits`);
        } else {
            // Fallback based on archived state
            if (isArchived) {
                navigate('/Archives');
            } else {
                navigate('/Patients');
            }
        }
    };

    // Determine which consultation-specific forms to show
    console.log("CHECKKK",visit.consultationType);
    const consultationType = visit.consultationType;
    const consultationTabs = getConsultationTabs(consultationType);

    const allTabs = [...basicTabs, ...consultationTabs];

    const consultationTypeLabels = {
        general: "General Check-up",
        animal_bite: "Animal Bite",
        prenatal: "Prenatal",
        immunization: "Immunization",
        dental: "Dental"
    }
    
    const natureOfVisitLabels = {
        routine_checkup: "Routine Checkup", 
        emergency: "Emergency",
        follow_up: "Follow-up",
        new_symptoms: "New Symptoms",
        referral: "Referral"
    }
    

    return(
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
                            email={auth.userEmail || "Email"}
                            name= {auth.userFirstName + " " + auth.userLastName || "User"}
                        />
                    </div>
                </div>

                {/* Success/Error Message Display */}
                {/* {message.text && (
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
                )} */}

                {/* Archived Patient Warning Banner */}
                {isPatientArchived && (
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

                <div className="patient-header-card">
                    <div className="patient-avatar-large">
                        {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="patient-header-info">
                        <div className="patient-name-row">
                            <h1 className="patient-name">{patient.fullName.toUpperCase() || 'UNKNOWN'}</h1>
                            <span className={`status-badge status-${visit.status}`}>
                                {visit.status === 'completed'
                                    ? 'Completed'
                                    : visit.status === 'draft'
                                    ? 'Draft'
                                    : 'Active'}
                            </span>
                        </div>
                        <div className="patient-info-grid">
                            <div className="info-item">
                                <span className="info-label">Age:</span>
                                <span className="info-value">{patient.ageYears !== 'N/A' ? `${patient.ageYears} years, ${patient.ageMonths} months, ${patient.ageDays} days` : 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Birthdate (MM/DD/YYYY):</span>
                                <span className="info-value">{patient.dateOfBirth || 'Unknown'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Sex:</span>
                                <span className="info-value">{patient.sex || 'Unknown'}</span>
                            </div>
                            {/* <div className="info-item">
                                <span className="info-label">Status:</span>
                                <span className="info-value">Temp Unavailable</span>
                            </div> */}
                            {/* <div className="info-item">
                                <span className="info-label">Last Visit:</span>
                                <span className="info-value">Temp Unavailable</span>
                            </div> */}
                        </div>
                        <div className="patient-info-grid">
                            <div className="info-item">
                                <span className="info-label">Civil Status:</span>
                                <span className="info-value">{patient.civilStatus || 'Unknown'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Patient Status:</span>
                                <span className="info-value">{patient.status || 'Unknown'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">{/*Consultation for Follow up:*/}</span>
                                <span className="info-value">{/**/}</span>
                            </div>
                        </div>

                    </div>

                    {/* <div className="patient-header-actions">
                        <button className="add-to-queue-button">+ Add to Queue</button>
                    </div> */}
                </div>

                <div className="emergency-contact-section">
                    <div className="emergency-contact-container">
                        <div className="emergency-contact-card">
                            <h3>📞 Emergency Contact Information</h3>
                            <div className="emergency-details">
                                <div className="emergency-info-row">
                                    <span className="emergency-label">Primary Contact Name:</span>
                                    <span className="emergency-value">{patient.emergencyContact}</span>
                                </div>
                                <div className="emergency-info-row">
                                    <span className="emergency-label">Relationship:</span>
                                    <span className="emergency-value">Temp Unavail</span>
                                </div>
                                <div className="emergency-info-row">
                                    <span className="emergency-label">Phone Number:</span>
                                    <span className="emergency-value">{patient.phone}</span>
                                </div>
                                <div className="emergency-info-row">
                                    <span className="emergency-label">Alternative Phone:</span>
                                    <span className="emergency-value">Temp Unavailable</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visit Information Section - Only shown when coming from Visits */}
                {/* {currentVisitRecord && ( */}
                <div className="emergency-contact-section">
                    <div className="emergency-contact-container">
                        <div className="emergency-contact-card">
                            <h3>📋 Visit Information</h3>
                            <div className="emergency-details">
                                <div className="emergency-info-row">
                                    <span className="emergency-label">OPD Date:</span>
                                    <span className="emergency-value">
                                        {visit.dateTime
                                            ? new Date(visit.dateTime).toLocaleDateString('en-PH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })
                                            : 'Pending'
                                        }
                                    </span>
                                </div>
                                <div className="emergency-info-row">
                                    <span className="emergency-label">OPD Time:</span>
                                    <span className="emergency-value"> 
                                        {visit.dateTime
                                            ? new Date(visit.dateTime).toLocaleTimeString('en-PH', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })
                                            : 'Pending'
                                        }
                                    </span>
                                </div>
                                <div className="emergency-info-row">
                                    <span className="emergency-label">Attending Provider:</span>
                                    <span className="emergency-value">{visit.provider || 'N/A'}</span>
                                </div>
                                <div className="emergency-info-row">
                                    <span className="emergency-label">Chief Complaint:</span>
                                    <span className="emergency-value">{visit.chiefComplaint || 'N/A'}</span>
                                </div>
                                <div className="emergency-info-row">
                                    <span className="emergency-label">Nature of Visit:</span>
                                    <span className="emergency-value">{natureOfVisitLabels[visit.natureOfVisit] || 'N/A'}</span>
                                </div>
                                <div className="emergency-info-row">
                                    <span className="emergency-label">Consultation Type:</span>
                                    <span className="emergency-value">{consultationTypeLabels[visit.consultationType] || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical Records Tabs */}
                <div className="consultation-tabs-new">
                    {allTabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ flex: 1 }}
                        >
                        <span className="tab-icon">{tab.icon}</span>
                        <div className="tab-content">
                            <div className="tab-title">{tab.label}</div>
                            <div className="tab-subtitle">{tab.subLabel}</div>
                        </div>
                        </button>
                    ))}
                </div>
                <div className="ConsultationDetail-Content">
                    {activeTab === 'vital-signs' && (
                        <VitalSignsForm visitId={visitId} activeTab={activeTab} isReadOnly={isReadOnly} />
                    )}
                    {/* {activeTab === 'physical-exam' && (
                        <PhysicalExamForm visitId={visitId} activeTab={activeTab} isReadOnly={isReadOnly} />
                    )} */}
                    {activeTab === 'system-review' && (
                        <SystemReviewForm visitId={visitId} activeTab={activeTab} isReadOnly={isReadOnly} />
                    )}
                    {activeTab === 'doctors-order' && (
                        <DoctorsOrderForm activeTab={activeTab} visitId={visitId} patientId={patientId} isReadOnly={isReadOnly} />
                    )}
                    {activeTab === 'animal-bite' && (
                        <AnimalBiteForm activeTab={activeTab} consultationType={visit.consultationType} visitId={visitId} patientId={patientId} isReadOnly={isReadOnly} />
                    )}
                    {activeTab === 'prenatal' && (
                        <PrenatalForm activeTab={activeTab} consultationType={visit.consultationType} visitId={visitId} patientId={patientId} isReadOnly={isReadOnly} />
                    )}
                </div>


            </main>
        </div>
    );
}

export default VisitDetails;