import { useState, useRef } from 'react';
import useAuth from '../../../hooks/useAuth';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { getConsultationTabs } from '../pages/VisitDetails';
import { useToast } from '../../../hooks/use-toast';

import { createPrenatal } from '../api/prenatalApi';

export default function PrenatalModal({ isOpen, onClose, activeTab, consultationType, editingRecord, visitId, patientId, isReadOnly/*, onSubmit */}) {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");
    const { toast } = useToast();

    const [loading, setLoading] = useState("");
    const [formData, setFormData] = useState({
        //prenatal_menstrual_history
        menarche: '',
        periodDuration: '',
        intervalCycle: '',
        padsPerDay: '',
        lastMenstrualPeriod: '', //LMP
        expectedDateOfDelivery: '', //EDD
        menopause: 'no',
        //prenatal_sexual_history
        onsetOfSexualIntercourse: '',
        birthControlMethod: '',
        //prenatal_obstetric_history
        gravidity: '', //GRAVIDA
        parity: '', //PARA
        term: '',
        preterm: '',
        livebirths: '',
        abortion: '',
        //prenatal_medical_conditions
        ovarianCyst: 'no',
        intactUterus: 'no',
        diabetes: 'no',
        thyroid: 'no',
        obesity: 'no',
        asthma: 'no',
        epilepsy: 'no',
        hypertension: 'no',
        heartDisease: 'no',
        bleedingDisorder: 'no',
        tuberculosis: 'no',
        dateDelivered: '',
        caseStatus: 'active',
        remarks: ''
    });

    const consultationTabs = getConsultationTabs(consultationType);
    const activeTabData = consultationTabs.find(
        tab => tab.id === activeTab
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter((d) => d !== value),
            }));
        } else {
        // for text, textarea, select, etc.
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const prenatal_case = await createPrenatal(
                visitId,
                patientId, 
                formData
            );

            toast({ 
                title: `Submit success (Case ID: ${prenatal_case})`, 
                className: "toast-success" 
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

    const YesNoRadio = ({ name, value, onChange }) => (
        <div className="radio-set">
            <label>
                <input
                    type="radio"
                    name={name}
                    value="yes"
                    checked={value === 'yes'}
                    onChange={onChange}
                />
                <span>Yes</span>
            </label>
            <label>
                <input
                    type="radio"
                    name={name}
                    value="no"
                    checked={value === 'no'}
                    onChange={onChange}
                />
                <span>No</span>
            </label>
        </div>
    );


    return(
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
                        <div className="input-box">
                            <label>Menarche:</label>
                            <input 
                                type="number" 
                                placeholder="Menarche" 
                                name="menarche" 
                                className="site-select" 
                                value={formData.menarche} 
                                onChange={handleChange} 
                                min={1} 
                                max={5000}
                                step="1"
                            />
                         </div>
                         <div className="input-box">
                            <label>Period Duration:</label>
                            <input 
                                type="number" 
                                placeholder="periodDuration" 
                                name="periodDuration" 
                                className="site-select" 
                                value={formData.periodDuration} 
                                onChange={handleChange} 
                                min={1} 
                                max={5000}
                                step="1"
                            />
                         </div>
                         <div className="input-box">
                            <label>Interval/Cycle (Days):</label>
                            <input 
                                type="number" 
                                placeholder="intervalCycle" 
                                name="intervalCycle" 
                                className="site-select" 
                                value={formData.intervalCycle} 
                                onChange={handleChange} 
                                min={1} 
                                max={5000}
                                step="1"
                            />
                         </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>No. of pads/day during menstruation:</label>
                            <input 
                                type="number" 
                                placeholder="padsPerDay" 
                                name="padsPerDay" 
                                className="site-select" 
                                value={formData.padsPerDay} 
                                onChange={handleChange} 
                                min={1} 
                                max={5000}
                                step="1"
                            />
                        </div>
                        <div className="input-box">
                            <label className="required">Last Menstrual Period:</label>
                            <input 
                                type="date" 
                                placeholder="lastMenstrualPeriod" 
                                name="lastMenstrualPeriod" 
                                className="site-select" 
                                required 
                                value={formData.lastMenstrualPeriod} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="input-box">
                            <label>Expected Date of Delivery:</label>
                            <input 
                                type="date" 
                                placeholder="expectedDateOfDelivery" 
                                name="expectedDateOfDelivery" 
                                className="site-select" 
                                value={formData.expectedDateOfDelivery} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Menopause:</label>
                            <YesNoRadio
                                name="menopause"
                                value={formData.menopause}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Onset of sexual intercourse:</label>
                            <input 
                                type="number" 
                                placeholder="onsetOfSexualIntercourse" 
                                name="onsetOfSexualIntercourse" 
                                className="site-select" 
                                value={formData.onsetOfSexualIntercourse} 
                                onChange={handleChange} 
                                min={1} 
                                max={5000}
                                step="1"
                            />
                        </div>
                        <div className="input-box">
                            <label className="required">Select Birth Control Methods:</label>
                            <select 
                                name="birthControlMethod" 
                                value={formData.birthControlMethod} 
                                onChange={handleChange}
                                className="selectBox"
                            >
                                <option value="" hidden >Select</option>
                                <option value="none">None</option>
                                <option value="condom">Condom</option>
                                <option value="oral_contraceptive_pills">Oral Contraceptive Pills</option>
                                <option value="injectable_contraceptives">Injectable Contraceptives</option>
                                <option value="iud">Intrauterine Device (IUD)</option>
                                <option value="contraceptive_implant">Contraceptive Implant</option>
                                <option value="contraceptive_patch">Contraceptive Patch</option>
                                <option value="vaginal_ring">Vaginal Ring</option>
                                <option value="sterilization">Sterilization</option>
                                <option value="natural_methods">Natural Methods</option>
                                <option value="other">Other (no function yet)</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Gravidity:</label>
                            <input 
                                type="number" 
                                placeholder="gravidity" 
                                name="gravidity" 
                                className="site-select" 
                                value={formData.gravidity} 
                                onChange={handleChange} 
                                min={0} 
                                max={5000}
                                step="1"
                            />
                        </div>
                        <div className="input-box">
                            <label>Parity:</label>
                            <input 
                                type="number" 
                                placeholder="parity" 
                                name="parity" 
                                className="site-select" 
                                value={formData.parity} 
                                onChange={handleChange} 
                                min={0} 
                                max={5000}
                                step="1"
                            />
                        </div>
                        <div className="input-box">
                            <label>Term:</label>
                            <input 
                                type="number" 
                                placeholder="term" 
                                name="term" 
                                className="site-select" 
                                value={formData.term} 
                                onChange={handleChange} 
                                min={0} 
                                max={5000}
                                step="1"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Preterm:</label>
                            <input 
                                type="number" 
                                placeholder="preterm" 
                                name="preterm" 
                                className="site-select" 
                                value={formData.preterm} 
                                onChange={handleChange} 
                                min={0} 
                                max={5000}
                                step="1"
                            />
                        </div>
                        <div className="input-box">
                            <label>Livebirths:</label>
                            <input 
                                type="number" 
                                placeholder="livebirths" 
                                name="livebirths" 
                                className="site-select" 
                                value={formData.livebirths} 
                                onChange={handleChange} 
                                min={0} 
                                max={5000}
                                step="1"
                            />
                        </div>
                        <div className="input-box">
                            <label>Abortion:</label>
                            <input 
                                type="number" 
                                placeholder="abortion" 
                                name="abortion" 
                                className="site-select" 
                                value={formData.abortion} 
                                onChange={handleChange} 
                                min={0} 
                                max={5000}
                                step="1"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Ovarian Cyst:</label>
                            <YesNoRadio
                                name="ovarianCyst"
                                value={formData.ovarianCyst}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <label>Intact Uterus:</label>
                            <YesNoRadio
                                name="intactUterus"
                                value={formData.intactUterus}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <label>Diabetes:</label>
                            <YesNoRadio
                                name="diabetes"
                                value={formData.diabetes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Thyroid:</label>
                            <YesNoRadio
                                name="thyroid"
                                value={formData.thyroid}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <label>Obesity:</label>
                            <YesNoRadio
                                name="obesity"
                                value={formData.obesity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <label>Asthma:</label>
                            <YesNoRadio
                                name="asthma"
                                value={formData.asthma}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Epilepsy:</label>
                            <YesNoRadio
                                name="epilepsy"
                                value={formData.epilepsy}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <label>Hypertension:</label>
                            <YesNoRadio
                                name="hypertension"
                                value={formData.hypertension}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <label>Heart Disease:</label>
                            <YesNoRadio
                                name="heartDisease"
                                value={formData.heartDisease}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Bleeding Disorder:</label>
                            <YesNoRadio
                                name="bleedingDisorder"
                                value={formData.bleedingDisorder}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <label>Tuberculosis:</label>
                            <YesNoRadio
                                name="tuberculosis"
                                value={formData.tuberculosis}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Date Delivered:</label>
                            <input 
                                type="date" 
                                placeholder="dateDelivered" 
                                name="dateDelivered" 
                                className="site-select" 
                                value={formData.dateDelivered} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="input-box">
                            <label className="required">Case Status:</label>
                            <div className="radio-set">
                                <label>
                                    <input
                                        type="radio"
                                        name="caseStatus"
                                        value="active"
                                        checked={formData.caseStatus === 'active'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>Active</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="caseStatus"
                                        value="inactive"
                                        checked={formData.caseStatus === 'inactive'}
                                        onChange={handleChange}
                                    />
                                    <span>Inactive</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label>Remarks:</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Enter details here..."
                                rows={2}
                            />
                        </div>
                    </div>

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
                        >
                            {editingRecord ? 'Update Record' : 'Save Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
