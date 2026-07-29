import React, { useState, useEffect } from 'react';
import PrescriptionForm from './PrescriptionForm';
import { createPrescription/*, createMedicine*/ } from '../../../api/prescriptionApi';
import { toast } from '../../../../../hooks/use-toast';
import CommodityMedicineSummary from './CommodityMedicine/CommodityMedicineSummary'

export default function PrescriptionContainer({ 
    isOpen, 
    // onSuccess, 
    mode, 
    visitId, 
    // animalbite, 
    onClose 
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const [commodityMedicineOpen, setCommodityMedicineOpen] = useState(false);
    
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    const emptyPrescription = {
        medicineId: '',
        medicineName: '',
        drugCode: '',
        dosageStrength: '',
        dosageIntake: '',
        doseRegimen: '',
        otherDoseRegimen: '',
        totalQuantity: '',
        quantityUnit: '',
        intendedPurpose: '',
        otherIntendedPurpose: '',
        medicationNotes: ''
    };

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "add") {
            setFormData(emptyPrescription);
            setInitialData(emptyPrescription);
        }
        
    }, [isOpen, mode, /*animalbite*/]);

    if (!formData) { return <div>Loading...</div>; }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return;
        // if (!hasChanges) return;
        setIsSaving(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isAddMode) {
                const result = await createPrescription(visitId, formData);
                toast({
                    title: result.success ? 'Success!' : 'Notice',
                    description: result.message,
                    className: result.success ? 'toast-success' : 'toast-warning',
                });
            }

            

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

    const openCommodityMedicine = () => {
        setCommodityMedicineOpen(true);
    };

    const handleMedicineSelect = (medicine) => {
        setFormData(prev => ({
            ...prev,
            medicineId: medicine.medicineId,
            medicineName: medicine.genericName,
            drugCode: medicine.drugCode,
            dosageStrength: medicine.strength
        }));
    };

    return (
        <>
            <PrescriptionForm
                isOpen={isOpen}

                mode={mode}
                formData={formData}
                onClose={onClose}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                // hasChanges={hasChanges}
                isSaving={isSaving}
                onOpenCommodityMedicine={openCommodityMedicine}
            />

            {commodityMedicineOpen && (
                <CommodityMedicineSummary
                    isModuleOpen={commodityMedicineOpen}
                    mode={mode}
                    visitId={visitId}
                    closeCommodityMedicine={() => setCommodityMedicineOpen(false)}
                    onSelect={handleMedicineSelect}
                    // patientFullName={patientFullName}
                />
            )}
        </>
    );

}