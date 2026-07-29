
import { useState, useEffect } from 'react';
import { BiSearch, BiSolidEdit, BiSolidTrash } from 'react-icons/bi';
import DoctorsOrderModal from '../../../modules/admin/popups/DoctorsOrderModal';
import DoctorsOrderViewModal from '../../../modules/admin/popups/DoctorsOrderViewModal';
import { getDoctorOrderByVisitId } from '../api/doctorsOrderApi';

export default function DoctorsOrderForm({ activeTab, visitId, patientId, isReadOnly }) {
    const isArchived = location.state?.isArchived || false;
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await getDoctorOrderByVisitId(visitId);
                if(response.success) {
                    setFormData(response);
                }
                console.log("Fetched doctors order data:", response);
            } catch (error) {
                console.error("Error fetching doctors order data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                                {/* <th>Laboratory Request</th> */}
                                <th>Imaging Request</th>
                                <th>Diagnosis</th>
                                <th colSpan='3'>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData ? (
                                <tr>
                                    <td>
                                        {new Date(formData.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        {
                                            (formData.imaging ?? [])
                                                .map(word =>
                                                    word
                                                        .replace(/_/g, ' ')
                                                        .replace(/\b\w/g, l => l.toUpperCase())
                                                )
                                                .join(', ')
                                        }
                                    </td>
                                    <td>
                                        {/* {formData.diagnosisStatus
                                            .replace(/_/g, ' ')
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')
                                        } */}
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
                                    <td colSpan="6">No doctors order recorded.</td>
                                </tr>
                            )}
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
                    visitId = {visitId}
                    patientId = {patientId}
                    isReadOnly = {isReadOnly}
                />
            )}

            {showViewModal && (
                <DoctorsOrderViewModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    formData={formData}
                />
            )}
        </>
    );
}

