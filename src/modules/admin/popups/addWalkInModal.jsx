import React, { useState, useEffect } from 'react';
import { BiX, BiUser, BiCalendar, BiErrorCircle } from "react-icons/bi";
import { useToast } from '../../../hooks/use-toast';
import { getPatients, getProviders } from '../api/patientAppointmentApi';
import { createVisitShell, addToQueue } from '../api/queueManagementApi';
import styles from './addWalkInModal.module.css';
import ConsentForm from './VisitConsentForm';

const CONSULTATION_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'prenatal', label: 'Prenatal' },
  { value: 'postnatal', label: 'Postnatal' },
  { value: 'family_planning', label: 'Family Planning' },
  { value: 'immunization', label: 'Immunization' },
  { value: 'pediatric', label: 'Pediatric' },
  { value: 'dental', label: 'Dental' },
  { value: 'laboratory', label: 'Laboratory' }
];

const PRIORITIES = [
  { value: 'routine', label: 'Routine' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'emergency', label: 'Emergency' }
];

const NATURE_OF_VISIT = [
  { value: 'routine_checkup', label: 'Routine Checkup' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'new-symptoms', label: 'New Symptoms' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'referral', label: 'Referral' }
];

const MODE_OF_TRANSACTION = [
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'appointment', label: 'Appointment' },
];

