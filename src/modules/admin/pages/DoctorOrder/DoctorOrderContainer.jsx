import React, { useState, useEffect } from 'react';
import DoctorOrderForm from './DoctorOrderForm';
import { toast } from '../../../../hooks/use-toast';
import { createDoctorOrder, updateDoctorOrderRecord } from "../../api/doctorsOrderApi";
import PrescriptionSummary from './Prescription/PrescriptionSummary'
import ICD10Management from './ICD10/ICD10Management'

export default function DoctorOrderContainer({ 
    isOpen, 
    onSuccess, 
    mode, 
    visitId, 
    doctorOrderRecord, 
    onClose, 
    patientFullName 
}) {
    
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const [prescriptionOpen, setPrescriptionOpen] = useState(false);

    const [showICD10Modal, setShowICD10Modal] = useState(false);
    const [activeIcdField, setActiveIcdField] = useState(null);

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    const emptyDoctorOrderRecord = {
        imaging: [],
        alertType: [],
        alertDescription: '',
        diagnosisStatus: '',
        diagnosisSpecify: '',

        icd10_a: '',
        icd10_b: '',
        icd10_c: '',

        treatmentPlan: '',
        remarks: ''
    };
    
    useEffect(() => {
        if (!isOpen) return;
        
        if (mode === "add") {
            setFormData(emptyDoctorOrderRecord);
            setInitialData(emptyDoctorOrderRecord);
        }

        if ((mode === "edit" || mode === "view") && doctorOrderRecord) {
            setFormData(doctorOrderRecord);
            setInitialData(doctorOrderRecord);
        }
    }, [isOpen, mode, doctorOrderRecord]);

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
                const result = await createDoctorOrder(visitId, formData);
                toast({
                    title: result.success ? 'Success!' : 'Notice',
                    description: result.message,
                    className: result.success ? 'toast-success' : 'toast-warning',
                });
            }

            if (isEditMode) {
                const result = await updateDoctorOrderRecord(formData);
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

    const openPrescription = () => {
        setPrescriptionOpen(true);
    };

    const handleOpenICD10Search = (field) => {
        setActiveIcdField(field);
        setShowICD10Modal(true);
    };
    
    const handleSelectICD10 = (code) => {
        if (activeIcdField) {
            setFormData(prev => ({ 
                ...prev, 
                [activeIcdField]: code.code 
            }));
        }

        setShowICD10Modal(false);
        setActiveIcdField(null);
    };

    return (
        <>
            <DoctorOrderForm
                isOpen={isOpen}

                mode={mode}
                formData={formData}
                onClose={onClose}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                hasChanges={hasChanges}
                isSaving={isSaving}
                onOpenPrescription={openPrescription}
                handleOpenICD10Search={handleOpenICD10Search}
            />

            {prescriptionOpen && (
                <PrescriptionSummary
                    isModuleOpen={prescriptionOpen}
                    visitId={visitId}
                    closePrescription={() => setPrescriptionOpen(false)}
                    patientFullName={patientFullName}
                />
            )}

            {showICD10Modal && (
                <ICD10Management
                    isModuleOpen={showICD10Modal}
                    onClose={() => setShowICD10Modal(false)}
                    onSelect={handleSelectICD10}
                    patientFullName={patientFullName}
                    activeField={activeIcdField}
                    //isAdmin={isAdmin}
                />
            )}
        </>
    );
}