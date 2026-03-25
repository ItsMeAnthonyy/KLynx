import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearch, BiRefresh, BiExport, BiShow, BiUndo } from 'react-icons/bi';
import Sidebar from '../../../components/Sidebar';
import ProfileDropdown from '../../../components/ProfileDropdown';
import EmergencyButton from '../../../components/EmergencyButton';
import styles from './Archives.module.css';

const Archives = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [reasonFilter, setReasonFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [archivedBy, setArchivedBy] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [archivedPatients, setArchivedPatients] = useState([]);

    const reasons = ['All Reasons', 'Transferred', 'Deceased', 'Duplicate Record', 'Moved Away', 'Other'];

    // Load archived patients from localStorage on component mount
    useEffect(() => {
        const loadArchivedPatients = () => {
            const stored = localStorage.getItem('archivedPatients');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setArchivedPatients(parsed);
                } catch (error) {
                    console.error('Error loading archived patients:', error);
                    setArchivedPatients([]);
                }
            }
        };
        
        loadArchivedPatients();
        
        // Set up an interval to check for changes (in case another tab makes changes)
        const interval = setInterval(loadArchivedPatients, 1000);
        return () => clearInterval(interval);
    }, []);

    // Handle select all checkbox
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(archivedPatients.map(patient => patient.id));
        } else {
            setSelectedItems([]);
        }
    };

    // Handle individual checkbox
    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Handle restore selected
    const handleRestoreSelected = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one patient to restore');
            return;
        }
        if (window.confirm(`Are you sure you want to restore ${selectedItems.length} selected patient(s)?`)) {
            // Filter out selected patients from archived list
            const updatedArchived = archivedPatients.filter(patient => !selectedItems.includes(patient.id));
            
            // Update state
            setArchivedPatients(updatedArchived);
            
            // Update localStorage
            localStorage.setItem('archivedPatients', JSON.stringify(updatedArchived));
            
            // Clear selection
            setSelectedItems([]);
            
            alert('Selected patients have been restored successfully');
            
            // Note: You would need to also restore these patients to your backend database
            // Example: await axios.post('/api/patients/restore', { patientIds: selectedItems });
        }
    };

    // Handle export selected
    const handleExportSelected = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one patient to export');
            return;
        }

        // Helper function to escape CSV values
        const escapeCSV = (value) => {
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            // Escape double quotes and wrap in quotes if contains comma, quote, or newline
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        // Get selected patients
        const selectedPatients = archivedPatients.filter(patient => 
            selectedItems.includes(patient.id)
        );

        // Create CSV content
        const csvRows = [];
        
        // Add title
        csvRows.push(`ARCHIVED PATIENTS EXPORT - ${new Date().toLocaleDateString()}`);
        csvRows.push(`Total Records: ${selectedPatients.length}`);
        csvRows.push('');
        
        // Add headers
        csvRows.push('Patient ID,Patient Name,Date of Birth,Archived On,Reason,Notes,Archived By,Status');
        
        // Add data rows
        selectedPatients.forEach(patient => {
            // Get original patient data if available
            const originalData = patient.originalData || {};
            
            csvRows.push([
                escapeCSV(patient.id),
                escapeCSV(patient.name),
                escapeCSV(patient.Birthdate || originalData.Birthdate || originalData.Birthday || ''),
                escapeCSV(patient.archivedOn),
                escapeCSV(patient.reason),
                escapeCSV(patient.notes),
                escapeCSV(patient.archivedBy),
                escapeCSV(patient.status)
            ].join(','));
        });
            // Archive Information

        // Convert to CSV string
        const csvContent = csvRows.join('\n');
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Create filename with date
        const dateStr = new Date().toISOString().split('T')[0];
        const exportFileName = `archived_patients_${dateStr}.csv`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', exportFileName);
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        alert(`Successfully exported ${selectedPatients.length} patient(s) to ${exportFileName}`);
    };

    // Handle view patient
    const handleViewPatient = (id) => {
        const patient = archivedPatients.find(p => p.id === id);
        if (patient && patient.originalData) {
            // Navigate to visits page with archived flag
            navigate(`/patient/${id}/visits`, { 
                state: { 
                    patient: patient.originalData,
                    isArchived: true,
                    archiveInfo: {
                        reason: patient.reason,
                        notes: patient.notes,
                        archivedOn: patient.archivedOn,
                        archivedBy: patient.archivedBy
                    }
                } 
            });
        } else {
            alert('Patient data not available');
        }
    };

    // Handle restore individual patient
    const handleRestorePatient = (id, name) => {
        if (window.confirm(`Are you sure you want to restore ${name}?`)) {
            // Filter out the patient from archived list
            const updatedArchived = archivedPatients.filter(patient => patient.id !== id);
            
            // Update state
            setArchivedPatients(updatedArchived);
            
            // Update localStorage
            localStorage.setItem('archivedPatients', JSON.stringify(updatedArchived));
            
            alert(`${name} has been restored successfully`);
            
            // Note: You would need to also restore this patient to your backend database
            // Example: await axios.post('/api/patients/restore', { patientId: id });
        }
    };

    // Filter patients
    const filteredPatients = archivedPatients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            patient.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesReason = reasonFilter === 'all' || reasonFilter === 'All Reasons' || 
                             patient.reason === reasonFilter;
        const matchesArchivedBy = archivedBy === '' || 
                                 patient.archivedBy.toLowerCase().includes(archivedBy.toLowerCase());
        
        return matchesSearch && matchesReason && matchesArchivedBy;
    });

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Archive Management</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <EmergencyButton />
                        <ProfileDropdown 
                            email="admin@klynx.com"
                            name="Admin User"
                        />
                    </div>
                </div>
                
                {/* Filters Section */}
                <div className={styles.filtersSection}>
                    <div className={styles.searchBar}>
                        <BiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by name or patient ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filtersRow}>
                        <select 
                            className={styles.filterSelect}
                            value={reasonFilter}
                            onChange={(e) => setReasonFilter(e.target.value)}
                        >
                            {reasons.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            className={styles.dateInput}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="dd/mm/yyyy"
                        />

                        <input
                            type="date"
                            className={styles.dateInput}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="dd/mm/yyyy"
                        />

                        <input
                            type="text"
                            className={styles.filterInput}
                            placeholder="Archived by..."
                            value={archivedBy}
                            onChange={(e) => setArchivedBy(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionsRow}>
                        <span className={styles.selectedCount}>
                            {selectedItems.length} selected
                        </span>
                        <button 
                            className={styles.restoreButton}
                            onClick={handleRestoreSelected}
                            disabled={selectedItems.length === 0}
                        >
                            <BiRefresh />
                            Restore Selected
                        </button>
                        <button 
                            className={styles.exportButton}
                            onClick={handleExportSelected}
                            disabled={selectedItems.length === 0}
                        >
                            <BiExport />
                            Export Selected
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className={styles.tableSection}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === archivedPatients.length && archivedPatients.length > 0}
                                            onChange={handleSelectAll}
                                            className={styles.checkbox}
                                        />
                                    </th>
                                    <th>PATIENT NAME</th>
                                    <th>Birthdate</th>
                                    <th>PATIENT ID</th>
                                    <th>ARCHIVED ON</th>
                                    <th>REASON</th>
                                    <th>NOTES</th>
                                    <th>ARCHIVED BY</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(patient.id)}
                                                onChange={() => handleSelectItem(patient.id)}
                                                className={styles.checkbox}
                                            />
                                        </td>
                                        <td>
                                            <div className={styles.patientName}>
                                                {patient.name}
                                                <span className={styles.statusBadge}>{patient.status}</span>
                                            </div>
                                        </td>
                                        <td>{patient.Birthdate}</td>
                                        <td>{patient.id}</td>
                                        <td>{patient.archivedOn}</td>
                                        <td>{patient.reason}</td>
                                        <td>{patient.notes}</td>
                                        <td>{patient.archivedBy}</td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button 
                                                    className={styles.viewButton}
                                                    onClick={() => handleViewPatient(patient.id)}
                                                    title="View Patient"
                                                >
                                                    <BiShow />
                                                </button>
                                                <button 
                                                    className={styles.restoreIconButton}
                                                    onClick={() => handleRestorePatient(patient.id, patient.name)}
                                                    title="Restore Patient"
                                                >
                                                    <BiUndo />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredPatients.length === 0 && (
                            <div className={styles.noResults}>
                                <p>No archived patients found</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Archives;