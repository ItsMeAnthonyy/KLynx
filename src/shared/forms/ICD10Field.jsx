import { BiSearch } from "react-icons/bi";
import TextField from "./TextField";
import ButtonField from "./ButtonField";
import styles from "./Form.module.css";

export default function ICD10Field({
    values,
    onChange,
    onSearch,
    isViewMode = false,
    isSaving = false,
    required = false
}) {
    const fields = [
        {
            key: "icd10_a",
            label: "A. ICD10",
            placeholder: "Enter A. ICD10",
        },
        {
            key: "icd10_b",
            label: "B. ICD10",
            placeholder: "Enter B. ICD10",
        },
        {
            key: "icd10_c",
            label: "C. ICD10",
            placeholder: "Enter C. ICD10",
        },
    ];

    return (
        <div className={styles.field}>
            <label>
                ICD10 Codes
                {required && (
                    <span style={{ color: "#e53e3e" }}> *</span>
                )}
            </label>

            <div className={styles.icd10Grid}>
                {fields.map((field) => (
                    <TextField
                        key={field.key}
                        label={field.label}
                        name={field.key}
                        value={values[field.key]}
                        onChange={onChange}
                        placeholder={field.placeholder}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                        endAction={
                            !isViewMode && (
                                <ButtonField
                                    embedded
                                    text="Search ICD10 Code"
                                    icon={<BiSearch size={16} />}
                                    onClick={() => onSearch(field.key)}
                                    variant="secondary"
                                    isSaving={isSaving}
                                />
                            )
                        }
                    />
                ))}
            </div>
        </div>
    );
}