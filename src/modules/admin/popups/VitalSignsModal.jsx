import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { basicTabs } from '../pages/VisitDetails';

export default function VitalSignsModal({ isOpen, onClose, activeTab, editingRecord, visitId, isReadOnly/*, patientId, onSubmit */}) {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");
    const [formData, setFormData] = useState({
        checkupDate: '',
        imaging: [],
        alert_type: [],
        bloodPressure: '',
        diagnosis: '',
        diagnosis_specify: '',
        icd10_a: '',
        icd10_b: '',
        icd10_c: '',
        treatment_plan: '',
        remarks: ''
    });

    const activeTabData = basicTabs.find(tab => tab.id === activeTab);

    const handleChange = (e) => {

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

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

    return (
        <div className="addRecord-modal-overlay" onClick={onClose}>
            <div className="addRecord-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="addRecord-modal-header">
                    <h2 className="addRecord-modal-title">
                        {editingRecord ? 'Edit' : 'Add'} {activeTabData.label} Record
                        <button onClick={onClose} className="close-button">
                            <BiX size={24} />
                        </button>
                    </h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <div className="inputBox">
                            <label className='required'>Date</label>
                            <input
                                type="text"
                                name="checkupDate"
                                value={formData.checkupDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label className="required">Blood Pressure</label>
                            <input
                                type="text"
                                name="bloodPressure"
                                value={formData.bloodPressure}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label className="required">Pulse Rate</label>
                            <input
                                type="text"
                                name="pulseRate"
                                value={formData.pulseRate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label className='required'>Height</label>
                            <input
                                type="text"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                             <label className="required">Weight</label>
                             <input
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label className="required">Temperature</label>
                            <input
                                type="text"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                required
                            
                            />
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}