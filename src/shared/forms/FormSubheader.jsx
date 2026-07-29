import styles from "./Form.module.css";

export default function FormSubheader({
    title,
    subtitle = "",
    level = 1,
}) {

    return (
        <div
            className={`
                ${styles.formSubheader}
                ${level === 2 ? styles.level2 : ""}
                ${level === 3 ? styles.level3 : ""}
            `}
        >
            <h3
                className={`
                    ${styles.formSubheaderTitle}
                    ${level === 2 ? styles.titleLevel2 : ""}
                    ${level === 3 ? styles.titleLevel3 : ""}
                `}
            >
                {title}
            </h3>

            {subtitle && (
                <p className={styles.formSubheaderSubtitle}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}