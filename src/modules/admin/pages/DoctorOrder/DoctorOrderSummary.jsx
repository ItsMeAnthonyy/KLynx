
import { useState, useEffect } from 'react';
import { BiPlus, BiSearch, BiSolidEdit, BiSolidTrash, BiLoaderCircle } from 'react-icons/bi';
import DoctorsOrderModal from '../../../../modules/admin/popups/DoctorsOrderModal';
import DoctorsOrderViewModal from '../../../../modules/admin/popups/DoctorsOrderViewModal';
import { getDoctorOrderByVisitId } from '../../api/doctorsOrderApi';
import Modal from '../../../../shared/components/Modal';
import DoctorOrderContainer from './DoctorOrderContainer';

export default function DoctorOrderSummary({ activeTab, visitId, patientId, isReadOnly, patientFullName }) {
    const isArchived = location.state?.isArchived || false;
    const [loading, setLoading] = useState(true);
    const [doctorOrderRecord, setDoctorOrderRecord] = useState(null);

    const [saving, setSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [mode, setMode] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    const hasDoctorOrder = !!doctorOrderRecord;

    useEffect( () => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getDoctorOrderByVisitId(visitId);
            console.log("RES", res);
            if(res.success) {
                setDoctorOrderRecord(res.data);
                console.log(res.data);
                console.log("Fetched doctor order data:", res.data);
            }
        } catch (error) {
            console.error("Error fetching doctors order data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getDoctorOrderModalTitle = () => {
        if (mode === "add") return "Add New Record";

        if (mode === "view") return `View Doctor Order Record - ${patientFullName}`;
        if (mode === "edit") return `Edit Doctor Order Record - ${patientFullName}`;
        
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

    const handleAdd = () => {
        setLoadingAction({ type: "openAdd" });

        openModal({
            mode: "add",
            modalType: "doctorOrderForm"
        });

        setLoadingAction(null);
    };

    const handleView = async (visitId) => {
        setLoadingAction({ type: "openView", visitId });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            openModal({
                mode: "view",
                modalType: "doctorOrderForm"
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleEdit = async (visitId) => {
        setLoadingAction({ type: "openEdit", visitId });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            openModal({
                mode: "edit",
                modalType: "doctorOrderForm"
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
                    onClick={handleAdd}
                    disabled={
                        isReadOnly || 
                        hasDoctorOrder ||
                        loadingAction === "openAdd"
                    }
                    style={
                        isReadOnly || hasDoctorOrder
                            ? { opacity: 0.5, cursor: 'not-allowed' } 
                            : {}
                    }
                    title={
                        isReadOnly 
                            ? 'Cannot add records for archived patients'
                            : hasDoctorOrder
                                ? "A doctor order record already exists for this visit"
                                : 'Add New Record'
                    }
                >
                    {loadingAction?.type === "openAdd" ? (
                        <>
                            <BiLoaderCircle size={18} className="spin" />
                            Opening...
                        </>
                    ) : (
                        <>
                            <BiPlus size={16} />
                            Add New Record
                        </>
                    )}
                </button>

                <div className="records-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                {/* <th>Laboratory Request</th> */}
                                <th>Imaging Request</th>
                                <th>Diagnosis</th>
                                <th colSpan='3'>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorOrderRecord ? (
                                <tr>
                                    <td>
                                        {new Date(doctorOrderRecord.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        {
                                            (doctorOrderRecord.imaging ?? [])
                                                .map(word =>
                                                    word
                                                        .replace(/_/g, ' ')
                                                        .replace(/\b\w/g, l => l.toUpperCase())
                                                )
                                                .join(', ')
                                        }
                                    </td>
                                    <td>
                                        {doctorOrderRecord.diagnosisStatus
                                            .replace(/_/g, ' ')
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')
                                        }
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
                                            title="View Details"
                                            onClick={() => { 
                                                handleView(doctorOrderRecord.visitId);
                                            }} 
                                            disabled={loadingAction?.type === "openView" && loadingAction?.visitId === doctorOrderRecord.visitId || isArchived}
                                        >
                                            {loadingAction?.type === "openView" && loadingAction?.visitId === doctorOrderRecord.visitId ? (
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
                                                handleEdit(doctorOrderRecord.visitId);
                                            }} 
                                            disabled={loadingAction?.type === "openEdit" && loadingAction?.visitId === doctorOrderRecord.visitId || isArchived}
                                        >
                                            {loadingAction?.type === "openEdit" && loadingAction?.visitId === doctorOrderRecord.visitId ? (
                                                <BiLoaderCircle size={18} className="spin" />
                                            ) : (
                                                <BiSolidEdit style={{ fontSize: '18px', color: '#282a2eff' }} />
                                            )}
                                        </button>
                                    </td>
                                    {/* <td>
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
                                    </td> */}
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="6">No doctors order recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpen && (
                <>
                    {modalType === "doctorOrderForm" && (
                        <Modal
                            title={getDoctorOrderModalTitle()}
                            onClose={closeModal}
                        >
                            <DoctorOrderContainer
                                isOpen={isOpen} 
                                onSuccess={fetchData}
                                mode={mode} 
                                visitId = {visitId}
                                doctorOrderRecord={mode === 'add' ? null : doctorOrderRecord}
                                onClose={closeModal}
                                patientFullName={patientFullName}
                            />
                        </Modal>
                    )}
                </>
            )}

            {showAddModal && (
                <DoctorsOrderModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    activeTab={activeTab}
                    editingRecord={editingRecord}
                    visitId = {visitId}
                    patientId = {patientId}
                    isReadOnly = {isReadOnly}
                />
            )}

            {showViewModal && (
                <DoctorsOrderViewModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    doctorOrderRecord={doctorOrderRecord}
                />
            )}
        </>
    );
}

