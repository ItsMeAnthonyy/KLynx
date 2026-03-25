import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { basicTabs } from '../pages/VisitDetails';

export default function VitalSignsModal({ isOpen, onClose, prenatal, aogWeeks, aogDays}) {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");
    console.log("FORMDATA?", prenatal.visit_date_time);
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
                        View Prenatal Record
                        <button onClick={onClose} className="close-button">
                            <BiX size={24} />
                        </button>
                    </h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>AOG (Weeks)</label>
                            <input
                                type="text"
                                name="aogWeeks"
                                readOnly
                                value={aogWeeks}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>AOG (Days)</label>
                            <input
                                type="text"
                                name="aogDays"
                                readOnly
                                value={aogDays}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Last Menstrual Period</label>
                            <input
                                type="text"
                                name="last_menstrual_period"
                                readOnly
                                value={prenatal.last_menstrual_period}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Expected Date of Delivery</label>
                            <input
                                type="text"
                                name="expected_date_of_delivery"
                                readOnly
                                value={prenatal.expected_date_of_delivery}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                             <label>Gravidity</label>
                             <input
                                type="text"
                                name="gravidity"
                                readOnly
                                value={prenatal.gravidity}

                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Parity</label>
                            <input
                                type="text"
                                name="parity"
                                readOnly
                                value={prenatal.parity}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Term</label>
                            <input
                                type="text"
                                name="term"
                                readOnly
                                value={prenatal.term}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Preterm</label>
                            <input
                                type="text"
                                name="preterm"
                                readOnly
                                value={prenatal.preterm}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Livebirths</label>
                            <input
                                type="text"
                                name="livebirths"
                                readOnly
                                value={prenatal.livebirths}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Menarche</label>
                            <input
                                type="text"
                                name="menarche"
                                readOnly
                                value={prenatal.menarche}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Period Duration</label>
                            <input
                                type="text"
                                name="period_duration"
                                readOnly
                                value={prenatal.period_duration}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Interval / Cycle (Days)</label>
                            <input
                                type="text"
                                name="interval_cycle"
                                readOnly
                                value={prenatal.interval_cycle}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>No. of pads/day during menstruation</label>
                            <input
                                type="text"
                                name="pads_per_day"
                                readOnly
                                value={prenatal.pads_per_day}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Menopause</label>
                            <input
                                type="text"
                                name="menopause"
                                readOnly
                                value={prenatal.menopause}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Onset of sexual intercourse</label>
                            <input
                                type="text"
                                name="onset_sexual_intercourse"
                                readOnly
                                value={prenatal.onset_sexual_intercourse}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Birth Control Method</label>
                            <input
                                type="text"
                                name="birth_control_method"
                                readOnly
                                value={prenatal.birth_control_method}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Abortion</label>
                            <input
                                type="text"
                                name="abortion"
                                readOnly
                                value={prenatal.abortion}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Ovarian Cyst?</label>
                            <input
                                type="text"
                                name="ovarian_cyst"
                                readOnly
                                value={prenatal.ovarian_cyst}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Intact Uterus?</label>
                            <input
                                type="text"
                                name="intact_uterus"
                                readOnly
                                value={prenatal.intact_uterus}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Diabetes?</label>
                            <input
                                type="text"
                                name="diabetes"
                                readOnly
                                value={prenatal.diabetes}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Thyroid?</label>
                            <input
                                type="text"
                                name="thyroid"
                                readOnly
                                value={prenatal.thyroid}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Obesity?</label>
                            <input
                                type="text"
                                name="obesity"
                                readOnly
                                value={prenatal.obesity}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Ashthma?</label>
                            <input
                                type="text"
                                name="asthma"
                                readOnly
                                value={prenatal.asthma}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Epilepsy?</label>
                            <input
                                type="text"
                                name="epilepsy"
                                readOnly
                                value={prenatal.epilepsy}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Hypertension?</label>
                            <input
                                type="text"
                                name="hypertension"
                                readOnly
                                value={prenatal.hypertension}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Heart Disease?</label>
                            <input
                                type="text"
                                name="heart_disease"
                                readOnly
                                value={prenatal.heart_disease}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Bleeding Disorder?</label>
                            <input
                                type="text"
                                name="bleeding_disorder"
                                readOnly
                                value={prenatal.bleeding_disorder}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Have Tuberculosis?</label>
                            <input
                                type="text"
                                name="tuberculosis"
                                readOnly
                                value={prenatal.tuberculosis}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Date Delivered</label>
                            <input
                                type="text"
                                name="date_delivered"
                                readOnly
                                value={prenatal.date_delivered}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Case Status</label>
                            <input
                                type="text"
                                name="case_status"
                                readOnly
                                value={prenatal.case_status}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Remarks</label>
                            <input
                                type="text"
                                name="remarks"
                                readOnly
                                value={prenatal.remarks}
                            />
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}