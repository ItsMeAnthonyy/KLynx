import { useState } from 'react';
import { BiSearchAlt, BiX, BiPlus} from "react-icons/bi";
import modalStyles from './FamilyIdSearchModal.module.css';


const mockPatients = [
  { familyId: 'F001', fullName: 'Juan Dela Cruz', dateOfBirth: '01/15/1980' },
  { familyId: 'F002', fullName: 'Maria Santos', dateOfBirth: '03/22/1992' },
  { familyId: 'F003', fullName: 'Pedro Reyes', dateOfBirth: '07/08/1975' },
  { familyId: 'F004', fullName: 'Ana Garcia', dateOfBirth: '11/30/1988' },
  { familyId: 'F005', fullName: 'Jose Hernandez', dateOfBirth: '05/12/1995' },
  { familyId: 'F006', fullName: 'Carmen Lopez', dateOfBirth: '09/25/1982' },
  { familyId: 'F007', fullName: 'Roberto Martinez', dateOfBirth: '02/18/1978' },
  { familyId: 'F008', fullName: 'Sofia Rodriguez', dateOfBirth: '12/05/1990' },
];

const FamilyIdSearchModal = ({ isOpen, onClose, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState(mockPatients);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = mockPatients.filter(
           (patient) =>
            patient.familyId.toLowerCase().includes(query) ||
            patient.fullName.toLowerCase().includes(query) ||
            patient.dateOfBirth.includes(query)
        );
        setFilteredPatients(filtered);
    };

    const generateNewFamilyId = () => {
        // Find the highest family ID number
        const highestId = mockPatients.reduce((max, patient) => {
            const idNumber = parseInt(patient.familyId.replace('F', ''));
            return idNumber > max ? idNumber : max;
        }, 0);

        // Generate new ID with incremented number
        const newId = `F${String(highestId + 1).padStart(3, '0')}`;
        
        // Create a new patient object with just the generated ID
        onSelect({ familyId: newId, lastName: '', dateOfBirth: '' });
        onClose();
        setSearchQuery('');
        setFilteredPatients(mockPatients);
    };

    if (!isOpen) return null;

    return (
        <div 
            className={modalStyles.overlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-family-id"
        >
            <div 
                className={modalStyles.container}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={modalStyles.header}>
                    <h3 id="search-family-id" className={modalStyles.title}>
                        Search Family ID
                    </h3>
                    <div className={modalStyles.headerActions}>
                        <button
                            type="button"
                            className={modalStyles.generateButtonHeader}
                            onClick={generateNewFamilyId}
                            title="Generate New Family ID"
                        >
                            <BiPlus size={18} />
                            New Family ID
                        </button>
                        <button
                            className={modalStyles.closeButton}
                            onClick={onClose}
                            aria-label="Close family id search modal"
                        >
                            <BiX size={20} />
                        </button>
                    </div>
                </div>

                <div className={modalStyles.searchBox}>
                    <BiSearchAlt size={18} className={modalStyles.searchIcon} />
                    <input
                        type="text"
                        className={modalStyles.searchInput}
                        placeholder="Search by Family ID, Name, or Date of Birth..."
                        value={searchQuery}
                        onChange={handleSearch}
                        autoFocus
                    />
                </div>

                <div className={modalStyles.tableWrapper}>
                    <table className={modalStyles.table}>
                        <thead>
                        <tr>
                            <th>Family ID</th>
                            <th>Full Name</th>
                            <th>Date of Birth</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                            <tr
                                key={patient.familyId}
                                onClick={() => handleSelectPatient(patient)}
                                className={modalStyles.tableRow}
                            >
                                <td>{patient.familyId}</td>
                                <td>{patient.fullName}</td>
                                <td>{patient.dateOfBirth}</td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className={modalStyles.emptyState}>
                                    No patients found matching your search
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}

export default FamilyIdSearchModal;
