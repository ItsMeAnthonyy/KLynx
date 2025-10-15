import { useState } from 'react';
import PropTypes from 'prop-types';
import './AddRecordModal.css';
import "../../../components/css/FileMaintenance.css";


export default function AddRecordModal({ isOpen, onClose, recordType, onSubmit }) {
  const doctors = [
    { id: 'dr_smith', name: 'Dr. Smith' },
    { id: 'dr_jones', name: 'Dr. Jones' },
    { id: 'dr_brown', name: 'Dr. Brown' },
  ];
  const [formData, setFormData] = useState({
    bloodPressure: '',
    temperature: '',
    pulse: '',
    symptoms: '',
    diagnosis: '',
    // Prenatal fields
    gestationalAge: '',
    fetalHeartRate: '',
    fundalHeight: '',
    nextVisit: '',
    // Dental fields
    procedure: '',
    toothNumber: '',
    treatmentPlan: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type: recordType,
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="addRecord-modal-overlay">
      <div className="addRecord-modal-content">
        <div className="addRecord-modal-header">
          <h2 className="addRecord-modal-title">
            Add {recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record
            <button onClick={onClose} className="close-button">
            ✕
          </button>
          </h2>
          
        </div>

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
       
              <label className="required">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
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
              name="pulse"
              value={formData.pulse}
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
                disabled
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
                      Medication / Prescription
                
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
           </div>


          <div className="input-group">

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
          

        </form>
        )}

          {/* Prenatal Fields */}
          {recordType === 'prenatal' && (
           <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <div className="input-box">
                                    <label htmlFor="history-date" className='required'>Date:</label>
                                    <input type="date" id="history-date" name="dateVisit" required onChange={handleChange} disabled/>
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-aog" className='required'>AOG:</label>
                                    <input type="text" id="history-aog" name="AOG" required onChange={handleChange} />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-bp" className='required'>Blood Pressure:</label>
                                    <input type="text" id="history-bp" name="BPS" required onChange={handleChange} />
                                </div>
              
                                <div className="input-box">
                                    <label htmlFor="history-pr" className='required'>Pulse Rate:</label>
                                    <input type="text" id="history-pr" name="PR" required onChange={handleChange} />
                                </div>             
                            </div>
                            <div className="input-group">
                                <div className="input-box">
                                    <label htmlFor="history-ht" className='required'>Height:</label>
                                    <input type="text" id="history-ht" name="HT" required onChange={handleChange} />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-wt" className='required'>Weight:</label>
                                    <input type="text" id="history-wt" name="WT" required onChange={handleChange} />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-bmi" className='required'>BMI:</label>
                                    <input type="text" id="history-bmi" name="BMI" required onChange={handleChange} />
                                </div>
                                <div className="input-box">
                                    <label htmlFor="history-temp" className='required'>Temperature:</label>
                                    <input type="text" id="history-temp" name="Temp" required onChange={handleChange} />
                                </div> 
                            </div>
                            <div className="input-group">
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

                                <div className="input-box">
                                    <label htmlFor="history-cc" className='required'>Chief Complaints:</label>
                                    <input type="text" id="history-cc" name="ccomplaint" required onChange={handleChange} />
                                </div> 
                                <div className="input-box">
                                    <label htmlFor="history-note" className='required'>Nurse&apos;s/Midwife Note:</label>
                                    <div className="select-box">
                                    <textarea 
                                      name="notes" 
                                      value={formData.doctorNotes}
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
                  name="procedure"
                  value={formData.procedure}
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
                  name="treatmentPlan"
                  value={formData.treatmentPlan}
                  onChange={handleChange}
                  rows={3}
                  className="selectBox"
                  required
                />
              </div>
              <div>
                <label className="required">Next Visit</label>
                <input
                  type="date"
                  name="nextVisit"
                  value={formData.nextVisit}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
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
            >
              Save Record
            </button>
          </div>
       
      </div>
    </div>
  );
}

AddRecordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  recordType: PropTypes.oneOf(['general', 'prenatal', 'dental']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  patientId: PropTypes.string,
};