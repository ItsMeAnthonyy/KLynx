import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { basicTabs } from '../pages/VisitDetails';

export default function VitalSignsModal({ isOpen, onClose, formData}) {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");

    return (
        <div className="addRecord-modal-overlay" onClick={onClose}>
            <div className="addRecord-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="addRecord-modal-header">
                    <h2 className="addRecord-modal-title">
                        View Doctors Order Record
                        <button onClick={onClose} className="close-button">
                            <BiX size={24} />
                        </button>
                    </h2>
                </div>
                <form>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Imaging Request</label>
                            <input
                                type="text"
                                name="imaging"
                                readOnly
                                value={formData.data[0].imaging
                                            .split(',')
                                            .map(type => type.charAt(0).toUpperCase() + type.slice(1))
                                            .join(', ')
                                        }
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Diagnosis</label>
                            <input
                                type="text"
                                name="diagnosis_status"
                                readOnly
                                value={formData.data[0].diagnosis_status
                                            .replace(/_/g, ' ')
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')
                                        }
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Alert Type</label>
                            <input
                                type="text"
                                name="alert_type"
                                readOnly
                                value={formData.data[0].alert_type
                                            .split(',')
                                            .map(type => type.charAt(0).toUpperCase() + type.slice(1))
                                            .join(', ')
                                        }
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Alert Description</label>
                            <textarea
                                type="text"
                                name="alert_description"
                                readOnly
                                value={formData.data[0].alert_description}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                             <label>Diagnosis Specify</label>
                             <textarea
                                type="text"
                                name="diagnosis_specify"
                                readOnly
                                value={formData.data[0].diagnosis_specify}

                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Treatment Plan</label>
                            <textarea
                                type="text"
                                name="treatment_plan"
                                readOnly
                                value={formData.data[0].treatment_plan}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Remarks</label>
                            <textarea
                                type="text"
                                name="remarks"
                                readOnly
                                value={formData.data[0].remarks}
                            />
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}