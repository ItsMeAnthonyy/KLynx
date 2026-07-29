import React, { useState, useEffect } from 'react';
import { BiX, BiPlus, BiDownload, BiPencil, BiTrash, BiCapsule } from "react-icons/bi";
import { getPrescriptionsByVisitId/*, createMedicine*/ } from '../../../api/prescriptionApi';
import Modal from '../../../../../shared/components/Modal';
import Button from '../../../../../shared/components/Button';
import styles from './PrescriptionSummary.module.css'
import PrescriptionContainer from './PrescriptionContainer';

const DOSE_REGIMEN_LABELS = {
    '2x_day_12hrs': '2x a day - every 12 hours',
    '3x_day_8hrs': '3x a day - every 8 hours',
    '4x_day_6hrs': '4x a day - every 6 hours',
    'bedtime': 'Every bedtime',
    'every_other_day': 'Every other day',
    'once_daily': 'Once a day',
    'others': 'Others'
};

export default function PrescriptionSummary({
    isModuleOpen,
    visitId,
    closePrescription,
    patientFullName
}) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    useEffect(() => {
        if (!isModuleOpen) return;

        // fetchProviders();
        fetchPrescriptions();
    }, [isModuleOpen]);

    const fetchPrescriptions = async () => {
        try {
            const res = await getPrescriptionsByVisitId(visitId);
            if(res.success) {
                setPrescriptions(res.data);
            } 
            console.log("Fetched prescription data:", res);
        } catch (error) {
            console.error("Error prescription data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPrescriptionModalTitle = () => {
        if (mode === "add") return "Add Prescription";
        if (mode === "view") return "Prescription Details";
        if (mode === "edit") return "Edit Prescription";
        if (mode === "status") return "Confirm Status Change";

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
        openModal({
            mode: "add",
            modalType: "prescriptionForm"
        });
    };

    return(
        <>
            <Modal
                title={
                    <>
                        <BiCapsule size={25} /> Prescription List
                    </>
                }
                subtitle={`Patient: ${patientFullName}`}
                onClose={closePrescription}
            >
                <div className={styles.listActions}>
                    <Button
                        variant="primary"
                        icon={<BiPlus />}
                        onClick={handleAdd}
                    >
                        Add New Prescription
                    </Button>

                    <Button
                        variant="secondary"
                        icon={<BiDownload />}
                        //onClick={handleDownload}
                    >
                        Download Prescriptions
                    </Button>
                </div>

                <div className={styles.prescriptionList}>
                    {!prescriptions || prescriptions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <BiCapsule size={48} className={styles.emptyIcon} />
                            <p>No prescriptions added yet</p>
                            {/* {!isReadOnly && ( */}
                                <Button
                                    variant="primary"
                                    icon={<BiPlus />}
                                    onClick={handleAdd}
                                >
                                    Add First Prescription
                                </Button>
                            {/* )} */}
                        </div>
                    ) : (
                        prescriptions.map((prescription, idx) => (
                            <div key={prescription.prescriptionId || idx} className={styles.prescriptionCard}>
                                <div className={styles.prescriptionHeader}>
                                    <span className={styles.prescriptionNumber}>#{idx + 1}</span>
                                    <h3>{prescription.medicineName}</h3>
                                    {prescription.drugCode && (
                                        <span className={styles.drugCodeBadge}>{prescription.drugCode}</span>
                                    )}
                                    {/* {!isReadOnly && ( */}
                                        <div className={styles.prescriptionActions}>
                                            <button 
                                                onClick={() => handleEditPrescription(prescription)}
                                                className={styles.iconButton}
                                                title="Edit"
                                            >
                                                <BiPencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeletePrescription(prescription.id)}
                                                className={styles.iconButtonDanger}
                                                title="Delete"
                                            >
                                                <BiTrash size={16} />
                                            </button>
                                        </div>
                                    {/* )} */}
                                </div>
                                <div className={styles.prescriptionDetails}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Dosage:</span>
                                        <span>{prescription.dosageStrength}</span>
                                    </div>
                                    {prescription.dosageIntake && (
                                        <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Intake:</span>
                                        <span>{prescription.dosageIntake}</span>
                                        </div>
                                    )}
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Regimen:</span>
                                        <span>
                                            {prescription.doseRegimen === "others"
                                                ? `Others (Specify): ${prescription.otherDoseRegimen}`
                                                : DOSE_REGIMEN_LABELS[prescription.doseRegimen]}
                                        </span>
                                    </div>
                                    {prescription.quantityUnit && (
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Quantity:</span>
                                            <span>{prescription.quantityUnit}</span>
                                        </div>
                                    )}
                                    {prescription.intendedPurpose && (
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Purpose:</span>
                                            <span>
                                                {prescription.intendedPurpose === "other"
                                                    ? `Other Intended Purpose: ${prescription.otherIntendedPurpose}`
                                                    : prescription.intendedPurpose}
                                            </span>
                                        </div>
                                    )}
                                    {prescription.medicationNotes && (
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Notes:</span>
                                            <span>{prescription.medicationNotes}</span>
                                        </div>
                                    )}
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Prescribed by:</span>
                                        {/* <span>{getProviderName(prescription.prescribedBy)}</span> */}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>

            {isOpen && (
                <>
                    {modalType === "prescriptionForm" && (
                        <Modal
                            title={getPrescriptionModalTitle()}
                            subtitle={`Patient: ${patientFullName}`}
                            onClose={closeModal}
                        >
                            <PrescriptionContainer 
                                isOpen={isOpen}
                                mode={mode}
                                visitId={visitId}
                                onClose={closeModal}
                            />
                        </Modal>
                    )}
                </>
            )}
        </>
    );
}