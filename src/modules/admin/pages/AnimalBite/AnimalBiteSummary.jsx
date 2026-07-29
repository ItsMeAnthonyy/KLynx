import { useState, useEffect } from 'react';
import { BiPlus, BiSearch, BiSolidEdit, BiSolidTrash, BiLoaderCircle } from 'react-icons/bi';
import Modal from '../../../../shared/components/Modal';
import AnimalBiteContainer from './AnimalBiteContainer';
import { getAnimalBiteByVisitId } from '../../api/animalBiteApi';

export default function AnimalBiteSummary({ activeTab, visitId, patientId, isReadOnly, patientFullName }) {
    const isArchived = location.state?.isArchived || false;
    const [loading, setLoading] = useState(true);
    const [animalbite, setAnimalBite] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const [mode, setMode] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    const hasAnimalBite = !!animalbite;

    useEffect( () => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getAnimalBiteByVisitId(visitId);
            if(res.success) {
                setAnimalBite(res.data);
            }
            console.log("Fetched animal bite data:", res);
        } catch (error) {
            console.error("Error animal bite data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAnimalBiteModalTitle = () => {
        if (mode === "add") return `Add New Record - ${patientFullName}`;

        if (mode === "view") return `View Animal Bite Record - ${patientFullName}`;
        if (mode === "edit") return `Edit Animal Bite Record - ${patientFullName}`;
        
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
            modalType: "animalBiteForm"
        });

        setLoadingAction(null);
    };

    const handleView = async (visitId) => {
        setLoadingAction({ type: "openView", visitId });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            openModal({
                mode: "view",
                modalType: "animalBiteForm"
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
                modalType: "animalBiteForm"
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
                        hasAnimalBite ||
                        loadingAction === "openAdd"
                    }
                    style={
                        isReadOnly || hasAnimalBite
                            ? { opacity: 0.5, cursor: 'not-allowed' } 
                            : {}
                    }
                    title={
                        isReadOnly 
                            ? 'Cannot add records for archived patients'
                            : hasAnimalBite
                                ? "A animal bite record already exists for this visit"
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
                                <th>Anatomical Location</th>
                                <th>Animal Type</th>
                                <th>Type of Exposure</th>
                                <th>Wash The Bite?</th>
                                <th>Date of Exposure</th>
                                <th colSpan='3'>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animalbite ? (
                                <tr>
                                    <td>
                                        {animalbite.siteOfBite
                                            .map(word =>
                                                word
                                                    .replace(/_/g, ' ')
                                                    .replace(/\b\w/g, l => l.toUpperCase())
                                            )
                                            .join(', ')
                                        }
                                    </td>
                                    <td>
                                        {animalbite.species
                                            ? animalbite.species.charAt(0).toUpperCase() +
                                            animalbite.species.slice(1)
                                            : ''
                                        }
                                    </td>
                                    <td>
                                        {animalbite.categoryOfExposure
                                            ? `Category ${animalbite.categoryOfExposure.split('_')[1]?.toUpperCase()}`
                                            : ''
                                        }
                                    </td>
                                    <td>
                                        {animalbite.postExposureTreatment?.includes('washed_soap_water')
                                            ? 'Yes'
                                            : 'No'}
                                    </td>
                                    <td>
                                        {animalbite.dateOfBite
                                            ? new Date(animalbite.dateOfBite).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                            : 'N/A'}
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
                                                handleView(animalbite.visitId);
                                            }} 
                                            disabled={loadingAction?.type === "openView" && loadingAction?.visitId === animalbite.visitId || isArchived}
                                        >
                                            {loadingAction?.type === "openView" && loadingAction?.visitId === animalbite.visitId ? (
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
                                                handleEdit(animalbite.visitId);
                                            }} 
                                            disabled={loadingAction?.type === "openEdit" && loadingAction?.visitId === animalbite.visitId || isArchived}
                                        >
                                            {loadingAction?.type === "openEdit" && loadingAction?.visitId === animalbite.visitId ? (
                                                <BiLoaderCircle size={18} className="spin" />
                                            ) : (
                                                <BiSolidEdit style={{ fontSize: '18px', color: '#282a2eff' }} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="8">No animal bite data recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpen && (
                <>
                    {modalType === "animalBiteForm" && (
                        <Modal
                            title={getAnimalBiteModalTitle()}
                            onClose={closeModal}
                        >
                            <AnimalBiteContainer
                                isOpen={isOpen} 
                                onSuccess={fetchData}
                                mode={mode} 
                                visitId = {visitId}
                                animalbite={mode === 'add' ? null : animalbite}
                                onClose={closeModal}
                            />
                        </Modal>
                    )}
                </>
            )}
        </>
    );
}   