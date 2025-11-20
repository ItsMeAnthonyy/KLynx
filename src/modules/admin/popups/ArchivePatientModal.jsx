import { useState } from 'react';
import PropTypes from 'prop-types';
import { BiX, BiArchiveIn } from 'react-icons/bi';
import styles from './ArchivePatientModal.module.css';

const ArchivePatientModal = ({ isOpen, onClose, patient, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !patient) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!reason) {
            setError('Please select a reason for archiving');
            return;
        }

        onConfirm({ reason, notes });
        handleClose();
    };

    const handleClose = () => {
        setReason('');
        setNotes('');
        setError('');
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        <BiArchiveIn />
                    </div>
                    <h2 className={styles.title}>Archive Patient</h2>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <BiX />
                    </button>
                </div>

                {/* Warning Banner */}
                <div className={styles.warningBanner}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <p className={styles.warningText}>
                        Archiving this patient will also archive all related visits. The patient will move to the Archive Management Page.
                    </p>
                </div>

                {/* Patient Information */}
                <div className={styles.patientInfo}>
                    <h3 className={styles.sectionTitle}>Patient Information</h3>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Name:</span>
                            <span className={styles.infoValue}>
                                {patient.FirstName} {patient.MiddleName || ''} {patient.LastName}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Patient ID:</span>
                            <span className={styles.infoValue}>{patient.PatientID}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Date of Birth:</span>
                            <span className={styles.infoValue}>{patient.Birthdate}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Last Visit:</span>
                            <span className={styles.infoValue}>
                                {patient.LastVisit || '1/8/2024'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Reason Dropdown */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Reason for Archive <span className={styles.required}>*</span>
                        </label>
                        <select
                            className={styles.select}
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError('');
                            }}
                            required
                        >
                            <option value="">Select a reason...</option>
                            <option value="Transferred">Transferred</option>
                            <option value="Deceased">Deceased</option>
                            <option value="Duplicate Record">Duplicate Record</option>
                            <option value="Moved Away">Moved Away</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Other">Other</option>
                        </select>
                        {error && <span className={styles.errorText}>{error}</span>}
                    </div>

                    {/* Notes Textarea */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Additional Notes</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Provide more details if needed..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.confirmButton}
                        >
                            Continue to Confirmation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ArchivePatientModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    patient: PropTypes.object,
    onConfirm: PropTypes.func.isRequired,
};

export default ArchivePatientModal;