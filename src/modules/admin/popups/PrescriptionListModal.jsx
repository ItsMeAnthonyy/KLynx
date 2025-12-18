import React, { useState, useEffect } from 'react';
//import { X, Plus, Download, Edit2, Trash2, Pill } from 'lucide-react';
import { BiX, BiPlus, BiDownload, BiPencil, BiTrash, BiCapsule } from "react-icons/bi";
import { getProviders } from '../api/patientAppointmentApi';
import AddPrescriptionModal from './AddPrescriptionModal';
import { getPrescriptionsByVisitId } from '../api/prescriptionApi'
import styles from './PrescriptionModals.module.css';

const DOSE_REGIMEN_LABELS = {
  '2x_day_12hrs': '2x a day - every 12 hours',
  '3x_day_8hrs': '3x a day - every 8 hours',
  '4x_day_6hrs': '4x a day - every 6 hours',
  'bedtime': 'Every bedtime',
  'every_other_day': 'Every other day',
  'once_daily': 'Once a day',
  'others': 'Others'
};

export default function PrescriptionListModal({ isOpen, onClose, visitId, onUpdate, prescritions, isReadOnly }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPrescription, setEditingPrescription] = useState(null);
    const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
      fetchPrescriptions();
    }
  }, [isOpen]);

  const fetchPrescriptions = async () => {
    console.log(visitId);
    const data = await getPrescriptionsByVisitId(visitId);
    setPrescriptions(data);
  };

  const fetchProviders = async () => {
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const getProviderName = (id) => {
    const provider = providers.find(p => p.id === id);
    return provider?.full_name || 'Unknown';
  };

  const handleAddPrescription = (prescription) => {
    const newPrescriptions = [...(prescriptions || []), { ...prescription, id: Date.now() }];
    onUpdate(newPrescriptions);
  };

  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setShowAddModal(true);
  };

  const handleUpdatePrescription = (updatedPrescription) => {
    const newPrescriptions = prescriptions.map(p => 
      p.id === editingPrescription.id ? { ...updatedPrescription, id: p.id } : p
    );
    setPrescriptions(newPrescriptions);
    onUpdate(newPrescriptions);
    setEditingPrescription(null);
  };

  const handleDeletePrescription = (id) => {
    const newPrescriptions = prescriptions.filter(p => p.id !== id);
    onUpdate(newPrescriptions);
  };

  const handleDownload = () => {
    const content = prescriptions?.map((p, idx) => {
      return `
PRESCRIPTION #${idx + 1}
------------------
Medicine: ${p.medicine_name} ${p.drug_code ? `(${p.drug_code})` : ''}
Dosage: ${p.dosage_strength}
Intake: ${p.dosage_intake || 'N/A'}
Regimen: ${DOSE_REGIMEN_LABELS[p.dose_regimen] || p.dose_regimen_other || 'N/A'}
Quantity: ${p.total_quantity || 'N/A'} ${p.quantity_unit || ''}
Purpose: ${p.intended_purpose || 'N/A'}
Notes: ${p.medication_notes || 'N/A'}
Prescribed by: ${getProviderName(p.prescribed_by)}
`;
    }).join('\n');

    const blob = new Blob([`PRESCRIPTION LIST\n==================\nDate: ${new Date().toLocaleDateString()}\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContainerLarge} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2><BiCapsule size={20} /> Prescription List</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <BiX size={20} />
            </button>
          </div>

          <div className={styles.listActions}>
            {!isReadOnly && (
              <button onClick={() => setShowAddModal(true)} className={styles.addButton}>
                <BiPlus size={16} /> Add New Prescription
              </button>
            )}
            {prescriptions?.length > 0 && (
              <button onClick={handleDownload} className={styles.downloadButton}>
                <BiDownload size={16} /> Download Prescription
              </button>
            )}
          </div>

          <div className={styles.prescriptionList}>
            {!prescriptions || prescriptions.length === 0 ? (
              <div className={styles.emptyState}>
                <BiCapsule size={48} className={styles.emptyIcon} />
                <p>No prescriptions added yet</p>
                {!isReadOnly && (
                  <button onClick={() => setShowAddModal(true)} className={styles.addButton}>
                    <BiPlus size={16} /> Add First Prescription
                  </button>
                )}
              </div>
            ) : (
              prescriptions.map((prescription, idx) => (
                <div key={prescription.id || idx} className={styles.prescriptionCard}>
                  <div className={styles.prescriptionHeader}>
                    <span className={styles.prescriptionNumber}>#{idx + 1}</span>
                    <h3>{prescription.medicine_name}</h3>
                    {prescription.drug_code && (
                      <span className={styles.drugCodeBadge}>{prescription.drug_code}</span>
                    )}
                    {!isReadOnly && (
                      <div className={styles.prescriptionActions}>
                        <button 
                          onClick={() => handleEditPrescription(prescription)}
                          className={styles.iconButton}
                          title="Edit"
                        >
                          <BiPencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeletePrescription(prescription.id)}
                          className={styles.iconButtonDanger}
                          title="Delete"
                        >
                          <BiTrash size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={styles.prescriptionDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Dosage:</span>
                      <span>{prescription.dosage_strength}</span>
                    </div>
                    {prescription.dosage_intake && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Intake:</span>
                        <span>{prescription.dosage_intake}</span>
                      </div>
                    )}
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Regimen:</span>
                      <span>
                        {DOSE_REGIMEN_LABELS[prescription.dose_regimen] || prescription.dose_regimen_other}
                      </span>
                    </div>
                    {prescription.total_quantity && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Quantity:</span>
                        <span>{prescription.total_quantity} {prescription.quantity_unit}</span>
                      </div>
                    )}
                    {prescription.intended_purpose && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Purpose:</span>
                        <span>{prescription.intended_purpose}</span>
                      </div>
                    )}
                    {prescription.medication_notes && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Notes:</span>
                        <span>{prescription.medication_notes}</span>
                      </div>
                    )}
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Prescribed by:</span>
                      <span>{getProviderName(prescription.prescribed_by)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddPrescriptionModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingPrescription(null); }}
        onSaved={editingPrescription ? handleUpdatePrescription : handleAddPrescription}
        visitId={visitId}
        fetchPrescriptions={fetchPrescriptions}
        existingPrescription={editingPrescription}
      />
    </>
  );
}
