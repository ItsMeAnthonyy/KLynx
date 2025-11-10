import { useState } from 'react';
import { BiSearch, BiRefresh, BiExport, BiShow, BiUndo } from 'react-icons/bi';
import Sidebar from '../../../components/Sidebar';
import ProfileDropdown from '../../../components/ProfileDropdown';
import EmergencyButton from '../../../components/EmergencyButton';
import styles from './Archives.module.css';

const Archives = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [reasonFilter, setReasonFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [archivedBy, setArchivedBy] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const [archivedPatients, setArchivedPatients] = useState([
        {
            id: 'FAM-002',
            name: 'Michael Chen',
            dob: '1985-08-22',
            archivedOn: '11/6/2025',
            reason: 'Transferred',
            notes: 'Moving to another city',
            archivedBy: 'Anthony',
            status: 'Archived'
        },
        {
            id: 'FAM-004',
            name: 'David Kim',
            dob: '1988-11-30',
            archivedOn: '11/4/2025',
            reason: 'Deceased',
            notes: 'Passed away due to illness',
            archivedBy: 'Coleen',
            status: 'Archived'
        }
    ]);

    const reasons = ['All Reasons', 'Transferred', 'Deceased', 'Duplicate Record', 'Moved Away', 'Other'];

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
            setArchivedPatients(archivedPatients.filter(patient => !selectedItems.includes(patient.id)));
            setSelectedItems([]);
            alert('Selected patients have been restored successfully');
        }
    };

    // Handle export selected
    const handleExportSelected = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one patient to export');
            return;
        }
        alert(`Exporting ${selectedItems.length} selected patient(s)...`);
    };

    // Handle view patient
    const handleViewPatient = (id) => {
        alert(`Viewing patient ${id}`);
    };

    // Handle restore individual patient
    const handleRestorePatient = (id, name) => {
        if (window.confirm(`Are you sure you want to restore ${name}?`)) {
            setArchivedPatients(archivedPatients.filter(patient => patient.id !== id));
            alert(`${name} has been restored successfully`);
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
                                    <th>DOB</th>
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
                                        <td>{patient.dob}</td>
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