import { BiCapsule } from "react-icons/bi";
import styles from '../../../../shared/forms/Form.module.css';
import SelectField from "../../../../shared/forms/SelectField";
import CheckboxField from "../../../../shared/forms/CheckboxField";
import TextareaField from "../../../../shared/forms/TextareaField";
import ButtonField from "../../../../shared/forms/ButtonField";
import ICD10Field from "../../../../shared/forms/ICD10Field";
import { FaSpinner } from 'react-icons/fa';

export default function DoctorOrderForm({ 
    isOpen, 
    mode, 
    formData, 
    onClose, 
    handleSubmit, 
    handleChange, 
    hasChanges, 
    isSaving, 
    onOpenPrescription,
    handleOpenICD10Search
}) {
    
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    return(
        <form onSubmit={handleSubmit} className={styles.form}>
            <CheckboxField
                label="Imaging"
                name="imaging"
                values={formData.imaging || []}
                onChange={handleChange}
                options={[
                    { label: "ECG", value: "ecg" },
                    { label: "MRI", value: "mri" },
                    { label: "Ultrasound", value: "ultrasound" },
                    { label: "X-ray", value: "x-ray" },
                ]}
                columns={4}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <CheckboxField
                label="Alert Type"
                name="alertType"
                values={formData.alertType || []}
                onChange={handleChange}
                options={[
                    { label: "Allergy", value: "allergy" },
                    { label: "Disability", value: "disability" },
                    { label: "Drug", value: "drug" },
                    { label: "Handicap", value: "handicap" },
                    { label: "Impairment", value: "impairment" },
                    { label: "Others", value: "others" },
                ]}
                columns={3}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <TextareaField
                label="Alert Description"
                name="alertDescription"
                value={formData.alertDescription}
                onChange={handleChange}
                rows={2}
                placeholder="Enter alert details here..."
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <SelectField
                label="Diagnosis Status"
                name="diagnosisStatus"
                value={formData.diagnosisStatus}
                onChange={handleChange}
                options={[
                    { label: "Not Applicable", value: "not_applicable" },
                    { label: "Admitting Diagnosis", value: "admitting_diagnosis" },
                    { label: "Working Diagnosis", value: "working_diagnosis" },
                    { label: "Final Diagnosis", value: "final_diagnosis" },
                ]}
                required={isAddMode}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            {["admitting_diagnosis", "working_diagnosis", "final_diagnosis"].includes(formData.diagnosisStatus) && (
                <ICD10Field
                    values={formData}
                    onChange={handleChange}
                    onSearch={handleOpenICD10Search}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            )}
            <TextareaField
                label="Diagnosis Specify"
                name="diagnosisSpecify"
                value={formData.diagnosisSpecify}
                onChange={handleChange}
                rows={2}
                placeholder="Enter diagnosis details here..."
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <ButtonField
                label="Prescription"
                text="Prescribe Medicine"
                icon={<BiCapsule size={18} />}
                onClick={onOpenPrescription}
                variant="secondary"
                isSaving={isSaving}
                fullWidth={true}
            />
            <TextareaField
                label="Treatment Plan"
                name="treatmentPlan"
                value={formData.treatmentPlan}
                onChange={handleChange}
                rows={2}
                placeholder="Enter treatment plan details here..."
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <TextareaField
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={2}
                placeholder="Enter remarks details here..."
                isViewMode={isViewMode}
                isSaving={isSaving}
            />

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
                                isEditMode ? "Update Record" : "Create Record"
                        )}
                    </button>
                )}
            </div>
        </form>
    );
}