const AddWalkInModal = ({ onClose, onSuccess, currentUserId, prefillData = null }) => {
    const [patients, setPatients] = useState([]);
    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: prefillData?.patient_id || '',
        assigned_provider_id: prefillData?.assigned_provider_id || '',
        consultation_type: prefillData?.consultation_type || 'general',
        priority: prefillData?.priority || 'routine',
        chief_complaint: prefillData?.chief_complaint || '',
        nature_of_visit: prefillData?.nature_of_visit || 'routine_checkup',
        height: prefillData?.height || '',
        weight: prefillData?.weight || '',
        waist: prefillData?.waist || '',
        mode_of_transaction: prefillData?.mode_of_transaction || '',
        patient_consent: prefillData?.patient_consent || ''
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [patientsData, providersData] = await Promise.all([
                getPatients(),
                getProviders()
            ]);
            setPatients(patientsData);
            setProviders(providersData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.patient_id) {
            toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        const assignedProviderId =
            formData.assigned_provider_id === "none" || !formData.assigned_provider_id
                ? null
                : formData.assigned_provider_id;

        setLoading(true);
        try {
            // Create visit shell
            const visit = await createVisitShell({
                patient_id: formData.patient_id,
                visit_date_time: null,
                consultation_type: formData.consultation_type,
                assigned_provider_id: assignedProviderId, //may chance maging null at start
                chief_complaint: formData.chief_complaint, 
                priority: formData.priority,
                status: 'draft',
                visit_created_by: currentUserId,
                nature_of_visit: formData.nature_of_visit,
                height: formData.height,
                weight: formData.weight,
                waist: formData.waist,
                mode_of_transaction: formData.mode_of_transaction,
                patient_consent: formData.patient_consent,
                //patient age - for frontend viewing
            });

            // Add to queue
            await addToQueue({
                patient_id: formData.patient_id,
                assigned_provider_id: assignedProviderId,
                visit_id: Number(visit),
                consultation_type: formData.consultation_type,
                priority: formData.priority,
                queued_by: currentUserId,
                status: 'waiting'
            });
            toast({ title: 'Patient added to queue successfully', className: "toast-success" });
            onSuccess();
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Add Walk-In Patient</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <BiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.infoBox}>
                        <BiErrorCircle size={18} />
                        <p>This will create a visit record and add the patient to the queue.</p>
                    </div>
                    <div className={styles.field}>
                        <label>
                            <BiUser size={16} />
                            Patient *
                        </label>
                        <select
                            value={formData.patient_id}
                            onChange={(e) => handleChange('patient_id', e.target.value)}
                            required
                            disabled={!!prefillData?.patient_id}
                            className={styles.select}
                        >
                            <option value="" disabled hidden >Select patient...</option>
                            {patients.map((patient) => (
                                <option key={patient.PatientID} value={patient.PatientID}>
                                    {patient.LastName}, {patient.FirstName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>
                            <BiUser size={16} />
                            Assigned Provider *
                        </label>
                        <select
                            value={formData.assigned_provider_id}
                            onChange={(e) => handleChange('assigned_provider_id', e.target.value)}
                            disabled={!!prefillData?.assigned_provider_id}
                            className={styles.select}
                        >
                            <option value="" disabled hidden >Select provider...</option>
                            <option value="none">No Assigned Yet</option>
                            {providers.map((provider) => (
                                <option key={provider.id} value={provider.id}>
                                    {provider.last_name}, {provider.first_name} ({provider.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Consultation Type *</label>
                            <select
                                value={formData.consultation_type}
                                onChange={(e) => handleChange('consultation_type', e.target.value)}
                                required
                                disabled={!!prefillData?.consultation_type}
                                className={styles.select}
                            >
                                {CONSULTATION_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Nature of Visit *</label>
                            <select
                                value={formData.nature_of_visit}
                                onChange={(e) => handleChange('nature_of_visit', e.target.value)}
                                required
                                disabled={!!prefillData?.nature_of_visit}
                                className={styles.select}
                            >
                                {NATURE_OF_VISIT.map((nature) => (
                                    <option key={nature.value} value={nature.value}>
                                        {nature.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Mode of Transaction *</label>
                        <select
                            value={formData.mode_of_transaction}
                            onChange={(e) => handleChange('mode_of_transaction', e.target.value)}
                            required
                            className={styles.select}
                        >
                            <option value="" disabled hidden >Select mode of transaction</option>
                            {MODE_OF_TRANSACTION.map((transaction) => (
                                    <option key={transaction.value} value={transaction.value}>
                                        {transaction.label}
                                    </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Priority *</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                            required
                            disabled={!!prefillData?.priority}
                            className={styles.select}
                        >
                            {PRIORITIES.map((priority) => (
                                <option key={priority.value} value={priority.value}>
                                    {priority.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                value={formData.height || ''}
                                onChange={(e) => handleChange('height', e.target.value)}
                                className={styles.input}
                                min="0"
                                step="0.1"
                                placeholder="Enter height"
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                value={formData.weight || ''}
                                onChange={(e) => handleChange('weight', e.target.value)}
                                className={styles.input}
                                min="0"
                                step="0.1"
                                placeholder="Enter weight"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Waist (circumference)</label>
                        <input
                            type="number"
                            value={formData.waist || ''}
                            onChange={(e) => handleChange('waist', e.target.value)}
                            className={styles.input}
                            min="0"
                            step="0.1"
                            placeholder="Enter waist size"
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Chief Complaint</label>
                        <textarea
                            value={formData.chief_complaint}
                            onChange={(e) => handleChange('chief_complaint', e.target.value)}
                            rows={3}
                            placeholder="Describe the reason for visit..."
                            disabled={!!prefillData?.chief_complaint}
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Patient Consent *</label>
                        <div className={styles.radioRow}>
                            <label>
                            <input
                                type="radio"
                                name="patient_consent"
                                value="yes"
                                checked={formData.patient_consent === 'yes'}
                                onChange={(e) => handleChange('patient_consent', e.target.value)}
                            />
                                Yes
                            </label>
                            <label>
                            <input
                                type="radio"
                                name="patient_consent"
                                value="no"
                                checked={formData.patient_consent === 'no'}
                                onChange={(e) => handleChange('patient_consent', e.target.value)}
                            />
                                No
                            </label>
                        </div>
                    </div>

                    {formData.patient_consent === 'yes' && (
                        <ConsentForm patient="Anthony" />
                    )}

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelBtn}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add to Queue'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddWalkInModal;