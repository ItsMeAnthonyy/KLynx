import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BiX, BiTime, BiUser, BiCalendar, BiErrorCircle, BiCheckCircle } from "react-icons/bi";
//import { useToast } from '@/hooks/use-toast';
import { confirmAppointment, cancelAppointment/*, requestCancellation*/ } from '../api/patientAppointmentApi';
//import AddWalkInModal from '@/components/queue/AddWalkInModal';
import styles from './appointmentModal.module.css';

const STATUS_LABELS = {
    pending: 'Pending',
    scheduled: 'Scheduled',
    late: 'Late',
    completed: 'Completed',
    cancelled: 'Cancelled'
};

const STATUS_COLORS = {
    pending: '#F59E0B',
    scheduled: '#10B981',
    late: '#F97316',
    completed: '#6B7280',
    cancelled: '#EF4444'
};


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


const appointmentModal = ({ appointment, onClose, onUpdate, currentUserId, isAdmin }) => {
    console.log("RAW DATA: ", appointment);
    const [loading, setLoading] = useState(false);
    const [showCancelReason, setShowCancelReason] = useState(false);
    const [showQueueForm, setShowQueueForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [patients, setPatients] = useState([]);
    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: '',
        assigned_provider_id: '',
        consultation_type: 'general',
        priority: 'routine',
        chief_complaint: ''
    });
    //const { toast } = useToast();

    useEffect(() => {
        if (showQueueForm) {
        fetchData();
        setFormData({
            patient_id: appointment.patient_id,
            assigned_provider_id: appointment.assigned_provider_id,
            consultation_type: appointment.consultation_type || 'general',
            priority: appointment.priority || 'routine',
            chief_complaint: appointment.chief_complaint || ''
        });
        }
    }, [showQueueForm, appointment]);

    const fetchData = async () => {
        try {
            // const [patientsData, providersData] = await Promise.all([
            //     getPatients(),
            //     getProviders()
            // ]);
            // setPatients(patientsData);
            // setProviders(providersData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (!appointment) return null;

    const isTimeEligible = () => {
        const now = new Date();
        const scheduledTime = new Date(appointment.scheduled_time);
        return now >= scheduledTime;
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await confirmAppointment(appointment.id, currentUserId);
            //toast({ title: 'Appointment confirmed' });
            onUpdate();
            onClose();
        } catch (err) {
            //toast({ title: 'Error', description: err.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToQueue = () => {
        if (!isTimeEligible()) {
            const confirmed = window.confirm('Patient is early. Queue anyway?');
            if (!confirmed) return;
        }
        setShowQueueForm(true);
    };

    const handleQueueSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patient_id || !formData.assigned_provider_id) {
            //toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        setLoading(true);

        try {
            //onUpdate();
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
    }

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            // toast({ title: 'Error', description: 'Please provide a reason', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            if (isAdmin) {
                await cancelAppointment(appointment.id, currentUserId, cancelReason);
                //toast({ title: 'Appointment cancelled' });
                onUpdate();
                onClose();
            } else {
                await requestCancellation(appointment.id, cancelReason);
                // toast({ title: 'Cancellation requested' });
                onUpdate();
                onClose();
            }
        } catch (error) {
            // toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{showQueueForm ? 'Add to Queue' : 'Appointment Details'}</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <BiX size={24} />
                    </button>
                </div>

                {!showQueueForm ? (
                    <div className={styles.content}>
                        <div className={styles.statusBadge} style={{ backgroundColor: STATUS_COLORS[appointment.status] }}>
                            {STATUS_LABELS[appointment.status]}
                        </div>

                        <div className={styles.section}>
                            <div className={styles.field}>
                                <BiUser size={18} />
                                <div>
                                    <label>Patient</label>
                                    <p>{appointment.patient_first_name} {appointment.patient_last_name}</p>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <BiUser size={18} />
                                <div>
                                    <label>Provider</label>
                                    <p>
                                        {(appointment.provider_first_name + ' ' + appointment.provider_last_name) 
                                        || 'Unassigned'}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <BiCalendar size={18} />
                                <div>
                                    <label>Date & Time</label>
                                    <p>{format(new Date(appointment.scheduled_time), 'PPP p')}</p>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <BiTime size={18} />
                                <div>
                                    <label>Duration</label>
                                    <p>{appointment.visit_duration_minutes || 30} minutes</p>
                                </div>
                            </div>
                        </div>

                        {appointment.consultation_type && (
                            <div className={styles.section}>
                                <label>Consultation Type</label>
                                <p className={styles.consultationType}>{appointment.consultation_type.replace('_', ' ')}</p>
                            </div>
                        )}

                        {appointment.chief_complaint && (
                            <div className={styles.section}>
                                <label>Chief Complaint</label>
                                <p>{appointment.chief_complaint}</p>
                            </div>
                        )}

                        {/* {appointment.cancellation_requested_by_provider && (
                            <div className={styles.alert}>
                                <AlertCircle size={20} />
                                <div>
                                    <strong>Cancellation Requested</strong>
                                    <p>{appointment.cancellation_request_reason}</p>
                                </div>
                            </div>
                        )} */}

                        {!showCancelReason && (
                            <div className={styles.actions}>
                                {appointment.status === 'pending' && isAdmin && (
                                    <button onClick={handleConfirm} disabled={loading} className={styles.confirmBtn}>
                                        <BiCheckCircle size={18} />
                                        Confirm Appointment
                                    </button>
                                )}

                                {(appointment.status === 'scheduled' || appointment.status === 'late') && isAdmin && (
                                    <button 
                                        onClick={handleAddToQueue} 
                                        disabled={loading}
                                        className={styles.queueBtn}
                                    >
                                        Add to Queue
                                    </button>
                                )}

                                {(appointment.status === 'scheduled' || appointment.status === 'late') && (
                                    <button 
                                        onClick={() => setShowCancelReason(true)} 
                                        className={styles.cancelBtn}
                                    >
                                    {isAdmin ? 'Cancel Appointment' : 'Request Cancellation'}
                                    </button>
                                )}
                            </div>
                        )}

                        {showCancelReason && (
                            <div className={styles.cancelSection}>
                                <label>Reason for Cancellation</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Enter reason..."
                                    rows={3}
                                    className={styles.textarea}
                                />
                                <div className={styles.cancelActions}>
                                <button onClick={handleCancel} disabled={loading} className={styles.submitCancelBtn}>
                                    Submit
                                </button>
                                <button onClick={() => setShowCancelReason(false)} className={styles.cancelCancelBtn}>
                                    Cancel
                                </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleQueueSubmit} className={styles.queueForm}>
                        <div className={styles.infoBox}>
                            <BiCheckCircle size={18} />
                            <p>This will create a visit record and add the patient to the queue.</p>
                        </div>

                        <div className={styles.formField}>
                            <label>
                                <BiUser size={16} />
                                Patient *
                            </label>

                            <select
                                value={formData.patient_id}
                                onChange={(e) => handleFormChange('patient_id', e.target.value)}
                                required
                                className={styles.select}
                            >
                                <option value="">Select patient...</option>
                                {/* {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.full_name}
                                    </option>
                                ))} */}
                            </select>
                        </div>

                        <div className={styles.formField}>
                            <label>
                                <BiUser size={16} />
                                Assigned Provider *
                            </label>
                            <select
                                value={formData.assigned_provider_id}
                                onChange={(e) => handleFormChange('assigned_provider_id', e.target.value)}
                                required
                                className={styles.select}
                            >
                                <option value="">Select provider...</option>
                                {/* {providers.map((provider) => (
                                <option key={provider.id} value={provider.id}>
                                    {provider.full_name}
                                </option>
                                ))} */}
                            </select>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formField}>
                                <label>Consultation Type *</label>
                                <select
                                    value={formData.consultation_type}
                                    onChange={(e) => handleFormChange('consultation_type', e.target.value)}
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

                            <div className={styles.formField}>
                                <label>Priority *</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => handleFormChange('priority', e.target.value)}
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

                        <div className={styles.formField}>
                            <label>Chief Complaint</label>
                            <textarea
                                value={formData.chief_complaint}
                                onChange={(e) => handleFormChange('chief_complaint', e.target.value)}
                                rows={3}
                                placeholder="Describe the reason for visit..."
                                className={styles.textarea}
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={() => setShowQueueForm(false)}
                                className={styles.backBtn}
                                disabled={loading}
                            >
                                Back
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
                )}

            </div>
        </div>
    );
}

export default appointmentModal;