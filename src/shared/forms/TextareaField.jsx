import styles from "./Form.module.css";

export default function TextareaField({
    label,
    name,
    value,
    onChange,
    required = false,
    isViewMode = false,
    isSaving = false,
    rows = 9,
    placeholder = "Enter details here...",
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
                <div
                    className={`${styles.textarea} ${styles.inputReadOnly}`}
                    style={{
                        minHeight: `${rows * 24}px`,
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {value || "-"}
                </div>
            ) : (
                <textarea
                    name={name}
                    className={styles.textarea}
                    value={value}
                    onChange={onChange}
                    disabled={isSaving}
                    required={required}
                    rows={rows}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
}