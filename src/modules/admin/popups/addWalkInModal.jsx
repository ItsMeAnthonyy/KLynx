import React, { useState, useEffect } from 'react';
import { BiX, BiUser, BiCalendar, BiErrorCircle } from "react-icons/bi";
import { useToast } from '../../../hooks/use-toast';
import { getPatients, getProviders } from '../api/patientAppointmentApi';
import { /*createVisitShel,*/ addToQueue } from '../api/queueManagementApi';
import styles from './addWalkInModal.module.css';

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

const AddWalkInModal = ({ onClose, onSuccess, currentUserId, prefillData = null }) => {
    const [patients, setPatients] = useState([]);
    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: prefillData?.patient_id || '',
        assigned_provider_id: prefillData?.assigned_provider_id || '',
        consultation_type: prefillData?.consultation_type || 'general',
        priority: prefillData?.priority || 'routine',
        chief_complaint: prefillData?.chief_complaint || ''
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

        if (!formData.patient_id || !formData.assigned_provider_id) {
            toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {

            // Add to queue
            await addToQueue({
                patient_id: formData.patient_id,
                assigned_provider_id: formData.assigned_provider_id,
                visit_id: 12345,
                consultation_type: formData.consultation_type,
                priority: formData.priority,
                queued_by: currentUserId,
                status: 'waiting'
            });
            toast({ title: 'Patient added to queue successfully', className: "toast-success" });
            
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
                            <option value="">Select patient...</option>
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
                            required
                            disabled={!!prefillData?.assigned_provider_id}
                            className={styles.select}
                        >
                            <option value="">Select provider...</option>
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