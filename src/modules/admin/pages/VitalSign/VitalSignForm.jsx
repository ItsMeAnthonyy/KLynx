import styles from '../../../../shared/forms/Form.module.css';
import { FaSpinner } from 'react-icons/fa';

export default function VitalSignForm({ isOpen, mode, formData, onClose, handleSubmit, handleChange, hasChanges, isSaving }) {
    
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";
    
    const formatDateTime = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString.replace(' ', 'T'));

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };
    
    return(
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>
                        Blood Pressure Systolic{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="bpSystolic"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        value={formData.bpSystolic}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        Blood Pressure Diastolic{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="bpDiastolic"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        value={formData.bpDiastolic}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
            </div>
            <div className={styles.field}>
                <label>
                    Respiratory Rate{isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                </label>
                <input
                    type="number"
                    name="respiratoryRate"
                    className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    disabled={isSaving}
                    required
                />
            </div>
            <div className={styles.field}>
                <label>
                    Body Temperature{isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                </label>
                <input
                    type="number"
                    name="bodyTemp"
                    className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                    step="0.1"
                    value={formData.bodyTemp}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    disabled={isSaving}
                    required
                />
            </div>
            <div className={styles.field}>
                <label>
                    Pulse Rate{isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                </label>
                <input
                    type="number"
                    name="pulseRate"
                    className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                    value={formData.pulseRate}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    disabled={isSaving}
                    required
                />
            </div>
            <div className={styles.field}>
                <label>
                    Heart Rate{isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                </label>
                <input
                    type="number"
                    name="heartRate"
                    className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                    value={formData.heartRate}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    disabled={isSaving}
                    required
                />
            </div>
            <div className={styles.field}>
                <label>
                    O₂ Saturation{isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                </label>
                <input
                    type="number"
                    name="oxygenSaturation"
                    className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                    value={formData.oxygenSaturation}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    disabled={isSaving}
                    required
                />
            </div>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>
                        Height (cm){isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="heightCm"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        step="0.01"
                        value={formData.heightCm}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        Weight (KG){isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="weightKg"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        step="0.01"
                        value={formData.weightKg}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
            </div>
            <div className={styles.field}>
                <label>
                    Time Taken{isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                </label>
                <input
                    type="text"
                    name="timeTaken"
                    className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                    value={formatDateTime(formData.timeTaken)}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    disabled
                    required
                />
            </div>
            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnCancel}`}
                    onClick={() => {
                        onClose();
                        // setErrors({});
                    }}
                    disabled={isSaving}
                >
                    {isViewMode ? "Close" : "Cancel"}
                </button>
                {!isViewMode && (
                    <button
                        type="submit"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        disabled={isSaving || isViewMode || !hasChanges}
                    >
                        {isSaving ? (
                                <>
                                    <span className={styles.btnContent}>
                                        <FaSpinner className={styles.spinner} size={16} />
                                        {isEditMode ? "Saving..." : "Creating..."}
                                    </span>
                                </>
                            ) : (
                                isEditMode ? "Save Changes" : "Create User"
                        )}
                    </button>
                )}
            </div>
        </form>
    );
}