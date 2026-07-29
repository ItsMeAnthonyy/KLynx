import styles from "./Form.module.css";

export default function DateField({
    label,
    name,
    value,
    onChange,
    required = false,
    isViewMode = false,
    isSaving = false,
    min,
    max,
}) {

    return (
        <div className={styles.field}>
            <label>
                {label}
                {required && (
                    <span style={{ color: "#e53e3e" }}>*</span>
                )}
            </label>

            {isViewMode ? (
                <div className={`${styles.input} ${styles.inputReadOnly}`}>
                    {value || "-"}
                </div>
            ) : (
                <input
                    type="date"
                    name={name}
                    className={styles.input}
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSaving}
                    required={required}
                    min={min}
                    max={max}
                />
            )}
        </div>
    );
}