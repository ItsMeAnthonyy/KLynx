import styles from '../../../../shared/forms/Form.module.css';
import RadioField from "../../../../shared/forms/RadioField";
import SelectField from "../../../../shared/forms/SelectField";
import { FaSpinner } from 'react-icons/fa';

export default function PrenatalForm({ isOpen, mode, formData, onClose, handleSubmit, handleChange, hasChanges, isSaving }) {

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    return(
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>
                        Menarche{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="menarche"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={1}
                        max={5000}
                        step="1"
                        value={formData.menarche ?? "-"}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        Period Duration{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="periodDuration"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={1} 
                        max={500}
                        step="1"
                        value={formData.periodDuration}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>
                        Interval/Cycle (Days){isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="intervalCycle"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={1}
                        max={5000}
                        step="1"
                        value={formData.intervalCycle}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        No. of pads/day during menstruation{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="padsPerDay"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={1}
                        max={5000}
                        step="1"
                        value={formData.padsPerDay}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>
                        Last Menstrual Period{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="date"
                        name="lastMenstrualPeriod"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        value={formData.lastMenstrualPeriod}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        Expected Date of Delivery{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="date"
                        name="expectedDateOfDelivery"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        value={formData.expectedDateOfDelivery}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                    />
                </div>
            </div>
            <RadioField
                label="Menopause"
                name="menopause"
                value={formData.menopause}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>
                        Onset of sexual intercourse{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="onsetOfSexualIntercourse"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        value={formData.onsetOfSexualIntercourse}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <SelectField
                    label="Select Birth Control Methods"
                    name="birthControlMethod"
                    value={formData.birthControlMethod}
                    onChange={handleChange}
                    options={[
                        { label: "None", value: "none" },
                        { label: "Condom", value: "condom" },
                        { label: "Oral Contraceptive Pills", value: "oralContraceptivePills" },
                    ]}
                    required={isAddMode}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            </div>
            <div className={styles.row3}>
                <div className={styles.field}>
                    <label>
                        Gravidity{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="gravidity"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={0}
                        max={5000}
                        step="1"
                        value={formData.gravidity}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        Parity{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="parity"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={0} 
                        max={500}
                        step="1"
                        value={formData.parity}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        Term{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="term"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={0} 
                        max={500}
                        step="1"
                        value={formData.term}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
            </div>
            <div className={styles.row3}>
                <div className={styles.field}>
                    <label>
                        Preterm{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="preterm"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={0}
                        max={5000}
                        step="1"
                        value={formData.preterm}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        Livebirths{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="livebirths"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={0} 
                        max={500}
                        step="1"
                        value={formData.livebirths}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        Abortion{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="number"
                        name="abortion"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        min={0} 
                        max={500}
                        step="1"
                        value={formData.abortion}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                        required
                    />
                </div>
            </div>
            <RadioField
                label="Ovarian Cyst"
                name="ovarianCyst"
                value={formData.ovarianCyst}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Intact Uterus"
                name="intactUterus"
                value={formData.intactUterus}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Diabetes"
                name="diabetes"
                value={formData.diabetes}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Thyroid"
                name="thyroid"
                value={formData.thyroid}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Obesity"
                name="obesity"
                value={formData.obesity}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Asthma"
                name="asthma"
                value={formData.asthma}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Epilepsy"
                name="epilepsy"
                value={formData.epilepsy}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Hypertension"
                name="hypertension"
                value={formData.hypertension}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Heart Disease"
                name="heartDisease"
                value={formData.heartDisease}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Bleeding Disorder"
                name="bleedingDisorder"
                value={formData.bleedingDisorder}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Tuberculosis"
                name="tuberculosis"
                value={formData.tuberculosis}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>
                        Date Delivered{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="date"
                        name="dateDelivered"
                        className={`${styles.input} ${isViewMode ? styles.inputReadOnly : ""}`}
                        value={formData.dateDelivered}
                        onChange={handleChange}
                        readOnly={isViewMode}
                        disabled={isSaving}
                    />
                </div>
                <RadioField
                    label="Case Status"
                    name="caseStatus"
                    value={formData.caseStatus}
                    onChange={handleChange}
                    options={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ]}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            </div>
            <div className={styles.field}>
                <label>Remarks</label>
                <textarea
                    name="remarks"
                    className={`${styles.textarea} ${isViewMode ? styles.inputReadOnly : ""}`}
                    value={formData.remarks}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    disabled={isSaving}
                    rows={2}
                    placeholder={isViewMode ? "" : "Enter details here..."}
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
                                isEditMode ? "Update Record" : "Create Record"
                        )}
                    </button>
                )}
            </div>
        </form>
    );
}