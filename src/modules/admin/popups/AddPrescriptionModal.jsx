import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { getProviders } from '../api/patientAppointmentApi';
// import { createPrescription, updatePrescription } from '@/services/prescriptionService';
import { useToast } from '../../../hooks/use-toast';
import MedicineSearchModal from './MedicineSearchModal';
import styles from './PrescriptionModals.module.css';
import axios from 'axios';


const DOSE_REGIMEN_OPTIONS = [
  { value: '2x_day_12hrs', label: '2x a day - every 12 hours' },
  { value: '3x_day_8hrs', label: '3x a day - every 8 hours' },
  { value: '4x_day_6hrs', label: '4x a day - every 6 hours' },
  { value: 'bedtime', label: 'Every bedtime' },
  { value: 'every_other_day', label: 'Every other day' },
  { value: 'once_daily', label: 'Once a day' },
  { value: 'others', label: 'Others' }
];

const INTENDED_PURPOSE_OPTIONS = [
  { value: '', label: 'Select purpose (optional)' },
  { value: 'pain_relief', label: 'Pain Relief' },
  { value: 'infection', label: 'Infection Treatment' },
  { value: 'inflammation', label: 'Anti-inflammatory' },
  { value: 'fever', label: 'Fever Reduction' },
  { value: 'blood_pressure', label: 'Blood Pressure Management' },
  { value: 'diabetes', label: 'Diabetes Management' },
  { value: 'allergy', label: 'Allergy Relief' },
  { value: 'vitamin', label: 'Vitamin/Supplement' },
  { value: 'other', label: 'Other' }
];

const QUANTITY_UNITS = [
  { value: '', label: 'Select unit' },
  { value: 'tablets', label: 'Tablets' },
  { value: 'capsules', label: 'Capsules' },
  { value: 'ml', label: 'mL (for syrup)' },
  { value: 'bottles', label: 'Bottles' },
  { value: 'sachets', label: 'Sachets' },
  { value: 'pieces', label: 'Pieces' }
];

const initialFormState = {
  medicine_id: '',
  medicine_name: '',
  drug_code: '',
  dosage_strength: '',
  dosage_intake: '',
  dose_regimen: '',
  dose_regimen_other: '',
  total_quantity: '',
  quantity_unit: '',
  intended_purpose: '',
  medication_notes: '',
  prescribed_by: ''
};

