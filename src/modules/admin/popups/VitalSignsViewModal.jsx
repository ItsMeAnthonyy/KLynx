import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { basicTabs } from '../pages/VisitDetails';

export default function VitalSignsViewModal({ isOpen, onClose, formData}) {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");

    return (
        <div className="addRecord-modal-overlay" onClick={onClose}>
            <div className="addRecord-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="addRecord-modal-header">
                    <h2 className="addRecord-modal-title">
                        View Vital Signs Record
                        <button onClick={onClose} className="close-button">
                            <BiX size={24} />
                        </button>
                    </h2>
                </div>
                <form>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Blood Pressure Systolic</label>
                            <input
                                type="text"
                                name="bpSystolic"
                                readOnly
                                value={formData.bpSystolic}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Blood Pressure Diastolic</label>
                            <input
                                type="text"
                                name="bpDiastolic"
                                readOnly
                                value={formData.bpDiastolic}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Respiratory Rate</label>
                            <input
                                type="text"
                                name="alert_type"
                                readOnly
                                value={formData.respiratoryRate}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Body Temperature</label>
                            <input
                                type="text"
                                name="bodyTemp"
                                readOnly
                                value={formData.bodyTemp}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                             <label>Pulse Rate</label>
                             <input
                                type="text"
                                name="pulseRate"
                                readOnly
                                value={formData.pulseRate}

                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Heart Rate</label>
                            <input
                                type="text"
                                name="heartRate"
                                readOnly
                                value={formData.heartRate}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>O₂ Saturation</label>
                            <input
                                type="text"
                                name="oxygenSaturation"
                                readOnly
                                value={formData.oxygenSaturation}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Height (cm)</label>
                            <input
                                type="text"
                                name="heightCm"
                                readOnly
                                value={formData.heightCm}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Weight (KG)</label>
                            <input
                                type="text"
                                name="weightKg"
                                readOnly
                                value={formData.weightKg}
                            />
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}