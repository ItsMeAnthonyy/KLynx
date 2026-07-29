import styles from "./Form.module.css";

export default function SelectField({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    isViewMode = false,
    isSaving = false,
    placeholder = "Select option",
    hideLabel
}) {
    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || "-";

    return (
        <div className={styles.field}>
            {!hideLabel && (
                <label>
                    {label}
                    {required && <span>*</span>}
                </label>
            )}

            {isViewMode ? (
                // 👁 View mode
                <div className={`${styles.input} ${styles.inputReadOnly}`}>
                    {selectedLabel}
                </div>
            ) : (
                // ✏️ Add/Edit mode
                <select
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className={styles.select}
                    disabled={isSaving}
                    required={required}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>

                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}