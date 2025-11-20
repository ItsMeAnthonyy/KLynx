import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiX, BiError } from 'react-icons/bi';
import { FaPaperPlane } from 'react-icons/fa';
import styles from './Emergency.module.css';

const Emergency = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    emergencyType: '',
    patientName: '',
    patientSex: '',
    birthDate: '',
    age: '',
    civilStatus: '',
    philhealthNo: '',
    address: '',
    additionalNotes: '',
    timeSystemDetected: '',
    patientStatus: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  // Auto-set timestamp when modal opens
  useEffect(() => {
    if (isOpen && !formData.timeSystemDetected) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      setFormData(prev => ({
        ...prev,
        timeSystemDetected: formattedDateTime
      }));
    }
  }, [isOpen, formData.timeSystemDetected]);

  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-calculate age when birth date changes
    if (name === 'birthDate') {
      const calculatedAge = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        age: calculatedAge.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSendAlert = async () => {
    // Validate required fields
    if (!formData.emergencyType) {
      setMessage({ type: 'error', text: 'Please select an emergency type' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (!formData.patientName.trim()) {
      setMessage({ type: 'error', text: 'Please enter patient name' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      // Here you would typically send the data to your backend
      console.log('Emergency Alert Data:', formData);
      
      setMessage({ type: 'success', text: 'Emergency alert sent successfully!' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        // Reset form and close modal
        setFormData({
          emergencyType: '',
          patientName: '',
          patientSex: '',
          birthDate: '',
          age: '',
          civilStatus: '',
          philhealthNo: '',
          address: '',
          additionalNotes: '',
          timeSystemDetected: '',
          patientStatus: ''
        });
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending alert:', error);
      setMessage({ type: 'error', text: 'Failed to send emergency alert' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <BiError size={32} className={styles.emergencyIcon} />
            <h1 className={styles.title}>EMERGENCY</h1>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <BiX size={32} />
          </button>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Main Content */}
        <div className={styles.modalBody}>
          <div className={styles.contentWrapper}>
            {/* Left Section */}
            <div className={styles.leftSection}>
              {/* Emergency Alert System */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Emergency Alert System</h2>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Emergency Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="emergencyType"
                    className={styles.select}
                    value={formData.emergencyType}
                    onChange={handleInputChange}
                  >
                    <option value="">e.g. Sudden Labor, Cardiac</option>
                    <option value="sudden_labor">Sudden Pregnancy/Labor</option>
                    <option value="cardiac">Cardiac Emergency</option>
                    <option value="trauma">Trauma/Injury</option>
                    <option value="respiratory">Respiratory Distress</option>
                    <option value="allergic">Severe Allergic Reaction</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Patient Information */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Patient Information</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      className={styles.input}
                      placeholder="e.g. Santos, Lia U."
                      value={formData.patientName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Sex <span className={styles.required}>*</span></label>
                    <select
                      name="patientSex"
                      className={styles.select}
                      value={formData.patientSex}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Birth Date <span className={styles.required}>*</span></label>
                    <input
                      type="date"
                      name="birthDate"
                      className={styles.input}
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Age</label>
                    <input
                      type="text"
                      name="age"
                      className={styles.input}
                      placeholder="Auto-calculated"
                      value={formData.age}
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Civil Status <span className={styles.required}>*</span></label>
                    <select
                      name="civilStatus"
                      className={styles.select}
                      value={formData.civilStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Philhealth No.<span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      name="philhealthNo"
                      className={styles.input}
                      placeholder="Enter number"
                      value={formData.philhealthNo}
                      onChange={handleInputChange}
                      required

                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Address <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="address"
                    className={styles.input}
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    className={styles.textarea}
                    placeholder="Enter any additional information"
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Send Alert Button */}
              <button className={styles.sendAlertButton} onClick={handleSendAlert}>
                <FaPaperPlane size={18} />
                Send Alert
              </button>
            </div>

            {/* Right Section - Emergency Protocols */}
            <div className={styles.rightSection}>
              <h2 className={styles.protocolsTitle}>Emergency Protocols</h2>
              
              <div className={styles.protocolCard}>
                <h3 className={styles.protocolCardTitle}>Sudden Pregnancy/Labor</h3>
                <p className={styles.protocolCardText}>
                  Immediate assessment and preparation for delivery. Contact OB-GYN on call.
                </p>
              </div>

              <div className={styles.protocolCard}>
                <h3 className={styles.protocolCardTitle}>Cardiac Emergency</h3>
                <p className={styles.protocolCardText}>
                  Start CPR if needed. Prepare AED and emergency medications. Call code blue.
                </p>
              </div>

              <div className={styles.protocolCard}>
                <h3 className={styles.protocolCardTitle}>Severe Allergic Reaction</h3>
                <p className={styles.protocolCardText}>
                  Administer epinephrine immediately. Monitor airways and vital signs.
                </p>
              </div>

              {/* Emergency Tracking Information */}
              <div className={styles.trackingSection}>
                <h2 className={styles.trackingTitle}>Emergency Tracking Information</h2>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Emergency Timestamp</label>
                  <input
                    type="datetime-local"
                    name="timeSystemDetected"
                    className={styles.input}
                    value={formData.timeSystemDetected}
                    onChange={handleInputChange}
                  />
                  <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px' }}>
                    When the emergency alert was received by the system
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Patient Status</label>
                  <select
                    name="patientStatus"
                    className={styles.select}
                    value={formData.patientStatus}
                    onChange={handleInputChange}
                  >
                    <option value="">Select patient status</option>
                    <option value="Critical">Critical</option>
                    <option value="Serious">Serious</option>
                    <option value="Stable">Stable</option>
                    <option value="Conscious">Conscious</option>
                    <option value="Unconscious">Unconscious</option>
                    <option value="Breathing">Breathing</option>
                    <option value="Not Breathing">Not Breathing</option>
                  </select>
                  <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px' }}>
                    Current condition of the patient
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Emergency.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Emergency;