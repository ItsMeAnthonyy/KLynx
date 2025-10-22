import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import ProfileDropdown from '../../../components/ProfileDropdown';
import { BiSearch, BiError  } from 'react-icons/bi';
import {  FaEye, FaEdit, FaPlus} from 'react-icons/fa';
import styles from './StaffHealthRecord.module.css';
import PermissionGate from '../../../components/PermissionGate';
import { PERMISSIONS } from '../../../utils/rolePermissions';


// Mock staff health data - Multiple records per staff member
const MOCK_STAFF_DATA = [
    {
        recordId: 1,
        initials: 'DES',
        staffName: 'Dr. Emily Smith',
        staffId: 'S001',
        department: 'Internal Medicine',
        role: 'Doctor',
        date: '8/15/2024',
        healthStatus: 'excellent',
        fitnessForDuty: 'cleared',
        lastPhysical: '8/15/2024',
        bmi: '22.4',
        bloodPressure: '118/76',
        doctor: 'Dr. John Doe',
        temperature: '36.7',
        diagnosis: 'Healthy',
        vaccinationStatus: 'current',
        healthInsurance: true,
        alerts: []
    },
    {
        recordId: 2,
        initials: 'SJ',
        staffName: 'Sarah Johnson',
        staffId: 'S002',
        department: 'Pediatrics',
        role: 'Nurse',
        date: '7/20/2024',
        doctor: 'Dr. Jane Smith',
        healthStatus: 'good',
        fitnessForDuty: 'cleared',
        lastPhysical: '7/22/2024',
        bmi: '24.1',
        bloodPressure: '120/80',
        temperature: '36.8',
        diagnosis: 'Mild Allergies',
        vaccinationStatus: 'current',
        healthInsurance: true,
        alerts: []
    },
    {
        recordId: 3,
        initials: 'LC',
        staffName: 'Lisa Chen',
        staffId: 'S003',
        doctor: 'Dr. Emily White',
        date: '9/5/2024',
        department: 'Reception',
        role: 'Staff',
        healthStatus: 'excellent',
        fitnessForDuty: 'cleared',
        lastPhysical: '9/10/2024',
        bmi: '21.8',
        bloodPressure: '115/75',
        temperature: '36.6',
        diagnosis: 'Healthy',
        vaccinationStatus: 'current',
        healthInsurance: true,
        alerts: []
    }
];

