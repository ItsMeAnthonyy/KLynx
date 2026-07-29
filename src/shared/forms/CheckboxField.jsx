import styles from "./Form.module.css";

export default function CheckboxField({
    label,
    name,
    values = [],
    onChange,
    options = [],
    required = false,
    isViewMode = false,
    isSaving = false,
    columns = 2,

    checkboxContent = null,
    checkboxViewValues = {},
}) {

    // ✅ Detect if grouped
    const isGrouped =
        options.length > 0 &&
        options[0].options;

    // ✅ Get selected labels for view mode
    const selectedLabels = isGrouped
        ? options
            .flatMap((group) => group.options)
            .filter((opt) => values.includes(opt.value))
            .map((opt) => opt.label)
        : options
            .filter((opt) => values.includes(opt.value))
            .map((opt) => opt.label);

    return (
        <div className={styles.field}>
            {label && (
                <label>
                    {label}
                    {required && (
                        <span style={{ color: "#e53e3e" }}>*</span>
                    )}
            </label>
            )}

            {isViewMode ? (

                // ✅ VIEW MODE WITH EXTRA CONTENT (ex: D0 + Date)
                checkboxContent ? (
                    <div
                        className={styles.checkboxGroup}
                        style={{
                            gridTemplateColumns:
                                `repeat(${columns}, 1fr)`
                        }}
                    >
                        {options.map((opt) => {

                            // show only selected values
                            if (!values.includes(opt.value)) {
                                return null;
                            }

                            return (
                                <div
                                    key={opt.value}
                                    className={styles.checkboxItem}
                                >
                                    <div
                                        className={styles.checkboxLabel}
                                    >
                                        {opt.label}
                                    </div>

                                    <div
                                        className={`${styles.input} ${styles.inputReadOnly}`}
                                        style={{ width: "9rem" }}
                                    >
                                        {checkboxViewValues?.[opt.value] || "-"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (

                    // ✅ NORMAL VIEW MODE
                    <div className={`${styles.input} ${styles.inputReadOnly}`}>
                        {selectedLabels.length > 0
                            ? selectedLabels.join(", ")
                            : "-"}
                    </div>
                )
            ) : (
                <>
                    {isGrouped ? (
                        // ✅ GROUPED OPTIONS
                        <div className={styles.checkboxWrapper}>
                            {options.map((groupItem) => (
                                <div key={groupItem.group}>

                                    {/* <div className={styles.checkboxGroupTitle}>
                                        {groupItem.group}
                                    </div> */}

                                    <div
                                        className={styles.checkboxGroup}
                                        style={{
                                            gridTemplateColumns:
                                                `repeat(${columns}, 1fr)`
                                        }}
                                    >
                                        {groupItem.options.map((opt) => (
                                            <div
                                                key={opt.value}
                                                className={styles.checkboxItem}
                                            >
                                                <label
                                                    className={styles.checkboxLabel}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={name}
                                                        value={opt.value}
                                                        checked={values.includes(opt.value)}
                                                        onChange={onChange}
                                                        disabled={isSaving}
                                                    />
                                                    {opt.label}
                                                </label>
                                                
                                                {checkboxContent?.[opt.value]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // ✅ NORMAL OPTIONS
                        <div
                            className={styles.checkboxGroup}
                            style={{
                                gridTemplateColumns:
                                    `repeat(${columns}, 1fr)`
                            }}
                        >
                            {options.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={styles.checkboxItem}
                                >
                                    <label
                                        className={styles.checkboxLabel}
                                    >
                                        <input
                                            type="checkbox"
                                            name={name}
                                            value={opt.value}
                                            checked={values.includes(opt.value)}
                                            onChange={onChange}
                                            disabled={isSaving}
                                        />
                                        {opt.label}
                                    </label>

                                    {checkboxContent?.[opt.value]}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}