import { BiSearch } from "react-icons/bi";
import styles from '../../../../../shared/forms/Form.module.css';
import TextField from "../../../../../shared/forms/TextField";
import NumberField from "../../../../../shared/forms/NumberField";
import SelectField from "../../../../../shared/forms/SelectField";
import TextareaField from "../../../../../shared/forms/TextareaField";
import Button from '../../../../../shared/components/Button';
import { FaSpinner } from 'react-icons/fa';


export default function PrescriptionForm({ 
    isOpen, 
    mode, 
    formData, 
    onClose, 
    handleSubmit, 
    handleChange, 
    // hasChanges, 
    isSaving,
    onOpenCommodityMedicine
}) {
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    return(
        <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
                label="Medicine"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                // required={formData.antiTetanus ? true : false}
                required
                isViewMode={isViewMode}
                isSaving={isSaving}
                endAction={
                    <Button
                        type="button"
                        variant="secondary"
                        icon={<BiSearch />}
                        onClick={onOpenCommodityMedicine}
                    >
                        Search Commodity Medicine
                    </Button>
                }
            />
            {formData.drugCode && (
                <span
                    style={{
                        display: "inline-block",
                        padding: "0.25rem 0.5rem",
                        background: "hsl(200 95% 40% / 0.1)",
                        color: "hsl(200 95% 40%)",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                    }}
                >
                    Drug Code: {formData.drugCode}
                </span>
            )}
            <div
                className={styles.row}
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            >
                <TextField
                    label="Dosage Strength"
                    name="dosageStrength"
                    value={formData.dosageStrength}
                    onChange={handleChange}
                    placeholder="e.g., 500 mg"
                    // required={formData.antiTetanus ? true : false}
                    required
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
                <TextField
                    label="Dosage Intake"
                    name="dosageIntake"
                    value={formData.dosageIntake}
                    onChange={handleChange}
                    placeholder="e.g., 1 tablet"
                    // required={formData.antiTetanus ? true : false}
                    required
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            </div>

            <SelectField
                label="Dose Regimen"
                name="doseRegimen"
                value={formData.doseRegimen}
                onChange={handleChange}
                options={[
                    { value: '2x_day_12hrs', label: '2x a day - every 12 hours' },
                    { value: '3x_day_8hrs', label: '3x a day - every 8 hours' },
                    { value: '4x_day_6hrs', label: '4x a day - every 6 hours' },
                    { value: 'bedtime', label: 'Every bedtime' },
                    { value: 'every_other_day', label: 'Every other day' },
                    { value: 'once_daily', label: 'Once a day' },
                    { value: 'others', label: 'Others' }
                ]}
                required={isAddMode}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            {formData.doseRegimen === 'others' && (
                <TextField
                    label="Others (specify)"
                    name="otherDoseRegimen"
                    value={formData.otherDoseRegimen}
                    onChange={handleChange}
                    required={formData.doseRegimen ? true : false}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            )}

            <div
                className={styles.row}
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            >
                <NumberField
                    label="Total Quantity"
                    name="totalQuantity"
                    value={formData.totalQuantity}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                    min={1}
                    max={500}
                    step={1}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
                <SelectField
                    label="Unit of Measure"
                    name="quantityUnit"
                    value={formData.quantityUnit}
                    onChange={handleChange}
                    options={[
                        { value: 'tablets', label: 'Tablets' },
                        { value: 'capsules', label: 'Capsules' },
                        { value: 'ml', label: 'mL (for syrup)' },
                        { value: 'bottles', label: 'Bottles' },
                        { value: 'sachets', label: 'Sachets' },
                        { value: 'pieces', label: 'Pieces' }
                    ]}
                    required={formData.totalQuantity ? true : false}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            </div>

            <SelectField
                label="Intended Purpose"
                name="intendedPurpose"
                value={formData.intendedPurpose}
                onChange={handleChange}
                options={[
                    { value: 'pain_relief', label: 'Pain Relief' },
                    { value: 'infection', label: 'Infection Treatment' },
                    { value: 'inflammation', label: 'Anti-inflammatory' },
                    { value: 'fever', label: 'Fever Reduction' },
                    { value: 'blood_pressure', label: 'Blood Pressure Management' },
                    { value: 'diabetes', label: 'Diabetes Management' },
                    { value: 'allergy', label: 'Allergy Relief' },
                    { value: 'vitamin', label: 'Vitamin/Supplement' },
                    { value: 'other', label: 'Other' }
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            {formData.intendedPurpose === 'other' && (
                <TextField
                    label="Other Intended Purpose"
                    name="otherIntendedPurpose"
                    value={formData.otherIntendedPurpose}
                    onChange={handleChange}
                    required={formData.intendedPurpose ? true : false}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            )}

            <TextareaField
                label="Medication Notes"
                name="medicationNotes"
                value={formData.medicationNotes}
                onChange={handleChange}
                rows={2}
                placeholder="Additional notes about the medication..."
                isViewMode={isViewMode}
                isSaving={isSaving}
            />

            <SelectField
                label="Prescribed By (WIP)"
                name="prescribedBy"
                value={formData.prescribedBy}
                onChange={handleChange}
                options={[
                    { value: 'pain_relief', label: 'Pain Relief' },
                    { value: 'infection', label: 'Infection Treatment' },
                    { value: 'inflammation', label: 'Anti-inflammatory' },
                    { value: 'fever', label: 'Fever Reduction' },
                    { value: 'blood_pressure', label: 'Blood Pressure Management' },
                    { value: 'diabetes', label: 'Diabetes Management' },
                    { value: 'allergy', label: 'Allergy Relief' },
                    { value: 'vitamin', label: 'Vitamin/Supplement' },
                    { value: 'other', label: 'Other' }
                ]}
                /* WIP
                {providers.map(p => (
                  <option key={p.id} value={p.id}>{p.last_name}, {p.first_name} ({p.role})</option>
                ))}
                */
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
                        disabled={isSaving || isViewMode /*|| !hasChanges*/}
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