import { useState, useEffect } from 'react';
import { BiSearch, BiSolidEdit, BiSolidTrash, BiArrowBack, BiPlus, BiShow, BiLoaderCircle } from 'react-icons/bi';
import VitalSignsModal from '../../../../modules/admin/popups/VitalSignsModal';
import VitalSignsViewModal from '../../../../modules/admin/popups/VitalSignsViewModal';
import { getVitalSignsByVisitId } from '../../api/vitalSignsApi';
import Modal from '../../../../shared/components/Modal';
import VitalSignContainer from './VitalSignContainer';

export default function VitalSignSummary({ visitId, activeTab, isReadOnly, patientFullName }) {
    const isArchived = location.state?.isArchived || false;
    const [loading, setIsLoading] = useState(false);
    const [vitalSign, setVitalSign] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const [showAddModal, setShowAddModal] = useState (false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [mode, setMode] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    const hasVitalSign = !!vitalSign;

    useEffect( () => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const vitalSignsResponse = await getVitalSignsByVisitId(visitId);
            if (vitalSignsResponse.success) {
                setVitalSign(vitalSignsResponse.data);
            }
        } catch (error) {
            console.error('Error fetching vital signs:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const getVitalSignModalTitle = () => {
        if (mode === "add") return "Add New Record";

        if (mode === "view") return `View Vital Sign - ${patientFullName}`;
        if (mode === "edit") return `Edit Vital Sign - ${patientFullName}`;
        
        if (mode === "status") {
            return `Confirm Status Change - ${patientFullName}`;
        }

        return "";
    };

    const openModal = ({ mode, modalType }) => {
        setMode(mode);
        setModalType(modalType);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);

        // reset context
        setTimeout(() => {
            setMode(null);
            setModalType(null);
        }, 200);
    }

    const handleView = async (visitId) => {
        setLoadingAction({ type: "openView", visitId });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            openModal({
                mode: "view",
                modalType: "vitalSignForm"
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleEdit = async (id) => {
        setLoadingAction({ type: "openEdit", id });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            openModal({
                mode: "edit",
                modalType: "vitalSignForm"
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(null);
        }
    };

    return(
        <>
            <div className='add-record-container'>
                <button 
                    className="add-record-button"
                    //onClick={handleAdd}
                    disabled={
                        isReadOnly || 
                        hasVitalSign ||
                        loadingAction === "openAdd"
                    }
                    style={
                        isReadOnly || hasVitalSign
                            ? { opacity: 0.5, cursor: 'not-allowed' } 
                            : {}
                    }
                    title={
                        isReadOnly 
                            ? 'Cannot add records for archived patients'
                            : hasVitalSign
                                ? "A vital sign record already exists for this visit"
                                : 'Add New Record'
                    }
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
                            {vitalSign ? (
                                <tr>
                                    <td>
                                        {new Date(vitalSign.timeTaken).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td>{vitalSign.bpSystolic}</td>
                                    <td>{vitalSign.bpDiastolic}</td>
                                    <td>{vitalSign.respiratoryRate}</td>
                                    <td>{vitalSign.bodyTemp}</td>
                                    <td>{vitalSign.pulseRate}</td>
                                    <td>{computeBPAssessment(vitalSign.bpSystolic, vitalSign.bpDiastolic)}</td>
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
                                                handleView(vitalSign.id);
                                            }} 
                                            disabled={loadingAction?.type === "openView" && loadingAction?.id === vitalSign.id || isArchived}
                                        >
                                            {loadingAction?.type === "openView" && loadingAction?.id === vitalSign.id ? (
                                                <BiLoaderCircle size={18} className="spin" />
                                            ) : (
                                                <BiSearch style={{ fontSize: '18px', color: '#282a2eff' }} />
                                            )}
                                        </button>
                                    </td>
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
                                            title={isArchived ? 'Cannot edit visits for archived patients' : 'Edit'}
                                            onClick={() => { 
                                                handleEdit(vitalSign.id);
                                            }} 
                                            disabled={loadingAction?.type === "openEdit" && loadingAction?.id === vitalSign.id || isArchived}
                                        >
                                            {loadingAction?.type === "openEdit" && loadingAction?.id === vitalSign.id ? (
                                                <BiLoaderCircle size={18} className="spin" />
                                            ) : (
                                                <BiSolidEdit style={{ fontSize: '18px', color: '#282a2eff' }} />
                                            )}
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

            {isOpen && (
                <>
                    {modalType === "vitalSignForm" && (
                        <Modal
                            title={getVitalSignModalTitle()}
                            onClose={closeModal}
                        >
                            <VitalSignContainer 
                                isOpen={isOpen} 
                                onSuccess={fetchData}
                                mode={mode} 
                                vitalSign={mode === 'add' ? null : vitalSign}
                                onClose={closeModal}
                            />
                        </Modal>
                    )}
                </>
            )}
        </>
    );
}
