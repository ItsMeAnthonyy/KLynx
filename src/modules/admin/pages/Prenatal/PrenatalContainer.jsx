
import React, { useState, useEffect } from 'react';
import PrenatalForm from './PrenatalForm';
import { toast } from '../../../../hooks/use-toast';
import { createPrenatalRecord, updatePrenatalRecord } from "../../api/prenatalApi"

export default function PrenatalContainer({ isOpen, onSuccess, mode, visitId, prenatalRecord, onClose }) {

    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    const emptyPrenatalRecord = {
        dateDelivered: '',
        caseStatus: 'active',
        remarks: '',
        ovarianCyst: 'no',
        intactUterus: 'no',
        diabetes: 'no',
        thyroid: 'no',
        obesity: 'no',
        asthma: 'no',
        epilepsy: 'no',
        hypertension: 'no',
        heartDisease: 'no',
        bleedingDisorder: 'no',
        tuberculosis: 'no',
        menarche: 'no',
        periodDuration: '',
        intervalCycle: '',
        padsPerDay: '',
        lastMenstrualPeriod: '',
        expectedDateOfDelivery: '',
        menopause: 'no',
        gravidity: '',
        parity: '',
        term: '',
        preterm: '',
        livebirths: '',
        abortion: '',
        onsetOfSexualIntercourse: '',
        birthControlMethod: ''
    };

    useEffect(() => {
        if (!isOpen) return;
        
        if (mode === "add") {
            setFormData(emptyPrenatalRecord);
            setInitialData(emptyPrenatalRecord);
        }

        if ((mode === "edit" || mode === "view") && prenatalRecord) {
            setFormData(prenatalRecord);
            setInitialData(prenatalRecord);
        }
    }, [isOpen, mode, prenatalRecord]);

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
                const result = await createPrenatalRecord(visitId, formData);
                toast({
                    title: result.success ? 'Success!' : 'Notice',
                    description: result.message,
                    className: result.success ? 'toast-success' : 'toast-warning',
                });
            }

            if (isEditMode) {
                const result = await updatePrenatalRecord(formData);
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
        <PrenatalForm 
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