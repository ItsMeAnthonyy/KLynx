import { useState, useEffect } from 'react';
import { BiSearch, BiSolidEdit, BiSolidTrash } from 'react-icons/bi';
import PrenatalModal from '../../../modules/admin/popups/PrenatalModal';
import PrenatalViewModal from '../../../modules/admin/popups/PrenatalViewModal';
import { getPrenatalDataByVisitId } from '../api/prenatalApi';


export default function PrenatalForm({ activeTab, consultationType, visitId, patientId, isReadOnly }) {
    const isArchived = location.state?.isArchived || false;
    const [loading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await getPrenatalDataByVisitId(visitId);
                setFormData(response);
                console.log("Fetched prenatal data:", response);
            } catch (error) {
                console.error("Error fetching prenatal data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const computeAOG = (lmpDate, referenceDate = new Date()) => {
        if (!lmpDate) return { weeks: '-', days: '-' };

        const lmp = new Date(lmpDate);
        const ref = new Date(referenceDate);

        const diffTime = ref - lmp;
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        console.log(totalDays);
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        return { weeks, days };
    };

    const prenatal = formData?.data;
    const aog = computeAOG(
        prenatal?.last_menstrual_period,
        prenatal?.visit_date_time
    );

    return (
        <>
            <div className='add-record-container'>
                <button 
                    className="add-record-button"
                    onClick={() => setShowAddModal(true)}
                    disabled={isReadOnly}
                    style={isReadOnly ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    title={isReadOnly ? 'Cannot add records for archived patients' : 'Add New Record'}
                >
                    Add New Record
                </button>

                <div className="records-container">
                    <table>
                        <thead>
                            <tr>
                                <th>AOG (Weeks)</th>
                                <th>AOG (Days)</th>
                                <th>Last Menstrual Period</th>
                                <th>Expected Date of Confinement</th>
                                <th>Gravidity</th>
                                <th>Parity</th>
                                <th>Term</th>
                                <th>Preterm</th>
                                <th>Livebirths</th>
                                <th colSpan="3">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData ? (
                                <tr>
                                    <td>{aog.weeks}</td>
                                    <td>{aog.days}</td>
                                    <td>{prenatal.last_menstrual_period}</td>
                                    <td>{prenatal.expected_date_of_delivery}</td>
                                    <td>{prenatal.gravidity}</td>
                                    <td>{prenatal.parity}</td>
                                    <td>{prenatal.term}</td>
                                    <td>{prenatal.preterm}</td>
                                    <td>{prenatal.livebirths}</td>
                                    <td>
                                        <button
                                            onClick={() => { 
                                                if (!isArchived || isArchived) {
                                                    setShowViewModal(true)
                                                }
                                            }} 
                                            style={{ 
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '4px',
                                                cursor: isArchived ? 'not-allowed' : 'pointer', 
                                                padding: '8px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                opacity: isArchived ? 0.5 : 1
                                            }} 
                                            title={'View Details'}
                                            onMouseEnter={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                    e.currentTarget.style.borderColor = '#d1d5db';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                        >
                                            <BiSearch style={{ fontSize: '18px', color: '#282a2eff' }} />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => { 
                                                if (!isArchived) {
                                                    setSelectedVisit(patient); 
                                                    setEditVisitModal(true);
                                                }
                                            }} 
                                            disabled={isArchived}
                                            style={{ 
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '4px',
                                                cursor: isArchived ? 'not-allowed' : 'pointer', 
                                                padding: '8px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                opacity: isArchived ? 0.5 : 1
                                            }} 
                                            title={isArchived ? 'Cannot edit visits for archived patients' : 'Edit'}
                                            onMouseEnter={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                    e.currentTarget.style.borderColor = '#d1d5db';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                        >
                                            <BiSolidEdit style={{ fontSize: '18px', color: '#282a2eff' }} />
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => { 
                                                if (!isArchived) {
                                                    setSelectedVisit(patient); 
                                                    setDeleteVisitModal(true);
                                                }
                                            }} 
                                            disabled={isArchived}
                                            style={{ 
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '4px',
                                                cursor: isArchived ? 'not-allowed' : 'pointer', 
                                                padding: '8px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                opacity: isArchived ? 0.5 : 1
                                            }} 
                                            title={isArchived ? 'Cannot delete visits for archived patients' : 'Delete'}
                                            onMouseEnter={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                                    e.currentTarget.style.borderColor = '#fca5a5';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                        >
                                            <BiSolidTrash style={{ fontSize: '18px', color: '#ef4444' }} />
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="11">No prenatal data recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <PrenatalModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    activeTab={activeTab}
                    consultationType={consultationType}
                    editingRecord={editingRecord}
                    visitId = {visitId}
                    patientId = {patientId}
                    isReadOnly = {isReadOnly}
                />
            )}

            {showViewModal && (
                <PrenatalViewModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    prenatal={prenatal}
                    aogWeeks={aog.weeks}
                    aogDays={aog.days}
                />
            )}
        </>
    );
}