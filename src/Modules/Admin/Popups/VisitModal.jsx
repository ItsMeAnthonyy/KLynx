import { useEffect } from 'react';
import { BiX } from "react-icons/bi";
import VisitForm from './VisitForm';
import styles from './VisitModal.module.css';

const VisitModal = ({ isOpen, onClose, onSuccess, patient }) => {
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

  return(
    <div 
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-modal-title"
    >
      <div 
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <BiX size={24} />
        </button>
        
        <div className={styles.header}>
          <h2 id="visit-modal-title" className={styles.title}>
            Add New Visit
          </h2>
          <p className={styles.subtitle}>
            Record a new clinic visit for {patient?.fullName}
          </p>
        </div>

        <VisitForm onSuccess={onSuccess || onClose} onCancel={onClose} patient={patient} />
      </div>
    </div>

  );

}

export default VisitModal;