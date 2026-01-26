import { useState, useEffect } from 'react';

import PhysicalExamsModal from '../../../modules/admin/popups/PhysicalExamsModal';

export default function PhysicalExamForm({ visitId, activeTab, isReadOnly }) {

    const [physicalExams, setPhysicalExams] = useState(null);

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
                                <th>Head</th>
                                <th>Conjuctiva (Eye Anatomy)</th>
                                <th>Conjuctiva Remarks</th>
                                <th>Neck</th>
                                <th>Chest</th>
                                <th>Breast Remarks</th>
                                <th colSpan="2">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {physicalExams ? (
                                <td></td>
                            ) : (
                                <tr>
                                    <td colSpan="8">No physical exams recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <PhysicalExamsModal
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