export default function AddPrescriptionModal({ isOpen, onClose, onSaved, visitId, fetchPrescriptions, existingPrescription }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [providers, setProviders] = useState([]);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
      if (existingPrescription) {
        setFormData({
          medicine_id: existingPrescription.medicine_id || '',
          medicine_name: existingPrescription.medicine_name || '',
          drug_code: existingPrescription.drug_code || '',
          dosage_strength: existingPrescription.dosage_strength || '',
          dosage_intake: existingPrescription.dosage_intake || '',
          dose_regimen: existingPrescription.dose_regimen || '',
          dose_regimen_other: existingPrescription.dose_regimen_other || '',
          total_quantity: existingPrescription.total_quantity || '',
          quantity_unit: existingPrescription.quantity_unit || '',
          intended_purpose: existingPrescription.intended_purpose || '',
          medication_notes: existingPrescription.medication_notes || '',
          prescribed_by: existingPrescription.prescribed_by || ''
        });
      } else {
        setFormData({
          ...initialFormState,
          prescribed_by: user?.id || ''
        });
      }
    }
  }, [isOpen, user, existingPrescription]);

  const fetchProviders = async () => {
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicineSelect = (medicine) => {
    setFormData(prev => ({
      ...prev,
      medicine_id: medicine.id,
      medicine_name: medicine.generic_name,
      drug_code: medicine.drug_code,
      dosage_strength: medicine.strength || ''
    }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.medicine_name || !formData.dosage_strength || !formData.dose_regimen || !formData.prescribed_by) {
        toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
        });
        return;
    }

    setSaving(true);

    const prescriptionData = {
        visit_id: visitId,
        medicine_id: formData.medicine_id || null,
        medicine_name: formData.medicine_name,
        drug_code: formData.drug_code || null,
        dosage_strength: formData.dosage_strength,
        dosage_intake: formData.dosage_intake || null,
        dose_regimen: formData.dose_regimen,
        dose_regimen_other: formData.dose_regimen_other || null,
        total_quantity: formData.total_quantity ? parseInt(formData.total_quantity) : null,
        quantity_unit: formData.quantity_unit || null,
        intended_purpose: formData.intended_purpose || null,
        medication_notes: formData.medication_notes || null,
        prescribed_by: formData.prescribed_by
    };

    try {
        if (existingPrescription) {
        // Update
        await axios.post('http://localhost/api/update_prescription.php', {
            id: existingPrescription.id,
            ...prescriptionData
        });
        toast({ title: 'Success', description: 'Prescription updated successfully' });
        } else {
        // Create
        await axios.post('http://localhost/api/create_prescription.php', prescriptionData);
        toast({ title: 'Success', description: 'Prescription added successfully' });
        }
        fetchPrescriptions()
        //onSaved();
        onClose();
    } catch (error) {
        console.error('Error saving prescription:', error);
        toast({
        title: 'Error',
        description: 'Failed to save prescription',
        variant: 'destructive',
        });
    } finally {
        setSaving(false);
    }
    };


  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>{existingPrescription ? 'Edit Prescription' : 'Add New Prescription'}</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.prescriptionForm}>
            <div className={styles.formField}>
              <label>Medicine *</label>
              <div className={styles.medicineInputGroup}>
                <input
                  type="text"
                  value={formData.medicine_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicine_name: e.target.value }))}
                  placeholder="Enter or search medicine name"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowMedicineSearch(true)}
                  className={styles.searchMedicineButton}
                >
                  <Search size={16} />
                  Search Commodity Medicine
                </button>
              </div>
              {formData.drug_code && (
                <span className={styles.drugCodeBadge}>Code: {formData.drug_code}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Dosage Strength *</label>
                <input
                  type="text"
                  name="dosage_strength"
                  value={formData.dosage_strength}
                  onChange={handleChange}
                  placeholder="e.g., 500 mg"
                  required
                />
              </div>
              <div className={styles.formField}>
                <label>Dosage Intake</label>
                <input
                  type="text"
                  name="dosage_intake"
                  value={formData.dosage_intake}
                  onChange={handleChange}
                  placeholder="e.g., 1 tablet"
                />
              </div>
            </div>

            <div className={styles.formField}>
              <label>Dose Regimen *</label>
              <select
                name="dose_regimen"
                value={formData.dose_regimen}
                onChange={handleChange}
                required
              >
                <option value="">Select dose regimen</option>
                {DOSE_REGIMEN_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {formData.dose_regimen === 'others' && (
                <input
                  type="text"
                  name="dose_regimen_other"
                  value={formData.dose_regimen_other}
                  onChange={handleChange}
                  placeholder="Specify dose regimen"
                  className={styles.otherInput}
                />
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Total Quantity</label>
                <input
                  type="number"
                  name="total_quantity"
                  value={formData.total_quantity}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  min="0"
                />
              </div>
              <div className={styles.formField}>
                <label>Unit of Measure</label>
                <select
                  name="quantity_unit"
                  value={formData.quantity_unit}
                  onChange={handleChange}
                >
                  {QUANTITY_UNITS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formField}>
              <label>Intended Purpose</label>
              <select
                name="intended_purpose"
                value={formData.intended_purpose}
                onChange={handleChange}
              >
                {INTENDED_PURPOSE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label>Medication Notes</label>
              <textarea
                name="medication_notes"
                value={formData.medication_notes}
                onChange={handleChange}
                placeholder="Additional notes about the medication..."
                rows="2"
              />
            </div>

            <div className={styles.formField}>
              <label>Prescribed By *</label>
              <select
                name="prescribed_by"
                value={formData.prescribed_by}
                onChange={handleChange}
                required
              >
                <option value="">Select provider</option>
                {providers.map(p => (
                  <option key={p.id} value={p.id}>{p.last_name}, {p.first_name} ({p.role})</option>
                ))}
              </select>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={saving}>
                {saving ? 'Saving...' : (existingPrescription ? 'Update Prescription' : 'Add Prescription')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MedicineSearchModal
        isOpen={showMedicineSearch}
        onClose={() => setShowMedicineSearch(false)}
        onSelect={handleMedicineSelect}
      />
    </>
  );
}
