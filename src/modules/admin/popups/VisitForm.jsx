import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from '../../../hooks/use-toast';
import ConsentForm from './VisitConsentForm';
import styles from './VisitForm.module.css';
import { createPatientVisitData } from '../api/visitApi';

const natureOfVisitOptions = [
  { value: 'routine', label: 'Routine Checkup' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'new-symptoms', label: 'New Symptoms' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'referral', label: 'Referral' },
];

const consultationTypeOptions = [
  { value: 'general', label: 'General' },
  { value: 'prenatal', label: 'Prenatal' },
  { value: 'immunization', label: 'Immunization' },
];

const transactionModeOptions = [
  { value: 'walk-in', label: 'Walk-In' },
];

const VisitForm = ({ onSuccess, onCancel, patient }) => {
  const [formData, setFormData] = useState({
    natureOfVisit: '',
    typeOfConsultation: '',
    consultationDate: '',
    consultationTime: '',
    ageYears: '',
    ageMonths: '',
    ageDays: '',
    transactionMode: '',
    weight: '',
    height: '',
    waistCircumference: '',
    bmi: '',
    bmiCategory: '',
    attendingProvider: '',
    chiefComplaint: '',
    patientConsent: '',
    patientId: patient.PatientID,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConsentForm, setShowConsentForm] = useState(false);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (weight > 0 && height > 0) {
      // BMI = weight (kg) / (height (m))^2
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const bmiValue = bmi.toFixed(1);

      let category = '';
      if (bmi < 18.5) {
        category = 'Underweight';
      } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
      } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
      } else {
        category = 'Obese';
      }

      setFormData((prev) => ({
        ...prev,
        bmi: bmiValue,
        bmiCategory: category,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        bmi: '',
        bmiCategory: '',
      }));
    }
  }, [formData.weight, formData.height]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsentChange = (value) => {
    setFormData((prev) => ({ ...prev, patientConsent: value }));
    setShowConsentForm(value === 'yes');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.natureOfVisit ||
      !formData.typeOfConsultation ||
      !formData.consultationDate ||
      !formData.consultationTime ||
      !formData.attendingProvider ||
      !formData.chiefComplaint ||
      !formData.patientConsent
    ) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    console.log({formData, patientId: patient.PatientID});

    try {
      // Simulate API call
      await createPatientVisitData(formData);

      toast({
        title: 'Success!',
        description: 'Visit has been recorded successfully',
        className: 'toast-success',
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record visit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="natureOfVisit" className={styles.label}>
            Nature of Visit <span className={styles.required}>*</span>
          </label>
          <Select
            inputId="natureOfVisit"
            name="natureOfVisit"
            options={natureOfVisitOptions}
            value={natureOfVisitOptions.find((opt) => opt.value === formData.natureOfVisit)}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, natureOfVisit: selected?.value || '' }))
            }
            placeholder="Select nature of visit"
            className={styles.reactSelect}
            classNamePrefix="react-select"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="typeOfConsultation" className={styles.label}>
            Type of Consultation <span className={styles.required}>*</span>
          </label>
          <Select
            inputId="typeOfConsultation"
            name="typeOfConsultation"
            options={consultationTypeOptions}
            value={consultationTypeOptions.find((opt) => opt.value === formData.typeOfConsultation)}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, typeOfConsultation: selected?.value || '' }))
            }
            placeholder="Select consultation type"
            className={styles.reactSelect}
            classNamePrefix="react-select"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="consultationDate" className={styles.label}>
            Consultation Date <span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            id="consultationDate"
            name="consultationDate"
            className={styles.input}
            value={formData.consultationDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="consultationTime" className={styles.label}>
            Consultation Time <span className={styles.required}>*</span>
          </label>
          <input
            type="time"
            id="consultationTime"
            name="consultationTime"
            className={styles.input}
            value={formData.consultationTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.ageGroup}>
        <label className={styles.label}>Patient Age</label>
        <div className={styles.ageInputs}>
          <div className={styles.ageField}>
            <input
              type="number"
              name="ageYears"
              className={styles.input}
              value={formData.ageYears}
              onChange={handleChange}
              placeholder="Years"
              min="0"
            />
            <span className={styles.ageLabel}>Years</span>
          </div>
          <div className={styles.ageField}>
            <input
              type="number"
              name="ageMonths"
              className={styles.input}
              value={formData.ageMonths}
              onChange={handleChange}
              placeholder="Months"
              min="0"
              max="11"
            />
            <span className={styles.ageLabel}>Months</span>
          </div>
          <div className={styles.ageField}>
            <input
              type="number"
              name="ageDays"
              className={styles.input}
              value={formData.ageDays}
              onChange={handleChange}
              placeholder="Days"
              min="0"
              max="30"
            />
            <span className={styles.ageLabel}>Days</span>
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="transactionMode" className={styles.label}>
          Mode of Transaction
        </label>
        <Select
          inputId="transactionMode"
          name="transactionMode"
          options={transactionModeOptions}
          value={transactionModeOptions.find((opt) => opt.value === formData.transactionMode)}
          onChange={(selected) =>
            setFormData((prev) => ({ ...prev, transactionMode: selected?.value || '' }))
          }
          placeholder="Select transaction mode"
          className={styles.reactSelect}
          classNamePrefix="react-select"
        />
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="weight" className={styles.label}>
            Patient Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            className={styles.input}
            value={formData.weight}
            onChange={handleChange}
            placeholder="0.0"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="height" className={styles.label}>
            Patient Height (cm)
          </label>
          <input
            type="number"
            id="height"
            name="height"
            className={styles.input}
            value={formData.height}
            onChange={handleChange}
            placeholder="0.0"
            step="0.1"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="waistCircumference" className={styles.label}>
            Waist Circumference (cm)
          </label>
          <input
            type="number"
            id="waistCircumference"
            name="waistCircumference"
            className={styles.input}
            value={formData.waistCircumference}
            onChange={handleChange}
            placeholder="0.0"
            step="0.1"
            min="0"
          />
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="bmi" className={styles.label}>
            Body Mass Index (BMI)
          </label>
          <input
            type="text"
            id="bmi"
            name="bmi"
            className={styles.input}
            value={formData.bmi}
            readOnly
            placeholder="Auto-calculated"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bmiCategory" className={styles.label}>
            BMI Category
          </label>
          <input
            type="text"
            id="bmiCategory"
            name="bmiCategory"
            className={styles.input}
            value={formData.bmiCategory}
            readOnly
            placeholder="Auto-calculated"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="attendingProvider" className={styles.label}>
          Name of Attending Provider <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="attendingProvider"
          name="attendingProvider"
          className={styles.input}
          value={formData.attendingProvider}
          onChange={handleChange}
          placeholder="Dr. John Doe"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="chiefComplaint" className={styles.label}>
          Chief Complaint <span className={styles.required}>*</span>
        </label>
        <textarea
          id="chiefComplaint"
          name="chiefComplaint"
          className={styles.textarea}
          value={formData.chiefComplaint}
          onChange={handleChange}
          placeholder="Describe the patient's main concern..."
          rows={4}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Patient Consent <span className={styles.required}>*</span>
        </label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="patientConsent"
              value="yes"
              checked={formData.patientConsent === 'yes'}
              onChange={(e) => handleConsentChange(e.target.value)}
              className={styles.radio}
            />
            <span>Yes</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="patientConsent"
              value="no"
              checked={formData.patientConsent === 'no'}
              onChange={(e) => handleConsentChange(e.target.value)}
              className={styles.radio}
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {showConsentForm && <ConsentForm patient={patient} />}

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnCancel}`}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Recording...' : 'Record Visit'}
        </button>
      </div>
    </form>
  );
};

export default VisitForm;
