
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { basicTabs } from '../pages/VisitDetails';
import { useToast } from '../../../hooks/use-toast';

import ICD10SearchModal from './ICD10SearchModal';
import PrescriptionListModal from './PrescriptionListModal';

import { createDoctorOrder } from '../api/doctorsOrderApi';


export default function DoctorsOrderModal({ isOpen, onClose, activeTab, editingRecord, visitId, patientId, isReadOnly/*, patientId, onSubmit */}) {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");
    const { toast } = useToast();

    const activeTabData = basicTabs.find(tab => tab.id === activeTab);
    const [loading, setLoading] = useState(false);
    const [doctorsOrderForm, setDoctorsOrderForm] = useState({
        imaging: [],
        alertType: [],
        alertDescription: '',
        diagnosisStatus: "",
        icd10_a: "",
        icd10_b: "",
        icd10_c: "",
        diagnosisSpecify: "",
        treatmentPlan: "",
        remarks: ""
      });
      const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
      const [showICD10Modal, setShowICD10Modal] = useState(false);
      const [activeIcdField, setActiveIcdField] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setDoctorsOrderForm((prev) => ({
                ...prev,
                [name]: checked
                ? [...prev[name], value]
                : prev[name].filter((d) => d !== value),
            }));
        } else {
        // for text, textarea, select, etc.
            setDoctorsOrderForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handlePrescriptionModalClose = () => {
        setShowPrescriptionModal(false);
        // fetchPrescriptionCount();
    };

    const handleSelectICD10 = (code) => {
        console.log("FINAL LAST",code.Code);
        if (activeIcdField) {
            setDoctorsOrderForm(prev => ({ ...prev, [activeIcdField]: code.Code }));
        }
        console.log(doctorsOrderForm);
        setShowICD10Modal(false);
        setActiveIcdField(null);
    };

    const handleOpenICD10Search = (field) => {
        setActiveIcdField(field);
        setShowICD10Modal(true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createDoctorOrder(
                visitId,
                patientId, 
                doctorsOrderForm
            );

            setDoctorsOrderForm({
                imaging: [],
                alertType: [],
                alertDescription: '',
                diagnosisStatus: "",
                icd10_a: "",
                icd10_b: "",
                icd10_c: "",
                diagnosisSpecify: "",
                treatmentPlan: "",
                remarks: ""
            });

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
                            <label className="required">Imaging</label>
                            <div className="checkbox-3-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="imaging"
                                        value="ecg"
                                        checked={doctorsOrderForm.imaging.includes("ecg")}
                                        onChange={handleChange}
                                    />
                                    ECG
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="imaging"
                                        value="mri"
                                        checked={doctorsOrderForm.imaging.includes("mri")}
                                        onChange={handleChange}
                                    />
                                    MRI
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="imaging"
                                        value="ultraSound"
                                        checked={doctorsOrderForm.imaging.includes("ultraSound")}
                                        onChange={handleChange}
                                    />
                                    Ultrasound
                                </label>
                            </div>
                            <div className="checkbox-3-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="imaging"
                                        value="x-ray"
                                        checked={doctorsOrderForm.imaging.includes("x-ray")}
                                        onChange={handleChange}
                                    />
                                    X-ray
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="inputBox">
                            <label className="required">Alert Type</label>
                            <div className="checkbox-3-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="alertType"
                                        value="allergy"
                                        checked={doctorsOrderForm.alertType.includes("allergy")}
                                        onChange={handleChange}
                                    />
                                    Allergy
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="alertType"
                                        value="disability"
                                        checked={doctorsOrderForm.alertType.includes("disability")}
                                        onChange={handleChange}
                                    />
                                    Disability
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="alertType"
                                        value="drug"
                                        checked={doctorsOrderForm.alertType.includes("drug")}
                                        onChange={handleChange}
                                    />
                                    Drug
                                </label>
                            </div>
                            <div className="checkbox-3-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="alertType"
                                        value="handicap"
                                        checked={doctorsOrderForm.alertType.includes("handicap")}
                                        onChange={handleChange}
                                    />
                                    Handicap
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="alertType"
                                        value="impairment"
                                        checked={doctorsOrderForm.alertType.includes("impairment")}
                                        onChange={handleChange}
                                    />
                                    Impairment
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="alertType"
                                        value="others"
                                        checked={doctorsOrderForm.alertType.includes("others")}
                                        onChange={handleChange}
                                    />
                                    Others
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 🚨 New Alert Description Section */}
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Alert Description</label>
                            <textarea
                                name="alertDescription"
                                value={doctorsOrderForm.alertDescription}
                                onChange={handleChange}
                                placeholder="Enter alert details here..."
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Diagnosis Type Section */}
                    <div className="input-group">
                        <div className="inputBox">
                            <label className="required">Diagnosis Status</label>
                            <select
                                name="diagnosisStatus"
                                value={doctorsOrderForm.diagnosisStatus}
                                onChange={handleChange}
                                className="selectBox"
                            >
                                <option value="" hidden >-- Select Diagnosis Status --</option>
                                <option value="admitting_diagnosis">Admitting Diagnosis</option>
                                <option value="working_diagnosis">Working Diagnosis</option>
                                <option value="final_diagnosis">Final Diagnosis</option>
                                <option value="not_applicable">Not Applicable</option>
                            </select>
                        </div>
                    </div>

                    {/* Conditionally render ICD10 inputs */}
                    {["admitting_diagnosis", "working_diagnosis", "final_diagnosis"].includes(doctorsOrderForm.diagnosisStatus) && (
                        <div className="input-group">
                            <div className="inputBox">
                                <label className="required">ICD10 Codes</label>
                                <div className="icd10-grid">
                                    <div className="icd10-row">
                                        <input
                                            type="text"
                                            name="icd10_a"
                                            value={doctorsOrderForm.icd10_a}
                                            onChange={handleChange}
                                            placeholder="Enter A. ICD10"
                                        />
                                        <label className="required"></label>
                                        <button 
                                            type="button" 
                                            onClick={() => handleOpenICD10Search("icd10_a")}
                                        >
                                            <BiSearch size={16} />  
                                            Search ICD10 Code
                                        </button>
                                    </div>
                                    <div className="icd10-row">
                                        <input
                                            type="text"
                                            name="icd10_b"
                                            value={doctorsOrderForm.icd10_b}
                                            onChange={handleChange}
                                            placeholder="Enter B. ICD10"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => handleOpenICD10Search("icd10_b")}
                                        >
                                            <BiSearch size={16} />  
                                            Search ICD10 Code
                                        </button>
                                    </div>
                                    <div className="icd10-row">
                                        <input
                                            type="text"
                                            name="icd10_c"
                                            value={doctorsOrderForm.icd10_c}
                                            onChange={handleChange}
                                            placeholder="Enter C. ICD10"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => handleOpenICD10Search("icd10_c")}
                                        >
                                            <BiSearch size={16} />  
                                            Search ICD10 Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🚨 New Alert Description Section */}
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Diagnosis Specify</label>
                            <textarea
                                name="diagnosisSpecify"
                                value={doctorsOrderForm.diagnosisSpecify}
                                onChange={handleChange}
                                placeholder="Enter diagnosis details here..."
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* 🚨 New Alert Description Section */}
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Prescription</label>
                            <button
                                type="button"
                                name="diagnosisSpecify"
                                onClick={() => setShowPrescriptionModal(true)}
                                className="prescribeButton"
                            >
                                <BiCapsule size={18} />
                                Prescribe Medicine
                            </button>
                        </div>
                    </div>

                    {/* 🚨 New Treatment Plan Section */}
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Treatment Plan</label>
                            <textarea
                                name="treatmentPlan"
                                value={doctorsOrderForm.treatmentPlan}
                                onChange={handleChange}
                                placeholder="Enter alert details here..."
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* 🚨 New Remarks Section */}
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Remarks</label>
                            <textarea
                                name="remarks"
                                value={doctorsOrderForm.remarks}
                                onChange={handleChange}
                                placeholder="Enter alert details here..."
                                rows="3"
                            />
                        </div>
                    </div>

                </form>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="save-button"
                        onClick={handleSubmit}
                    >
                        {editingRecord ? 'Update Record' : 'Save Record'}
                    </button>
                </div>

                <PrescriptionListModal
                    isOpen={showPrescriptionModal}
                    onClose={handlePrescriptionModalClose}
                    visitId={visitId}
                    isReadOnly={isReadOnly}
                />

                <ICD10SearchModal
                    isOpen={showICD10Modal}
                    onClose={() => setShowICD10Modal(false)}
                    onSelect={handleSelectICD10}
                    isAdmin={isAdmin}
                />

            </div>
        </div>
    );
}