import styles from "./Form.module.css";

export default function ButtonField({
    label,
    text,
    icon = null,
    onClick,
    type = "button",
    isSaving = false,
    fullWidth = false,
    variant = "primary",
}) {

    return (
        <div className={styles.field}>
            {label && <label>{label}</label>}

            <button
                type={type}
                onClick={onClick}
                disabled={isSaving}
                className={`
                    ${styles.fieldButton}
                    ${
                        variant === "primary"
                            ? styles.fieldButtonPrimary
                            : styles.fieldButtonSecondary
                    }
                    ${fullWidth ? styles.fieldButtonFull : ""}
                `}
            >
                {icon}
                {text}
            </button>
        </div>
    );
}