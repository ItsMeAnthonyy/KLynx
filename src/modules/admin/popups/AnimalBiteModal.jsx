import { useState, useRef } from 'react';
import useAuth from '../../../hooks/useAuth';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { getConsultationTabs } from '../pages/VisitDetails';
import { useToast } from '../../../hooks/use-toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { createAnimalBite } from '../api/animalBiteApi';

export default function AnimalBiteModal({ isOpen, onClose, activeTab, consultationType, editingRecord, visitId, patientId, isReadOnly/*, onSubmit */}) {
    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");
    const { toast } = useToast();

    const [loading, setLoading] = useState("");
    const [formData, setFormData] = useState({
        siteOfBite: [],
        dateOfBite: '',
        categoryOfExposure: '',
        placeBitten: [],
        postExposureTreatment: [],
        otherPostExposureTreatment: '',
        antiTetanus: '',
        antiTetanusVaccineName: '',
        antiTetanusDate: '',
        antiTetanusWhere: '',
        antibioticsGiven: '',
        activeImmunization: '',
        idOrIm: '',
        activeImmunizationDate: '',
        dateD0: '',
        dateD3: '',
        dateD7: '',
        dateD30: '',
        previousArvVacc: '',
        PrevArvVaccDate: '',
        vacc:'',
        passiveImmunization: '',
        passiveImmunizationDate: '',
        typeOfImmunoglobulin: '',
        erigVolume: '',
        erigDate: '',
        erigWhere: '',
        hrigVolume: '',
        hrigDate: '',
        hrigWhere: '',
        species: '',
        specifyTypeOfAnimal: '',
        ageOfAnimal: '',
        ageOfAnimalUnit: '',
        animalContainmentStatus: '',
        ownerOfAnimal: '',
        ownerContact: '',
        ownerAddress: '',
        wasAnimalVaccinated: '',
        dateOfAnimalVaccination:'',
        animalVaccineType: '',
        contactWithOtherAnimals: '',
        animalTypeContacted: '',
        animalContactCount: '',
        conditionBeforeBite: '',
        sickSince: '',
        animalDeathDate: '',
        animalCauseOfDeath: '',
        rabiesClinicalSigns: '',
        animalObservationDate: ''
    });

    // const bodyPartLocations = {
    //     Face: [
    //         'Head',
    //         'Forehead',
    //         'Eyebrow',
    //         'Eyes',
    //         'Nose',
    //         'Cheek',
    //         'Upper Lip',
    //         'Lower Lip',
    //         'Chin',
    //         'Jaw',
    //         'Neck',
    //         'Nape',
    //         'Ears',
    //         'Scalp'
    //     ],
    //     Head: ['Scalp', 'Temple', 'Forehead'],
    //     Torso: ['Chest', 'Abdomen', 'Back'],
    //     'Left Arm': ['Upper Arm', 'Elbow', 'Forearm', 'Wrist', 'Hand', 'Fingers'],
    //     'Right Arm': ['Upper Arm', 'Elbow', 'Forearm', 'Wrist', 'Hand', 'Fingers'],
    //     'Left Leg': ['Thigh', 'Knee', 'Shin', 'Ankle', 'Foot', 'Toes'],
    //     'Right Leg': ['Thigh', 'Knee', 'Shin', 'Ankle', 'Foot', 'Toes']
    //   };
    //   const [showOthers, setShowOthers] = useState(false);
    //   const postExposureSpecifyRef = useRef(null);
    //   const typeOfAnimalSpecifyRef = useRef(null);
    //   const specifyContactRef = useRef(null);
    //   const [ShowActiveImmunenization, setShowActiveImmunenization] = useState(false);
    //   const [showTypeOfAnimalOthers, setShowTypeOfAnimalOthers] = useState(false);
    //   const [showSpecifyVaccine, setShowSpecifyVaccine] = useState(false);
    //   const [showSpecifyContact, setShowSpecifyContact] = useState(false);

     const consultationTabs = getConsultationTabs(consultationType);
     const activeTabData = consultationTabs.find(
        tab => tab.id === activeTab
    );

    
    const siteOfBiteOptions = [
        {
            group: "Head/Neck",
            options: [
            { label: "Scalp", value: "scalp" },
            { label: "Face", value: "face" },
            { label: "Neck", value: "neck" }
            ]
        },
        {
            group: "Upper Limbs",
            options: [
            { label: "Left Arm", value: "left_arm" },
            { label: "Right Arm", value: "right_arm" },
            { label: "Left Hand", value: "left_hand" },
            { label: "Right Hand", value: "right_hand" }
            ]
        },
        {
            group: "Lower Limbs",
            options: [
            { label: "Left Leg", value: "left_leg" },
            { label: "Right Leg", value: "right_leg" },
            { label: "Left Foot", value: "left_foot" },
            { label: "Right Foot", value: "right_foot" }
            ]
        },
        {
            group: "Torso",
            options: [
            { label: "Chest", value: "chest" },
            { label: "Back", value: "back" },
            { label: "Abdomen", value: "abdomen" }
            ]
        }
        // },
        // {
        //     group: "Other",
        //     options: [
        //     { label: "Genital Area", value: "genital_area" },
        //     { label: "Multiple Sites", value: "multiple_sites" },
        //     { label: "Unknown", value: "unknown" }
        //     ]
        // }
    ];

    const placeBittenOptions = [
        { label: "House", value: "house" },
        { label: "Street", value: "street" },
        { label: "Neighbour", value: "neighbour" },
        { label: "Compound", value: "compound" },
        { label: "Work/Site", value: "work_site" },
        { label: "Other places", value: "other_places" }
    ];
    
    const postExposureOptions = [
        { label: "Wound washed with soap & water", value: "washed_soap_water" },
        { label: "Applied disinfectant", value: "applied_disinfectant" },
        { label: "Tandok applied", value: "tandok_applied" },
        { label: "Used garlic", value: "used_garlic" },
        { label: "None", value: "none" },
        { label: "Others", value: "others" }
    ];
    
    const activeImmunizationDateOptions = [
        { label: "D0", value: "D0" },
        { label: "D3", value: "D3" },
        { label: "D7", value: "D7" },
        { label: "D30", value: "D30" }
    ];

    const speciesOptions = [
        { label: "Dog", value: "dog" },
        { label: "Cat", value: "cat" },
        { label: "Monkey", value: "monkey" },
        { label: "Others", value: "others" }
    ];

    const containmentStatusOptions = [
        { label: "Leashed", value: "leashed" },
        { label: "Unleashed", value: "unleashed" },
        { label: "Cage", value: "cage" },
        { label: "Stray", value: "stray" }
    ];

    const conditionBeforeBiteOptions = [
        { label: "Healthy", value: "healthy" },
        { label: "Sick", value: "sick" },
        { label: "Unknown", value: "unknown" }
    ]

    const animalCauseOfDeathOptions = [
        { label: "Sick", value: "sick" },
        { label: "Slaughtered", value: "slaughtered" },
        { label: "Found Dead", value: "found_dead" },
        { label: "Accident", value: "accident" }
    ]


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

    const handleBodyPartClick = (part) => {
        setSelectedBodyPart(part);
        const locs = bodyPartLocations[part] || [];
        setSpecificLocations(locs);
        setSelectedSpecificLocation("");
    };

    const handlePostExposureChange = (e) => {
        setShowOthers(e.target.value === 'others');
    };
      
    const handleActiveImmunizationChange = (e) => {
        setShowActiveImmunenization(e.target.value === 'yes');
    };

    const handleTypeOfAnimalChange = (e) => {
        setShowTypeOfAnimalOthers(e.target.value === 'others');
    };

    const handleSpecifyVaccineChange = (e) => {
        setShowSpecifyVaccine(e.target.value === 'yes');
    };

    const handleSpecifyContactChange = (e) => {
        setShowSpecifyContact(e.target.value === 'yes');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const animal_bite_case = await createAnimalBite(
                visitId,
                patientId, 
                formData
            );
            
            toast({ 
                title: `Submit success (Case ID: ${animal_bite_case})`, 
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
                <form id="myForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <div className="inputBox">
                            <label className='required'>Date of Bite</label>
                            <input
                                type="date"
                                name="dateOfBite"
                                placeholder="Enter Date of Bite"
                                value={formData.dateOfBite}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Site of Bite ( PLEASE CHECK ALL APPLICABLE CHOICES ):</label>
                            {siteOfBiteOptions.map(({ group, options }) => (
                                <div key={group} className="checkbox-4-grid">
                                    {options.map(({ label, value }) => (
                                        <label key={value} className="checkbox-label">
                                            <input
                                            type="checkbox"
                                            name="siteOfBite"
                                            value={value}
                                            checked={formData.siteOfBite.includes(value)}
                                            onChange={handleChange}
                                        />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <div className="input-group">
                        <label>Click a body part</label>
                        <div className="input-box site-bite-left">
                            <div className="site-bite-caption">Click on a body part to select</div>
                            <div className="body-figure-box">
                                <svg viewBox="0 0 120 260" width="100%" height="220" preserveAspectRatio="xMidYMid meet">
                                    <circle cx="60" cy="28" r="18" className={`bf-region ${selectedBodyPart === 'Face' || selectedBodyPart === 'Head' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Face')}><title>Face</title></circle>
                                    <rect x="28" y="50" width="64" height="70" rx="4" className={`bf-region ${selectedBodyPart === 'Torso' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Torso')} ><title>Torso</title></rect>
                                    <rect x="4" y="58" width="24" height="16" rx="2" className={`bf-region ${selectedBodyPart === 'Left Arm' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Left Arm')} ><title>Left Arm</title></rect>
                                    <rect x="4" y="75" width="24" height="16" rx="2" className={`bf-region ${selectedBodyPart === 'Left Arm' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Left Arm')} ><title>Left Arm</title></rect>
                                    <rect x="92" y="58" width="24" height="16" rx="2" className={`bf-region ${selectedBodyPart === 'Right Arm' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Right Arm')} ><title>Right Arm</title></rect>
                                    <rect x="92" y="75  " width="24" height="16" rx="2" className={`bf-region ${selectedBodyPart === 'Right Arm' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Right Arm')} ><title>Right Arm</title></rect>
                                    <rect x="34" y="126" width="18" height="72" rx="2" className={`bf-region ${selectedBodyPart === 'Left Leg' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Left Leg')} ><title>Left Leg</title></rect>
                                    <rect x="34" y="200" width="18" height="12" rx="2" className={`bf-region ${selectedBodyPart === 'Left Leg' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Left Foot')} ><title>Left Foot</title></rect>
                                    <rect x="68" y="126" width="18" height="72" rx="2" className={`bf-region ${selectedBodyPart === 'Right Leg' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Right Leg')} ><title>Right Leg</title></rect>
                                    <rect x="68" y="200" width="18" height="12" rx="2" className={`bf-region ${selectedBodyPart === 'Right Leg' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Right Foot')} ><title>Right Foot</title></rect>
                                </svg>
                            </div>
                        </div>
                        <div className="input-box site-bite-right">
                            <label className="required">Specific Location</label>
                            <select name="specificLocation" value={selectedSpecificLocation} onChange={(e) => { setSelectedSpecificLocation(e.target.value); handleChange(e); }} className="site-select" required>
                                <option value="" hidden >Select specific location</option>
                                {specificLocations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div> */}
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Category of Exposure:</label>
                            <div className="radio-set">
                                <label>
                                    <input
                                        type="radio"
                                        name="categoryOfExposure"
                                        value="category_ii"
                                        checked={formData.categoryOfExposure === 'category_ii'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>Category II</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="categoryOfExposure"
                                        value="category_iii"
                                        checked={formData.categoryOfExposure === 'category_iii'}
                                        onChange={handleChange}
                                    />
                                    <span>Category III</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Place Bitten:</label>
                            <div className="checkbox-3-grid">
                                {placeBittenOptions.map(({ label, value }) => (
                                    <label key={value} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="placeBitten"
                                            value={value}
                                            checked={formData.placeBitten.includes(value)}
                                            onChange={handleChange}
                                        />
                                        {label}
                                    </label>    
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="addRecord-modal-header">
                        <h2 className="addRecord-modal-title">
                            Post Exposure Treatment
                        </h2>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Post Exposure Treatment</label>
                            <div className="checkbox-2-grid">
                                {postExposureOptions.map(({ label, value }) => (
                                    <label key={value} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="postExposureTreatment"
                                            value={value}
                                            checked={formData.postExposureTreatment.includes(value)}
                                            onChange={handleChange}
                                        />
                                        {label}
                                    </label>    
                                ))}
                            </div>
                        </div>
                        {formData.postExposureTreatment.includes('others') && (
                            <div className="input-box">
                                <label className="required">Others (specify):</label>
                                <input type="text" name="otherPostExposureTreatment" required className="site-select" value={formData.otherPostExposureTreatment} onChange={handleChange} />
                            </div>
                        )}
                    </div>

                    <div className="addRecord-modal-header">
                        <h2 className="addRecord-modal-title">
                            Anti-Tetanus Immunization Given
                        </h2>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Anti-Tetanus Immunization Given</label>
                            <div className="radio-set">
                                <label>
                                    <input
                                        type="radio"
                                        name="antiTetanus"
                                        value="ats_tig"
                                        checked={formData.antiTetanus === 'ats_tig'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>ATS/TIG</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="antiTetanus"
                                        value="tetanus_toxoid"
                                        checked={formData.antiTetanus === 'tetanus_toxoid'}
                                        onChange={handleChange}
                                    />
                                    <span>Tetanus Toxoid</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {formData.antiTetanus && (
                        <>
                            <div className="input-group">
                                <div className="input-box">
                                    <label className="required">Vaccine/Serum Name:</label>
                                    <input type="text" name="antiTetanusVaccineName" required={formData.antiTetanus ? true : false} className="site-select" value={formData.antiTetanusVaccineName ?? ''} onChange={handleChange} />
                                </div>
                                <div className="input-box">
                                    <label className="required">When Given:</label>
                                    <input type="Date" name="antiTetanusDate" required={formData.antiTetanus ? true : false} className="site-select" value={formData.antiTetanusDate ?? ''} onChange={handleChange} />
                                </div>
                                <div className="input-box">
                                    <label className="required">Where Given:</label>
                                    <input type="text" name="antiTetanusWhere" required={formData.antiTetanus ? true : false} className="site-select" value={formData.antiTetanusWhere ?? ''} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="input-box">
                                    <label className="required">Antibiotics Given:</label>
                                    <input type="text" placeholder="Enter Antibiotics Given" name="antibioticsGiven" className="site-select" value={formData.antibioticsGiven ?? ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="addRecord-modal-header">
                                <h3 className="addRecord-modal-title">
                                    a. Immunization Provided
                                </h3>
                            </div>
                            <div className="input-group">
                                <div className="input-box">
                                    <label className="required">Active Immunization:</label>
                                    <div className="radio-set">
                                        <label>
                                            <input
                                                type="radio"
                                                name="activeImmunization"
                                                value="yes"
                                                checked={formData.activeImmunization === 'yes'}
                                                onChange={handleChange}
                                                required
                                            />
                                            <span>Yes</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="activeImmunization"
                                                value="no"
                                                checked={formData.activeImmunization === 'no'}
                                                onChange={handleChange}
                                            />
                                            <span>No</span>
                                        </label>
                                    </div>
                                </div>
                                {formData.activeImmunization === 'yes' && (
                                    <div className="input-box">
                                        <label className="required">ID/IM:</label>
                                        <div className="checkbox-2-grid">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="idOrIm"
                                                    value="pcec"
                                                    checked={formData.idOrIm.includes("pcec")}
                                                    onChange={handleChange}
                                                />
                                                PCEC
                                            </label>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="idOrIm"
                                                    value="pvrv"
                                                    checked={formData.idOrIm.includes("pvrv")}
                                                    onChange={handleChange}
                                                />
                                                PVRV
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {formData.activeImmunization === 'yes' && (
                                <>
                                    <div className="input-group-checkbox-grid">
                                        {/* <div className="input-box">
                                            <label className="required">Date Given:</label>
                                            <div className="checkbox-2-grid">
                                                {activeImmunizationDateOptions.map(({ label, value }) => (
                                                    <label key={value} className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            name="activeImmunizationDate"
                                                            value={value}
                                                            checked={formData.activeImmunizationDate.includes(value)}
                                                            onChange={(e) => { handlePostExposureChange(e); handleChange(e); }}
                                                        />
                                                        {label}
                                                    </label>   
                                                ))}
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        name="activeImmunizationDate"
                                                        value="d0"
                                                        checked={formData.activeImmunizationDate.includes("d0")}
                                                        onChange={handleChange}
                                                    />
                                                    D0
                                                </label>
                                                
                                            </div>
                                        </div> */}
                                        <label className="required">Date Given:</label>
                                        <div className="checkbox-date-grid">
                                            <div className="checkbox-date-item">
                                                <label className="checkbox-label">
                                                    <input 
                                                        type="checkbox" 
                                                        name="activeImmunizationDate" 
                                                        value="d0Status" 
                                                        checked={formData.activeImmunizationDate.includes("d0Status")} 
                                                        onChange={handleChange}
                                                    />
                                                    D0
                                                </label>
                                                <label className="date-label">Date:</label>
                                                <DatePicker
                                                    selected={formData.dateD0 ? new Date(formData.dateD0) : null}
                                                    onChange={(date) =>
                                                        handleChange({ target: { name: "dateD0", value: date } })
                                                    }
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="Select date"
                                                    disabled={!formData.activeImmunizationDate.includes("d0Status")}
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    showMonthDropdown
                                                    yearDropdownItemNumber={124}
                                                    minDate={new Date('1900-01-01')}
                                                />
                                            </div>

                                            <div className="checkbox-date-item">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        name="activeImmunizationDate"
                                                        value="d3Status"
                                                        checked={formData.activeImmunizationDate.includes("d3Status")}
                                                        onChange={handleChange}
                                                    />
                                                    D3
                                                </label>
                                                <label className="date-label">Date:</label>
                                                <DatePicker
                                                    selected={formData.dateD3 ? new Date(formData.dateD3) : null}
                                                    onChange={(date) =>
                                                        handleChange({ target: { name: "dateD3", value: date } })
                                                    }
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="Select date"
                                                    disabled={!formData.activeImmunizationDate.includes("d3Status")}
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    showMonthDropdown
                                                    yearDropdownItemNumber={124}
                                                    minDate={new Date('1900-01-01')}
                                                />
                                            </div>

                                            <div className="checkbox-date-item">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        name="activeImmunizationDate"
                                                        value="d7Status"
                                                        checked={formData.activeImmunizationDate.includes("d7Status")}
                                                        onChange={handleChange}
                                                    />
                                                    D7
                                                </label>
                                                <label className="date-label">Date:</label>
                                                <DatePicker
                                                    selected={formData.dateD7 ? new Date(formData.dateD7) : null}
                                                    onChange={(date) =>
                                                        handleChange({ target: { name: "dateD7", value: date } })
                                                    }
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="Select date"
                                                    disabled={!formData.activeImmunizationDate.includes("d7Status")}
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    showMonthDropdown
                                                    yearDropdownItemNumber={124}
                                                    minDate={new Date('1900-01-01')}
                                                />
                                            </div>

                                            <div className="checkbox-date-item">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        name="activeImmunizationDate"
                                                        value="d30Status"
                                                        checked={formData.activeImmunizationDate.includes("d30Status")}
                                                        onChange={handleChange}
                                                    />
                                                    D30
                                                </label>
                                                <label className="date-label">Date:</label>
                                                <DatePicker
                                                    selected={formData.dateD30 ? new Date(formData.dateD30) : null}
                                                    onChange={(date) =>
                                                        handleChange({ target: { name: "dateD30", value: date } })
                                                    }
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="Select date"
                                                    disabled={!formData.activeImmunizationDate.includes("d30Status")}
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    showMonthDropdown
                                                    yearDropdownItemNumber={124}
                                                    minDate={new Date('1900-01-01')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="input-box">
                                            <label>PREVIOUS ARV VACC:</label>
                                            <input type="text" name="previousArvVacc" placeholder="Previous ARV Vacc" className="site-select" value={formData.previousArvVacc ?? ''} onChange={handleChange} />
                                        </div>
                                        <div className="input-box">
                                            <label className={formData.previousArvVacc ? "required" : ""}>When:</label>
                                            <input 
                                                type="date" 
                                                name="PrevArvVaccDate" 
                                                className="site-select" 
                                                required={!!formData.previousArvVacc}
                                                value={formData.PrevArvVaccDate ?? ''} 
                                                onChange={handleChange} 
                                            />
                                        </div>
                                        <div className="input-box">
                                            <label className={formData.previousArvVacc ? "required" : ""}>Vacc:</label>
                                            <input 
                                                type="text" 
                                                placeholder="Enter Vacc" 
                                                name="vacc" 
                                                className="site-select" 
                                                required={!!formData.previousArvVacc}
                                                value={formData.vacc ?? ''} 
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="input-group">
                                <div className="input-box">
                                    <label className="required">Passive Immunization:</label>
                                    <div className="radio-set">
                                        <label>
                                            <input
                                                type="radio"
                                                name="passiveImmunization"
                                                value="yes"
                                                checked={formData.passiveImmunization === 'yes'}
                                                onChange={handleChange}
                                                required
                                            />
                                            <span>Yes</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="passiveImmunization"
                                                value="no"
                                                checked={formData.passiveImmunization === 'no'}
                                                onChange={handleChange}
                                            />
                                            <span>No</span>
                                        </label>
                                    </div>
                                </div>
                                {formData.passiveImmunization === 'yes' && (
                                        <div className="input-box">
                                            <label className="required">Date Given:</label>
                                            <DatePicker
                                                selected={formData.passiveImmunizationDate ? new Date(formData.passiveImmunizationDate) : null}
                                                onChange={(date) =>
                                                    handleChange({ target: { name: "passiveImmunizationDate", value: date } })
                                                }
                                                dateFormat="MM/dd/yyyy"
                                                placeholderText="Select date"
                                                disabled={!!formData.passiveImmunizationDate}
                                                showYearDropdown
                                                scrollableYearDropdown
                                                showMonthDropdown
                                                yearDropdownItemNumber={124}
                                                minDate={new Date('1900-01-01')}
                                                maxDate={new Date()}
                                            />
                                        </div>
                                )}
                            </div>
                            {formData.passiveImmunization === 'yes' && (
                                <>
                                    <div className="input-group-checkbox-grid">
                                        <label className="required">Type of Immunoglobulin:</label>
                                        <div className="checkbox-date-1-grid">
                                            <div className="checkbox-date-item">
                                                <label className="checkbox-label">
                                                    <input 
                                                        type="checkbox" 
                                                        name="typeOfImmunoglobulin" 
                                                        value="erig" 
                                                        checked={formData.typeOfImmunoglobulin.includes("erig")} 
                                                        onChange={handleChange} 
                                                    />
                                                    ERIG
                                                </label>
                                                <input 
                                                    type="number"
                                                    name="erigVolume"
                                                    value={formData.erigVolume}
                                                    onChange={handleChange}
                                                    disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                                                    min={0} 
                                                    //max={200} 
                                                    step="0.1" 
                                                    placeholder="ml" 
                                                />
                                                <label className="ml-label">ml. (40 IU/kg body weight)</label>
                                            </div>
                                        </div>
                                    </div>
                                    {formData.typeOfImmunoglobulin.includes("erig") && (
                                        <div className="input-group">
                                            <div className="input-box">
                                                <label className="required">When Given:</label>
                                                <input 
                                                    type="Date" 
                                                    name="erigDate" 
                                                    required={formData.typeOfImmunoglobulin.includes("erig")} 
                                                    disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                                                    className="site-select" 
                                                    value={formData.erigDate ?? ''} 
                                                    onChange={handleChange} />
                                            </div>
                                            <div className="input-box">
                                                <label className="required">Where Given:</label>
                                                <input 
                                                    type="text" 
                                                    name="erigWhere" 
                                                    required={formData.typeOfImmunoglobulin.includes("erig")} 
                                                    disabled={!formData.typeOfImmunoglobulin.includes("erig")}
                                                    className="site-select" 
                                                    value={formData.erigWhere ?? ''} 
                                                    onChange={handleChange} />
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="input-group-checkbox-grid">
                                        <div className="checkbox-date-1-grid">
                                             <div className="checkbox-date-item">
                                                <label className="checkbox-label">
                                                    <input 
                                                        type="checkbox" 
                                                        name="typeOfImmunoglobulin" 
                                                        value="hrig" 
                                                        checked={formData.typeOfImmunoglobulin.includes("hrig")} 
                                                        onChange={handleChange} 
                                                    />
                                                    HRIG
                                                </label>
                                                <input 
                                                    type="number"
                                                    name="hrigVolume"
                                                    value={formData.hrigVolume}
                                                    onChange={handleChange}
                                                    disabled={!formData.typeOfImmunoglobulin.includes("hrig")}
                                                    min={0} 
                                                    //max={200} 
                                                    step="0.1" 
                                                    placeholder="ml" 
                                                />
                                                <label className="ml-label">ml. (20 IU/kg body weight)</label>
                                             </div>
                                        </div>
                                    </div>
                                    {formData.typeOfImmunoglobulin.includes("hrig") && (
                                        <div className="input-group">
                                            <div className="input-box">
                                                <label className={formData.typeOfImmunoglobulin.includes("hrig") ? "required" : ""} >When Given:</label>
                                                <input 
                                                    type="Date" 
                                                    name="hrigDate" 
                                                    required={formData.typeOfImmunoglobulin.includes("hrig")} 
                                                    disabled={!formData.typeOfImmunoglobulin.includes("hrig")}
                                                    className="site-select" 
                                                    value={formData.hrigDate ?? ''} 
                                                    onChange={handleChange} />
                                            </div>
                                            <div className="input-box">
                                                <label className="required">Where Given:</label>
                                                <input 
                                                    type="text" 
                                                    name="hrigWhere" 
                                                    required={formData.typeOfImmunoglobulin.includes("hrig")} 
                                                    disabled={!formData.typeOfImmunoglobulin.includes("hrig")}
                                                    className="site-select" 
                                                    value={formData.hrigWhere ?? ''} 
                                                    onChange={handleChange} />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}


                    <div className="addRecord-modal-header">
                        <h2 className="addRecord-modal-title">
                            Animal profile
                        </h2>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Species:</label>
                            <div className="radio-set">
                                {speciesOptions.map(({ label, value }) => (
                                    <label key={value}>
                                        <input
                                            type="radio"
                                            name="species"
                                            value={value}
                                            checked={formData.species === value}
                                            onChange={(e) => { handleChange(e); }}
                                        />
                                        <span>{label}</span>
                                    </label>    
                                ))}
                            </div>
                        </div>
                        {formData.species === 'others' && (
                            <div className="input-box">
                                <label className="required">Specify Type Of Animal:</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter animal type" 
                                    name="specifyTypeOfAnimal" 
                                    className="site-select" 
                                    required={!!formData.species}
                                    value={formData.specifyTypeOfAnimal} 
                                    onChange={handleChange} />
                            </div>
                        )}
                    </div>

                    {/* <div className="input-group">
                        <div className="input-box">
                            <label className="required">Type of Animal</label>
                            <select name="typeOfAnimal" required className="selectBox" onChange={(e) => { handleTypeOfAnimalChange(e); handleChange(e); }} value={formData.typeOfAnimal ?? ''}>
                                <option value="" hidden >Select</option>
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                                <option value="monkey">Monkey</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        {showTypeOfAnimalOthers && (
                            <div className="input-box">
                                <label className="required">Please specify</label>
                                <input ref={typeOfAnimalSpecifyRef} type="text" placeholder="Specify" name="specifyTypeOfAnimal" className="site-select" required value={formData.specifyTypeOfAnimal ?? ''} onChange={handleChange} />
                            </div>
                        )}
                    </div> */}

                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Age of Animal:</label>
                            <input 
                                type="number" 
                                placeholder="Age" 
                                name="ageOfAnimal" 
                                className="site-select" 
                                required 
                                value={formData.ageOfAnimal} 
                                onChange={handleChange} 
                                min={1} 
                                max={155} 
                                step="1"
                            />
                        </div>
                        <div className="input-box">
                            <label className="required">Age of Animal Unit:</label>
                            <select 
                                name="ageOfAnimalUnit" 
                                value={formData.ageOfAnimalUnit} 
                                onChange={handleChange}
                                className="selectBox"
                            >
                                <option value="" hidden >Select</option>
                                <option value="years">Years</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Containment Status:</label>
                            <div className="radio-set">
                                {containmentStatusOptions.map(({ label, value }) => (
                                    <label key={value}>
                                        <input
                                            type="radio"
                                            name="animalContainmentStatus"
                                            value={value}
                                            checked={formData.animalContainmentStatus === value}
                                            onChange={(e) => { handleChange(e); }}
                                        />
                                        <span>{label}</span>
                                    </label>    
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Name of Owner:</label>
                            <input type="text" placeholder="Name of Owner" name="ownerOfAnimal" className="site-select" required value={formData.ownerOfAnimal ?? ''} onChange={handleChange} />
                        </div>
                        <div className="input-box">
                            <label className="required">Owner's Contact #:</label>
                            <input type="tel" name="ownerContact" value={formData.ownerContact} placeholder="Contact #" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Address of the Owner:</label>
                            <textarea
                                name="ownerAddress"
                                value={formData.ownerAddress}
                                onChange={handleChange}
                                placeholder="Enter address here..."
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Was the animal vaccinated?</label>
                            <div className="radio-set">
                                <label>
                                    <input
                                        type="radio"
                                        name="wasAnimalVaccinated"
                                        value="yes"
                                        checked={formData.wasAnimalVaccinated === 'yes'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>Yes</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="wasAnimalVaccinated"
                                        value="no"
                                        checked={formData.wasAnimalVaccinated === 'no'}
                                        onChange={handleChange}
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {formData.wasAnimalVaccinated === "yes" && (
                        <div className="input-group">
                            <div className="input-box">
                                <label>Date of Vaccination:</label>
                                <input type="date" placeholder="Name of Owner" name="dateOfAnimalVaccination" className="site-select" value={formData.dateOfAnimalVaccination} onChange={handleChange} />
                            </div>
                            <div className="input-box">
                                <label>Type of Vaccine:</label>
                                <input type="text" placeholder="Name of Owner" name="animalVaccineType" className="site-select" value={formData.animalVaccineType} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">In contact with other animals?</label>
                            <div className="radio-set">
                                <label>
                                    <input
                                        type="radio"
                                        name="contactWithOtherAnimals"
                                        value="yes"
                                        checked={formData.contactWithOtherAnimals === 'yes'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>Yes</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="contactWithOtherAnimals"
                                        value="no"
                                        checked={formData.contactWithOtherAnimals === 'no'}
                                        onChange={handleChange}
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {formData.contactWithOtherAnimals === "yes" && (
                        <div className="input-group">
                            <div className="input-box">
                                <label className="required">What kind of Animal/s:</label>
                                <input type="text" placeholder="Name of Owner" name="animalTypeContacted" className="site-select" required value={formData.animalTypeContacted} onChange={handleChange} />
                            </div>
                            <div className="input-box">
                                <label className="required">How many:</label>
                                <input 
                                    type="number" 
                                    placeholder="Name of Owner" 
                                    name="animalContactCount" 
                                    className="site-select" 
                                    required 
                                    value={formData.animalContactCount} 
                                    onChange={handleChange} 
                                    min={1} 
                                    max={5000}
                                    step="1"
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Condition before the bite:</label>
                            <div className="radio-set">
                                {conditionBeforeBiteOptions.map(({ label, value }) => (
                                    <label key={value}>
                                        <input
                                            type="radio"
                                            name="conditionBeforeBite"
                                            value={value}
                                            checked={formData.conditionBeforeBite === value}
                                            onChange={(e) => { handleChange(e); }}
                                        />
                                        <span>{label}</span>
                                    </label>    
                                ))}
                            </div>
                        </div>
                        {formData.conditionBeforeBite === "sick" && (
                            <div className="input-box">
                                <label className="required">If sick, since when?:</label>
                                <input 
                                    type="date" 
                                    name="sickSince" 
                                    className="site-select" 
                                    value={formData.sickSince} 
                                    onChange={handleChange} 
                                />
                            </div>
                    )}
                    </div>
                    
                    <div className="input-group">
                        <div className="input-box">
                            <label>If animal is dead, when?</label>
                            <input 
                                type="date" 
                                name="animalDeathDate" 
                                className="site-select" 
                                value={formData.animalDeathDate} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    {formData.animalDeathDate && (
                        <div className="input-group">
                            <div className="input-box">
                                <label className="required">Cause of Death:</label>
                                <div className="radio-set">
                                    {animalCauseOfDeathOptions.map(({ label, value }) => (
                                        <label key={value}>
                                            <input
                                                type="radio"
                                                name="animalCauseOfDeath"
                                                value={value}
                                                checked={formData.animalCauseOfDeath === value}
                                                onChange={(e) => { handleChange(e); }}
                                            />
                                            <span>{label}</span>
                                        </label>    
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}  

                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">If rabies is suspected, what are the clinical manifestation observed?</label>
                            <textarea
                                name="rabiesClinicalSigns"
                                value={formData.rabiesClinicalSigns}
                                onChange={handleChange}
                                placeholder="Enter details here..."
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-box">
                            <label className="required">Animal Status ( 14 days observation )</label>
                            <input 
                                type="date" 
                                name="animalObservationDate" 
                                className="site-select" 
                                value={formData.animalObservationDate} 
                                onChange={handleChange} 
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
                        form="myForm"
                        className="save-button"
                    >
                        {editingRecord ? 'Update Record' : 'Save Record'}
                    </button>
                </div>
            </div>
        </div>
    );
}