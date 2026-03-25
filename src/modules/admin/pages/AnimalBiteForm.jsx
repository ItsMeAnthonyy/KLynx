
import { useState, useEffect } from 'react';
import { BiSearch, BiSolidEdit, BiSolidTrash } from 'react-icons/bi';
import AnimalBiteModal from '../../../modules/admin/popups/AnimalBiteModal';
import { getAnimalBiteByVisitId } from '../api/animalBiteApi';

export default function AnimalBiteForm({ activeTab, consultationType, visitId, patientId, isReadOnly }) {
    const isArchived = location.state?.isArchived || false;
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await getAnimalBiteByVisitId(visitId);
                if(response.success) {
                    setFormData(response.data);
                }
                console.log("Fetched animal bite data:", response);
            } catch (error) {
                console.error("Error animal bite data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                                <th>Anatomical Location</th>
                                <th>Animal Type</th>
                                <th>Type of Exposure</th>
                                <th>Wash The Bite?</th>
                                <th>Date of Exposure</th>
                                <th colSpan='3'>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData ? (
                                <tr>
                                    <td>
                                        {formData.site_of_bite
                                            .split(',')
                                            .map(word => word
                                                .replace(/_/g, ' ')       // replace underscores with spaces
                                                .replace(/\b\w/g, l => l.toUpperCase()) // capitalize first letter
                                            )
                                            .join(', ')
                                        }
                                    </td>
                                    <td>
                                        {formData?.species
                                            ? formData.species.charAt(0).toUpperCase() +
                                            formData.species.slice(1)
                                            : ''
                                        }
                                    </td>
                                    <td>
                                        {formData?.category_of_exposure
                                            ? `Category ${formData.category_of_exposure.split('_')[1]?.toUpperCase()}`
                                            : ''
                                        }
                                    </td>
                                    <td>
                                        {formData?.post_exposure_treatment
                                            ?.split(',')
                                            .includes('washed_soap_water')
                                                ? 'Yes'
                                                : 'No'}
                                    </td>
                                    <td>
                                        {formData?.date_of_bite
                                            ? new Date(formData.date_of_bite).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                            : 'N/A'}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => { 
                                                if (!isArchived || isArchived) {
                                                    setShowViewModal(true)
                                                }
                                            }} 
                                            style={{ 
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '4px',
                                                cursor: isArchived ? 'not-allowed' : 'pointer', 
                                                padding: '8px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                opacity: isArchived ? 0.5 : 1
                                            }} 
                                            title={'View Details'}
                                            onMouseEnter={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                    e.currentTarget.style.borderColor = '#d1d5db';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                        >
                                            <BiSearch style={{ fontSize: '18px', color: '#282a2eff' }} />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => { 
                                                if (!isArchived) {
                                                    setSelectedVisit(patient); 
                                                    setEditVisitModal(true);
                                                }
                                            }} 
                                            disabled={isArchived}
                                            style={{ 
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '4px',
                                                cursor: isArchived ? 'not-allowed' : 'pointer', 
                                                padding: '8px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                opacity: isArchived ? 0.5 : 1
                                            }} 
                                            title={isArchived ? 'Cannot edit visits for archived patients' : 'Edit'}
                                            onMouseEnter={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                    e.currentTarget.style.borderColor = '#d1d5db';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                        >
                                            <BiSolidEdit style={{ fontSize: '18px', color: '#282a2eff' }} />
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => { 
                                                if (!isArchived) {
                                                    setSelectedVisit(patient); 
                                                    setDeleteVisitModal(true);
                                                }
                                            }} 
                                            disabled={isArchived}
                                            style={{ 
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '4px',
                                                cursor: isArchived ? 'not-allowed' : 'pointer', 
                                                padding: '8px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                opacity: isArchived ? 0.5 : 1
                                            }} 
                                            title={isArchived ? 'Cannot delete visits for archived patients' : 'Delete'}
                                            onMouseEnter={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                                    e.currentTarget.style.borderColor = '#fca5a5';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isArchived) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                        >
                                            <BiSolidTrash style={{ fontSize: '18px', color: '#ef4444' }} />
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="8">No animal bite data recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <AnimalBiteModal
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