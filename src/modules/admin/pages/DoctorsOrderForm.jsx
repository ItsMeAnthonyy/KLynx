
import { useState } from 'react';
import DoctorsOrderModal from '../../../modules/admin/popups/DoctorsOrderModal';

export default function DoctorsOrderForm({ visitId, activeTab, isReadOnly }) {
    const [formData, setFormData] = useState({
        laboratory_request: '',
        imaging: [],
        alert_type: [],
        alert_description: '',
        diagnosis: '',
        diagnosis_specify: '',
        icd10_a: '',
        icd10_b: '',
        icd10_c: '',
        treatment_plan: '',
        remarks: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    return(
        <>
            <div className='add-record-container'>
                <button 
                    className="add-record-button"
                    onClick={() => setShowAddModal(true)}
                    disabled={isReadOnly}
                    style={isReadOnly ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    title={isReadOnly ? 'Cannot add records for archived patients' : 'Add New Record'}
                >
                    Add New Record
                </button>

                <div className="records-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Prescribed by</th>
                                <th>Diagnosis</th>
                                <th>Medication</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Follow-up Visit</th>
                                <th>Special Instructions</th>
                                <th colSpan='3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <DoctorsOrderModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    activeTab={activeTab}
                    editingRecord={editingRecord}
                    //patientId = 
                    visitId = {visitId}
                    isReadOnly = {isReadOnly}
                />
            )}
        </>
    );
}

