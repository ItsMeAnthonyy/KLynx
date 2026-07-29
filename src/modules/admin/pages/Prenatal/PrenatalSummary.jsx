import { useState, useEffect } from 'react';
import { BiPlus, BiSearch, BiSolidEdit, BiSolidTrash, BiLoaderCircle } from 'react-icons/bi';
import PrenatalModal from '../../../../modules/admin/popups/PrenatalModal';
import PrenatalViewModal from '../../../../modules/admin/popups/PrenatalViewModal';
import { getPrenatalRecordByVisitId } from '../../api/prenatalApi';
import Modal from '../../../../shared/components/Modal';
import PrenatalContainer from './PrenatalContainer';

export default function PrenatalSummary({ activeTab, consultationType, visitId, patientId, isReadOnly, patientFullName }) {
    const isArchived = location.state?.isArchived || false;
    const [loading, setIsLoading] = useState(false);
    const [prenatalRecord, setPrenatalRecord] = useState(null);
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [mode, setMode] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    const hasPrenatal = !!prenatalRecord;

    useEffect( () => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getPrenatalRecordByVisitId(visitId);
            if (res.success) {
                setPrenatalRecord(res.data);
            }
        } catch (error) {
            console.error("Error fetching prenatal data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const computeAOG = (lmpDate, referenceDate = new Date()) => {
        if (!lmpDate) return { weeks: '-', days: '-' };

        const lmp = new Date(lmpDate);
        const ref = new Date(referenceDate);

        const diffTime = ref - lmp;
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        return { weeks, days };
    };

    const aog = computeAOG(
        prenatalRecord?.lastMenstrualPeriod,
        prenatalRecord?.visitDateTime
    );

    const getPrenatalRecordModalTitle = () => {
        if (mode === "add") return "Add New Record";

        if (mode === "view") return `View Prenatal Record - ${patientFullName}`;
        if (mode === "edit") return `Edit Vital Record - ${patientFullName}`;
        
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
            modalType: "prenatalRecordForm"
        });

        setLoadingAction(null);
    };

    const handleView = async (visitId) => {
        setLoadingAction({ type: "openView", visitId });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            openModal({
                mode: "view",
                modalType: "prenatalRecordForm"
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
                modalType: "prenatalRecordForm"
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <>
            <div className='add-record-container'>
                <button 
                    className="add-record-button"
                    onClick={handleAdd}
                    disabled={
                        isReadOnly || 
                        hasPrenatal ||
                        loadingAction === "openAdd"
                    }
                    style={
                        isReadOnly || hasPrenatal
                            ? { opacity: 0.5, cursor: 'not-allowed' } 
                            : {}
                    }
                    title={
                        isReadOnly 
                            ? 'Cannot add records for archived patients'
                            : hasPrenatal
                                ? "A prenatal record already exists for this visit"
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
                            {prenatalRecord ? (
                                <tr>
                                    <td>{aog.weeks}</td>
                                    <td>{aog.days}</td>
                                    <td>{prenatalRecord.lastMenstrualPeriod}</td>
                                    <td>{prenatalRecord.expectedDateOfDelivery}</td>
                                    <td>{prenatalRecord.gravidity}</td>
                                    <td>{prenatalRecord.parity}</td>
                                    <td>{prenatalRecord.term}</td>
                                    <td>{prenatalRecord.preterm}</td>
                                    <td>{prenatalRecord.livebirths}</td>
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
                                                handleView(prenatalRecord.visitId);
                                            }} 
                                            disabled={loadingAction?.type === "openView" && loadingAction?.visitId === prenatalRecord.visitId || isArchived}
                                        >
                                            {loadingAction?.type === "openView" && loadingAction?.visitId === prenatalRecord.visitId ? (
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
                                                handleEdit(prenatalRecord.visitId);
                                            }} 
                                            disabled={loadingAction?.type === "openEdit" && loadingAction?.visitId === prenatalRecord.visitId || isArchived}
                                        >
                                            {loadingAction?.type === "openEdit" && loadingAction?.visitId === prenatalRecord.visitId ? (
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
                                    <td colSpan="11">No prenatal data recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpen && (
                <>
                    {modalType === "prenatalRecordForm" && (
                        <Modal
                            title={getPrenatalRecordModalTitle()}
                            onClose={closeModal}
                        >
                            <PrenatalContainer
                                isOpen={isOpen} 
                                onSuccess={fetchData}
                                mode={mode} 
                                visitId = {visitId}
                                prenatalRecord={mode === 'add' ? null : prenatalRecord}
                                onClose={closeModal}
                            />
                        </Modal>
                    )}
                </>
            )}

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