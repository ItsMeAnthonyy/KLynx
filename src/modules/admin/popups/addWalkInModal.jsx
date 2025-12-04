import React, { useState, useEffect, useMemo } from 'react';
import { BiX, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { useToast } from '../../../hooks/use-toast';
import { getPatients, getProviders } from '../api/patientAppointmentApi';
import { createVisitShell, addToQueue } from '../api/queueManagementApi';
import { saveVitalSigns } from '../api/vitalSignsApi';
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

// Auto-compute BP Assessment based on systolic/diastolic
const computeBPAssessment = (systolic, diastolic) => {
    if (!systolic || !diastolic) return '';
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    if (sys < 90 || dia < 60) return 'Hypotension';
    if (sys < 120 && dia < 80) return 'Normal';
    if (sys >= 120 && sys <= 129 && dia < 80) return 'Elevated';
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) return 'High Blood Pressure Stage 1';
    if (sys >= 140 || dia >= 90) return 'High Blood Pressure Stage 2';
    if (sys > 180 || dia > 120) return 'Hypertensive Crisis';
    return 'Normal';
};

// Auto-compute Normal Rate based on heart rate
const computeNormalRate = (heartRate) => {
    if (!heartRate) return null;
    const hr = parseInt(heartRate);
    return hr >= 60 && hr <= 100;
};

