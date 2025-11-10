import { useEffect } from 'react';
import { BiX } from "react-icons/bi";

import modalStyles from './AddPatientModal.module.css';
import AddPatientForm from './AddPatientForm';


const AddPatientModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
            return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };

    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={modalStyles.modalOverlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className={modalStyles.modalContainer}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={modalStyles.modalClose}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <BiX size={24} />
                </button>
                <div className={modalStyles.modalHeader}>
                    <h2 id="modalTitle" className={modalStyles.modalTitle}>
                        CREATE PATIENT PROFILE
                    </h2>
                    <p className={modalStyles.modalSubtitle}>
                        Fill in the details to add new Patient
                    </p>
                </div>

                <AddPatientForm onSuccess={onClose} onCancel={onClose} />

            </div>
        </div>
    );
}

export default AddPatientModal;