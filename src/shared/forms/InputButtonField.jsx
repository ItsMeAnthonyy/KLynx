import styles from "./Form.module.css";

export default function InputButtonField({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    buttonText = "Search",
    onButtonClick,
    disabled = false,
    required = false,
    isViewMode = false,
}) {

    return (
        <div className={styles.subFieldWrapper}>
            {label && (
                <label>
                    {label}

                    {required && (
                        <span style={{ color: "#e53e3e" }}>
                            *
                        </span>
                    )}
                </label>
            )}

            {isViewMode ? (

                // ✅ VIEW MODE
                <div
                    className={`${styles.input} ${styles.inputReadOnly}`}
                >
                    {value || "-"}
                </div>

            ) : (

                // ✅ ADD / EDIT MODE
                <div className={styles.inputButtonContainer}>
                    <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={styles.input}
                    />

                    <button
                        type="button"
                        onClick={onButtonClick}
                        disabled={disabled}
                        className={styles.actionButton}
                    >
                        {buttonText}
                    </button>
                </div>
            )}
        </div>
    );
}