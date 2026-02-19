import { useState, useEffect } from 'react';
import PrenatalModal from '../../../modules/admin/popups/PrenatalModal';

export default function AnimalBiteForm({ activeTab, consultationType, visitId, patientId, isReadOnly }) {
    const [prenatalData, setPrenatalData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    return (
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

                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <PrenatalModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    activeTab={activeTab}
                    consultationType={consultationType}
                    editingRecord={editingRecord}
                    visitId = {visitId}
                    patientId = {patientId}
                    isReadOnly = {isReadOnly}
                />
            )}
        </>
    );
}