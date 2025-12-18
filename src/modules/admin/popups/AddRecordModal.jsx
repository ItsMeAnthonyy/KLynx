import { useState, useEffect, useRef } from 'react';
import { BiX, BiCapsule, BiSearch, BiUser, BiCalendar, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";

import useAuth from '../../../hooks/useAuth';
import { createDoctorsOrder } from '../api/doctorsOrderApi';
import PropTypes from 'prop-types';
import './AddRecordModal.css';
import ICD10SearchModal from './ICD10SearchModal';
import PrescriptionListModal from './PrescriptionListModal';
import "../../../components/css/FileMaintenance.css";




export default function AddRecordModal({ isOpen, onClose, recordType, patientId, visitId, onSubmit, editingRecord, isReadOnly }) {
  const doctors = [
    { id: 'dr_smith', name: 'Dr. Smith' },
    { id: 'dr_jones', name: 'Dr. Jones' },
    { id: 'dr_brown', name: 'Dr. Brown' },
  ];
  console.log("RECORD TYPE?",recordType);

  const { auth } = useAuth();
  const isAdmin  = auth?.userRole?.includes("admin");

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
  const [showICD10Modal, setShowICD10Modal] = useState(false);
  const [activeIcdField, setActiveIcdField] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  

  const [formData, setFormData] = useState({
   
    // General checkup fields
    checkupDate: new Date().toISOString().split('T')[0],
    doctor: '',
    chiefComplaint: '',
    doctorNotes: '',
    medicineName: '',
    pulseRate: '',
    dosage: '',
    duration: '',
    frequency: '',
    height: '',
    weight: '',
   
    // Prenatal fields
   dateVisit: new Date().toISOString().split('T')[0],
   AOG: '',
   BPS: '',
   PR: '',
    HT: '',
    WT: '',
    BMI: '',
    Temp: '',
    doc: '',
    ccomplaint: '',
    MidwifeNotes: '',

  
    
    // Dental fields
    dateVisitDental: new Date().toISOString().split('T')[0],
    procedureDental: '',
    toothNumber: '',
    treatmentPlanDental: '',
    nextVisitDental: '',
    dentistName: '',

    // Animal Bite fields
    dateOfBite: '',
    specificLocation: '',
    isVaccinated: '',
    categExpo: '',
    placeBitten: '',
    postExposureTreatment: '',
    postExposureSpecify: '',
    'Anti-Tetanus': '',
    AntiTetaSpecify: '',
    AntiTetaDate: '',
    AntiTetaWhere: '',
    AntiBioticsGiven: '',
    activeImmunization: '',
    IDIM: '',
    dateGiven: '',
    PrevArvVacc: '',
    activeDateGiven: '',
    PrevArvVaccDate: '',
    Vacc:'',
    passiveImmunization: '',
    PassiveImmunizationDate: '',
    typeOfImmunoglobulin: '',
    SpecifyTypeofImmuno: '',
    TypeofImmunoDate: '',
    whereGivenImmuno: '',
    typeOfAnimal: '',
    specifyTypeOfAnimal: '',
    ageOwner: '',
    containment:'',
    nameOfOwner: '',
    Vaccdate:'',
    typeOfVaccine: '',
    isInContactWithAnimal: '',
    specifyContact: '',
    conditionBefore: '',
    howMany: '',
    isAnimalDead: '',
    AnimalDeadDate: '',
    causeOfDeath: '',
    clinicalManifestation: '',
    animalStatus: '',
    animalStatusDate: '',

    //immunization fields
    Recdate: new Date().toISOString().split('T')[0],
    patientId: '',
    familyId: '',
    lastName: '',
    firstName: '',
    middleName: '',
    suffix: '',
    birthDate: '',
    age: '',
    sex: '',
    timeOfBirth: '',
    placeOfBirth: '',
    birthWeight: '',
    birthHeight: '',
    attendedBy: '',
    newBornScreening: '',
    bcg: '',
    hepB: '',
    vitK: '',
    typeOfBirth: '',
    gestationalAgeBirth: '',
    weeksAtBirth: '',
    facilityOwnership: '',
    facilityType: '',
    facilityName: '',
    ageInMonths: '',
    heightInCm: '',
    weightInKg: '',
    temperatureRec: '',
    FPmethod: '',
    antigen: '',
    vaccinatorName: '',
    nextVisitImmune: '',


    //Prescription fields
    prescribedBy: '',
    medicationName: '',
    prescdosage: '',
    prescduration: '',
    prescfrequency: '',
    specialInstructions: '',
    followUpDate: '',
    datePresc: new Date().toISOString().split('T')[0],
  });

  // State for multiple medications
  const [medications, setMedications] = useState([
    { medicationName: '', dosage: '', frequency: '', duration: '' }
  ]);

  // Populate form data when editing
  useEffect(() => {
    if (editingRecord) {
      setFormData(prev => ({
        ...prev,
        ...editingRecord
      }));
      
      // If editing prescription with multiple medications, parse them
      if (recordType === 'prescription' && editingRecord.medicationName) {
        const names = editingRecord.medicationName.split(',').map(s => s.trim());
        const dosages = (editingRecord.prescdosage || '').split(',').map(s => s.trim());
        const frequencies = (editingRecord.prescfrequency || '').split(',').map(s => s.trim());
        const durations = (editingRecord.prescduration || '').split(',').map(s => s.trim());
        
        const parsedMeds = names.map((name, index) => ({
          medicationName: name,
          dosage: dosages[index] || '',
          frequency: frequencies[index] || '',
          duration: durations[index] || ''
        }));
        
        setMedications(parsedMeds.length > 0 ? parsedMeds : [{ medicationName: '', dosage: '', frequency: '', duration: '' }]);
      }
    } else {
      // Reset medications when not editing (adding new record)
      setMedications([{ medicationName: '', dosage: '', frequency: '', duration: '' }]);
    }
  }, [editingRecord, recordType]);

  // Reset medications when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMedications([{ medicationName: '', dosage: '', frequency: '', duration: '' }]);
    }
  }, [isOpen]);

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




  // Handle medication field changes
  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  // Add new medication row
  const handleAddMedication = () => {
    setMedications([...medications, { medicationName: '', dosage: '', frequency: '', duration: '' }]);
  };

  // Remove medication row
  const handleRemoveMedication = (index) => {
    if (medications.length > 1) {
      const updatedMedications = medications.filter((_, i) => i !== index);
      setMedications(updatedMedications);
    }
  };

  const handlePrescriptionModalClose = () => {
    setShowPrescriptionModal(false);
    fetchPrescriptionCount();
  };

  const handleOpenICD10Search = (field) => {
    setActiveIcdField(field);
    setShowICD10Modal(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      await createDoctorsOrder(
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
      
    } catch (err) {
      console.error("Error submitting form:", err);
    }
    

    // let submitData = {
    //   ...formData,
    //   type: recordType,
    //   date: new Date().toISOString().split('T')[0]
    // };
    
    // For prescription type, combine medications array into comma-separated strings
    // if (recordType === 'prescription') {
    //   submitData.medicationName = medications.map(m => m.medicationName).join(', ');
    //   submitData.prescdosage = medications.map(m => m.dosage).join(', ');
    //   submitData.prescfrequency = medications.map(m => m.frequency).join(', ');
    //   submitData.prescduration = medications.map(m => m.duration).join(', ');
    // }
    console.log("TEST2: ", doctorsOrderForm);

    //const createdRecord = await onSubmit(submitData);

    //onClose();
    
    // Reset medications state
    setMedications([{ medicationName: '', dosage: '', frequency: '', duration: '' }]);

    // if (createdRecord?.id) {
    //   navigate(`/visits/${createdRecord.id}`);
    // }
  };

   const [selectedBodyPart, setSelectedBodyPart] = useState("");
      const [specificLocations, setSpecificLocations] = useState([]);
      const [selectedSpecificLocation, setSelectedSpecificLocation] = useState("");
  
      const bodyPartLocations = {
          Face: [
              'Forehead',
              'Eyebrow',
              'Eyes',
              'Nose',
              'Cheek',
              'Upper Lip',
              'Lower Lip',
              'Chin',
              'Jaw',
              'Neck',
              'Nape',
              'Ears',
              'Scalp'
          ],
          Head: ['Scalp', 'Temple', 'Forehead'],
          Torso: ['Chest', 'Abdomen', 'Back'],
          'Left Arm': ['Upper Arm', 'Elbow', 'Forearm', 'Wrist', 'Hand', 'Fingers'],
          'Right Arm': ['Upper Arm', 'Elbow', 'Forearm', 'Wrist', 'Hand', 'Fingers'],
          'Left Leg': ['Thigh', 'Knee', 'Shin', 'Ankle', 'Foot', 'Toes'],
          'Right Leg': ['Thigh', 'Knee', 'Shin', 'Ankle', 'Foot', 'Toes']
      };
  
      const handleBodyPartClick = (part) => {
          setSelectedBodyPart(part);
          const locs = bodyPartLocations[part] || [];
          setSpecificLocations(locs);
          setSelectedSpecificLocation("");
      };
  
      const [showOthers, setShowOthers] = useState(false);
      const postExposureSpecifyRef = useRef(null);
      const typeOfAnimalSpecifyRef = useRef(null);
      const specifyContactRef = useRef(null);
  
      // Declare conditional state variables here so they are initialized
      // before any useEffect that references them (avoid TDZ reference errors)
      const [ShowActiveImmunenization, setShowActiveImmunenization] = useState(false);
      const [showTypeOfAnimalOthers, setShowTypeOfAnimalOthers] = useState(false);
      const [showSpecifyVaccine, setShowSpecifyVaccine] = useState(false);
      const [showSpecifyContact, setShowSpecifyContact] = useState(false);
  
      // Autofocus the 'Please Specify' / conditional inputs when they appear
      useEffect(() => {
          if (showOthers && postExposureSpecifyRef.current) {
              postExposureSpecifyRef.current.focus();
          }
      }, [showOthers]);
  
      useEffect(() => {
          if (showTypeOfAnimalOthers && typeOfAnimalSpecifyRef.current) {
              typeOfAnimalSpecifyRef.current.focus();
          }
      }, [showTypeOfAnimalOthers]);
  
      useEffect(() => {
          if (showSpecifyContact && specifyContactRef.current) {
              specifyContactRef.current.focus();
          }
      }, [showSpecifyContact]);
  
      // Show the 'Please Specify' input when user selects 'others'
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
  
  
    
  if (!isOpen) return null;

  
  

  return (
    <div className="addRecord-modal-overlay">
      <div className="addRecord-modal-content">
        <div className="addRecord-modal-header">
          <h2 className="addRecord-modal-title">
            {editingRecord ? 'Edit' : 'Add'} {recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record
            <button onClick={onClose} className="close-button">
              ✕
            </button>
          </h2>
        </div>

        {recordType === 'doctors-order' && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="inputBox">
                  <label className="required">Imaging</label>
                  <div className="checkbox-grid">
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
                  <div className="checkbox-grid">
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
                  <div className="checkbox-grid">
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
                  <div className="checkbox-grid">
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
          </>
        )}


        {recordType === 'general' && (
        <form onSubmit={handleSubmit}>
          {/* Basic Vitals */}
          <div className="form-grid">
            <div className="input-group">
              <div>

              <label className='required'>Date</label>
            
              <input
                type="text"
                name="checkupDate"
                value={formData.checkupDate}
                onChange={handleChange}
                required
                disabled
              />

             </div>
         
            <div>
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
            </div> 
          

          <div className="input-group">

          <div>
            <label className="required">Pulse Rate</label>
            <input
              name="pulseRate"
              value={formData.pulseRate}
              onChange={handleChange}
              type="text"
              required
            />
          </div> 
              <div>

              <label className='required'>Height</label>
            
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />

             </div>

            <div>

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
             <div className='inputBox'>

              <label className="required">Temperature</label>
              <input
                type="text"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                required
              
              />
            </div>
            <div className="inputBox">
              <label className="required">Doctor</label>
              <select
                name="doctor"
                className='selectBox'
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
                <div className="inputBox">
              <label className="required">Chief&apos;s Complaint</label>
              <textarea
                name="chiefComplaint"
                value={formData.chiefComplaint}
                className='selectBox'
                onChange={handleChange}
                required
              >
              </textarea>
              </div>
            </div>
              
              <div className="addRecord-modal-header">
                <h2 className="addRecord-modal-title">
                      Doctor&apos;s Diagnosis
                
                </h2>
          
              </div>

              <div className="input-group">
                <div className="inputBox">
              <label className="required">Diagnosis</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                className='selectBox'
                required
              />
              </div>

              <div className="inputBox">
              <label className="required">Doctor&apos;s Notes</label>
              <textarea
                name="doctorNotes"
                value={formData.doctorNotes}
                onChange={handleChange}
                className='selectBox'
                required
              />
              </div>

            </div>

             <div className="addRecord-modal-header">
                <h2 className="addRecord-modal-title">
                      Medication
                
                </h2>
              </div>

               <div className="input-group">
              <div>

              <label className='required'>Medicine Name</label>
            
              <input
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                required
              />

             </div>
         
            <div>
       
              <label className="required">Dosage</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                required
              />
            </div>
           </div>

            <div className="input-group">
            <div className='inputBox'>
              <label className="required">Duration</label>
              <select
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className='selectBox'
                required
              >
              <option value="">Select Duration</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="indefinite">Indefinite</option>
              <option value="others">Others</option>
              </select>
              
            </div> 
          


         

              <div>

              <label className='required'>Frequency</label>
            
               <select
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className='selectBox'
                required
              >
              <option value="">Select Frequency</option>
              <option value="twice">2x a day - Every 12 hours</option>
              <option value="thrice">3x a day - Every 8 hours</option>
              <option value="fourTimes">4x a day - Every 6 hours</option>
              <option value="bedtime">Every Bedtime</option>
              <option value="otherday">Every other day</option>
              <option value="once">Once a day</option>
              <option value="others">Others</option>
              </select>

             </div>
            </div>
          

        </form>
        )}

          {/* Prenatal Fields */}
          {recordType === 'prenatal' && (
           <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <div className="input-box">
                                    <label htmlFor="history-date" className='required'>Date:</label>
                                    <input type="date"
                                     id="history-date"
                                      name="dateVisit" 
                                      required 
                                      onChange={handleChange} 
                                      disabled
                                      value={formData.dateVisit}
                                      />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-aog" className='required'>AOG:</label>
                                    <input 
                                    type="text" 
                                    id="history-aog" 
                                    name="AOG" 
                                    required 
                                    onChange={handleChange} 
                                    value={formData.AOG}
                                    />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-bp" className='required'>Blood Pressure:</label>
                                    <input 
                                    type="text" 
                                    id="history-bp" 
                                    name="BPS" 
                                    required 
                                    onChange={handleChange} 
                                    value={formData.BPS} />
                                </div>
              
                                <div className="input-box">
                                    <label htmlFor="history-pr" className='required'>Pulse Rate:</label>
                                    <input 
                                    type="text" 
                                    id="history-pr" 
                                    name="PR" 
                                    required 
                                    onChange={handleChange} 
                                    value={formData.PR} />
                                </div>             
                            </div>
                            <div className="input-group">
                                <div className="input-box">
                                    <label htmlFor="history-ht" className='required'>Height:</label>
                                    <input 
                                    type="text" 
                                    id="history-ht" 
                                    name="HT" 
                                    required 
                                    onChange={handleChange} 
                                    value={formData.HT}
                                    />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-wt" className='required'>Weight:</label>
                                    <input type="text" id="history-wt" name="WT" required onChange={handleChange} value={formData.WT} />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-bmi" className='required'>BMI:</label>
                                    <input type="text" id="history-bmi" name="BMI" required onChange={handleChange} value={formData.BMI} />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-temp" className='required'>Temperature:</label>
                                    <input type="text" id="history-temp" name="Temp" required onChange={handleChange} value={formData.Temp} />
                                </div> 
                            </div>
                            <div className="input-group">
                                 <div className="inputBox">
                                    <label className="required">Doctor</label>
                                    <select
                                      name="doc"
                                      className='selectBox'
                                      value={formData.doc}
                                      onChange={handleChange}
                                      required
                                    >
                                      <option value="">Select Doctor</option>
                                        {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                          {doctor.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                <div className="input-box">
                                    <label htmlFor="history-cc" className='required'>Chief Complaints:</label>
                                    <input type="text" id="history-cc" name="ccomplaint" required onChange={handleChange} />
                                </div> 
                                <div className="input-box">
                                    <label htmlFor="history-note" className='required'>Nurse&apos;s/Midwife Note:</label>
                                    <div className="select-box">
                                    <textarea 
                                      name="MidwifeNotes" 
                                      value={formData.MidwifeNotes}
                                      onChange={handleChange}
                                      className='selectBox'
                                      required 
                                      >
                                    </textarea>
                                    
                                </div>
                                </div> 
                            </div>
                          </form>
          )}

          {/* Dental Fields */}
          {recordType === 'dental' && (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
              <div className="input-box">
                <label className="required">Procedure</label>
                <input
                  type="text"
                  name="procedureDental"
                  value={formData.procedureDental}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="required">Tooth Number</label>
                <input
                  type="text"
                  name="toothNumber"
                  value={formData.toothNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              </div>
              <div className="input-group">
              <div className="input-box">
                <label className="required">Treatment Plan</label>
                <textarea
                  name="treatmentPlanDental"
                  value={formData.treatmentPlanDental}
                  onChange={handleChange}
                  rows={3}
                  className="selectBox"
                  required
                />
              </div>
              <div className="input-box">
                <label className="required">Next Visit</label>
                <input
                  type="date"
                  name="nextVisitDental"
                  value={formData.nextVisitDental}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div className="input-box">
                <label className="required">Dentist Name</label>
                <input
                  type="text"
                  name="dentistName"
                  value={formData.dentistName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              </div>
            </form>
          )}

          {recordType === 'animal_bite' && (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-box">
                  <label className="required">Date of Bite</label>
                  <input
                    type="date"
                    placeholder="Enter Date of Bite"
                    name="dateOfBite"
                    required
                    value={formData.dateOfBite ?? ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

               <div className="addRecord-modal-header">
                <h2 className="addRecord-modal-title">
                      Site of Bite
                
                </h2>
              </div>

              
                <div className="input-group">
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
                                        <option value="">Select specific location</option>
                                        {specificLocations.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-box">
                                        <label className="required">Is the animal vaccinated?</label>
                                        <select name="isVaccinated" required className="selectBox" value={formData.isVaccinated ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>

                                    <div className="input-box">
                                        <label className="required">Category of Exposure</label>
                                        <select name="categExpo" required className="site-select" value={formData.categExpo ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="categ2">Category II</option>
                                            <option value="categ3">Category III</option>
                                        </select>
                                    </div>

                                    <div className="input-box">
                                        <label className="required">Place Bitten</label>
                                        <select name="placeBitten" required className="selectBox" value={formData.placeBitten ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="house">House</option>
                                            <option value="street">Street</option>
                                            <option value="neighbor">Neighbor</option>
                                            <option value="compound">Compound</option>
                                            <option value="others">Others</option>
                                        </select>
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
                                        <select name="postExposureTreatment" required className="selectBox" onChange={(e) => { handlePostExposureChange(e); handleChange(e); }} value={formData.postExposureTreatment ?? ''}>
                                            <option value="">Select</option>
                                            <option value="soap">Wounds washed with soap & water</option>
                                            <option value="disinfect">Applied disinfectant</option>
                                            <option value="tandok">Tandok</option>
                                            <option value="garlic">Used garlic</option>
                                            <option value="none">None</option>
                                            <option value="others">Others</option>

                                        </select>
                                    </div>
                            {showOthers && (
                                     <div className="input-box">
                                        <label className="required">Please Specify</label>
                                        <input ref={postExposureSpecifyRef} type="text" name="postExposureSpecify" required className="site-select" value={formData.postExposureSpecify ?? ''} onChange={handleChange} />
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
                                        <select name="Anti-Tetanus" required className="selectBox" value={formData['Anti-Tetanus'] ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="yes">ATS/TIG</option>
                                            <option value="no">Tetanus Taxoid</option>
                                        </select>
                                    </div>

                                    <div className="input-box">
                                        <label className="required">Please Specify</label>
                                           <input type="text" name="AntiTetaSpecify" required className="site-select" value={formData.AntiTetaSpecify ?? ''} onChange={handleChange} />
                                    </div>

                                      <div className="input-box">
                                        <label className="required">Date</label>
                                            <input type="Date" name="AntiTetaDate" required className="site-select" value={formData.AntiTetaDate ?? ''} onChange={handleChange} />
                                    </div>

                                      <div className="input-box">
                                        <label className="required">Where</label>
                                              <input type="text" name="AntiTetaWhere" required className="site-select" value={formData.AntiTetaWhere ?? ''} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-box">
                                        <label className="required">Antibiotics Given</label>
                                        <input type="text" placeholder="Enter Antibiotics Given" name="AntiBioticsGiven" required className="site-select" value={formData.AntiBioticsGiven ?? ''} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="addRecord-modal-header">
                                    <h2 className="addRecord-modal-title">
                                        Anti-Tetanus Immunization Given
                                    </h2>
                                    
                                </div>
                                    <h3 className="addRecord-modal-subtitle">
                                        Active Immunization
                                    </h3>
                            <div className="input-group">
                                <div className="input-box">
                                    <label className="required">Active Immunization</label>
                                    <select name="activeImmunization" required className="selectBox" onChange={(e) => { handleActiveImmunizationChange(e); handleChange(e); }} value={formData.activeImmunization ?? ''}>
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>

                                    {/* <div className="input-box">
                                        <label>Date</label>
                                        <input type="date" name="ActiveImmunizationDate" className="site-select" />
                                    </div> */}

                                    <div className="ainput-box">
                                        <label className="required">ID/IM</label>
                                        <select name="ID/IM" className="site-select" required value={formData['ID/IM'] ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="PCEC">PCEC</option>
                                            <option value="Other">PVRV</option>
                                        </select>
                                    </div>

                            </div>
                        {ShowActiveImmunenization && (

                            <div className="input-group">
                               
                                <div className="input-box">
                                    <label className="required">If yes, date given</label>
                                        <select placeholder="D0" name="activeDateGiven" className="selectBox" required value={formData.activeDateGiven ?? ''} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="D0">D0</option>
                                        <option value="D3">D3</option>
                                        <option value="D7">D7</option>
                                        <option value="D30">D30</option>
                                    </select>
                                </div>
                            </div> 
                        )}

                                <div className="input-group">
                                    <div className="input-box">
                                    <label className="required">PREVIOUS ARV VACC</label>
                                    <input type="text" name="PrevArvVacc" placeholder="Previous ARV Vacc" required className="site-select" value={formData.PrevArvVacc ?? ''} onChange={handleChange} />
                                            
                                       
                                </div>

                                <div className="input-box">
                                    <label className="required">When</label>
                                    <input type="date" name="PrevArvVaccDate" className="site-select" required value={formData.PrevArvVaccDate ?? ''} onChange={handleChange} />
                                </div>

                                <div className="input-box">
                                    <label className="required">Vacc</label>
                                    <input type="text" placeholder="Enter Vacc" name="Vacc" className="site-select" required value={formData.Vacc ?? ''} onChange={handleChange} />
                                </div>
                            </div>

                                <h3 className="addRecord-modal-subtitle">
                                    Passive Immunization
                                </h3>
                             
                                <div className="input-group">
                                    <div className="input-box">
                                        <label className="required">Passive Immunization</label>
                                        <select name="passiveImmunization" required className="selectBox" value={formData.passiveImmunization ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>

                                    <div className="input-box">
                                        <label className="required">Date</label>
                                        <input type="date" name="PassiveImmunizationDate" className="site-select" required value={formData.PassiveImmunizationDate ?? ''} onChange={handleChange} />
                                    </div> 
                                </div>

                                <div className="input-group">
                                    <div className="input-box">
                                        <label className="required">Type of Immunoglobulin</label>
                                        <select name="typeOfImmunoglobulin" required className="selectBox" value={formData.typeOfImmunoglobulin ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="hrig">HRIG</option>
                                            <option value="erig">ERIG</option>
                                        </select>
                                    </div>

                                    <div className="input-box">
                                        <label className="required">ml. 40i.u/kg body weight</label>
                                        <input type="text" placeholder="" name="SpecifyTypeofImmuno" className="site-select" required value={formData.SpecifyTypeofImmuno ?? ''} onChange={handleChange} />
                                    </div>

                                    <div className="input-box">
                                        <label className="required">Date</label>
                                        <input type="date" placeholder="Date" name="TypeofImmunoDate" className="site-select" required value={formData.TypeofImmunoDate ?? ''} onChange={handleChange} />
                                    </div>

                                    <div className="input-box">
                                        <label className="required">Where</label>
                                        <input type="text" placeholder="Where" name="whereGivenImmuno" className="site-select" required value={formData.whereGivenImmuno ?? ''} onChange={handleChange} />
                                    </div>
                                </div>

                             <div className="addRecord-modal-header">
                                <h2 className="addRecord-modal-title">
                                    Animal profile
                                </h2>
                            </div>

                                <div className="input-group">
                                    <div className="input-box">
                                        <label className="required">Type of Animal</label>
                                        <select name="typeOfAnimal" required className="selectBox" onChange={(e) => { handleTypeOfAnimalChange(e); handleChange(e); }} value={formData.typeOfAnimal ?? ''}>
                                            <option value="">Select</option>
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
                                    )}  </div>

                            <h3 className='addRecord-modal-subtitle'>Containment and Ownership Status</h3>
                            <div className="input-group">
                                <div className="input-box">
                                        <label className="required">Age</label>
                    <input type="text" placeholder="Age" name="ageOwner" className="site-select" required value={formData.ageOwner   ?? ''} onChange={handleChange} />
                                </div>

                                <div className="input-box">
                                        <label className="required">Containment</label>
                                        <select name="containment" required className="selectBox" value={formData.containment ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="dog">Leashed</option>
                                            <option value="cat">Unleashed</option>
                                            <option value="cage">Cage</option>
                                            <option value="stray">Stray</option>
                                        </select>
                                </div>

                                <div className="input-box">
                                        <label className="required">Name of Owner</label>
                                        <input type="text" placeholder="Name of Owner" name="nameOfOwner" className="site-select" required value={formData.nameOfOwner ?? ''} onChange={handleChange} />
                                </div>
                            </div>    

                            <div className="input-group">
                                    <div className="input-box">
                                        <label className="required">Is the animal vaccinated?</label>
                                        <select name="isVaccinated" required className="selectBox" onClick={handleSpecifyVaccineChange}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                {showSpecifyVaccine && (
                                   <> 
                                    <div className="input-box">
                                        <label className="required">Date</label>
                                        <input type="date" name="VaccDate" className="selectBox" required onClick={handleChange} value={formData.Vaccdate}/>
                                    </div>

                                    <div className="input-box">
                                        <label className="required">Type of Vaccine</label>
                                        <input type="text" placeholder="Enter Type of Vaccine" name="typeOfVaccine" className="site-select" required/>
                                    </div></>
                                )}
                            </div>

                            <div className="input-group">
                                <div className="input-box">
                                    <label className="required">In contact w/ other animal?</label>
                                        <select name="isInContactWithOtherAnimal" required className="selectBox" onClick={handleSpecifyContactChange}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                </div>
                            {showSpecifyContact && (
                                <>
                                    <div className="input-box">
                                    <label className="required">If yes, specify</label>
                                    <input ref={specifyContactRef} type="text" placeholder="Specify" name="specifyContact" required className="selectBox"/></div>
                                    <div className="input-box"><label className="required">How many?</label>
                                    <input type="text" placeholder="Enter How Many" name="howMany" required className="selectBox" /></div>
                                </>   
                            )}
                            </div>

                            <div className="input-group">
                                <div className="qinput-box">
                                <label className="required">Condition before the bite</label>
                                        <select name="conditionBefore" required className="selectBox">
                                            <option value="">Select</option>
                                            <option value="healthy">Healthy</option>
                                            <option value="sick">Sick</option>
                                            <option value="unknown">Unknown</option>

                                        </select>
                                </div>
                                <div className="input-box">
                                <label className="required">Is the animal dead?</label>
                                <select name="isAnimalDead" required className="selectBox">
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                                </div>
                             
                                <div className="input-box">
                                <label className="required">When</label>
                                <input type="AnimalDeadDate" name="date" required /></div>
                            </div>

                            <div className="input-group">
                                <div className="input-box">
                                <label className="required">Cause of Death</label>

                                 <select name="causeOfDeath" required className="selectBox">
                                            <option value="">Select</option>
                                            <option value="sick">Sick</option>
                                            <option value="slaughtered">Slaughtered</option>
                                            <option value="dead">Found dead</option>
                                            <option value="accident">Accident</option>

                                </select>
                            </div>
                                <div className="input-box">
                                  <label className="required">If rabies are present, what are the clinical manifestation observed?</label>
                                        <input type="text" placeholder="Enter Clinical Manifestation" name="clinicalManifestation" required />
                                </div>
                            </div>

                            <div className="addRecord-modal-header">
                                <h2 className="addRecord-modal-title">
                                     Animal Status (14 days observation )
                                </h2>
                              </div>
                            <div className="input-group">
                                <div className="input-box">
                                <label className="required">Animal Status</label>
                                <input type="text" placeholder="Enter Animal Status" name="animalStatus" required />
                                </div>
                                <div className="input-box"><label className="required">Date</label><input type="date" name="animalStatusDate" required /></div>
                            </div>
                        </form>
           
          )}

          {recordType === 'immunization' && (
                  <form onSubmit={handleSubmit}>
                        {/* <div className="addRecord-modal-header">
                                <h3 className="addRecord-modal-subtitle">
                                    Patient Profile
                                </h3>
                            </div>

                          <div className="input-group">
                                <div className="input-box">
                                <label className="required">Patient ID</label>
                                <input type="text" placeholder="Enter Patient ID" name="patientId" required onChange={handleChange} value={formData.patientId ?? ''} />
                                </div>
                                <div className="input-box">
                                <label className="required">Family ID</label>
                                <input type="text" placeholder="Enter Family ID" name="familyId" required onChange={handleChange} value={formData.familyId ?? ''} /></div>
                          </div>

                         <div className="input-group">
                                <div className="input-box">
                                <label className="required">Last Name</label>
                                <input type="text" placeholder="Enter Last Name" name="lastName" required onChange={handleChange} value={formData.lastName ?? ''} />
                                </div>
                                <div className="input-box">
                                <label className="required">First Name</label>
                                <input type="text" placeholder="Enter First Name" name="firstName" required onChange={handleChange} value={formData.firstName ?? ''} /></div>

                                <div className="input-box">
                                <label >Middle Name</label>
                                <input type="text" placeholder="Enter Middle Name" name="middleName"  onChange={handleChange} value={formData.middleName ?? ''} />
                                </div>
                                <div className="input-box">
                                <label >Suffix</label>
                                <input type="text" placeholder="Enter Suffix" name="suffix"  onChange={handleChange} value={formData.suffix ?? ''} /></div>
                          </div>

                          <div className="input-group">
                                <div className="input-box">
                                <label className="required">Birthdate</label>
                                <input type="date" placeholder="Enter Birthdate" name="birthdate" required onChange={handleChange} value={formData.birthdate ?? ''} />
                                </div>
                                <div className="input-box">
                                <label className="required">Age</label>
                                <input type="text" placeholder="Enter Age" name="age" required disabled value={formData.age ?? ''} /></div>

                                <div className="input-box">
                                <label className='required'>Sex</label>
                                <select name="sex" required className="selectBox" value={formData.sex ?? ''} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                            <option value="others">Others</option>
                                </select>
                                </div>
                                <div className="input-box">
                                <label className='required'>Time of Birth</label>
                                <input type="time" placeholder="Enter Time of Birth" name="timeOfBirth" required onChange={handleChange} value={formData.timeOfBirth ?? ''} /></div>
                          </div>

                          <div className="input-group">
                                <div className="input-box">
                                <label className="required">Birth Weight</label>
                                <input type="number" placeholder="Enter Birth Weight" name="birthWeight" required onChange={handleChange} value={formData.birthWeight ?? ''} />
                                </div>
                                <div className="input-box">
                                <label className="required">Birth Height</label>
                                <input type="number" placeholder="Enter Birth Height" name="birthHeight" required onChange={handleChange} value={formData.birthHeight ?? ''} />
                                </div>

                                <div className="input-box">
                                  <label className='required'>Birth Attended by</label>
                                        <select name="attendedBy" required className="selectBox" value={formData.attendedBy ?? ''} onChange={handleChange}>
                                        <option hidden value="">Select Birth Attended By</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Midwife">Midwife</option>
                                        <option value="Nurse">Nurse</option>
                                        <option value="Traditional Birth Attendant">Traditional Birth Attendant</option>
                                        <option value="Family Member">Family Member</option>
                                        </select>  
                                </div>       
                          </div>

                          <div className='input-group'>
                                <div className="input-box">
                                  <label className='required'>New Born Screening</label>
                                        <select name="newBornScreening" required className="selectBox" value={formData.newBornScreening ?? ''} onChange={handleChange}>
                                        <option hidden value="">Select New Born Screening</option>
                                        <option value="done">Done</option>
                                        <option value="notDone">Not Done</option>
                                       
                                        </select>  
                                </div>  

                                 <div className="input-box">
                                  <label className='required' title='Bacillus Calmette-Guerin Vaccine'>BCG</label>
                                        <select name="bcg" required className="selectBox" value={formData.bcg ?? ''} onChange={handleChange}>
                                        <option hidden value="">Select BCG</option>
                                        <option value="bcgGiven">Given</option>
                                        <option value="bcgNotGiven">Not Given</option>

                                        </select>  
                                </div>   

                                 <div className="input-box">
                                  <label className='required'>HepB</label>
                                        <select name="hepB" required className="selectBox" value={formData.hepB ?? ''} onChange={handleChange}>
                                        <option hidden value="">Select HepB</option>
                                        <option value="hepBGiven">Given</option>
                                        <option value="hepBNotGiven">Not Given</option>

                                        </select>  
                                </div>  

                                 <div className="input-box">
                                  <label className='required'>Vit K</label>
                                        <select name="vitK" required className="selectBox" value={formData.vitK ?? ''} onChange={handleChange}>
                                        <option hidden value="">Select Vit K</option>
                                        <option value="vitKGiven">Given</option>
                                        <option value="vitKNotGiven">Not Given</option>

                                        </select>  
                                </div>     

                          </div>

                          <div className='input-group'>
                                <div className="input-box">
                                  <label className='required'>Type of Birth</label>
                                        <select name="typeOfBirth" required className="selectBox" value={formData.typeOfBirth ?? ''} onChange={handleChange}>
                                        <option hidden value="">Select Type of Birth</option>
                                        <option value="normal">Normal Spontaneous Delivery</option>
                                        <option value="csection">C-Section</option>
                                        </select>  
                                </div>  

                                 <div className="input-box">
                                  <label className='required'>Gestational Age at Birth</label>
                                        <select name="gestationalAgeBirth" required className="selectBox" value={formData.gestationalAge ?? ''} onChange={handleChange}>
                                        <option hidden value="">Select Gestational Age</option>
                                        <option value="preterm">Preterm</option>
                                        <option value="term">Term</option>
                                        <option value="postterm">Postterm</option>

                                        </select>  
                                </div>   

                                 <div className="input-box">
                                  <label className='required'>Weeks</label>
                                        <input type="number" placeholder="Enter Weeks" name="weeksAtBirth" min="20" max="36" step="1" required className="site-select" value={formData.weeksAtBirth ?? ''} onChange={handleChange} /> 
                                </div>  

                                

                          </div>

                          <div className='input-group'>

                                <div className="input-box">
                                  <label className='required'>Place of Birth</label>
                                        <input type="text" placeholder="City of Address" name="placeOfBirth" required className="site-select" value={formData.placeOfBirth ?? ''} onChange={handleChange} />
                                </div>
                                     
                               <div className="input-box">
                                  <label className='required'>Facility Ownership</label>
                                        <select name="facilityOwnership" required className="selectBox" value={formData.facilityOwnership ?? ''} onChange={handleChange}>
                                            <option hidden value="">Select Facility Ownership</option>
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>  
                                </div>  

                                 <div className="input-box">
                                  <label className='required'>Facility Type</label>
                                       <select name="facilityType" required className="selectBox" value={formData.facilityType ?? ''} onChange={handleChange}>
                                            <option hidden value="">Select Facility Type</option>
                                            <option value="hospital">Hospital</option>
                                            <option value="clinic">Clinic</option>
                                            <option value="lyingIn">Lying In</option>
                                            <option value="others">Others</option>
                                        </select>  
                                </div> 

                                <div className="input-box">
                                  <label className='required'>Facility Name</label>
                                        <input type="text" placeholder="Enter Facility Name" name="facilityName" required className="site-select" value={formData.facilityName ?? ''} onChange={handleChange} />
                                </div>  



                          </div> */}

                          <div className="addRecord-modal-header">
                                <h3 className="addRecord-modal-subtitle">
                                   New Patient Record
                                </h3>
                            </div>

                          <div className="input-group">
                                <div className="input-box">
                                  <label className='required'>Date</label>
                                        <input type="date" disabled placeholder="Enter Date" name="Recdate" required className="site-select" value={formData.Recdate ?? ''} onChange={handleChange} />
                                </div>

                                <div className="input-box">
                                  <label className='required'>Age in Months</label>
                                        <input type="number" placeholder="Enter Age in Months" min="0" max="60" name="ageInMonths" required className="site-select" value={formData.ageInMonths ?? ''} onChange={handleChange} />
                                </div>

                                <div className="input-box">
                                  <label className='required'>Height (cm)</label>
                                        <input type="number" placeholder="Enter Height in cm" step="0.1" min="30" max="120" name="heightInCm" required className="site-select" value={formData.heightInCm ?? ''} onChange={handleChange} />
                                </div>
                          </div>

                          <div className="input-group">
                                <div className="input-box">
                                  <label className='required'>Weight (kg)</label>
                                        <input type="number" placeholder="Enter Weight in kg" step="0.1" min="1" max="30" name="weightInKg" required className="site-select" value={formData.weightInKg ?? ''} onChange={handleChange} />
                                </div>

                                <div className="input-box">
                                  <label className='required'>Temperature (°C)</label>
                                        <input type="number" placeholder="Enter Temperature" step="0.1" min="34" max="42" name="temperatureRec" required className="site-select" value={formData.temperatureRec ?? ''} onChange={handleChange} />
                                </div>

                                <div className="input-box">
                                  <label className='required'>FP Method</label>
                                       <select name="FPmethod" required className="selectBox" value={formData.FPmethod ?? ''} onChange={handleChange}>
                                            <option hidden value="">Select FP Method</option>
                                            <option value="Pills">Pills</option>
                                            <option value="Injectables">Injectables</option>
                                            <option value="IUD" title="Intrauterine Device">IUD</option>
                                            <option value="Condom">Condom</option>
                                            <option value="Implant">Implant</option>
                                            <option value="Natural">Natural</option>
                                            <option value="None">None</option>
                                        </select>
                                </div>                               
                          </div>

                          <div className='input-group'>
                              <div className="input-box">
                                  <label className='required'>Antigen</label>
                                       <select name="antigen" required className="selectBox" value={formData.antigen ?? ''} onChange={handleChange}>
                                            <option hidden value="">Select Antigen</option>
                                            <option value="BCG">BCG (Tuberculosis)</option>
                                            <option value="HepB">Hepatitis B</option>
                                            <option value="DPT">DPT (Diphtheria, Pertussis, Tetanus)</option>
                                            <option value="OPV">OPV (Oral Polio Vaccine)</option>
                                            <option value="IPV">IPV (Inactivated Polio Vaccine)</option>
                                            <option value="MMR">MMR (Measles, Mumps, Rubella)</option>
                                            <option value="Td">Td (Tetanus, Diphtheria)</option>
                                            <option value="Hib">Hib (Haemophilus influenzae type b)</option>
                                            <option value="PCV">PCV (Pneumococcal Conjugate Vaccine)</option>
                                        </select>
                                </div>

                                <div className="input-box">
                                  <label className='required'>Vaccinator&apos;s Name</label>
                                        <input type="text" placeholder="Enter Vaccinator's Name" name="vaccinatorName" required className="site-select" value={formData.vaccinatorName ?? ''} onChange={handleChange} />
                                </div>  

                                <div className="input-box">
                                  <label className='required'>Next Visit</label>
                                        <input type="date" name="nextVisitImmune" required className="site-select" value={formData.nextVisitImmune ?? ''} onChange={handleChange} />
                                </div>


                          </div>
                  </form>
          )}


          {recordType === 'prescription' && (
                  <form onSubmit={handleSubmit}>
                        <div className="addRecord-modal-header">
                                <h3 className="addRecord-modal-subtitle">
                                  Diagnosis and Clinical Notes
                                </h3>
                            </div>

                        <div className='input-group'>
                            <div className='input-box'>
                              <textarea rows="4" cols="50" placeholder="Patient diagnosis, symptoms, and clinical findings.." name="prescriptionDetails" required className="selectBox" value={formData.prescriptionDetails ?? ''} onChange={handleChange}  >

                              </textarea>
                            </div>
                        </div>

                        <div className="addRecord-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="addRecord-modal-subtitle">
                                  Medications
                                </h3>
                                <button 
                                  type="button" 
                                  onClick={handleAddMedication}
                                  style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#111250',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                  }}
                                >
                                  + Add Medication
                                </button>
                            </div>

                        {medications.map((medication, index) => (
                          <div key={index} style={{ position: 'relative', marginBottom: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                            {medications.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMedication(index)}
                                style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '10px',
                                  padding: '4px 8px',
                                  backgroundColor: '#ff4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Remove
                              </button>
                            )}
                            
                            <div style={{ color: '#666', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                              Medication {index + 1}
                            </div>

                            <div className='input-group'>
                              <div className='input-box'>
                                  <label className='required'>Medication Name</label>                           
                                      <input 
                                        type="text" 
                                        placeholder="Enter Medication Name" 
                                        required 
                                        className="site-select" 
                                        value={medication.medicationName} 
                                        onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)} 
                                      />
                              </div>

                               <div className='input-box'>
                                  <label className='required'>Dosage</label>                           
                                      <input 
                                        type="text" 
                                        placeholder="e.g., 500mg" 
                                        required 
                                        className="site-select" 
                                        value={medication.dosage} 
                                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} 
                                      />
                              </div>
                            </div>

                            <div className='input-group'>
                               <div className='input-box'>
                                  <label className='required'>Frequency</label>    
                                       <select
                                        required
                                        className='selectBox'
                                        value={medication.frequency}
                                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                      >
                                      <option value="">Select Frequency</option>
                                      <option value="2x a day - every 12 hours">2x a day - Every 12 hours</option>
                                      <option value="3x a day - every 8 hours">3x a day - Every 8 hours</option>
                                      <option value="4x a day - every 6 hours">4x a day - Every 6 hours</option>
                                      <option value="Every bedtime">Every Bedtime</option>
                                      <option value="Every other day">Every Other Day</option>
                                      <option value="Once a day">Once a Day</option>
                                      <option value="Others">Others</option>
                                      </select>
                              </div>
                          
                               
                                  <div className='inputBox'>
                                      <label className="required">Duration</label>
                                      <select
                                        required
                                        className='selectBox'
                                        value={medication.duration}
                                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                      >
                                      <option value="">Select Duration</option>
                                      <option value="daily">Daily</option>
                                      <option value="monthly">Monthly</option>
                                      <option value="weekly">Weekly</option>
                                      <option value="quarterly">Quarterly</option>
                                      <option value="yearly">Yearly</option>
                                      <option value="indefinite">Indefinite</option>
                                      <option value="others">Others</option>
                                      </select>
              
                                  </div>                         
                              </div>
                          </div>
                        ))}
                        
                            <div className='input-group'>
                                  <div className='input-box'>
                                      <label>Special Instructions (optional)</label>                           
                                      <input type="text" placeholder="e.g. Take with food" name="specialInstructions" className="site-select" value={formData.specialInstructions ?? ''} onChange={handleChange} />
                                  </div>
                              
                                  <div className='input-box'>
                                      <label>Follow-up Date (optional)</label>                           
                                      <input type="date" placeholder="e.g. 2023-12-31" name="followUpDate" className="site-select" value={formData.followUpDate ?? ''} onChange={handleChange} />
                                  </div>

                                  <div className='input-box'>
                                      <label className='required'>prescribed by:</label>
                                      <input type="text" placeholder="e.g. Dr. Smith" name="prescribedBy" className="site-select" value={formData.prescribedBy ?? ''} onChange={handleChange} required/>
                                  </div>
                              </div>
                       
                  </form>

          )}



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

AddRecordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  recordType: PropTypes.oneOf(['general', 'prenatal', 'dental', 'animal_bite', 'immunization', 'prescription', 'doctors-order']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  patientId: PropTypes.string,
  editingRecord: PropTypes.object,
};