function StaffHealthRecord() {
    // Load initial data from localStorage or use mock data
    const [staffData, setStaffData] = useState(() => {
        const savedData = localStorage.getItem('staffHealthRecords');
        return savedData ? JSON.parse(savedData) : MOCK_STAFF_DATA;
    });
    const [filteredStaff, setFilteredStaff] = useState(staffData);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All Departments');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedStaffRecords, setSelectedStaffRecords] = useState([]); // All records for selected staff
    const [message, setMessage] = useState({ type: '', text: '' });

    // Save to localStorage whenever staffData changes
    useEffect(() => {
        localStorage.setItem('staffHealthRecords', JSON.stringify(staffData));
    }, [staffData]);

    // Form data for Add General Record modal
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        staffName: '',
        department: '',
        role: '',
        bloodPressure: '',
        pulseRate: '',
        height: '',
        weight: '',
        temperature: '',
        doctor: '',
        chiefComplaint: '',
        diagnosis: '',
        doctorNotes: '',
        medicineName: '',
        dosage: '',
        duration: '',
        frequency: ''
    });

    // Filter staff based on search and department
    useEffect(() => {
        let result = staffData;

        if (searchQuery) {
            result = result.filter(staff =>
                staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterDepartment !== 'All Departments') {
            result = result.filter(staff => staff.department === filterDepartment);
        }

        // Group by staffId and show only the most recent record for each staff member
        const groupedByStaff = {};
        result.forEach(record => {
            if (!groupedByStaff[record.staffId]) {
                groupedByStaff[record.staffId] = record;
            } else {
                // Keep the record with the most recent date
                const existingDate = new Date(groupedByStaff[record.staffId].date);
                const currentDate = new Date(record.date);
                if (currentDate > existingDate) {
                    groupedByStaff[record.staffId] = record;
                }
            }
        });

        setFilteredStaff(Object.values(groupedByStaff));
    }, [staffData, searchQuery, filterDepartment]);

    // Calculate statistics (for future use)
    // const stats = {
    //     clearedForDuty: staffData.filter(s => s.fitnessForDuty === 'cleared').length,
    //     underMonitoring: staffData.filter(s => s.fitnessForDuty === 'monitoring').length,
    //     vaccinationRate: Math.round((staffData.filter(s => s.vaccinationStatus === 'current').length / staffData.length) * 100),
    //     healthAlerts: staffData.reduce((sum, s) => sum + (s.alerts?.length || 0), 0)
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddRecord = (e) => {
        e.preventDefault();
        
        // Calculate BMI
        const heightInMeters = parseFloat(formData.height) / 100; // Convert cm to meters
        const weightInKg = parseFloat(formData.weight);
        const calculatedBMI = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        
        // Check if staff already exists
        const existingStaffRecords = staffData.filter(record => 
            record.staffName === formData.staffName || record.staffId === formData.staffId
        );
        
        let staffId, initials;
        
        if (existingStaffRecords.length > 0) {
            // Use existing staffId and initials
            staffId = existingStaffRecords[0].staffId;
            initials = existingStaffRecords[0].initials;
        } else {
            // Generate new staffId and initials for new staff
            const existingStaffIds = [...new Set(staffData.map(record => record.staffId))];
            const maxStaffNumber = existingStaffIds.length > 0 
                ? Math.max(...existingStaffIds.map(id => parseInt(id.substring(1)))) 
                : 0;
            staffId = `S${String(maxStaffNumber + 1).padStart(3, '0')}`;
            
            const nameParts = formData.staffName.split(' ');
            initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
        }
        
        // Create new health record
        const newRecord = {
            recordId: Date.now(),
            initials: initials,
            staffName: formData.staffName,
            staffId: staffId,
            department: formData.department,
            role: formData.role,
            date: new Date().toISOString().split('T')[0],
            healthStatus: 'excellent',
            fitnessForDuty: 'cleared',
            lastPhysical: formData.date,
            bmi: calculatedBMI,
            bloodPressure: formData.bloodPressure,
            pulseRate: formData.pulseRate,
            height: formData.height,
            weight: formData.weight,
            doctor: formData.doctor,
            temperature: formData.temperature,
            diagnosis: formData.diagnosis,
            chiefComplaint: formData.chiefComplaint,
            doctorNotes: formData.doctorNotes,
            medicineName: formData.medicineName,
            dosage: formData.dosage,
            duration: formData.duration,
            frequency: formData.frequency,
            vaccinationStatus: 'current',
            healthInsurance: true,
            alerts: []
        };
        
        // Add to staff data
        const updatedStaffData = [...staffData, newRecord];
        setStaffData(updatedStaffData);
        
        // Show success message
        const messageText = existingStaffRecords.length > 0 
            ? `New health record added to ${formData.staffName}'s history!`
            : 'New staff member and health record added successfully!';
        setMessage({ type: 'success', text: messageText });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        
        setShowAddModal(false);
        resetForm();
    };

    const handleEditRecord = (e) => {
        e.preventDefault();
        
        if (!selectedStaff) return;
        
        // Calculate BMI
        const heightInMeters = parseFloat(formData.height) / 100;
        const weightInKg = parseFloat(formData.weight);
        const calculatedBMI = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        
        // Update the specific record
        const updatedStaffData = staffData.map(staff => 
            staff.recordId === selectedStaff.recordId 
                ? {
                    ...staff,
                    staffName: formData.staffName,
                    department: formData.department,
                    role: formData.role,
                    date: formData.date,
                    bmi: calculatedBMI,
                    bloodPressure: formData.bloodPressure,
                    pulseRate: formData.pulseRate,
                    height: formData.height,
                    weight: formData.weight,
                    doctor: formData.doctor,
                    temperature: formData.temperature,
                    diagnosis: formData.diagnosis,
                    chiefComplaint: formData.chiefComplaint,
                    doctorNotes: formData.doctorNotes,
                    medicineName: formData.medicineName,
                    dosage: formData.dosage,
                    duration: formData.duration,
                    frequency: formData.frequency,
                    lastPhysical: formData.date
                }
                : staff
        );
        
        setStaffData(updatedStaffData);
        
        // Show success message
        setMessage({ type: 'success', text: 'Health record updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        
        setShowEditModal(false);
        setSelectedStaff(null);
        resetForm();
    };

    const handleViewRecord = (staff) => {
        setSelectedStaff(staff);
        // Get all records for this staff member, sorted by date (most recent first)
        const allStaffRecords = staffData
            .filter(record => record.staffId === staff.staffId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        setSelectedStaffRecords(allStaffRecords);
        setShowViewModal(true);
    };

    const handleAddNewRecord = (staff) => {
        // Pre-fill the form with staff info for adding a new record
        setFormData({
            staffName: staff.staffName,
            department: staff.department,
            role: staff.role,
            date: new Date().toISOString().split('T')[0],
            bloodPressure: '',
            pulseRate: '',
            height: '',
            weight: '',
            temperature: '',
            doctor: '',
            chiefComplaint: '',
            diagnosis: '',
            doctorNotes: '',
            medicineName: '',
            dosage: '',
            duration: '',
            frequency: ''
        });
        setShowViewModal(false);
        setShowAddModal(true);
    };

    const handleEditClick = (staff) => {
        setSelectedStaff(staff);
        setFormData({
            staffName: staff.staffName,
            department: staff.department,
            role: staff.role,
            date: staff.date,
            bloodPressure: staff.bloodPressure,
            pulseRate: staff.pulseRate || '',
            height: staff.height || '',
            weight: staff.weight || '',
            temperature: staff.temperature,
            doctor: staff.doctor,
            chiefComplaint: staff.chiefComplaint || '',
            diagnosis: staff.diagnosis,
            doctorNotes: staff.doctorNotes || '',
            medicineName: staff.medicineName || '',
            dosage: staff.dosage || '',
            duration: staff.duration || '',
            frequency: staff.frequency || ''
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            staffName: '',
            department: '',
            role: '',
            date: new Date().toISOString().split('T')[0],
            bloodPressure: '',
            pulseRate: '',
            height: '',
            weight: '',
            temperature: '',
            doctor: '',
            chiefComplaint: '',
            diagnosis: '',
            doctorNotes: '',
            medicineName: '',
            dosage: '',
            duration: '',
            frequency: ''
        });
    };


    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Staff Health Records</h1>
                    
                    </div>
                    <div className={styles.headerRight}>
                        <button className={styles.emergencyButton}>
                            <BiError size={20} />
                            EMERGENCY MODE
                        </button>
                        <ProfileDropdown />
                    </div>
                </div>

                {/* Success/Error Message */}
                {message.text && (
                    <div style={{
                        padding: '12px 20px',
                        margin: '20px 2rem 0',
                        borderRadius: '8px',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        border: `2px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                    }}>
                        {message.text}
                    </div>
                )}


                {/* Search and Filter Section */}
                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <div className={styles.searchInputWrapper}>
                            <BiSearch className={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search staff by name, ID, or specialization..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className={styles.filterSelect}
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                        > 
                            <option>All Departments</option>
                            <option>Internal Medicine</option>
                            <option>Pediatrics</option>
                            <option>Reception</option>
                            <option>Emergency</option>
                            <option>IT</option>
                           
                        </select>
                    </div>
                </div>

                 <PermissionGate permission={PERMISSIONS.USERS_ADD}>
                                        <div className={styles.addButtonContainer}>
                                            <button 
                                                className={styles.addButton}
                                                onClick={() => setShowAddModal(true)}
                                            >
                                                <FaPlus size={16} />
                                               Add Health Record
                                            </button>
                                        </div>
                </PermissionGate>

                {/* Summary Table */}
                <div className={styles.summarySection}>
                    <div className={styles.summaryHeader}>
                    <h3 className={styles.summaryTitle}>Staff Health Records Summary</h3>
                    <p className={styles.summarySubtitle}>Showing {filteredStaff.length} of {staffData.length} staff health records</p>
                    </div>
                    <table className={styles.summaryTable}>
                        <thead>
                            <tr>
                                <th>Medical Staff</th>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Blood Pressure</th>
                                <th>Temperature</th>
                                <th>Diagnosis</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map((formData) => (
                                <tr key={formData.recordId}>
                                    <td>
                                        <div className={styles.tableStaffInfo}>
                                       
                                            <div>
                                                <div className={styles.tableName}>{formData.staffName}</div>
                                                <div className={styles.tableId}>{formData.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span>
                                            {formData.date}
                                        </span>
                                    </td>
                                    <td>
                                        <span>
                                            {formData.doctor}
                                        </span>
                                    </td>
                                    
                                    <td>
                                        <div className={styles.metrics}>
                                            
                                            <span> {formData.bloodPressure}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span>{formData.temperature} °C</span>
                                    </td>
                                    <td> {formData.diagnosis} </td>
                                    <td>
                                        <div className={styles.tableActions}>
                                            <button 
                                                className={styles.tableActionBtn}
                                                onClick={() => handleViewRecord(formData)}
                                                title="View Details"
                                            >
                                                <FaEye size={14} />
                                            </button>
                                            <button 
                                                className={styles.tableActionBtn}
                                                onClick={() => handleEditClick(formData)}
                                                title="Edit Record"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* View Consultation History Modal */}
                {showViewModal && selectedStaff && (
                    <div className={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Consultation History - {selectedStaff.staffName}</h2>
                                <button className={styles.closeButton} onClick={() => setShowViewModal(false)}>×</button>
                            </div>

                            <div className={styles.modalBody}>
                                {/* Staff Info Header */}
                                <div className={styles.viewStaffHeader}>
                                    <div className={styles.viewAvatar}>{selectedStaff.initials}</div>
                                    <div className={styles.viewStaffInfo}>
                                        <h3 className={styles.viewStaffName}>{selectedStaff.staffName}</h3>
                                        <p className={styles.viewStaffDetails}>
                                            {selectedStaff.staffId} • {selectedStaff.department} • {selectedStaff.role}
                                        </p>
                                    </div>
                                    <button 
                                        className={styles.addRecordBtn}
                                        onClick={() => handleAddNewRecord(selectedStaff)}
                                        title="Add New Health Record"
                                    >
                                        <FaPlus size={14} style={{ marginRight: '6px' }} />
                                        Add New Record
                                    </button>
                                </div>

                                {/* Consultation History Table */}
                                <div className={styles.historyTableContainer}>
                                    <h4 className={styles.historyTitle}>
                                        Consultation Records ({selectedStaffRecords.length} Total)
                                    </h4>
                                    <div className={styles.tableWrapper}>
                                        <table className={styles.historyTable}>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Date</th>
                                                    <th>Doctor</th>
                                                    <th>Vitals</th>
                                                    <th>Chief Complaint</th>
                                                    <th>Diagnosis</th>
                                                    <th>Medication</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedStaffRecords.map((record, index) => (
                                                    <tr key={record.recordId}>
                                                        <td className={styles.recordNumber}>
                                                            {selectedStaffRecords.length - index}
                                                        </td>
                                                        <td>{record.date}</td>
                                                        <td>{record.doctor}</td>
                                                        <td>
                                                            <div className={styles.vitalsCell}>
                                                                <div><strong>BP:</strong> {record.bloodPressure}</div>
                                                                {record.pulseRate && <div><strong>PR:</strong> {record.pulseRate} bpm</div>}
                                                                <div><strong>Temp:</strong> {record.temperature}°C</div>
                                                                {record.bmi && <div><strong>BMI:</strong> {record.bmi}</div>}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {record.chiefComplaint || 'N/A'}
                                                        </td>
                                                        <td>
                                                            <div className={styles.diagnosisCell}>
                                                                <strong>{record.diagnosis}</strong>
                                                                {record.doctorNotes && (
                                                                    <div className={styles.notes}>
                                                                        {record.doctorNotes.length > 50 
                                                                            ? record.doctorNotes.substring(0, 50) + '...' 
                                                                            : record.doctorNotes}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {record.medicineName ? (
                                                                <div className={styles.medicationCell}>
                                                                    <strong>{record.medicineName}</strong>
                                                                    {record.dosage && <div>{record.dosage}</div>}
                                                                    {record.frequency && <div>{record.frequency}</div>}
                                                                    {record.duration && <div className={styles.duration}>{record.duration}</div>}
                                                                </div>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button 
                                                                className={styles.editRecordBtn}
                                                                onClick={() => {
                                                                    setShowViewModal(false);
                                                                    handleEditClick(record);
                                                                }}
                                                                title="Edit this record"
                                                            >
                                                                <FaEdit size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button 
                                    className={styles.cancelBtn} 
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Record Modal */}
                {showEditModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Edit Health Record</h2>
                                <button className={styles.closeButton} onClick={() => setShowEditModal(false)}>×</button>
                            </div>

                            <form onSubmit={handleEditRecord} className={styles.modalBody}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Name <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="staffName"
                                            className={styles.formInput}
                                            value={formData.staffName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div> 

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Department <span className={styles.required}>*</span></label>   
                                        <select
                                            name="department"
                                            className={styles.formSelect}
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Reception">Reception</option>
                                            <option value="IT">IT</option>
                                            <option value="Internal Medicine">Internal Medicine</option>
                                            <option value="Emergency">Emergency</option>
                                            <option value="Temporary">Temporary</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Role <span className={styles.required}>*</span></label>   
                                        <select
                                            name="role"
                                            className={styles.formSelect}
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Doctor">Doctor</option>
                                            <option value="Nurse">Nurse</option>
                                            <option value="Staff">Staff</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Date <span className={styles.required}>*</span></label>
                                        <input
                                            type="date"
                                            name="date"
                                            className={styles.formInput}
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Blood Pressure <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="bloodPressure"
                                            className={styles.formInput}
                                            value={formData.bloodPressure}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Pulse Rate <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="pulseRate"
                                            className={styles.formInput}
                                            value={formData.pulseRate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Height <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="height"
                                            className={styles.formInput}
                                            value={formData.height}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Weight <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="weight"
                                            className={styles.formInput}
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Temperature <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="temperature"
                                            className={styles.formInput}
                                            value={formData.temperature}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Doctor <span className={styles.required}>*</span></label>
                                        <select
                                            name="doctor"
                                            className={styles.formSelect}
                                            value={formData.doctor}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Doctor</option>
                                            <option value="Dr. Smith">Dr. Smith</option>
                                            <option value="Dr. Johnson">Dr. Johnson</option>
                                            <option value="Dr. John Doe">Dr. John Doe</option>
                                            <option value="Dr. Jane Smith">Dr. Jane Smith</option>
                                            <option value="Dr. Emily White">Dr. Emily White</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Chief&apos;s Complaint <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="chiefComplaint"
                                            className={styles.formInput}
                                            value={formData.chiefComplaint}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.sectionTitle}>Doctor&apos;s Diagnosis</div>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Diagnosis <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="diagnosis"
                                            className={styles.formInput}
                                            value={formData.diagnosis}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Doctor&apos;s Notes <span className={styles.required}>*</span></label>
                                        <textarea
                                            name="doctorNotes"
                                            className={styles.formTextarea}
                                            value={formData.doctorNotes}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.sectionTitle}>Medication</div>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Medicine Name <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="medicineName"
                                            className={styles.formInput}
                                            value={formData.medicineName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Dosage <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="dosage"
                                            className={styles.formInput}
                                            value={formData.dosage}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Duration <span className={styles.required}>*</span></label>
                                        <select
                                            name="duration"
                                            className={styles.formSelect}
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Duration</option>
                                            <option value="1 Week">1 Week</option>
                                            <option value="2 Weeks">2 Weeks</option>
                                            <option value="1 Month">1 Month</option>
                                            <option value="3 Months">3 Months</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Frequency <span className={styles.required}>*</span></label>
                                        <select
                                            name="frequency"
                                            className={styles.formSelect}
                                            value={formData.frequency}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Frequency</option>
                                            <option value="Once Daily">Once Daily</option>
                                            <option value="Twice Daily">Twice Daily</option>
                                            <option value="Three Times Daily">Three Times Daily</option>
                                            <option value="As Needed">As Needed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.saveBtn}>
                                        Update Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add General Record Modal */}
                {showAddModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Add General Record</h2>
                                <button className={styles.closeButton} onClick={() => setShowAddModal(false)}>×</button>
                            </div>

                            <form onSubmit={handleAddRecord} className={styles.modalBody}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Name <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="staffName"
                                            className={styles.formInput}
                                            value={formData.staffName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div> 

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Department <span className={styles.required}>*</span></label>   
                                        <select
                                            name="department"
                                            className={styles.formSelect}
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Reception">Reception</option>
                                            <option value="IT">IT</option>
                                            <option value="Internal Medicine">Internal Medicine</option>
                                            <option value="Emergency">Emergency</option>
                                            <option value="Temporary">Temporary</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Role <span className={styles.required}>*</span></label>   
                                        <select
                                            name="role"
                                            className={styles.formSelect}
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Doctor">Doctor</option>
                                            <option value="Nurse">Nurse</option>
                                            <option value="Staff">Staff</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Date <span className={styles.required}>*</span></label>
                                        <input
                                            type="date"
                                            name="date"
                                            className={styles.formInput}
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Blood Pressure <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="bloodPressure"
                                            className={styles.formInput}
                                            placeholder="120/80"
                                            value={formData.bloodPressure}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Pulse Rate <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="pulseRate"
                                            className={styles.formInput}
                                            placeholder="72 bpm"
                                            value={formData.pulseRate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Height (cm) <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="height"
                                            className={styles.formInput}
                                            placeholder="170"
                                            value={formData.height}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Weight (kg) <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="weight"
                                            className={styles.formInput}
                                            placeholder="70"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Temperature (°C) <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="temperature"
                                            className={styles.formInput}
                                            placeholder="36.7"
                                            value={formData.temperature}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Doctor <span className={styles.required}>*</span></label>
                                        <select
                                            name="doctor"
                                            className={styles.formSelect}
                                            value={formData.doctor}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Doctor</option>
                                            <option value="Dr. Smith">Dr. Smith</option>
                                            <option value="Dr. Johnson">Dr. Johnson</option>
                                            <option value="Dr. John Doe">Dr. John Doe</option>
                                            <option value="Dr. Jane Smith">Dr. Jane Smith</option>
                                            <option value="Dr. Emily White">Dr. Emily White</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Chief&apos;s Complaint <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="chiefComplaint"
                                            className={styles.formInput}
                                            placeholder="Enter chief complaint"
                                            value={formData.chiefComplaint}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.sectionTitle}>Doctor&apos;s Diagnosis</div>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Diagnosis <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="diagnosis"
                                            className={styles.formInput}
                                            placeholder="Enter diagnosis"
                                            value={formData.diagnosis}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Doctor&apos;s Notes <span className={styles.required}>*</span></label>
                                        <textarea
                                            name="doctorNotes"
                                            className={styles.formTextarea}
                                            placeholder="Enter doctor's notes"
                                            value={formData.doctorNotes}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.sectionTitle}>Medication</div>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Medicine Name <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="medicineName"
                                            className={styles.formInput}
                                            placeholder="Enter medicine name"
                                            value={formData.medicineName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Dosage <span className={styles.required}>*</span></label>
                                        <input
                                            type="text"
                                            name="dosage"
                                            className={styles.formInput}
                                            placeholder="e.g., 500mg"
                                            value={formData.dosage}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Duration <span className={styles.required}>*</span></label>
                                        <select
                                            name="duration"
                                            className={styles.formSelect}
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Duration</option>
                                            <option value="1 Week">1 Week</option>
                                            <option value="2 Weeks">2 Weeks</option>
                                            <option value="1 Month">1 Month</option>
                                            <option value="3 Months">3 Months</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Frequency <span className={styles.required}>*</span></label>
                                        <select
                                            name="frequency"
                                            className={styles.formSelect}
                                            value={formData.frequency}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Frequency</option>
                                            <option value="Once Daily">Once Daily</option>
                                            <option value="Twice Daily">Twice Daily</option>
                                            <option value="Three Times Daily">Three Times Daily</option>
                                            <option value="As Needed">As Needed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.saveBtn}>
                                        Save Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default StaffHealthRecord;