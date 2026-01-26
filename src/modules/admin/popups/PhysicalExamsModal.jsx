
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { basicTabs } from '../pages/VisitDetails';

export default function VitalSignsModal({ isOpen, onClose, activeTab, editingRecord, visitId, isReadOnly/*, patientId, onSubmit */}) {

    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");
    const [formData, setFormData] = useState({
        head: '',
        conjuctiva: [],
        conjuctivaRemarks: '',
        neck: [],
        chest: '',
        breast: [],
        breastRemarks: '',
        thorax: [],
        thoraxRemarks: '',
        abdomen: [],
        abdomenRemarks: '',
        genitals: [],
        genitalsRemarks: '',
        extremities: [],
        extremitiesRemarks: '',
        others: '',
        waistCircumference: '',
        administeredBy: ''
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
                            <label>Head</label>
                            <textarea
                                name="head"
                                value={formData.head}
                                onChange={handleChange}
                                placeholder="Enter head details here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Conjuctiva (Eye Anatomy)</label>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="conjuctiva"
                                        value="pale"
                                        checked={formData.conjuctiva.includes("pale")}
                                        onChange={handleChange}
                                    />
                                    Pale
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="conjuctiva"
                                        value="yellowish"
                                        checked={formData.conjuctiva.includes("yellowish")}
                                        onChange={handleChange}
                                    />
                                    Yellowish
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Conjuctiva Remarks</label>
                            <textarea
                                name="conjuctivaRemarks"
                                value={formData.conjuctivaRemarks}
                                onChange={handleChange}
                                placeholder="Enter conjuctiva remarks here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Neck</label>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="neck"
                                        value="enlargedLymphNodes"
                                        checked={formData.neck.includes("enlargedLymphNodes")}
                                        onChange={handleChange}
                                    />
                                    Enlarged Lymph Nodes
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="neck"
                                        value="enlargedThyroid"
                                        checked={formData.neck.includes("enlargedThyroid")}
                                        onChange={handleChange}
                                    />
                                    Enlarged Thyroid
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Chest</label>
                            <textarea
                                name="chest"
                                value={formData.chest}
                                onChange={handleChange}
                                placeholder="Enter chest details here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Breast:</label>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="breast"
                                        value="enlargedAxillaryLymphNodes"
                                        checked={formData.breast.includes("enlargedAxillaryLymphNodes")}
                                        onChange={handleChange}
                                    />
                                    Enlarged Axillary Lymph Nodes
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="breast"
                                        value="mass"
                                        checked={formData.breast.includes("mass")}
                                        onChange={handleChange}
                                    />
                                    Mass
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="breast"
                                        value="nippleDischarge"
                                        checked={formData.breast.includes("nippleDischarge")}
                                        onChange={handleChange}
                                    />
                                    Nipple Discharge
                                </label>
                            </div>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="breast"
                                        value="skinOrangePeelOrDimpling"
                                        checked={formData.conjuctiva.includes("skinOrangePeelOrDimpling")}
                                        onChange={handleChange}
                                    />
                                    Skin Orange Peel or Dimpling
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Breast Remarks:</label>
                            <textarea
                                name="breastRemarks"
                                value={formData.breastRemarks}
                                onChange={handleChange}
                                placeholder="Enter breast remarks here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Thorax:</label>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="thorax"
                                        value="abnormalBreathSoundsOrRespiratoryRate"
                                        checked={formData.thorax.includes("abnormalBreathSoundsOrRespiratoryRate")}
                                        onChange={handleChange}
                                    />
                                    Abnormal Breath Sounds/Respiratory Rate
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="thorax"
                                        value="abnormalHeartSoundsOrCardiacRate"
                                        checked={formData.thorax.includes("abnormalHeartSoundsOrCardiacRate")}
                                        onChange={handleChange}
                                    />
                                    Abnormal Heart Sounds/Cardiac Rate
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Thorax Remarks:</label>
                            <textarea
                                name="thoraxRemarks"
                                value={formData.thoraxRemarks}
                                onChange={handleChange}
                                placeholder="Enter thorax remarks here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Abdomen:</label>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="abdomen"
                                        value="enlargedLiver"
                                        checked={formData.abdomen.includes("enlargedLiver")}
                                        onChange={handleChange}
                                    />
                                    Enlarged Liver
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="abdomen"
                                        value="mass"
                                        checked={formData.abdomen.includes("mass")}
                                        onChange={handleChange}
                                    />
                                    Mass
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="abdomen"
                                        value="scar"
                                        checked={formData.abdomen.includes("scar")}
                                        onChange={handleChange}
                                    />
                                    Scar
                                </label>
                            </div>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="abdomen"
                                        value="tenderness"
                                        checked={formData.abdomen.includes("tenderness")}
                                        onChange={handleChange}
                                    />
                                    Tenderness
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Abdomen Remarks:</label>
                            <textarea
                                name="abdomenRemarks"
                                value={formData.abdomenRemarks}
                                onChange={handleChange}
                                placeholder="Enter abdomen remarks here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Genitals:</label>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="genitals"
                                        value="bleeding"
                                        checked={formData.genitals.includes("bleeding")}
                                        onChange={handleChange}
                                    />
                                    Bleeding
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="genitals"
                                        value="cystOrMass"
                                        checked={formData.genitals.includes("cystOrMass")}
                                        onChange={handleChange}
                                    />
                                    Cyst/Mass
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="genitals"
                                        value="discharges"
                                        checked={formData.genitals.includes("discharges")}
                                        onChange={handleChange}
                                    />
                                    Discharges
                                </label>
                            </div>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="genitals"
                                        value="laceration"
                                        checked={formData.genitals.includes("laceration")}
                                        onChange={handleChange}
                                    />
                                    Laceration
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="genitals"
                                        value="scars"
                                        checked={formData.genitals.includes("scars")}
                                        onChange={handleChange}
                                    />
                                    Scars
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="genitals"
                                        value="warts"
                                        checked={formData.genitals.includes("warts")}
                                        onChange={handleChange}
                                    />
                                    Warts
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Genitals Remarks:</label>
                            <textarea
                                name="genitalsRemarks"
                                value={formData.genitalsRemarks}
                                onChange={handleChange}
                                placeholder="Enter genitals remarks here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Extremities:</label>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="extremities"
                                        value="edema"
                                        checked={formData.extremities.includes("edema")}
                                        onChange={handleChange}
                                    />
                                    Edema
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="extremities"
                                        value="fullAndEqualMasses"
                                        checked={formData.extremities.includes("fullAndEqualMasses")}
                                        onChange={handleChange}
                                    />
                                    Full and Equal Masses
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="extremities"
                                        value="grossDeformity"
                                        checked={formData.extremities.includes("grossDeformity")}
                                        onChange={handleChange}
                                    />
                                    Gross Deformity
                                </label>
                            </div>
                            <div className="checkbox-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="extremities"
                                        value="normalGait"
                                        checked={formData.extremities.includes("normalGait")}
                                        onChange={handleChange}
                                    />
                                    Normal Gait
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="extremities"
                                        value="painOrForcedDorsiflexion"
                                        checked={formData.extremities.includes("painOrForcedDorsiflexion")}
                                        onChange={handleChange}
                                    />
                                    Pain or Forced Dorsiflexion
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="extremities"
                                        value="varicosities"
                                        checked={formData.extremities.includes("varicosities")}
                                        onChange={handleChange}
                                    />
                                    Varicosities
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Extremities Remarks:</label>
                            <textarea
                                name="extremitiesRemarks"
                                value={formData.extremitiesRemarks}
                                onChange={handleChange}
                                placeholder="Enter extremities remarks here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                            <label>Others:</label>
                            <textarea
                                name="others"
                                value={formData.others}
                                onChange={handleChange}
                                placeholder="Enter other details here..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="inputBox">
                             <label>Waist Circumference:</label>
                            <input 
                                name="waistCircumference"
                                type="number" 
                                value={formData.waistCircumference}
                                onChange={handleChange}
                                min={40} 
                                max={200} 
                                step="0.1" 
                                placeholder="cm" 
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
            </div>
        </div>
    );
}