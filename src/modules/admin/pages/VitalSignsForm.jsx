import { useState, useEffect } from 'react';
import { BiSearch, BiSolidEdit, BiSolidTrash, BiArrowBack, BiPlus, BiShow } from 'react-icons/bi';
import VitalSignsModal from '../../../modules/admin/popups/VitalSignsModal';
import VitalSignsViewModal from '../../../modules/admin/popups/VitalSignsViewModal';
import { getVitalSignsByVisitId } from '../api/vitalSignsApi';

export default function VitalSignsForm({ visitId, activeTab, isReadOnly }) {
    const isArchived = location.state?.isArchived || false;
    const [loading, setIsLoading] = useState(false);
    const [vitalSigns, setVitalSigns] = useState(null);
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const vitalSignsResponse = await getVitalSignsByVisitId(visitId);
                if (vitalSignsResponse.success) {
                    setVitalSigns(vitalSignsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching vital signs:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const computeBPAssessment = (systolic, diastolic) => {
        if (!systolic || !diastolic) return '';
        const sys = parseInt(systolic);
        const dia = parseInt(diastolic);

        if (sys < 90 || dia < 60) return 'Hypotension';
        if (sys <= 120 && dia <= 80) return 'Normal';
        if (sys >= 121 && sys <= 129 && dia < 80) return 'Elevated';
        if ((sys >= 130 && sys <= 139) || (dia >= 81 && dia <= 89)) return 'High Blood Pressure Stage 1';
        if (sys >= 140 || dia >= 90) return 'High Blood Pressure Stage 2';
        if (sys > 180 || dia > 120) return 'Hypertensive Crisis';
        return 'Normal';
    };

    const getUserModalTitle = () => {
        //if (mode === "add") return "Create User Account";

        // const name = selectedUser
        //     ? `${selectedUser.first_name} ${selectedUser.last_name}`
        //     : "";

        if (mode === "view") return `View User - ${name}`;
        if (mode === "edit") return `Edit User - ${name}`;
        
        if (mode === "status") {
            return `Confirm Status Change - ${name}`;
        }

        return "";
    };    

    const openModal = ({ mode, modalType }) => {
        setMode(mode);
        setModalType(modalType);
        setIsOpen(true);
    };

    const handleView = async (id) => {
        setLoadingAction({ type: "openView", id });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            openModal({
                mode: "view",
                modalType: "vitalSignsForm",
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(null);
        }
    }

    return(
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
                                <th>Date</th>
                                <th>Blood Pressure Systolic</th>
                                <th>Blood Pressure Diastolic</th>
                                <th>Respiratory Rate</th>
                                <th>Body Temperature</th>
                                <th>Pulse Rate</th>
                                <th>BP Measurement Assessment</th>
                                <th colSpan="3">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vitalSigns ? (
                                <tr>
                                    <td>
                                        {new Date(vitalSigns.timeTaken).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td>{vitalSigns.bpSystolic}</td>
                                    <td>{vitalSigns.bpDiastolic}</td>
                                    <td>{vitalSigns.respiratoryRate}</td>
                                    <td>{vitalSigns.bodyTemp}</td>
                                    <td>{vitalSigns.pulseRate}</td>
                                    <td>{computeBPAssessment(vitalSigns.bpSystolic, vitalSigns.bpDiastolic)}</td>
                                    <td>
                                        <button
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
                                            title="View Details"
                                            onClick={() => { 
                                                console.log("Viewing vital signs: ", vitalSigns.visitId);
                                                handleView(user.id);
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
                                    <td colSpan="9">No vital signs recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <VitalSignsModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    activeTab={activeTab}
                    editingRecord={editingRecord}
                    //patientId = 
                    visitId = {visitId}
                    isReadOnly = {isReadOnly}
                />
            )}

            {showViewModal && (
                <VitalSignsViewModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    formData={vitalSigns}
                />
            )}
        </>
    );
}
