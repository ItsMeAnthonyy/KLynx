import styles from "./Form.module.css";

export default function NumberField({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    min,
    max,
    step = 1,
    required = false,
    isViewMode = false,
    isSaving = false,
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
                    {value ?? "-"}
                </div>
            ) : (
                <input
                    type="number"
                    name={name}
                    className={styles.input}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                    disabled={isSaving}
                    required={required}
                />
            )}
        </div>
    );
}