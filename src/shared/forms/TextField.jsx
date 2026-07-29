import styles from "./Form.module.css";

export default function TextField({
    label,
    name,
    value,
    onChange,

    // ✅ NEW
    type = "text",

    placeholder = "",
    required = false,
    isViewMode = false,
    isSaving = false,

    startIcon,
    endAction,
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
                <div className={styles.inputWrapper}>
                    <div className={styles.inputContainer}>

                        {startIcon && (
                            <div className={styles.startIcon}>
                                {startIcon}
                            </div>
                        )}
                        
                        <input
                            type={type}
                            name={name}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            className={`${styles.input} ${startIcon ? styles.inputWithIcon : ""}`}
                            disabled={isSaving}
                            required={required}
                        />
                    </div>

                    {endAction && (
                        <div className={styles.endAction}>
                            {endAction}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}