import styles from './Modal.module.css';
import { BiX } from "react-icons/bi";

export default function Modal({ 
    children, 
    title, 
    subtitle,
    onClose,
    maxWidth
}) {
    return (
        <div 
            className={styles.modalOverlay} 
            onClick={onClose}
        >
            <div
                className={styles.modalContent}
                style={{ maxWidth }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <div className={styles.titleWrapper}>
                        <h2>{title || "Default Title"}</h2>

                        {subtitle && (
                            <p className={styles.subtitle}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <button 
                        onClick={onClose} 
                        className={styles.closeBtn}
                        type="button"
                    >
                        <BiX size={24} />
                    </button>
                </div>
                
                {children}
            </div>
        </div>
    );
}