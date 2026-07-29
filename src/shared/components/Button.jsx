import styles from './Button.module.css';

export default function Button({
    children,
    icon,
    variant = "primary",
    disabled,
    ...props
}) {
    return (
        <button
            className={`
                ${styles.button} 
                ${styles[variant]} 
                ${disabled ? styles.disabled : ""}
            `}
            disabled={disabled}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
}