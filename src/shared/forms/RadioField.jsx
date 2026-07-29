import styles from "./Form.module.css";

export default function RadioField({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    isViewMode = false,
    isSaving = false,
}) {
    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || "-";

    return (
        <div className={styles.field}>
            <label>
                {label}
                {required && <span style={{ color: "#e53e3e" }}>*</span>}
            </label>

            {isViewMode ? (
                // 👁 View mode
                <div className={`${styles.input} ${styles.inputReadOnly}`}>
                    {selectedLabel}
                </div>
            ) : (
                // ✏️ Add/Edit mode
                <div className={styles.radioGroup}>
                    {options.map((opt) => (
                        <label key={opt.value} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name={name}
                                value={opt.value}
                                checked={value === opt.value}
                                onChange={onChange}
                                disabled={isSaving}
                                required={required}
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}