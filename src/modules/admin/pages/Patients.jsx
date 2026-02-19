import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import '../../../components/css/GlobalContainer.css';
import './Patients.css';
import '../../../components/css/FileMaintenance.css'
import '../../../pages/Admin/Doctors.css'
import axios from 'axios'; 
import { FaDownload, FaArchive } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BiSearch } from 'react-icons/bi';

import EmergencyButton from '../../../components/EmergencyButton';
import ProfileDropdown from '../../../components/ProfileDropdown';
//import IcdCollapsibleDropdown from "./IcdManager";
import styles from './Patients.module.css';

import AddPatientModal from '../popups/AddPatientModal';
import ArchivePatientModal from '../popups/ArchivePatientModal';


import { fetchPatientData } from "../services/patientService";

const Patients = () => {
    const navigate = useNavigate();
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

    const [allPatients, setAllPatients] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [addDoctorsInputs, setAddDoctorsInputs] = useState({});
    const [selectedAccompaniment, setSelectedAccompaniment] = useState(''); // New state for accompaniment selection
    const [showFatherSection, setShowFatherSection] = useState(false); // Control father section visibility
    const [showMotherSection, setShowMotherSection] = useState(false); // Control mother section visibility
    const [showWifeSection, setShowWifeSection] = useState(false); // Control wife section visibility
    const [showHusbandSection, setShowHusbandSection] = useState(false); // Control husband section visibility
    const [showFatherMotherSection, setShowFatherMotherSection] = useState(false); // Control father and mother section visibility
    
    const [doctorsList, setDoctorsList] = useState([]);
  //  const [prenatalPatients, setPrenatalPatients] = useState([]);
    const [consultProfiles, setConsultProfiles] = useState([]);
    const [viewHistoryModal, setViewHistoryModal] = useState(false);
    const [addHistoryModal, setAddHistoryModal] = useState(false);
    const [consultVisits, setConsultVisits] = useState([]);
    const [addHistoryInputs, setAddHistoryInputs] = useState({});
    const [editDoctorModal, setEditDoctorModal] = useState(false);
    const [deleteDoctorModal, setDeleteDoctorModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    //const [filteredPatients, setFilteredPatients] = useState([]);
    
    // Archive modal states
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [selectedPatientToArchive, setSelectedPatientToArchive] = useState(null);
    
    // Pagination states
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const handleModalOpen = () =>{
        setShowModal(true);
    }

    const handleAccompanimentSelect = (accompanimentType) => {
        setSelectedAccompaniment(accompanimentType);
        
        // Reset all input fields
        setAddDoctorsInputs({});
        
        // Reset all sections first
        setShowFatherSection(false);
        setShowMotherSection(false);
        setShowWifeSection(false);
        setShowHusbandSection(false);
        setShowFatherMotherSection(false);
        
        // Show relevant sections based on selection
        switch(accompanimentType) {
            case 'Husband':
                setShowHusbandSection(true);
                break;
            case 'Wife':
                setShowWifeSection(true);
                break;
            case 'Father':
                setShowFatherSection(true);
                break;
            case 'Mother':
                setShowMotherSection(true);
                break;
            case 'Father&Mother':
                setShowFatherMotherSection(true);
                break;
            case 'None':
                // No additional sections needed
                break;
            default:
                break;
        }
    }    

    const handleAddDoctorsChange = (e) => {
        const navigate = useNavigate();
        const name = e.target.name;
        const value = e.target.value;
        const updatedInputs = { ...addDoctorsInputs, [name]: value };

        // Only compute age for father_birthday
        if (name === "father_birthday") {
            updatedInputs["father_age"] = value ? getAge(value).toString() : "";
        }

        if (name === "mother_birthday") {
            updatedInputs["mother_age"] = value ? getAge(value).toString() : "";
        }

        if (name === "husband_birthday") {
            updatedInputs["husband_age"] = value ? getAge(value).toString() : "";
        }

        if (name === "wife_birthday") {
            updatedInputs["wife_age"] = value ? getAge(value).toString() : "";
        }

        setAddDoctorsInputs(updatedInputs);
    };

    const handleAddDoctorsSubmit = (e) =>{
        e.preventDefault();
        console.log("Inputs result: ", addDoctorsInputs);

        // Add accompaniment type to the form data
        const formDataWithAccompaniment = {
            ...addDoctorsInputs,
            accompaniment_type: selectedAccompaniment
        };
        console.log("Inputs result with Accompaniment: ", formDataWithAccompaniment);

        axios.post('http://localhost/api/Patient_Consult_Profiles.php', formDataWithAccompaniment).then(function(response){
            console.log(response.data);
            setSelectedDoctor(null);
            if (response.data.status === 1) {
                const newConsultID = response.data.consult_id;
                
                const updatedInputs = {
                    ...formDataWithAccompaniment,
                    patient_consult_id: newConsultID
                };
                console.log("Updated Inputs: ", updatedInputs);
                
                // Only submit mother's data if mother section is shown
                if (showHusbandSection || showWifeSection) {
                    axios.post('http://localhost/api/Patient_Consult_Accompany.php', updatedInputs).then(function(response){
                        console.log("Patient Consult Partner Results:", response.data);
                    });
                } else if (showFatherSection || showMotherSection || showFatherMotherSection){
                    axios.post('http://localhost/api/Patient_Consult_Accompany.php', updatedInputs).then(function(response){
                        console.log("Patient Consult Partner Results:", response.data);
                    });
                }

                

                // Close modal and reset form
                setShowModal(false);
                setSelectedDoctor({});
                setAddDoctorsInputs({});
                setSelectedAccompaniment('');
                setShowFatherSection(false);
                setShowMotherSection(false);
                setShowWifeSection(false);
                setShowHusbandSection(false);
                setShowFatherMotherSection(false);
                getConsultProfiles();
            }
    
        });
        

    }

    function getConsultProfiles() {
        axios.get('http://localhost/api/Patient.php').then(function(response){
            console.log("Get All Patient Profiles: ", response.data);
            
            // Filter out archived patients
            const archivedPatients = JSON.parse(localStorage.getItem('archivedPatients') || '[]');
            const archivedPatientIds = archivedPatients.map(ap => ap.id);
            const activePatients = response.data.filter(patient => !archivedPatientIds.includes(patient.PatientID));
            
            setDoctorsList(activePatients);
            setConsultProfiles(activePatients);
        });
    }

    useEffect( () => {
            getConsultProfiles();
            setAddHistoryInputs((prev) => ({
    ...prev,
    consult_date_visit: new Date().toISOString().split("T")[0]
  }));
    }, []);



    /* Fetches All Patient Info from Patient Creation Page */
    useEffect(() => {
        setIsLoading(false);
        axios.get("http://localhost/api/Patient.php")
            .then(res => { 
                // Filter out archived patients
                const archivedPatients = JSON.parse(localStorage.getItem('archivedPatients') || '[]');
                const archivedPatientIds = archivedPatients.map(ap => ap.id);
                const activePatients = res.data.filter(patient => !archivedPatientIds.includes(patient.PatientID));
                
                setAllPatients(activePatients); 
                console.log(activePatients); 
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("http://localhost/api/Doctors.php")
            .then(res => { setAllDoctors(res.data); console.log(res.data); })
            .catch(err => console.error(err));
    }, []);

    // Utility function to compute age from birthdate in YYYY-MM-DD format
    function getAge(birthdate) {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const handlePatientSelect = (e) => {
        const selectedID = e.target.value;
        const selected = allPatients.find(p => p.PatientID === selectedID);

        if (selected) {
            setAddDoctorsInputs({
                ...addDoctorsInputs,
                patientID: selected.PatientID,
                patient_family_id: selected.FamilyID,
                patient_first_name: selected.FirstName,
                patient_middle_name: selected.MiddleName,
                patient_last_name: selected.LastName,
                patient_birthdate: selected.Birthdate,
                patient_age: selected.Birthdate ? getAge(selected.Birthdate) : null,
                patient_sex: selected.Sex,
            });
        }
    };

    const handleDoctorSelect = (e) => {
        const selectedID = e.target.value;
        const selected = allDoctors.find(p => p.AdminID === selectedID);

        if (selected) {
            setAddHistoryInputs({
                ...addHistoryInputs,
                doctorID: selected.AdminID,
                doctor_first_name: selected.FirstName,
                doctor_middle_name: selected.MiddleName,
                doctor_last_name: selected.LastName,
            });
        }
    };

    const viewHistory = async (id) => {
        const response = await axios.get(`http://localhost/api/Patient_Consult_Visits.php?id=${id}`);
        setConsultVisits(response.data);
        setViewHistoryModal(true);
        console.log("Consult Visits List: ", response.data);
        
        setAddHistoryInputs((values) => ({ ...values, ConsultID: id }));
    }


    const handleAddHistoryChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setAddHistoryInputs(values => ({...values, [name]: value}));
    }

    const submitHistoryRecord = (e) => {
        e.preventDefault();
        console.log("addHistoryInputs consists of: ", addHistoryInputs);
        const consultId = addHistoryInputs.ConsultID;

        axios.post('http://localhost/api/Patient_Consult_Visits.php', addHistoryInputs).then(function(response){
            console.log(response.data);
            setAddHistoryModal(false);

            setAddHistoryInputs({});
            setAddHistoryInputs((prev) => ({
                ...prev,
                consult_date_visit: new Date().toISOString().split("T")[0]
            }));
            viewHistory(consultId);
        });
        
    }

    const editDoctor = async (id) => {
        const response = await axios.get(`http://localhost/api/Doctors.php?id=${id}`);
        console.log("Before Doctor: ",selectedDoctor);
        console.log(response.data);
        setSelectedDoctor(response.data);
        setEditDoctorModal(true);
    }

    const handleEditSubmit = (e) =>{
        e.preventDefault();
        console.log(selectedDoctor);

        axios.put(`http://localhost/api/Doctors.php?id=${selectedDoctor.AdminID}`, selectedDoctor).then(function(response){
            console.log(response.data);
            getPrenatalProfiles();
            setSelectedDoctor(null);
            setEditDoctorModal(false);
        });
    }

    const handleEditDoctorsChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setSelectedDoctor(values => ({...values, [name]: value}));
    }

    const deleteDoctor = (id) => {
        axios.delete(`http://localhost/api/Patient_Consult_Accompany.php?id=${id}`).then(function(response){
            console.log(response.data);
        });
        axios.delete(`http://localhost/api/Patient_Consult_Profiles.php?id=${id}`).then(function(response){
            console.log(response.data);
        });
        axios.delete(`http://localhost/api/Patient_Consult_Visits.php?id=${id}`).then(function(response){
            console.log(response.data);
            getConsultProfiles();
            setSelectedDoctor(null);
            setDeleteDoctorModal(false);

        });
    }

    const handleViewPatient = async (patient) => {
        setLoading(true);
        try {
            navigate(`/patient/${patient.PatientID}/visits`, { state: { patient } });
        } finally {
            setLoading(false);
        }
    }

    const handleArchivePatient = (patient) => {
        setSelectedPatientToArchive(patient);
        setIsArchiveModalOpen(true);
    };

    const handleConfirmArchive = ({ reason, notes }) => {
        if (!selectedPatientToArchive) return;

        // Create archived patient object
        const archivedPatient = {
            id: selectedPatientToArchive.PatientID,
            name: `${selectedPatientToArchive.FirstName} ${selectedPatientToArchive.MiddleName || ''} ${selectedPatientToArchive.LastName}`.trim(),
            Birthdate: selectedPatientToArchive.Birthdate,
            archivedOn: new Date().toLocaleDateString('en-US'),
            reason: reason,
            notes: notes || '',
            archivedBy: 'Admin User', // You can get this from auth context
            status: 'Archived',
            originalData: selectedPatientToArchive // Store original patient data for restoration
        };
        
        // Get existing archived patients from localStorage
        const existingArchived = JSON.parse(localStorage.getItem('archivedPatients') || '[]');
        
        // Add new archived patient
        existingArchived.push(archivedPatient);
        
        // Save to localStorage
        localStorage.setItem('archivedPatients', JSON.stringify(existingArchived));
        
        // Remove from consultProfiles
        setConsultProfiles(consultProfiles.filter(p => p.PatientID !== selectedPatientToArchive.PatientID));
        
        alert(`${selectedPatientToArchive.FirstName} ${selectedPatientToArchive.LastName} has been archived successfully!`);
    };

    const handleDownloadData = (patient) => {
        // Create a CSV or JSON export of patient data
        const patientData = {
            'Patient ID': patient.PatientID,
            'Name': `${patient.FirstName} ${patient.MiddleName || ''} ${patient.LastName}`,
            'Birthday': patient.Birthday,
            'Registration Date': patient.RegistrationDate || new Date().toLocaleDateString()
        };
        
        // Convert to JSON string
        const dataStr = JSON.stringify(patientData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        // Create download link
        const exportFileDefaultName = `patient_${patient.PatientID}_data.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Filter patients based on search term
    const filteredPatients = consultProfiles.filter(patient => {
        const fullName = `${patient.LastName} ${patient.FirstName} ${patient.MiddleName}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return fullName.includes(searchLower) || 
               patient.Birthdate?.includes(searchTerm) ||
               patient.DateCreated?.includes(searchTerm);
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredPatients.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const currentPatients = filteredPatients.slice(startIndex, endIndex);

    // Handle entries per page change
    const handleEntriesChange = (e) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle search
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleAddToQueue = (patient) => {
        try {
            navigate('/QueueManagement');
            // // Get existing queue from localStorage
            // const savedQueue = localStorage.getItem('queueAppointments');
            // let queue = savedQueue ? JSON.parse(savedQueue) : [];
            
            // // Check if patient is already in queue
            // const isAlreadyInQueue = queue.some(apt => apt.patientId === patient.PatientID);
            // if (isAlreadyInQueue) {
            //     toast.warning(`${patient.FirstName} ${patient.LastName} is already in the queue!`);
            //     return;
            // }
            
            // // Get the next queue number
            // const nextQueueNumber = queue.length > 0 
            //     ? Math.max(...queue.map(apt => apt.queueNumber)) + 1 
            //     : 1;
            
            // // Create new appointment
            // const newAppointment = {
            //     queueNumber: nextQueueNumber,
            //     patientId: patient.PatientID,
            //     name: `${patient.FirstName} ${patient.MiddleName || ''} ${patient.LastName}`.trim(),
            //     phone: patient.ContactNumber || 'N/A',
            //     status: 'waiting',
            //     complaint: '',
            //     addedAt: new Date().toISOString()
            // };
            
            // // Add to queue
            // queue.push(newAppointment);
            
            // // Save to localStorage
            // localStorage.setItem('queueAppointments', JSON.stringify(queue));
            
            // // Show success message
            // toast.success(`${patient.FirstName} ${patient.LastName} added to queue (Queue #${nextQueueNumber})`);
            
            // console.log('Patient added to queue:', newAppointment);
        } catch (error) {
            console.error('Error adding patient to queue:', error);
            toast.error('Failed to add patient to queue');
        }
    };

    

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className="FileMaintenance-Content">
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>PATIENTS</h1>
                    </div>
                    <div className={styles.headerRight}>
                      <EmergencyButton />
                        <ProfileDropdown 
                            email="admin@klynx.com"
                            name="Admin User"
                        />
                    </div>
                </div>
                {/*<hr></hr>*/}
                <div className="Patients-Cards-Container">
                    <div className="Patients-Card">
                        <div className="Patients-CardTitle">
                            <h4>Total Number of Patients</h4>
                        </div>
                        <div className="Patients-CardNumber">
                            <h1>{allPatients.length + JSON.parse(localStorage.getItem('archivedPatients') || '[]').length}</h1>
                        </div>
                    </div>
                    <div className="Patients-Card">
                        <div className="Patients-CardTitle">
                            <h4>Active Patients</h4>
                        </div>
                        <div className="Patients-CardNumber">
                            <h1>{consultProfiles.length}</h1>
                        </div>
                    </div>
                    <div className="Patients-Card">
                        <div className="Patients-CardTitle">
                            <h4>Inactive Patients</h4>
                        </div>
                        <div className="Patients-CardNumber">
                            <h1>{JSON.parse(localStorage.getItem('archivedPatients') || '[]').length}</h1>
                        </div>
                    </div>
                </div>
                <div className="FileMaintenance-Filter-Container">
                    <div className="FileMaintenance-Entries">
                        <span>SHOW</span>
                        <select value={entriesPerPage} onChange={handleEntriesChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span>Entries</span>
                    </div>
                    {/* <div className="FileMaintenance-AddSearch">
                            <button 
                                title="Add new Patient" 
                                onClick={() => setIsAddPatientModalOpen(true)}
                                aria-label="Add new Patient"
                            >
                                +
                            </button>
                            <input type="text" placeholder="Search here..."/>
                            <input
                                type="checkbox"
                                //checked={includeArchived}
                                //onChange={(e) => setIncludeArchived(e.target.checked)}
                            />
                            <span>Include Archived Patients</span>
                    </div> */}
                    
                        <div className="searchSection">
                            
                            <div className="searchRow">
                                <button
                                className="addPatientButton"
                                title="Add new Patient"
                                onClick={() => setIsAddPatientModalOpen(true)}
                                aria-label="Add new Patient"
                                >
                                    + Add Patient
                                </button>
                                <div className="searchInputContainer">
                                    <BiSearch className="searchIcon" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or patient ID..."
                                        // value=/*{searchQuery}*/
                                        // onChange={(e) => setSearchQuery(e.target.value)}
                                        onChange={handleSearchChange}
                                        value={searchTerm}
                                        className="searchInput"
                                    />
                                </div>
                                <label className="filterCheckbox">
                                    <input
                                        type="checkbox"
                                        // checked={includeArchived}
                                        // onChange={(e) => setIncludeArchived(e.target.checked)}
                                    />
                                    <span>Include Archived Patients</span>
                                </label>
                            </div>
                        </div>
                        
                </div>

                {isLoading ? (
                    <div className="loadingState">Loading patients...</div>
                ) : (
                    <>
                <div className="FileMaintenance-TableWrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name (Lastname, Firstname, Middle)</th>
                                <th>Birthday</th>
                                <th>Registration</th>
                                <th>Queue</th>
                                <th colSpan="2">Actions</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {currentPatients.map((consProf, key) => (
                            <tr key={key} onClick={() => handleViewPatient(consProf)}>
                                <td>
                                    <button
                                        className="PatientNameButton"
                                        onClick={() => handleViewPatient(consProf)}
                                    >
                                        {consProf.LastName}, {consProf.FirstName} {consProf.MiddleName}
                                    </button>
                                </td>
                                <td>
                                    {consProf.Birthdate}
                                </td>
                                <td>
                                    {consProf.DateCreated}
                                </td>
                                <td>
                                    <button 
                                        className="queue-button" 
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent row click
                                            handleAddToQueue(consProf);
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Add to Queue
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        className="download-button"
                                        
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownloadData(consProf);
                                        }}
                                    >
                                        <FaDownload />
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        className="archive-button" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleArchivePatient(consProf);
                                        }}
                                    >
                                        <FaArchive />
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
             
                <div className="FileMaintenance-Pagination" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    marginTop: '10px'
                }}>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} entries
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                borderRadius: '4px'
                            }}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    backgroundColor: currentPage === index + 1 ? '#07598D' : '#fff',
                                    color: currentPage === index + 1 ? '#fff' : '#333',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontWeight: currentPage === index + 1 ? 'bold' : 'normal'
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                borderRadius: '4px'
                            }}
                        >
                            Next
                        </button>
                    </div>
                    
                </div>
                </>
                )}
            </main>

            <AddPatientModal 
                isOpen={isAddPatientModalOpen} 
                onClose={() => setIsAddPatientModalOpen(false)} 
            />

            {/* MODALS SECTION */}
            {showModal && (
            <div className="add-doctors-popup-overlay">
                <div className="add-doctors-popup-content">
                    <button className="doctors-popup-close-button" onClick={(e) => { 
                        e.preventDefault(); 
                        setShowModal(false); 
                        setSelectedDoctor({}); 
                        setAddDoctorsInputs({});
                        setSelectedAccompaniment('');
                        setShowFatherSection(false);
                        setShowMotherSection(false);
                        setShowWifeSection(false);
                        setShowHusbandSection(false);
                        setShowFatherMotherSection(false);
                    } }>
                        X
                    </button>
                    <h2>New Consult</h2>
                    <form className="add-doctors-form" onSubmit={handleAddDoctorsSubmit}>
                        <div className="add-doctors-column">
                            <div className="add-consult-accompanied-by-section">
                                <label htmlFor="add-doctors-famid">Accompanied by:</label>
                                <div className="add-consult-accompanied-by-button">
                                        <button 
                                            type="button"
                                            onClick={() => handleAccompanimentSelect('Husband')}
                                            className={selectedAccompaniment === 'Husband' ? 'selected' : ''}
                                        >
                                            Husband
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleAccompanimentSelect('Wife')}
                                            className={selectedAccompaniment === 'Wife' ? 'selected' : ''}
                                        >
                                            Wife
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleAccompanimentSelect('Father&Mother')}
                                            className={selectedAccompaniment === 'Father&Mother' ? 'selected' : ''}
                                        >
                                            Father & Mother
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleAccompanimentSelect('Father')}
                                            className={selectedAccompaniment === 'Father' ? 'selected' : ''}
                                        >
                                            Father
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleAccompanimentSelect('Mother')}
                                            className={selectedAccompaniment === 'Mother' ? 'selected' : ''}
                                        >
                                            Mother
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleAccompanimentSelect('None')}
                                            className={selectedAccompaniment === 'None' ? 'selected' : ''}
                                        >
                                            None
                                        </button>
                                </div>
                            </div>
                        </div>
                        <h2 style={{ marginTop: "1.3em" }}>Patient Profile</h2>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label>Select Patient ID:</label>
                                <div className="add-doctors-select-box">
                                    <select 
                                        onChange={handlePatientSelect} 
                                        value={addDoctorsInputs.patientID || ""} 
                                        required
                                    >
                                        <option hidden value="">-- Select Patient ID --</option>
                                        {allPatients.map((p) => (
                                            <option key={p.PatientID} value={p.PatientID}>
                                                {p.PatientID}
                                            </option>
                                        ))}
                                    </select>    
                                </div>
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-patientFamilyID">Family ID:</label>  
                                <input type="text" id="add-doctors-patientFamilyID" name="patient_family_id" placeholder="Select patient id" value={addDoctorsInputs.patient_family_id || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>   
                        </div>
                         <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-patientLastName">Last Name:</label>  
                                <input type="text" id="add-doctors-patientLastName" name="patient_last_name" placeholder="Select patient id" value={addDoctorsInputs.patient_last_name || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-patientFirstName">First Name:</label>
                                <input type="text" id="add-doctors-patientFirstName" name="patient_first_name" placeholder="Select patient id" value={addDoctorsInputs.patient_first_name || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-patientMiddleName">Middle Name:</label>
                                <input type="text" id="add-doctors-patientMiddleName" name="patient_middle_name" placeholder="Select patient id" value={addDoctorsInputs.patient_middle_name || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-patientAge">Age:</label>
                                <input type="text" id="add-doctors-patientAge" name="patient_age" required readOnly className="add-doctors-shaded-input" value={addDoctorsInputs.patient_age || ""} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-birthday">Birthday:</label>
                                <input type="date" id="add-doctors-birthday" name="patient_birthdate" value={addDoctorsInputs.patient_birthdate || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-patientSex">Sex:</label>
                                <input type="text" id="add-doctors-patientSex" name="patient_sex" placeholder="Select patient id" value={addDoctorsInputs.patient_sex || ""} required readOnly className="add-doctors-shaded-input" />
                            </div>

                        </div>
                        <div className="add-doctors-column">
                            {/* Hide these fields when Father, Mother, or Father&Mother is selected */}
                            {!(selectedAccompaniment === "Father" || selectedAccompaniment === "Mother" || selectedAccompaniment === "Father&Mother") && (
                                <>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-patientCivilStatus">Civil Status:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="patient_civil_status" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select Civil Status --</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-patientOccupation">Occupation:</label>
                                        <input type="text" id="add-doctors-patientOccupation" name="patient_occupation" placeholder="Enter patient's occupation" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-patientEducAttainment">Educational Attainment:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="patient_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select education level --</option>
                                                <option value="No Formal Education">No Formal Education</option>
                                                <option value="Elementary Level">Elementary Level</option>
                                                <option value="Elementary Graduate">Elementary Graduate</option>
                                                <option value="High School Level">High School Level</option>
                                                <option value="High School Graduate">High School Graduate</option>
                                                <option value="College Level">College Level</option>
                                                <option value="College Graduate">College Graduate</option>
                                                <option value="Vocational Graduate">Vocational Graduate</option>
                                                <option value="Post-Graduate">Post-Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="add-doctors-column">
                            {/* Hide Contact No. when Father, Mother, or Father&Mother is selected */}
                            {!(selectedAccompaniment === "Father" || selectedAccompaniment === "Mother" || selectedAccompaniment === "Father&Mother") && (
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-patientContactNo">Contact No.:</label>
                                    <input type="text" id="add-doctors-patientContactNo" name="patient_contact_no" placeholder="Enter patient's contact no." required onChange={handleAddDoctorsChange} />
                                </div>
                            )}
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-patientPhilHealthNo">Philhealth No.:</label>
                                <input type="text" id="add-doctors-patientPhilHealthNo" name="patient_philhealth_no" value={addDoctorsInputs.patient_philhealth_no || ""} placeholder="Enter patient's philhealth no." required onChange={handleAddDoctorsChange} />
                            </div>

                            <div className="add-doctors-input-box">
                                <label>Home Street:</label>
                                <div className="add-doctors-select-box">
                                    <select name="patient_street" required onChange={handleAddDoctorsChange}>
                                        <option hidden value="">-- Select Home Street --</option>
                                        <option value="kayumanggi">Kayumanggi</option>
                                        <option value="karunungan">Karunungan</option>
                                        <option value="kalinisan">Kalinisan</option>
                                        <option value="katapangan">Katapangan</option>
                                        <option value="kagitingan">Kagitingan</option>
                                        <option value="katatagan">Katatagan</option>
                                        <option value="karangalan">Karangalan</option>
                                        <option value="katapatan">Katapatan</option>
                                        <option value="kasipagan">Kasipagan</option>
                                        <option value="kahusayan">Kahusayan</option>
                                        <option value="kabutihan">Kabutihan</option>
                                        <option value="katalinuhan">Katalinuhan</option>
                                        <option value="kabanalan">Kabanalan</option>
                                        <option value="kaayusan">Kaayusan</option>
                                        <option value="kabayanihan">Kabayanihan</option>
                                        <option value="kalayaan">Kalayaan</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        {showFatherMotherSection && (
                            <>  
                                <h2 style={{ marginTop: "1.3em" }}>Father's Information</h2>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherLastName">Last Name:</label>
                                        <input type="text" id="add-doctors-fatherLastName" name="father_last_name" placeholder="Enter father's last name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherFirstName">First Name:</label>
                                        <input type="text" id="add-doctors-fatherFirstName" name="father_first_name" placeholder="Enter father's first name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherMiddleName">Middle Name:</label>
                                        <input type="text" id="add-doctors-fatherMiddleName" name="father_middle_name" placeholder="Enter father's middle name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherAge">Age:</label>
                                        <input type="text" id="add-doctors-fatherAge" name="father_age" placeholder="Enter father's birthday" value={addDoctorsInputs.father_age || ""} readOnly className="add-doctors-shaded-input" onChange={handleAddDoctorsChange} required />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherBirthday">Birthday:</label>
                                        <input type="date" id="add-doctors-fatherBirthday" name="father_birthday" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-father_civil_status">Civil Status:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="father_civil_status" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select Civil Status --</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherOccupation">Occupation:</label>
                                        <input type="text" id="add-doctors-fatherOccupation" name="father_occupation" placeholder="Enter father's occupation" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherEducAttainment">Educational Attainment:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="father_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select education level --</option>
                                                <option value="No Formal Education">No Formal Education</option>
                                                <option value="Elementary Level">Elementary Level</option>
                                                <option value="Elementary Graduate">Elementary Graduate</option>
                                                <option value="High School Level">High School Level</option>
                                                <option value="High School Graduate">High School Graduate</option>
                                                <option value="College Level">College Level</option>
                                                <option value="College Graduate">College Graduate</option>
                                                <option value="Vocational Graduate">Vocational Graduate</option>
                                                <option value="Post-Graduate">Post-Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherContactNo">Contact No.:</label>
                                        <input type="text" id="add-doctors-fatherContactNo" name="father_contact_no" placeholder="Enter father's contact no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherPhilHealthNo">Philhealth No.:</label>
                                        <input type="text" id="add-doctors-fatherPhilHealthNo" name="father_philhealth_no" placeholder="Enter father's philhealth no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                
                                <h2 style={{ marginTop: "1.3em" }}>Mother's Information</h2>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherLastName">Last Name:</label>
                                        <input type="text" id="add-doctors-motherLastName" name="mother_last_name" placeholder="Enter mother's last name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherFirstName">First Name:</label>
                                        <input type="text" id="add-doctors-motherFirstName" name="mother_first_name" placeholder="Enter mother's first name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherMiddleName">Middle Name:</label>
                                        <input type="text" id="add-doctors-motherMiddleName" name="mother_middle_name" placeholder="Enter mother's middle name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherAge">Age:</label>
                                        <input type="text" id="add-doctors-motherAge" name="mother_age" placeholder="Enter mother's birthday" required value={addDoctorsInputs.mother_age || ""} readOnly className="add-doctors-shaded-input" onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherBirthday">Birthday:</label>
                                        <input type="date" id="add-doctors-motherBirthday" name="mother_birthday" placeholder="Enter mother's birthday" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherCivilStatus">Civil Status:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="mother_civil_status" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select Civil Status --</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherOccupation">Occupation:</label>
                                        <input type="text" id="add-doctors-motherOccupation" name="mother_occupation" placeholder="Enter mother's occupation" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherEducAttainment">Educational Attainment:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="mother_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select education level --</option>
                                                <option value="No Formal Education">No Formal Education</option>
                                                <option value="Elementary Level">Elementary Level</option>
                                                <option value="Elementary Graduate">Elementary Graduate</option>
                                                <option value="High School Level">High School Level</option>
                                                <option value="High School Graduate">High School Graduate</option>
                                                <option value="College Level">College Level</option>
                                                <option value="College Graduate">College Graduate</option>
                                                <option value="Vocational Graduate">Vocational Graduate</option>
                                                <option value="Post-Graduate">Post-Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherContactNo">Contact No.:</label>
                                        <input type="text" id="add-doctors-motherContactNo" name="mother_contact_no" placeholder="Enter mother's contact no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherPhilHealthNo">Philhealth No.:</label>
                                        <input type="text" id="add-doctors-motherPhilHealthNo" name="mother_philhealth_no" placeholder="Enter mother's philhealth no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherCompleteAddress">Complete Address:</label>
                                        <input type="text" id="add-doctors-motherCompleteAddress" name="mother_complete_address" placeholder="Enter mother's complete address" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                            </>
                        )}

                        {showFatherSection && (
                            <>
                                <h2 style={{ marginTop: "1.3em" }}>Father's Information</h2>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherLastName">Last Name:</label>
                                        <input type="text" id="add-doctors-fatherLastName" name="father_last_name" placeholder="Enter father's last name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherFirstName">First Name:</label>
                                        <input type="text" id="add-doctors-fatherFirstName" name="father_first_name" placeholder="Enter father's first name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherMiddleName">Middle Name:</label>
                                        <input type="text" id="add-doctors-fatherMiddleName" name="father_middle_name" placeholder="Enter father's middle name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherAge">Age:</label>
                                        <input type="text" id="add-doctors-fatherAge" name="father_age" placeholder="Enter father's birthday" required value={addDoctorsInputs.father_age || ""} readOnly className="add-doctors-shaded-input" onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherBirthday">Birthday:</label>
                                        <input type="date" id="add-doctors-fatherBirthday" name="father_birthday" placeholder="Enter father's birthday" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherCivilStatus">Civil Status:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="father_civil_status" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select Civil Status --</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherOccupation">Occupation:</label>
                                        <input type="text" id="add-doctors-fatherOccupation" name="father_occupation" placeholder="Enter father's occupation" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherEducAttainment">Educational Attainment:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="father_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select education level --</option>
                                                <option value="No Formal Education">No Formal Education</option>
                                                <option value="Elementary Level">Elementary Level</option>
                                                <option value="Elementary Graduate">Elementary Graduate</option>
                                                <option value="High School Level">High School Level</option>
                                                <option value="High School Graduate">High School Graduate</option>
                                                <option value="College Level">College Level</option>
                                                <option value="College Graduate">College Graduate</option>
                                                <option value="Vocational Graduate">Vocational Graduate</option>
                                                <option value="Post-Graduate">Post-Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherContactNo">Contact No.:</label>
                                        <input type="text" id="add-doctors-fatherContactNo" name="father_contact_no" placeholder="Enter father's contact no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherPhilHealthNo">Philhealth No.:</label>
                                        <input type="text" id="add-doctors-fatherPhilHealthNo" name="father_philhealth_no" placeholder="Enter father's philhealth no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-fatherCompleteAddress">Complete Address:</label>
                                        <input type="text" id="add-doctors-fatherCompleteAddress" name="father_complete_address" placeholder="Enter father's complete address" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                            </>
                        )}

                        {showMotherSection && (
                            <>
                                <h2 style={{ marginTop: "1.3em" }}>Mother's Information</h2>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherLastName">Last Name:</label>
                                        <input type="text" id="add-doctors-motherLastName" name="mother_last_name" placeholder="Enter mother's last name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherFirstName">First Name:</label>
                                        <input type="text" id="add-doctors-motherFirstName" name="mother_first_name" placeholder="Enter mother's first name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherMiddleName">Middle Name:</label>
                                        <input type="text" id="add-doctors-motherMiddleName" name="mother_middle_name" placeholder="Enter mother's middle name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherAge">Age:</label>
                                        <input type="text" id="add-doctors-motherAge" name="mother_age" placeholder="Enter mother's birthday" value={addDoctorsInputs.mother_age || ""} readOnly className="add-doctors-shaded-input" onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherBirthday">Birthday:</label>
                                        <input type="date" id="add-doctors-motherBirthday" name="mother_birthday" placeholder="Enter mother's birthday" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherCivilStatus">Civil Status:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="mother_civil_status" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select Civil Status --</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherOccupation">Occupation:</label>
                                        <input type="text" id="add-doctors-motherOccupation" name="mother_occupation" placeholder="Enter mother's occupation" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherEducAttainment">Educational Attainment:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="mother_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select education level --</option>
                                                <option value="No Formal Education">No Formal Education</option>
                                                <option value="Elementary Level">Elementary Level</option>
                                                <option value="Elementary Graduate">Elementary Graduate</option>
                                                <option value="High School Level">High School Level</option>
                                                <option value="High School Graduate">High School Graduate</option>
                                                <option value="College Level">College Level</option>
                                                <option value="College Graduate">College Graduate</option>
                                                <option value="Vocational Graduate">Vocational Graduate</option>
                                                <option value="Post-Graduate">Post-Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherContactNo">Contact No.:</label>
                                        <input type="text" id="add-doctors-motherContactNo" name="mother_contact_no" placeholder="Enter mother's contact no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherPhilHealthNo">Philhealth No.:</label>
                                        <input type="text" id="add-doctors-motherPhilHealthNo" name="mother_philhealth_no" placeholder="Enter mother's philhealth no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-motherCompleteAddress">Complete Address:</label>
                                        <input type="text" id="add-doctors-motherCompleteAddress" name="mother_complete_address" placeholder="Enter mother's complete address" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                            </>
                        )}

                        {showHusbandSection && (
                            <>
                                <h2 style={{ marginTop: "1.3em" }}>Husband's Information</h2>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandLastName">Last Name:</label>
                                        <input type="text" id="add-doctors-husbandLastName" name="husband_last_name" placeholder="Enter husband's last name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandFirstName">First Name:</label>
                                        <input type="text" id="add-doctors-husbandFirstName" name="husband_first_name" placeholder="Enter husband's first name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandMiddleName">Middle Name:</label>
                                        <input type="text" id="add-doctors-husbandMiddleName" name="husband_middle_name" placeholder="Enter husband's middle name" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandAge">Age:</label>
                                        <input type="text" id="add-doctors-husbandAge" name="husband_age" placeholder="Enter husband's birthday" required value={addDoctorsInputs.husband_age || ""} readOnly className="add-doctors-shaded-input" onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandBirthday">Birthday:</label>
                                        <input type="date" id="add-doctors-husbandBirthday" name="husband_birthday" placeholder="Enter husband's birthday" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <div className="add-doctors-gender-box">
                                            <h3>Sex:</h3>
                                            <div className="add-doctors-gender-option">
                                                <div className="add-doctors-gender">
                                                    <input type="radio" id="check-male" name="husband_sex" checked={addDoctorsInputs.husband_sex === "Male"} value="Male" onChange={handleAddDoctorsChange} />
                                                    <label htmlFor="check-male">Male</label>
                                                </div>
                                                <div className="add-doctors-gender">
                                                    <input type="radio" id="check-female" name="husband_sex" checked={addDoctorsInputs.husband_sex === "Female"} value="Female" onChange={handleAddDoctorsChange} />
                                                    <label htmlFor="check-female">Female</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandCivilStatus">Civil Status:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="husband_civil_status" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select Civil Status --</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandOccupation">Occupation:</label>
                                        <input type="text" id="add-doctors-husbandOccupation" name="husband_occupation" placeholder="Enter husband's occupation" required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandEducAttainment">Educational Attainment:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="husband_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select education level --</option>
                                                <option value="No Formal Education">No Formal Education</option>
                                                <option value="Elementary Level">Elementary Level</option>
                                                <option value="Elementary Graduate">Elementary Graduate</option>
                                                <option value="High School Level">High School Level</option>
                                                <option value="High School Graduate">High School Graduate</option>
                                                <option value="College Level">College Level</option>
                                                <option value="College Graduate">College Graduate</option>
                                                <option value="Vocational Graduate">Vocational Graduate</option>
                                                <option value="Post-Graduate">Post-Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandContactNo">Contact No.:</label>
                                        <input type="text" id="add-doctors-husbandContactNo" name="husband_contact_no" placeholder="Enter husband's contact no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandPhilHealthNo">Philhealth No.:</label>
                                        <input type="text" id="add-doctors-husbandPhilHealthNo" name="husband_philhealth_no" placeholder="Enter husband's philhealth no." required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-husbandCompleteAddress">Complete Address:</label>
                                        <input type="text" id="add-doctors-husbandCompleteAddress" name="husband_complete_address" placeholder="Enter husband's complete address" required onChange={handleAddDoctorsChange} />
                                    </div>
                                </div>
                            </>
                        )}

                        {showWifeSection && (
                                <>
                                    <h2 style={{ marginTop: "1.3em" }}>Wife's Information</h2>
                                    <div className="add-doctors-column">
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeLastName">Last Name:</label>
                                            <input type="text" id="add-doctors-wifeLastName" name="wife_last_name" placeholder="Enter wife's last name" required onChange={handleAddDoctorsChange} />
                                        </div>
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeFirstName">First Name:</label>
                                            <input type="text" id="add-doctors-wifeFirstName" name="wife_first_name" placeholder="Enter wife's first name" required onChange={handleAddDoctorsChange} />
                                        </div>
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeMiddleName">Middle Name:</label>
                                            <input type="text" id="add-doctors-wifeMiddleName" name="wife_middle_name" placeholder="Enter wife's middle name" required onChange={handleAddDoctorsChange} />
                                        </div>
                                    </div>
                                    <div className="add-doctors-column">
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeAge">Age:</label>
                                            <input type="text" id="add-doctors-wifeAge" name="wife_age" placeholder="Enter wife's birthday" required value={addDoctorsInputs.wife_age || ""} readOnly className="add-doctors-shaded-input" onChange={handleAddDoctorsChange} />
                                        </div>
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeBirthday">Birthday:</label>
                                            <input type="date" id="add-doctors-wifeBirthday" name="wife_birthday" placeholder="Enter wife's birthday" required onChange={handleAddDoctorsChange} />
                                        </div>
                                        <div className="add-doctors-input-box">
                                        <div className="add-doctors-gender-box">
                                            <h3>Sex:</h3>
                                            <div className="add-doctors-gender-option">
                                                <div className="add-doctors-gender">
                                                    <input type="radio" id="check-male" name="wife_sex" checked={addDoctorsInputs.wife_sex === "Male"} value="Male" onChange={handleAddDoctorsChange} />
                                                    <label htmlFor="check-male">Male</label>
                                                </div>
                                                <div className="add-doctors-gender">
                                                    <input type="radio" id="check-female" name="wife_sex" checked={addDoctorsInputs.wife_sex === "Female"} value="Female" onChange={handleAddDoctorsChange} />
                                                    <label htmlFor="check-female">Female</label>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="add-doctors-column">
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeCivilStatus">Civil Status:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="wife_civil_status" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select Civil Status --</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                        </div>
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeOccupation">Occupation:</label>
                                            <input type="text" id="add-doctors-wifeOccupation" name="wife_occupation" placeholder="Enter wife's occupation" required onChange={handleAddDoctorsChange} />
                                        </div>
                                        <div className="add-doctors-input-box">
                                        <label htmlFor="add-doctors-wifeEducAttainment">Educational Attainment:</label>
                                        <div className="add-doctors-select-box">
                                            <select name="wife_educ_attainment" required onChange={handleAddDoctorsChange} > 
                                                <option hidden value="">-- Select education level --</option>
                                                <option value="No Formal Education">No Formal Education</option>
                                                <option value="Elementary Level">Elementary Level</option>
                                                <option value="Elementary Graduate">Elementary Graduate</option>
                                                <option value="High School Level">High School Level</option>
                                                <option value="High School Graduate">High School Graduate</option>
                                                <option value="College Level">College Level</option>
                                                <option value="College Graduate">College Graduate</option>
                                                <option value="Vocational Graduate">Vocational Graduate</option>
                                                <option value="Post-Graduate">Post-Graduate</option>
                                            </select>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="add-doctors-column">
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeContactNo">Contact No.:</label>
                                            <input type="text" id="add-doctors-wifeContactNo" name="wife_contact_no" placeholder="Enter wife's contact no." required onChange={handleAddDoctorsChange} />
                                        </div>
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifePhilHealthNo">Philhealth No.:</label>
                                            <input type="text" id="add-doctors-wifePhilHealthNo" name="wife_philhealth_no" placeholder="Enter wife's philhealth no." required onChange={handleAddDoctorsChange} />
                                        </div>
                                    </div>
                                    <div className="add-doctors-column">
                                        <div className="add-doctors-input-box">
                                            <label htmlFor="add-doctors-wifeCompleteAddress">Complete Address:</label>
                                            <input type="text" id="add-doctors-wifeCompleteAddress" name="wife_complete_address" placeholder="Enter wife's complete address" required onChange={handleAddDoctorsChange} />
                                        </div>
                                    </div>
                                </>
                            )}


                  
                        <div className="add-doctors-buttons">
                            <button className="add-doctors-save-button" >Save</button>
                            <button className="add-doctors-cancel-button" onClick={(e) => { 
                                e.preventDefault(); 
                                setSelectedDoctor(null);
                                setShowModal(false); 
                                setAddDoctorsInputs({}); 
                                setSelectedAccompaniment(''); 
                                setShowFatherSection(false); 
                                setShowMotherSection(false); 
                                setShowWifeSection(false); 
                                setShowHusbandSection(false); 
                                setShowFatherMotherSection(false);
                                } }>Close</button>
                        </div>
                    </form>
                </div>
            </div>
            )}
            {viewHistoryModal && (
                <div className="add-doctors-popup-overlay">
                    <div className="view-Prenatal-History-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setViewHistoryModal(false); } } > X </button>
                        <h2>Consultation History Record</h2>
                        <div className="view-Prenatal-History-AddFilter">
                            <button onClick={() => setAddHistoryModal(true)}>Add</button>
                            <span>Date Modified:</span>
                            <select>
                                <option hidden></option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                        <form className="add-doctors-form" onSubmit={handleAddDoctorsSubmit}>
                            <div className="view-Prenatal-History-TableWrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date Visit</th>
                                            <th>Doctor</th>
                                            <th>Age</th>
                                            <th>Blood Pressure (Systolic/Diastolic)</th>
                                            <th>Pulse Rate</th>
                                            <th>Height/Weight</th>
                                            <th>Temperature</th>
                                            <th>Chief Complaints</th>
                                            <th style={{ width: "250px" }}>Doctor's Diagnosis / Medication</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        
                                        {consultVisits.map((consVisit, key) => (
                                        <tr key={key}>
                                            <td>
                                                {consVisit.DateVisit}
                                            </td>
                                            <td>
                                                {consVisit.DoctorID}
                                            </td>
                                            <td>
                                                {consVisit.Age}
                                            </td>
                                            <td>
                                                {consVisit.BPSystolic} / {consVisit.BPDiastolic}
                                            </td>
                                            <td>
                                                {consVisit.PulseRate}
                                            </td>
                                            <td>
                                                {consVisit.Height}cm / {consVisit.Weight}kg
                                            </td>
                                            <td>
                                                {consVisit.Temperature}°C
                                            </td>
                                            <td>
                                                {consVisit.ChiefComplaint}
                                            </td>
                                            <td>
                                                {consVisit.ICDCode} {consVisit.DiagnosisName}<br />
                                                {consVisit.DoctorsNotes}<br />
                                                {consVisit.MedicineName} {consVisit.Dosage} {consVisit.Frequency} {consVisit.Duration}
                                            </td>
                                        </tr>
                                        ))}
                                    
                                    </tbody>
                                </table>
                            </div>
                            <div className="add-doctors-buttons">
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setViewHistoryModal(false); } } >Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {addHistoryModal && (
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setAddHistoryModal(false); } } > X </button>
                        <h2>Add Consultation History Record</h2>
                        <form className="add-doctors-form" onSubmit={submitHistoryRecord}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-date">Date Visit:</label>
                                    <input type="date" id="add-consultation-history-date" name="consult_date_visit" required value={addHistoryInputs.consult_date_visit} onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-age">Age:</label>
                                    <input type="number" id="add-consultation-history-age" name="consult_age" min="0" max="60" placeholder="e.g. 3" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-bp">BP - Systolic:</label>
                                    <input type="number" id="add-prenatal-history-bp" name="consult_bps" placeholder="e.g. 120" min="50" max="250" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-bp">BP - Diastolic:</label>
                                    <input type="number" id="add-prenatal-history-bp" name="consult_bpd" placeholder="e.g. 80" min="30" max="150" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-prenatal-history-pr">Pulse Rate:</label>
                                    <input type="number" id="add-prenatal-history-pr" name="consult_pr" placeholder="e.g. 72" min="30" max="200" required onChange={handleAddHistoryChange} />
                                </div>             
                                            
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-weight">Weight (kg):</label>
                                    <input type="number" id="add-doctors-weight" name="consult_wt" step="0.01" min="0" placeholder='0.00' required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-height">Height (cm):</label>
                                    <input type="number" id="add-doctors-height" name="consult_ht" step="0.1" min="0" placeholder='0.0' required onChange={handleAddHistoryChange} />
                            </div>                             
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-temp">Temperature (°C):</label>
                                    <input type="number" id="add-consultation-history-temp" name="consult_temp" placeholder="e.g. 36.6" step="0.1" min="30" max="45" required onChange={handleAddHistoryChange} />
                                </div>
                                
                                <div className="add-doctors-input-box">
                                    <label>Doctor:</label>
                                    <div className="add-doctors-select-box">
                                        <select 
                                            onChange={handleDoctorSelect} 
                                            value={addHistoryInputs.doctorID || ""} 
                                            required
                                        >
                                            <option hidden value="">-- Select Doctor ID --</option>
                                            {allDoctors.map((p) => (
                                                <option key={p.AdminID} value={p.AdminID}>
                                                    {p.AdminID}
                                                </option>
                                            ))}
                                        </select>    
                                    </div>
                                </div>



                            </div>
                                
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-cc">Chief Complaints:</label>
                                    <input type="text" id="add-consultation-history-cc" name="consult_chief_comp" required onChange={handleAddHistoryChange} />
                                </div> 
                            </div>
                            <h4 style={{ marginTop: "1.4em" }}>Doctor's Diagnosis</h4>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                       <IcdCollapsibleDropdown
                                            onChange={(selectedOptions) => {
                                                setAddHistoryInputs((prev) => ({
                                                ...prev,
                                                consult_icd_codes: selectedOptions.map((s) => s.value).join(","),
                                                DiagnosisName: selectedOptions?.map((s) => s.label.split(" - ")[1]).join("|") || "",
                                                }));
                                            }}
                                        />
                                </div> 
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-notes">Doctors Notes:</label>
                                    <input type="text" id="add-consultation-history-notes" name="consult_doctor_notes" required onChange={handleAddHistoryChange} />
                                </div> 
                                
                            </div>

                            <h4 style={{ marginTop: "1.4em" }}>Prescribed Medication</h4>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-medicine">Medicine Name:</label>
                                    <input 
                                        type="text" 
                                        id="add-consultation-history-medicine" 
                                        name="consult_medicine_name" 
                                        list="medicineList" 
                                        required 
                                        onChange={handleAddHistoryChange} 
                                        placeholder="Enter medicine name" 
                                    />
                                    <datalist id="medicineList">
                                        <option value="Paracetamol" />
                                        <option value="Ibuprofen" />
                                        <option value="Amoxicillin" />
                                        <option value="Ciprofloxacin" />
                                        <option value="Azithromycin" />
                                        <option value="Metronidazole" />
                                        <option value="Cefalexin" />
                                        <option value="Cotrimoxazole" />
                                        <option value="Doxycycline" />
                                        <option value="Chloroquine" />
                                        <option value="Artemether/Lumefantrine" />
                                        <option value="Hydroxychloroquine" />
                                        <option value="Loperamide" />
                                        <option value="Cetirizine" />
                                        <option value="Diphenhydramine" />
                                        <option value="Salbutamol" />
                                        <option value="Mefenamic Acid" />
                                        <option value="Ranitidine" />
                                        <option value="Omeprazole" />
                                        <option value="Oral Rehydration Salts (ORS)" />
                                        <option value="Zinc sulfate" />
                                        <option value="Isoniazid" />
                                        <option value="Rifampicin" />
                                        <option value="Vitamin A" />
                                        <option value="Ferrous sulfate" />
                                    </datalist>
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-dosage">Dosage:</label>
                                    <input type="text" id="add-consultation-history-dosage" name="consult_dosage" placeholder="e.g. 500mg" required onChange={handleAddHistoryChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-frequency">Frequency:</label>
                                    <div className="add-doctors-select-box">
                                        <select name="consult_frequency" onChange={handleAddHistoryChange} > 
                                            <option hidden>Select Frequency</option>
                                            <option value="Once a day">Once a day</option>
                                            <option value="Once a day, Before meal">Once a day, Before meal</option>
                                            <option value="Once a day, After meal">Once a day, After meal</option>

                                            <option value="Twice a day">Twice a day</option>
                                            <option value="Twice a day, Before meal">Twice a day, Before meal</option>
                                            <option value="Twice a day, After meal">Twice a day, After meal</option>

                                            <option value="Three times a day">Three times a day</option>
                                            <option value="Three times a day, Before meal">Three times a day, Before meal</option>
                                            <option value="Three times a day, After meal">Three times a day, After meal</option>
                                        </select>
                                    </div>
                                </div> 
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-consultation-history-duration">Duration:</label>
                                    <input type="text" id="add-consultation-history-duration" name="consult_duration" placeholder="e.g. 7 days" required onChange={handleAddHistoryChange} />
                                </div>
                            </div>
                            <div className="add-doctors-buttons">
                                <button className="add-doctors-save-button" >Save</button>
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setAddHistoryModal(false); } } >Close</button>
                            </div>
                        
                        </form>
                    </div>
                </div>
            )}

            {editDoctorModal && selectedDoctor && (
            
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setEditDoctorModal(false); setSelectedDoctor(null); } }     > X </button>
                        <h2>Edit Doctor</h2>
                        <form className="add-doctors-form" onSubmit={handleEditSubmit}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-firstName">First Name:</label>
                                    <input type="text" id="add-doctors-firstName" name="fName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.FirstName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                    <input type="text" id="add-doctors-middleName" name="MiddleName" value={selectedDoctor.MiddleName} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                    <input type="text" id="add-doctors-lastName" name="lName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.LastName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Sex:</label>  
                                    <input type="text" id="add-doctors-lastName" name="sex" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Sex} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-licensingNumber">Licensing Number:</label>
                                    <input type="text" id="add-doctors-licensingNumber" name="licNumber" className="add-doctors-shaded-input" readOnly value={selectedDoctor.LicensingNumber} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Specialty:</label>
                                    <input type="text" id="add-doctors-specialty" name="specialty" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Specialty} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Position:</label>
                                    <input type="text" id="add-doctors-specialty" name="position" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Position} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-homeAddress">Home Address:</label>
                                    <input type="text" id="add-doctors-homeAddress" name="HomeAddress" value={selectedDoctor.HomeAddress} onChange={handleEditDoctorsChange} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-contactNumber">Contact Number:</label>
                                    <input type="text" id="add-doctors-contactNumber" name="ContactNumber" value={selectedDoctor.ContactNumber} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-emergencyContact">Emergency Contact Number:</label>
                                    <input type="text" id="add-doctors-emergencyContact" name="EmergencyNumber" value={selectedDoctor.EmergencyNumber} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-userID">Admin ID:</label>  
                                    <input type="text" id="add-doctors-userID" name="AdminID" className="add-doctors-shaded-input" readOnly value={selectedDoctor.AdminID} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-emailAddress">Email Address:</label>
                                    <input type="text" id="add-doctors-emailAddress" name="emailAdd" className="add-doctors-shaded-input" readOnly value={selectedDoctor.EmailAddress} />
                                </div>
                            </div>
                            <div className="add-doctors-buttons">
                                <button className="add-doctors-save-button" >Save</button>
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setEditDoctorModal(false); setSelectedDoctor(null); } } >Close</button>
                            </div>
                        </form>
                    </div>
                </div>

            )}

            {/* WINDOW THAT SHOWS 'DELETE BUTTON' OF DOCTOR */}
            {deleteDoctorModal && selectedDoctor && (
            
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setDeleteDoctorModal(false); setSelectedDoctor(null); } }     > X </button>
                        <h2>Confirm Delete</h2>
                        <h4>Are you sure you want to delete this item?</h4>
                            <div className="delete-doctors-buttons">
                                <button className="add-doctors-save-button" onClick={() => deleteDoctor(selectedDoctor) } >Delete</button>
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setDeleteDoctorModal(false); setSelectedDoctor(null); } } >Cancel</button>
                            </div>
                    </div>
                </div>

            )}

            {/* Archive Patient Modal */}
            <ArchivePatientModal
                isOpen={isArchiveModalOpen}
                onClose={() => {
                    setIsArchiveModalOpen(false);
                    setSelectedPatientToArchive(null);
                }}
                patient={selectedPatientToArchive}
                onConfirm={handleConfirmArchive}
            />

        </div>
    );
}

export default Patients;