// Auto-compute Regular Rhythm based on heart rate and pulse rate
const computeRegularRhythm = (heartRate, pulseRate) => {
    if (!heartRate || !pulseRate) return null;
    const hr = parseInt(heartRate);
    const pr = parseInt(pulseRate);
    return Math.abs(hr - pr) <= 5;
};

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
        mode_of_transaction: prefillData?.mode_of_transaction || 'walk_in',
        patient_consent: prefillData?.patient_consent || ''
    });

    const [vitalSigns, setVitalSigns] = useState({
        bp_systolic: '',
        bp_diastolic: '',
        respiratory_rate: '',
        body_temp: '',
        heart_rate: '',
        pulse_rate: '',
        oxygen_saturation: '',
        time_taken: new Date().toISOString().slice(0, 16),
    });

    const [converters, setConverters] = useState({
        heightFt: '',
        heightIn: '',
        weightLbs: '',
        showHeightConverter: false,
        showWeightConverter: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Auto-computed values
    const bpAssessment = useMemo(() => 
        computeBPAssessment(vitalSigns.bp_systolic, vitalSigns.bp_diastolic), 
        [vitalSigns.bp_systolic, vitalSigns.bp_diastolic]
    );

    const normalRate = useMemo(() => 
        computeNormalRate(vitalSigns.heart_rate), 
        [vitalSigns.heart_rate]
    );

    const regularRhythm = useMemo(() => 
        computeRegularRhythm(vitalSigns.heart_rate, vitalSigns.pulse_rate), 
        [vitalSigns.heart_rate, vitalSigns.pulse_rate]
    );

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

    const convertFeetToCm = () => {
        const feet = parseFloat(converters.heightFt) || 0;
        const inches = parseFloat(converters.heightIn) || 0;
        const totalInches = (feet * 12) + inches;
        const cm = Math.round(totalInches * 2.54);
        setFormData(prev => ({ ...prev, height: cm.toString() }));
        setConverters(prev => ({ ...prev, showHeightConverter: false }));
    };

    const convertLbsToKg = () => {
        const lbs = parseFloat(converters.weightLbs) || 0;
        const kg = (lbs * 0.453592).toFixed(1);
        setFormData(prev => ({ ...prev, weight: kg }));
        setConverters(prev => ({ ...prev, showWeightConverter: false }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.patient_id) newErrors.patient_id = 'Patient is required';
        if (!formData.assigned_provider_id) newErrors.assigned_provider_id = 'Provider is required';
        if (!formData.chief_complaint?.trim()) newErrors.chief_complaint = 'Chief complaint is required';
        if (!formData.height) newErrors.height = 'Required';
        if (!formData.weight) newErrors.weight = 'Required';
        
        // Vital signs validation
        if (!vitalSigns.bp_systolic) newErrors.bp_systolic = 'Required';
        if (!vitalSigns.bp_diastolic) newErrors.bp_diastolic = 'Required';
        if (!vitalSigns.respiratory_rate) newErrors.respiratory_rate = 'Required';
        if (!vitalSigns.body_temp) newErrors.body_temp = 'Required';
        if (!vitalSigns.heart_rate) newErrors.heart_rate = 'Required';
        if (!vitalSigns.pulse_rate) newErrors.pulse_rate = 'Required';
        if (!vitalSigns.oxygen_saturation) newErrors.oxygen_saturation = 'Required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        setLoading(true);

        const assignedProviderId =
            formData.assigned_provider_id === "none" || !formData.assigned_provider_id
                ? null
                : formData.assigned_provider_id;

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
            
            await saveVitalSigns({
                visit_id: Number(visit),
                patient_id: formData.patient_id,
                bp_systolic: parseInt(vitalSigns.bp_systolic) || null,
                bp_diastolic: parseInt(vitalSigns.bp_diastolic) || null,
                respiratory_rate: parseInt(vitalSigns.respiratory_rate) || null,
                body_temp: parseFloat(vitalSigns.body_temp) || null,
                heart_rate: parseInt(vitalSigns.heart_rate) || null,
                pulse_rate: parseInt(vitalSigns.pulse_rate) || null,
                oxygen_saturation: parseInt(vitalSigns.oxygen_saturation) || null,
                time_taken: vitalSigns.time_taken || null,
                // normal_rate: normalRate,
                // regular_rhythm: regularRhythm,
                // bp_measurement_assessment: bpAssessment || null,
                administered_by: currentUserId
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
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleVitalChange = (field, value) => {
        let formattedValue = value;
        // If the field is time_taken, convert to MySQL DATETIME format
        if (field === "time_taken") {
            // Add seconds and replace T with space
            formattedValue = value.replace("T", " ") + ":00";
        }

        setVitalSigns(prev => ({
            ...prev,
            [field]: formattedValue // <-- use formattedValue here
        }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
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

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <BiUser size={18} />
                            Patient Information
                        </h3>

                        <div className={styles.field}>
                            <label>Patient <span className={styles.required}>*</span></label>
                            <select
                                value={formData.patient_id}
                                onChange={(e) => handleChange('patient_id', e.target.value)}
                                required
                                disabled={!!prefillData?.patient_id}
                                className={`${styles.select} ${errors.patient_id ? styles.inputError : ''}`}
                            >
                                <option value="" disabled hidden >Select patient...</option>
                                {patients.map((patient) => (
                                    <option key={patient.PatientID} value={patient.PatientID}>
                                        {patient.LastName}, {patient.FirstName}
                                    </option>
                                ))}
                            </select>
                        {errors.patient_id && <span className={styles.errorText}>{errors.patient_id}</span>}
                        </div>
                        
                        <div className={styles.field}>
                            <label>Assigned Provider <span className={styles.required}>*</span></label>
                            <select
                                value={formData.assigned_provider_id}
                                onChange={(e) => handleChange('assigned_provider_id', e.target.value)}
                                disabled={!!prefillData?.assigned_provider_id}
                                className={`${styles.select} ${errors.assigned_provider_id ? styles.inputError : ''}`}
                            >
                                <option value="" disabled hidden >Select provider...</option>
                                <option value="none">No Assigned Yet</option>
                                {providers.map((provider) => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.last_name}, {provider.first_name} ({provider.role})
                                    </option>
                                ))}
                            </select>
                            {errors.assigned_provider_id && <span className={styles.errorText}>{errors.assigned_provider_id}</span>}
                        </div>
                        
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Consultation Type <span className={styles.required}>*</span></label>
                                <select
                                    value={formData.consultation_type}
                                    onChange={(e) => handleChange('consultation_type', e.target.value)}
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
                                <label>Nature of Visit <span className={styles.required}>*</span></label>
                                <select
                                    value={formData.nature_of_visit}
                                    onChange={(e) => handleChange('nature_of_visit', e.target.value)}
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
                            <label>Mode of Transaction <span className={styles.required}>*</span></label>
                            <select
                                value={formData.mode_of_transaction}
                                onChange={(e) => handleChange('mode_of_transaction', e.target.value)}
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
                            <label>Priority <span className={styles.required}>*</span></label>
                            <select
                                value={formData.priority}
                                onChange={(e) => handleChange('priority', e.target.value)}
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

                        <div className={styles.field}>
                            <label>Chief Complaint <span className={styles.required}>*</span></label>
                            <textarea
                                value={formData.chief_complaint}
                                onChange={(e) => handleChange('chief_complaint', e.target.value)}
                                rows={2}
                                placeholder="Describe the reason for visit..."
                                disabled={!!prefillData?.chief_complaint}
                                className={`${styles.textarea} ${errors.chief_complaint ? styles.inputError : ''}`}
                            />
                            {errors.chief_complaint && <span className={styles.errorText}>{errors.chief_complaint}</span>}
                        </div>
                    </div>

                    {/* Patient Measurements Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <BiRuler size={18} />
                            Patient Measurements
                        </h3>

                        <div className={styles.fieldRow}>
                            {/* Height with Converter */}
                            <div className={styles.vitalGroup}>
                                <label className={styles.vitalLabel}>
                                    <BiRuler size={16} />
                                    Height <span className={styles.required}>*</span>
                                    <button 
                                        type="button" 
                                        className={styles.converterBtn}
                                        onClick={() => setConverters(prev => ({ ...prev, showHeightConverter: !prev.showHeightConverter }))}
                                        title="Convert from feet/inches"
                                    >
                                        <BiTransfer size={14} />
                                    </button>
                                </label>
                                {converters.showHeightConverter ? (
                                    <div className={styles.converterBox}>
                                        <div className={styles.converterInputs}>
                                            <input
                                                type="number"
                                                value={converters.heightFt}
                                                onChange={(e) => setConverters(prev => ({ ...prev, heightFt: e.target.value }))}
                                                placeholder="Feet"
                                                className={styles.converterInput}
                                                min="0"
                                                max="8"
                                            />
                                            <span>ft</span>
                                            <input
                                                type="number"
                                                value={converters.heightIn}
                                                onChange={(e) => setConverters(prev => ({ ...prev, heightIn: e.target.value }))}
                                                placeholder="Inches"
                                                className={styles.converterInput}
                                                min="0"
                                                max="11"
                                            />
                                            <span>in</span>
                                            <button type="button" onClick={convertFeetToCm} className={styles.convertBtn}>
                                                Convert
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.inputWithUnit}>
                                        <input
                                            type="number"
                                            value={formData.height}
                                            onChange={(e) => handleChange('height', e.target.value)}
                                            placeholder="170"
                                            className={`${styles.input} ${errors.height ? styles.inputError : ''}`}
                                            min="30"
                                            max="250"
                                        />
                                        <span className={styles.unit}>cm</span>
                                    </div>
                                )}
                                {errors.height && <span className={styles.errorText}>{errors.height}</span>}
                            </div>

                            {/* Weight with Converter */}
                            <div className={styles.vitalGroup}>
                                <label className={styles.vitalLabel}>
                                    <BiTrip size={16} />
                                    Weight <span className={styles.required}>*</span>
                                    <button 
                                        type="button" 
                                        className={styles.converterBtn}
                                        onClick={() => setConverters(prev => ({ ...prev, showWeightConverter: !prev.showWeightConverter }))}
                                        title="Convert from pounds"
                                    >
                                        <BiTransfer size={14} />
                                    </button>
                                </label>
                                {converters.showWeightConverter ? (
                                    <div className={styles.converterBox}>
                                        <div className={styles.converterInputs}>
                                            <input
                                                type="number"
                                                value={converters.weightLbs}
                                                onChange={(e) => setConverters(prev => ({ ...prev, weightLbs: e.target.value }))}
                                                placeholder="Pounds"
                                                className={styles.converterInput}
                                                min="0"
                                                max="1000"
                                            />
                                            <span>lbs</span>
                                            <button type="button" onClick={convertLbsToKg} className={styles.convertBtn}>
                                                Convert
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.inputWithUnit}>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.weight}
                                            onChange={(e) => handleChange('weight', e.target.value)}
                                            placeholder="70"
                                            className={`${styles.input} ${errors.weight ? styles.inputError : ''}`}
                                            min="1"
                                            max="500"
                                        />
                                        <span className={styles.unit}>kg</span>
                                    </div>
                                )}
                                {errors.weight && <span className={styles.errorText}>{errors.weight}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Vital Signs Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <BiPulse size={18} />
                            Vital Signs
                        </h3>

                        {/* Blood Pressure */}
                        <div className={styles.vitalGroup}>
                            <label className={styles.vitalLabel}>
                                <BiHeart size={16} />
                                Blood Pressure <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.bpRow}>
                                <div className={styles.bpField}>
                                    <input
                                        type="number"
                                        value={vitalSigns.bp_systolic}
                                        onChange={(e) => handleVitalChange('bp_systolic', e.target.value)}
                                        placeholder="Systolic"
                                        className={`${styles.input} ${errors.bp_systolic ? styles.inputError : ''}`}
                                        min="50"
                                        max="250"
                                    />
                                    <span className={styles.unit}>mmHg</span>
                                </div>
                                <span className={styles.bpDivider}>/</span>
                                <div className={styles.bpField}>
                                    <input
                                        type="number"
                                        value={vitalSigns.bp_diastolic}
                                        onChange={(e) => handleVitalChange('bp_diastolic', e.target.value)}
                                        placeholder="Diastolic"
                                        className={`${styles.input} ${errors.bp_diastolic ? styles.inputError : ''}`}
                                        min="30"
                                        max="150"
                                    />
                                    <span className={styles.unit}>mmHg</span>
                                </div>
                            </div>
                            {bpAssessment && (
                                <div className={`${styles.autoComputed} ${bpAssessment === 'Normal' ? styles.normal : bpAssessment.includes('Crisis') ? styles.critical : styles.warning}`}>
                                    Assessment: {bpAssessment}
                                </div>
                            )}
                        </div>

                        {/* Temperature & Respiratory */}
                        <div className={styles.fieldRow}>
                            <div className={styles.vitalGroup}>
                                <label className={styles.vitalLabel}>
                                    <BiTrendingUp size={16} />
                                    Body Temp <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={vitalSigns.body_temp}
                                        onChange={(e) => handleVitalChange('body_temp', e.target.value)}
                                        placeholder="36.5"
                                        className={`${styles.input} ${errors.body_temp ? styles.inputError : ''}`}
                                        min="30"
                                        max="45"
                                    />
                                    <span className={styles.unit}>°C</span>
                                </div>
                            </div>

                            <div className={styles.vitalGroup}>
                                <label className={styles.vitalLabel}>
                                    <BiWind size={16} />
                                    Respiratory Rate <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        value={vitalSigns.respiratory_rate}
                                        onChange={(e) => handleVitalChange('respiratory_rate', e.target.value)}
                                        placeholder="16"
                                        className={`${styles.input} ${errors.respiratory_rate ? styles.inputError : ''}`}
                                        min="5"
                                        max="60"
                                    />
                                    <span className={styles.unit}>bpm</span>
                                </div>
                            </div>
                        </div>

                        {/* Heart Rate & Pulse */}
                        <div className={styles.fieldRow}>
                            <div className={styles.vitalGroup}>
                                <label className={styles.vitalLabel}>
                                    <BiHeart size={16} />
                                    Heart Rate <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        value={vitalSigns.heart_rate}
                                        onChange={(e) => handleVitalChange('heart_rate', e.target.value)}
                                        placeholder="72"
                                        className={`${styles.input} ${errors.heart_rate ? styles.inputError : ''}`}
                                        min="30"
                                        max="220"
                                    />
                                    <span className={styles.unit}>bpm</span>
                                </div>
                                {normalRate !== null && (
                                    <div className={`${styles.autoComputedSmall} ${normalRate ? styles.normal : styles.warning}`}>
                                        {normalRate ? '✓ Normal' : '⚠ Abnormal'}
                                    </div>
                                )}
                            </div>

                            <div className={styles.vitalGroup}>
                                <label className={styles.vitalLabel}>
                                    <BiTrip size={16} />
                                    Pulse Rate <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        value={vitalSigns.pulse_rate}
                                        onChange={(e) => handleVitalChange('pulse_rate', e.target.value)}
                                        placeholder="72"
                                        className={`${styles.input} ${errors.pulse_rate ? styles.inputError : ''}`}
                                        min="30"
                                        max="220"
                                    />
                                    <span className={styles.unit}>bpm</span>
                                </div>
                                {regularRhythm !== null && (
                                    <div className={`${styles.autoComputedSmall} ${regularRhythm ? styles.normal : styles.warning}`}>
                                        {regularRhythm ? '✓ Regular' : '⚠ Irregular'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Oxygen & Time */}
                        <div className={styles.fieldRow}>
                            <div className={styles.vitalGroup}>
                                <label className={styles.vitalLabel}>
                                    <BiDroplet size={16} />
                                    O₂ Saturation <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        value={vitalSigns.oxygen_saturation}
                                        onChange={(e) => handleVitalChange('oxygen_saturation', e.target.value)}
                                        placeholder="98"
                                        className={`${styles.input} ${errors.oxygen_saturation ? styles.inputError : ''}`}
                                        min="50"
                                        max="100"
                                    />
                                    <span className={styles.unit}>%</span>
                                </div>
                            </div>

                            <div className={styles.vitalGroup}>
                                <label className={styles.vitalLabel}>
                                    <BiTime size={16} />
                                    Time Taken
                                </label>
                                <input
                                    type="datetime-local"
                                    value={vitalSigns.time_taken}
                                    onChange={(e) => handleVitalChange('time_taken', e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>

                

                    <div className={styles.field}>
                        <label>Patient Consent <span className={styles.required}>*</span></label>
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
                            {loading ? 'Adding to Queue...' : 'Add to Queue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWalkInModal;