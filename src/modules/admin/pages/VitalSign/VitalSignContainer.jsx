import React, { useState, useEffect } from 'react';
import VitalSignForm from './VitalSignForm';
import { toast } from '../../../../hooks/use-toast';
import { updateVitalSign } from "../../api/vitalSignsApi"

export default function VitalSignContainer({ isOpen, onSuccess, mode, vitalSign, onClose }) {
    
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";
    
    const emptyVitalSign = {
        bpSystolic: '',
        bpDiastolic: '',
        respiratoryRate: '',
        bodyTemp: '',
        heartRate: '',
        pulseRate: '',
        oxygenSaturation: '',
        heightCm: '',
        weightKg: ''
    };

    useEffect(() => {
        if (!isOpen) return;
        
        if (mode === "add") {
            setFormData(emptyVitalSign);
            setInitialData(emptyVitalSign);
        }

        if ((mode === "edit" || mode === "view") && vitalSign) {
            setFormData(vitalSign);
            setInitialData(vitalSign);
        }
    }, [isOpen, mode, vitalSign]);

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

            if (isAddMode) {
                
            }

            if (isEditMode) {
                const result = await updateVitalSign(formData);
                toast({
                    title: result.success ? 'Success!' : 'Notice',
                    description: result.message,
                    className: result.success ? 'toast-success' : 'toast-warning',
                });
            }

            onSuccess?.();
            onClose();

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
            setFormData((prev) => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter((d) => d !== value),
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
        <VitalSignForm 
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