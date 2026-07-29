import React, { useState, useEffect } from 'react';
import AnimalBiteForm from './AnimalBiteForm';
import { toast } from '../../../../hooks/use-toast';
import { createAnimalBiteRecord, updateAnimalBiteRecord } from "../../api/animalBiteApi"

export default function AnimalBiteContainer({ isOpen, onSuccess, mode, visitId, animalbite, onClose }) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    const emptyAnimalBite = {
        dateOfBite: '',
        siteOfBite: [],
        categoryOfExposure: '',
        placeBitten: [],
        postExposureTreatment: [],
        otherPostExposureTreatment: '',
        antiTetanus: '',
        antiTetanusVaccineName: '',
        antiTetanusDate: '',
        antiTetanusWhere: '',
        antibioticsGiven: '',
        activeImmunization: '',
        idOrIm: [],
        activeImmunizationDate: [],
        dateD0: '',
        dateD3: '',
        dateD7: '',
        dateD30: '',
        previousArvVacc: '',
        PrevArvVaccDate: '',
        vacc:'',
        passiveImmunization: '',
        passiveImmunizationDate: '',
        typeOfImmunoglobulin: [],
        erigVolume: '',
        erigDate: '',
        erigWhere: '',
        hrigVolume: '',
        hrigDate: '',
        hrigWhere: '',
        species: '',
        specifyTypeOfAnimal: '',
        ageOfAnimal: '',
        ageOfAnimalUnit: '',
        animalContainmentStatus: '',
        ownerOfAnimal: '',
        ownerContact: '',
        ownerAddress: '',
        wasAnimalVaccinated: '',
        dateOfAnimalVaccination:'',
        animalVaccineType: '',
        contactWithOtherAnimals: '',
        animalTypeContacted: '',
        animalContactCount: '',
        conditionBeforeBite: '',
        sickSince: '',
        animalDeathDate: '',
        animalCauseOfDeath: '',
        rabiesClinicalSigns: '',
        animalObservationDate: ''
    };

    useEffect(() => {
        if (!isOpen) return;
        
        if (mode === "add") {
            setFormData(emptyAnimalBite);
            setInitialData(emptyAnimalBite);
        }

        if ((mode === "edit" || mode === "view") && animalbite) {
            setFormData(animalbite);
            setInitialData(animalbite);
        }
    }, [isOpen, mode, animalbite]);

    const hasChanges =
        initialData &&
        JSON.stringify(formData) !== JSON.stringify(initialData);

    if (!formData) { return <div>Loading...</div>; }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return;
        if (!hasChanges) return;
        setIsSaving(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Check: ", formData);

            if (isAddMode) {
                const result = await createAnimalBiteRecord(visitId, formData);
                toast({
                    title: result.success ? 'Success!' : 'Notice',
                    description: result.message,
                    className: result.success ? 'toast-success' : 'toast-warning',
                });
            }

            if (isEditMode) {
                const result = await updateAnimalBiteRecord(formData);
                toast({
                    title: result.success ? 'Success!' : 'Notice',
                    description: result.message,
                    className: result.success ? 'toast-success' : 'toast-warning',
                });
            }
            
            // onSuccess?.();
            // onClose();

        } catch (err) {
            toast({
            title: 'Error',
            description: err.message || 'Something went wrong.',
            variant: 'destructive',
        });
        } finally {
            setIsSaving(false);
        }
    }
    
    const handleChange = (e) => {
        if (isViewMode) return;

        const { name, value, type, checked, valueAsNumber } = e.target;

        if (type === "checkbox") {

            if (name === "postExposureTreatment" && value === "others" && !checked) {
                setFormData((prev) => ({
                    ...prev,
                    otherPostExposureTreatment: ""
                }));
            }

            if (name === "activeImmunizationDate") {
                setFormData((prev) => {
                    const updatedValues = checked
                        ? [...prev[name], value]
                        : prev[name].filter((d) => d !== value);

                    let resetFields = {};

                    if (!checked) {
                        if (value === "d0Status") resetFields.dateD0 = "";
                        if (value === "d3Status") resetFields.dateD3 = "";
                        if (value === "d7Status") resetFields.dateD7 = "";
                        if (value === "d30Status") resetFields.dateD30 = "";
                    }

                    return {
                        ...prev,
                        [name]: updatedValues,
                        ...resetFields,
                    };
                });

                return; // IMPORTANT
            }

            if (
                name === "typeOfImmunoglobulin" &&
                value === "erig" &&
                !checked
            ) {
                setFormData((prev) => ({
                    ...prev,
                    erigVolume: "",
                    erigDate: "",
                    erigWhere: ""
                }));
            }

            if (
                name === "typeOfImmunoglobulin" &&
                value === "hrig" &&
                !checked
            ) {
                setFormData((prev) => ({
                    ...prev,
                    hrigVolume: "",
                    hrigDate: "",
                    hrigWhere: ""
                }));
            }

            setFormData((prev) => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter((d) => d !== value),
            }));
        
        } 
        else if (type === "radio") {
            
            if (name === "species" && value !== "others") {
                setFormData((prev) => ({
                    ...prev,
                    specifyTypeOfAnimal: ""
                }));
            }

            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
        else if (type === "number") {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "" ? "" : valueAsNumber
            }));
        } 
        else {
            // for text, textarea, select, etc.
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <AnimalBiteForm
            isOpen={isOpen}

            mode={mode}
            formData={formData}
            onClose={onClose}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            hasChanges={hasChanges}
            isSaving={isSaving}
        />
    );
}