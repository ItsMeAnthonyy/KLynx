import styles from '../../../../shared/forms/Form.module.css';
import FormSubheader from "../../../../shared/forms/FormSubheader";
import DateField from "../../../../shared/forms/DateField";
import CheckboxField from "../../../../shared/forms/CheckboxField";
import RadioField from "../../../../shared/forms/RadioField";
import TextField from "../../../../shared/forms/TextField";
import NumberField from "../../../../shared/forms/NumberField";
import SelectField from "../../../../shared/forms/SelectField";
import TextareaField from "../../../../shared/forms/TextareaField";
import { FaSpinner } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AnimalBiteForm({ isOpen, mode, formData, onClose, handleSubmit, handleChange, hasChanges, isSaving }) {

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    return(
        <form onSubmit={handleSubmit} className={styles.form}>
            <DateField
                label="Date of Bite"
                name="dateOfBite"
                value={formData.dateOfBite}
                onChange={handleChange}
                required={true}
                isViewMode={isViewMode}
                isSaving={isSaving}
                min="1926-01-01"
                max={new Date().toISOString().split("T")[0]}
            />
            <CheckboxField
                label="Site of Bite ( PLEASE CHECK ALL APPLICABLE CHOICES )"
                name="siteOfBite"
                values={formData.siteOfBite || []}
                onChange={handleChange}
                options={[
                    {
                        group: "Head/Neck",
                        options: [
                            { label: "Scalp", value: "scalp" },
                            { label: "Face", value: "face" },
                            { label: "Neck", value: "neck" }
                        ]
                    },
                    {
                        group: "Upper Limbs",
                        options: [
                            { label: "Left Arm", value: "left_arm" },
                            { label: "Right Arm", value: "right_arm" },
                            { label: "Left Hand", value: "left_hand" },
                            { label: "Right Hand", value: "right_hand" }
                        ]
                    },
                    {
                        group: "Lower Limbs",
                        options: [
                            { label: "Left Leg", value: "left_leg" },
                            { label: "Right Leg", value: "right_leg" },
                            { label: "Left Foot", value: "left_foot" },
                            { label: "Right Foot", value: "right_foot" }
                        ]
                    },
                    {
                        group: "Torso",
                        options: [
                            { label: "Chest", value: "chest" },
                            { label: "Back", value: "back" },
                            { label: "Abdomen", value: "abdomen" }
                        ]
                    }
                    // },
                    // {
                    //     group: "Other",
                    //     options: [
                    //     { label: "Genital Area", value: "genital_area" },
                    //     { label: "Multiple Sites", value: "multiple_sites" },
                    //     { label: "Unknown", value: "unknown" }
                    //     ]
                    // }
                ]}
                required={true}
                isViewMode={isViewMode}
                isSaving={isSaving}
                columns={4}
            />
            <RadioField
                label="Category of Exposure"
                name="categoryOfExposure"
                value={formData.categoryOfExposure}
                onChange={handleChange}
                options={[
                    { label: "Category II", value: "category_ii" },
                    { label: "Category III", value: "category_iii" },
                ]}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <CheckboxField
                label="Place Bitten"
                name="placeBitten"
                values={formData.placeBitten || []}
                onChange={handleChange}
                options={[
                    { label: "House", value: "house" },
                    { label: "Street", value: "street" },
                    { label: "Neighbour", value: "neighbour" },
                    { label: "Compound", value: "compound" },
                    { label: "Work/Site", value: "work_site" },
                    { label: "Other places", value: "other_places" }
                ]}
                columns={3}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <FormSubheader
                title="Post Exposure Treatment"
                // subtitle="Please check all applicable choices"
            />
            <CheckboxField
                label="Post Exposure Treatment"
                name="postExposureTreatment"
                values={formData.postExposureTreatment || []}
                onChange={handleChange}
                options={[
                    { label: "Wound washed with soap & water", value: "washed_soap_water" },
                    { label: "Applied disinfectant", value: "applied_disinfectant" },
                    { label: "Tandok applied", value: "tandok_applied" },
                    { label: "Used garlic", value: "used_garlic" },
                    { label: "None", value: "none" },
                    { label: "Others", value: "others" }
                ]}
                required={true}
                isViewMode={isViewMode}
                isSaving={isSaving}
                columns={2}
            />
            {formData.postExposureTreatment.includes('others') && (
                <TextField
                    label="Others (specify)"
                    name="otherPostExposureTreatment"
                    value={formData.otherPostExposureTreatment}
                    onChange={handleChange}
                    required={true}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            )}
            <FormSubheader
                title="Anti-Tetanus Immunization Given"
                // subtitle="Please check all applicable choices"
            />
            <RadioField
                label="Anti-Tetanus Immunization Given"
                name="antiTetanus"
                value={formData.antiTetanus}
                onChange={handleChange}
                options={[
                    { label: "ATS/TIG", value: "ats_tig" },
                    { label: "Tetanus Toxoid", value: "tetanus_toxoid" },
                ]}
                required={true}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            {formData.antiTetanus && (
                <>
                    <div
                        className={styles.row}
                        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                    >
                        <TextField
                            label="Vaccine/Serum Name"
                            name="antiTetanusVaccineName"
                            value={formData.antiTetanusVaccineName}
                            onChange={handleChange}
                            required={formData.antiTetanus ? true : false}
                            isViewMode={isViewMode}
                            isSaving={isSaving}
                        />
                        <DateField
                            label="When Given"
                            name="antiTetanusDate"
                            value={formData.antiTetanusDate}
                            onChange={handleChange}
                            required={formData.antiTetanus ? true : false}
                            isViewMode={isViewMode}
                            isSaving={isSaving}
                            min="1926-01-01"
                            max={new Date().toISOString().split("T")[0]}
                        />
                        <TextField
                            label="Where Given"
                            name="antiTetanusWhere"
                            value={formData.antiTetanusWhere}
                            onChange={handleChange}
                            required={formData.antiTetanus ? true : false}
                            isViewMode={isViewMode}
                            isSaving={isSaving}
                        />
                    </div>
                    <TextField
                        label="Antibiotics Given"
                        name="antibioticsGiven"
                        value={formData.antibioticsGiven}
                        onChange={handleChange}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                    />
                    <FormSubheader
                        title="a. Immunization Provided"
                        level={2}
                    />
                    <RadioField
                        label="Active Immunization"
                        name="activeImmunization"
                        value={formData.activeImmunization}
                        onChange={handleChange}
                        options={[
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                        ]}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                    />
                    {formData.activeImmunization === 'yes' && (
                        <>
                            <CheckboxField
                                label="ID/IM"
                                name="idOrIm"
                                values={formData.idOrIm || []}
                                onChange={handleChange}
                                options={[
                                    { label: "PCEC", value: "pcec" },
                                    { label: "PVRV", value: "pvrv" }
                                ]}
                                isViewMode={isViewMode}
                                isSaving={isSaving}
                                columns={2}
                            />
                            <CheckboxField
                                label="Date Given"
                                name="activeImmunizationDate"
                                values={formData.activeImmunizationDate || []}
                                onChange={handleChange}
                                options={[
                                    { label: "D0", value: "d0Status" },
                                    { label: "D3", value: "d3Status" },
                                    { label: "D7", value: "d7Status" },
                                    { label: "D30", value: "d30Status" }
                                ]}
                                isViewMode={isViewMode}
                                isSaving={isSaving}
                                columns={2}

                                checkboxViewValues={{
                                    d0Status: formData.dateD0,
                                    d3Status: formData.dateD3,
                                    d7Status: formData.dateD7,
                                    d30Status: formData.dateD30,
                                }}

                                checkboxContent={{
                                    d0Status: (
                                        <div className={styles.inlineField}>
                                            <input 
                                                type="date"
                                                name="dateD0"
                                                value={formData.dateD0}
                                                onChange={handleChange}
                                                disabled={
                                                    !formData.activeImmunizationDate.includes("d0Status")
                                                }
                                                min="1926-01-01"
                                                className={styles.input}
                                                style={{ width: "9rem" }}
                                            />
                                        </div>
                                    ),
                                    d3Status: (
                                        <div className={styles.inlineField}>
                                            <input 
                                                type="date"
                                                name="dateD3"
                                                value={formData.dateD3}
                                                onChange={handleChange}
                                                disabled={
                                                    !formData.activeImmunizationDate.includes("d3Status")
                                                }
                                                min="1926-01-01"
                                                className={styles.input}
                                                style={{ width: "9rem" }}
                                            />
                                        </div>
                                    ),
                                    d7Status: (
                                        <div className={styles.inlineField}>
                                            <input 
                                                type="date"
                                                name="dateD7"
                                                value={formData.dateD7}
                                                onChange={handleChange}
                                                disabled={
                                                    !formData.activeImmunizationDate.includes("d7Status")
                                                }
                                                min="1926-01-01"
                                                className={styles.input}
                                                style={{ width: "9rem" }}
                                            />
                                        </div>
                                    ),
                                    d30Status: (
                                        <div className={styles.inlineField}>
                                            <input 
                                                type="date"
                                                name="dateD30"
                                                value={formData.dateD30}
                                                onChange={handleChange}
                                                disabled={
                                                    !formData.activeImmunizationDate.includes("d30Status")
                                                }
                                                min="1926-01-01"
                                                className={styles.input}
                                                style={{ width: "9rem" }}
                                            />
                                        </div>
                                    )
                                }}
                            />
                            <div
                                className={styles.row}
                                style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                            >
                                <TextField
                                    label="Prev ARV Vacc"
                                    name="previousArvVacc"
                                    value={formData.previousArvVacc}
                                    onChange={handleChange}
                                    isViewMode={isViewMode}
                                    isSaving={isSaving}
                                />
                                <DateField
                                    label="When"
                                    name="PrevArvVaccDate"
                                    value={formData.PrevArvVaccDate}
                                    onChange={handleChange}
                                    // disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                                    isViewMode={isViewMode}
                                    isSaving={isSaving}
                                    min="1926-01-01"
                                    max={new Date().toISOString().split("T")[0]}
                                />
                                <TextField
                                    label="Vacc"
                                    name="vacc"
                                    value={formData.vacc}
                                    onChange={handleChange}
                                    isViewMode={isViewMode}
                                    isSaving={isSaving}
                                />
                            </div>
                        </>
                    )}
                    <RadioField
                        label="Passive Immunization"
                        name="passiveImmunization"
                        value={formData.passiveImmunization}
                        onChange={handleChange}
                        options={[
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                        ]}
                        required={formData.antiTetanus ? true : false}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                    />
                    {formData.passiveImmunization === 'yes' && (
                        <>
                            <DateField
                                label="Date Given"
                                name="passiveImmunizationDate"
                                value={formData.passiveImmunizationDate}
                                onChange={handleChange}
                                // disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                                isViewMode={isViewMode}
                                isSaving={isSaving}
                                min="1926-01-01"
                                max={new Date().toISOString().split("T")[0]}
                            />
                            <CheckboxField
                                label="Type of Immunoglobulin"
                                name="typeOfImmunoglobulin"
                                values={formData.typeOfImmunoglobulin || []}
                                onChange={handleChange}
                                options={[
                                    { label: "ERIG", value: "erig" }
                                ]}
                                isViewMode={isViewMode}
                                isSaving={isSaving}
                                columns={1}

                                checkboxContent={{
                                    erig: (
                                        <div className={styles.inlineField}>
                                            <input 
                                                type="number"
                                                name="erigVolume"
                                                value={formData.erigVolume}
                                                onChange={handleChange}
                                                disabled={
                                                    !formData.typeOfImmunoglobulin.includes("erig")
                                                }
                                                min={0}
                                                step="0.1"
                                                placeholder="ml"
                                                className={styles.input}
                                            />

                                            <span className={styles.mlLabel}>
                                                ml. (40 IU/kg body weight)
                                            </span>
                                        </div>
                                    )
                                }}

                                checkboxViewValues={{
                                    erig: `${formData.erigVolume} ml. (40 IU/kg body weight)`
                                }}

                            />
                            {formData.typeOfImmunoglobulin.includes("erig") && (
                                <div
                                    className={styles.row}
                                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                                >
                                    <DateField
                                        label="When Given"
                                        name="erigDate"
                                        value={formData.erigDate}
                                        onChange={handleChange}
                                        required={formData.typeOfImmunoglobulin.includes("erig")}
                                        // disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                                        isViewMode={isViewMode}
                                        isSaving={isSaving}
                                        min="1926-01-01"
                                        max={new Date().toISOString().split("T")[0]}
                                    />
                                    <TextField
                                        label="Where Given"
                                        name="erigWhere"
                                        value={formData.erigWhere}
                                        onChange={handleChange}
                                        required={formData.typeOfImmunoglobulin.includes("erig")}
                                        isViewMode={isViewMode}
                                        isSaving={isSaving}
                                    />
                                </div>
                            )}
                            <CheckboxField
                                name="typeOfImmunoglobulin"
                                values={formData.typeOfImmunoglobulin || []}
                                onChange={handleChange}
                                options={[
                                    { label: "HRIG", value: "hrig" }
                                ]}
                                isViewMode={isViewMode}
                                isSaving={isSaving}
                                columns={1}

                                checkboxContent={{
                                    hrig: (
                                        <div className={styles.inlineField}>
                                            <input 
                                                type="number"
                                                name="hrigVolume"
                                                value={formData.hrigVolume}
                                                onChange={handleChange}
                                                disabled={
                                                    !formData.typeOfImmunoglobulin.includes("hrig")
                                                }
                                                min={0}
                                                step="0.1"
                                                placeholder="ml"
                                                className={styles.input}
                                            />

                                            <span className={styles.mlLabel}>
                                                ml. (20 IU/kg body weight)
                                            </span>
                                        </div>
                                    )
                                }}

                                checkboxViewValues={{
                                    hrig: `${formData.hrigVolume} ml. (20 IU/kg body weight)`
                                }}
                            />
                            {formData.typeOfImmunoglobulin.includes("hrig") && (
                                <div
                                    className={styles.row}
                                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                                >
                                    <DateField
                                        label="When Given"
                                        name="hrigDate"
                                        value={formData.hrigDate}
                                        onChange={handleChange}
                                        required={formData.typeOfImmunoglobulin.includes("hrig")}
                                        // disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                                        isViewMode={isViewMode}
                                        isSaving={isSaving}
                                        min="1926-01-01"
                                        max={new Date().toISOString().split("T")[0]}
                                    />
                                    <TextField
                                        label="Where Given"
                                        name="hrigWhere"
                                        value={formData.hrigWhere}
                                        onChange={handleChange}
                                        required={formData.typeOfImmunoglobulin.includes("hrig")}
                                        isViewMode={isViewMode}
                                        isSaving={isSaving}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
            <FormSubheader
                title="Animal profile"
                // subtitle="Please check all applicable choices"
            />
            <RadioField
                label="Species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                options={[
                    { label: "Dog", value: "dog" },
                    { label: "Cat", value: "cat" },
                    { label: "Monkey", value: "monkey" },
                    { label: "Others", value: "others" }
                ]}
                required={true}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            {formData.species === 'others' && (
                <TextField
                    label="Specify Type Of Animal"
                    name="specifyTypeOfAnimal"
                    value={formData.specifyTypeOfAnimal}
                    onChange={handleChange}
                    required={formData.species === 'others'}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            )}
            <div
                className={styles.row}
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            >
                <NumberField
                    label="Age of Animal"
                    name="ageOfAnimal"
                    value={formData.ageOfAnimal}
                    onChange={handleChange}
                    min={1}
                    max={155}
                    step={1}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
                <SelectField
                    label="Age of Animal Unit"
                    name="ageOfAnimalUnit"
                    value={formData.ageOfAnimalUnit}
                    onChange={handleChange}
                    options={[
                        { label: "Months", value: "months" },
                        { label: "Years", value: "years" },
                    ]}
                    required={isAddMode}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            </div>
            <RadioField
                label="Containment Status"
                name="animalContainmentStatus"
                value={formData.animalContainmentStatus}
                onChange={handleChange}
                options={[
                    { label: "Leashed", value: "leashed" },
                    { label: "Unleashed", value: "unleashed" },
                    { label: "Cage", value: "cage" },
                    { label: "Stray", value: "stray" }
                ]}
                required={true}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <div
                className={styles.row}
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            >
                <TextField
                    label="Name of Owner"
                    name="ownerOfAnimal"
                    value={formData.ownerOfAnimal}
                    onChange={handleChange}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
                <TextField
                    label="Owner's Contact #"
                    name="ownerContact"
                    type="tel"
                    value={formData.ownerContact}
                    onChange={handleChange}
                    placeholder="09XXXXXXXXX"
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
            </div>
            <TextareaField
                label="Address of the Owner"
                name="ownerAddress"
                value={formData.ownerAddress}
                onChange={handleChange}
                rows={2}
                placeholder="Enter address here...."
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <RadioField
                label="Was the animal vaccinated?"
                name="wasAnimalVaccinated"
                value={formData.wasAnimalVaccinated}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" }
                ]}
                required={true}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            {formData.wasAnimalVaccinated === "yes" && (
                <div
                    className={styles.row}
                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                >
                    <DateField
                        label="Date of Vaccination"
                        name="dateOfAnimalVaccination"
                        value={formData.dateOfAnimalVaccination}
                        onChange={handleChange}
                        // disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                        min="1926-01-01"
                        max={new Date().toISOString().split("T")[0]}
                    />
                    <TextField
                        label="Type of Vaccine"
                        name="animalVaccineType"
                        value={formData.animalVaccineType}
                        onChange={handleChange}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                    />
                </div>
            )}
            <RadioField
                label="In contact with other animals?"
                name="contactWithOtherAnimals"
                value={formData.contactWithOtherAnimals}
                onChange={handleChange}
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" }
                ]}
                required={true}
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            {formData.contactWithOtherAnimals === "yes" && (
                <div
                    className={styles.row}
                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                >
                    <TextField
                        label="What kind of Animal/s"
                        name="animalTypeContacted"
                        value={formData.animalTypeContacted}
                        onChange={handleChange}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                    />
                    <NumberField
                        label="How many"
                        name="animalContactCount"
                        value={formData.animalContactCount}
                        onChange={handleChange}
                        min={1}
                        max={50}
                        step={1}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                    />
                </div>
            )}
            <div
                className={styles.row}
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            >
                <RadioField
                    label="Condition before the bite"
                    name="conditionBeforeBite"
                    value={formData.conditionBeforeBite}
                    onChange={handleChange}
                    options={[
                        { label: "Healthy", value: "healthy" },
                        { label: "Sick", value: "sick" },
                        { label: "Unknown", value: "unknown" }
                    ]}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                />
                {formData.conditionBeforeBite === "sick" && (
                    <DateField
                        label="If sick, since when?"
                        name="sickSince"
                        value={formData.sickSince}
                        onChange={handleChange}
                        required={formData.conditionBeforeBite === "sick"}
                        // disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                        min="1926-01-01"
                        max={new Date().toISOString().split("T")[0]}
                    />
                )}
            </div>
            <div
                className={styles.row}
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            >
                <DateField
                    label="If animal is dead, when?"
                    name="animalDeathDate"
                    value={formData.animalDeathDate}
                    onChange={handleChange}
                    // disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                    isViewMode={isViewMode}
                    isSaving={isSaving}
                    min="1926-01-01"
                    max={new Date().toISOString().split("T")[0]}
                />
                {formData.animalDeathDate && (
                    <RadioField
                        label="Cause of Death"
                        name="animalCauseOfDeath"
                        value={formData.animalCauseOfDeath}
                        onChange={handleChange}
                        options={[
                            { label: "Sick", value: "sick" },
                            { label: "Slaughtered", value: "slaughtered" },
                            { label: "Found Dead", value: "found_dead" },
                            { label: "Accident", value: "accident" }
                        ]}
                        isViewMode={isViewMode}
                        isSaving={isSaving}
                    />
                )}
            </div>
            <TextareaField
                label="If rabies is suspected, what are the clinical manifestation observed?"
                name="rabiesClinicalSigns"
                value={formData.rabiesClinicalSigns}
                onChange={handleChange}
                rows={2}
                placeholder="Enter details here..."
                isViewMode={isViewMode}
                isSaving={isSaving}
            />
            <DateField
                label="Animal Status ( 14 days observation )"
                name="animalObservationDate"
                value={formData.animalObservationDate}
                onChange={handleChange}
                // disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                isViewMode={isViewMode}
                isSaving={isSaving}
                min="1926-01-01"
                max={new Date().toISOString().split("T")[0]}
            />

            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnCancel}`}
                    onClick={() => {
                        onClose();
                        // setErrors({});
                    }}
                    disabled={isSaving}
                >
                    {isViewMode ? "Close" : "Cancel"}
                </button>
                {!isViewMode && (
                    <button
                        type="submit"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        disabled={isSaving || isViewMode || !hasChanges}
                    >
                        {isSaving ? (
                                <>
                                    <span className={styles.btnContent}>
                                        <FaSpinner className={styles.spinner} size={16} />
                                        {isEditMode ? "Saving..." : "Creating..."}
                                    </span>
                                </>
                            ) : (
                                isEditMode ? "Update Record" : "Create Record"
                        )}
                    </button>
                )}
            </div>
        </form>
    );
}