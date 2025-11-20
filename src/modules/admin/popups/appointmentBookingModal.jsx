import React, { useState, useEffect } from 'react';
import styles from './appointmentBookingModal.module.css';

import { BiX, BiUser, BiCalendar, BiTime, BiCheckCircle, BiErrorCircle } from "react-icons/bi";

import { getPatients, getProviders, createAppointment, /*updateAppointment*/ } from '../api/patientAppointmentApi';
import { format } from 'date-fns';
import useAuth from '../../../hooks/useAuth';

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


const appointmentBookingModal = ({ appointment, onClose, onSuccess, currentUserId }) => {
    const [patients, setPatients] = useState([]);
    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: '',
        assigned_provider_id: '',
        scheduled_time: '',
        consultation_type: 'general',
        priority: 'routine',
        chief_complaint: '',
        visit_duration_minutes: 30,
        status: 'scheduled'
    });
    const [availabilityCheck, setAvailabilityCheck] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [loading, setLoading] = useState(false);

    const { auth } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (appointment) {
            
            setFormData({
                patient_id: appointment.patient_id,
                assigned_provider_id: appointment.assigned_provider_id || '',
                scheduled_time: format(new Date(appointment.scheduled_time), "yyyy-MM-dd'T'HH:mm"),
                consultation_type: appointment.consultation_type || 'general',
                priority: appointment.priority || 'routine',
                chief_complaint: appointment.chief_complaint || '',
                visit_duration_minutes: appointment.visit_duration_minutes || 30,
                status: appointment.status
            });
        }
    }, [appointment]);

    // useEffect(() => {
    //     if (formData.assigned_provider_id && formData.scheduled_time) {
    //         checkAvailability();
    //     }
    // }, [formData.assigned_provider_id, formData.scheduled_time, formData.visit_duration_minutes]);

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
    };

    const checkAvailability = async () => {
        setCheckingAvailability(true);
        try {
            const result = await checkProviderAvailability(
                formData.assigned_provider_id,
                new Date(formData.scheduled_time).toISOString(),
                formData.visit_duration_minutes,
                appointment?.id
            );
            setAvailabilityCheck(result);
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailabilityCheck({ available: false, reason: 'Error checking availability' });
        } finally {
            setCheckingAvailability(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patient_id || !formData.assigned_provider_id || !formData.scheduled_time) {
            //toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        if (availabilityCheck && !availabilityCheck.available && !availabilityCheck.warning) {
            //toast({ title: 'Error', description: availabilityCheck.reason, variant: 'destructive' });
            return;
        }

        if (availabilityCheck?.warning) {
            if (!window.confirm(`${availabilityCheck.reason}\n\nDo you want to proceed anyway?`)) {
                return;
            }
        }
        setLoading(true);

        try {
            const localDate = new Date(formData.scheduled_time);
            const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

            const appointmentData = {
                ...formData,
                scheduled_time: utcDate.toISOString(),
                created_by: auth.userId,
                confirmed_by: formData.status === 'scheduled' ? currentUserId : null,
                confirmed_at: formData.status === 'scheduled' ? new Date().toISOString() : null
            };

            if (appointment) {
                await updateAppointment(appointment.id, appointmentData);
                //toast({ title: 'Appointment updated successfully' });
            } else {
                await createAppointment(appointmentData);
                //toast({ title: 'Appointment created successfully' });
            }

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
                    <h2>{appointment ? 'Edit Appointment' : 'New Appointment'}</h2>
    
                    <button onClick={onClose} className={styles.closeBtn}>
                        <BiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>
                            <BiUser size={16} />
                            Patient *
                        </label>
                        <select
                            value={formData.patient_id}
                            onChange={(e) => handleChange('patient_id', e.target.value)}
                            required
                            disabled={!!appointment}
                            className={styles.select}
                        >
                            <option value="" hidden>Select patient...</option>
                                {patients.map((patient) => (
                                <option key={patient.PatientID} value={patient.PatientID}>
                                    {patient.FirstName} {patient.LastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>
                            <BiUser size={16} />
                            Provider *
                        </label>
                        <select
                            value={formData.assigned_provider_id}
                            onChange={(e) => handleChange('assigned_provider_id', e.target.value)}
                            required
                            className={styles.select}
                        >
                            <option value="" hidden>Select provider...</option>
                            {providers.map((provider) => (
                                <option key={provider.id} value={provider.id}>
                                    {provider.first_name} {provider.last_name} ({provider.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>
                                <BiCalendar size={16} />
                                Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.scheduled_time}
                                onChange={(e) => handleChange('scheduled_time', e.target.value)}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>
                                <BiTime size={16} />
                                Duration (min) *
                            </label>
                            <input
                                type="number"
                                value={formData.visit_duration_minutes}
                                onChange={(e) => handleChange('visit_duration_minutes', parseInt(e.target.value))}
                                min="15"
                                max="120"
                                step="15"
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Consultation Type *</label>
                            <select
                                value={formData.consultation_type}
                                onChange={(e) => handleChange('consultation_type', e.target.value)}
                                required
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
                        <label>Status *</label>
                        <select
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            required
                            className={styles.select}
                        >
                            <option value="pending">Pending</option>
                            <option value="scheduled">Scheduled (Confirmed)</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Chief Complaint</label>
                        <textarea
                            value={formData.chief_complaint}
                            onChange={(e) => handleChange('chief_complaint', e.target.value)}
                            rows={3}
                            placeholder="Describe the reason for visit..."
                            className={styles.textarea}
                        />
                    </div>

                    {checkingAvailability && (
                        <div className={styles.checking}>
                            <BiTime size={18} className={styles.spin} />
                            Checking availability...
                        </div>
                    )}

                    {availabilityCheck && !checkingAvailability && (
                        <div className={availabilityCheck.available ? styles.availableAlert : styles.unavailableAlert}>
                            {availabilityCheck.available ? (
                                <>
                                    <BiCheckCircle size={20} />
                                    <div>
                                        <strong>Available</strong>
                                        {availabilityCheck.queuedCount > 0 && (
                                            <p>Provider currently has {availabilityCheck.queuedCount} patients in queue</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <BiErrorCircle size={20} />
                                    <div>
                                        <strong>{availabilityCheck.warning ? 'Warning' : 'Not Available'}</strong>
                                        <p>{availabilityCheck.reason}</p>
                                    </div>
                                </>
                            )}
                        </div>
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
                            //disabled={loading || (availabilityCheck && !availabilityCheck.available && !availabilityCheck.warning)}
                        >
                            {loading ? 'Saving...' : appointment ? 'Update Appointment' : 'Create Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default appointmentBookingModal;