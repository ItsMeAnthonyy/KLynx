import { useState } from 'react';
import formStyles from './AddPatientForm.module.css';

const AddPatientForm = ({ onSuccess, onCancel }) => {

    const [patientFormData, setPatientFormData] = useState({
        patientName: '',
        date: '',
        time: '',
        reason: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return(
        <form className={formStyles.consultationForm} onSubmit={handleSubmit}>
            <div className={formStyles.formGroup}>
                <label htmlFor="patientName" className={formStyles.formLabel}>
                    Patient Name <span className={formStyles.required}>*</span>
                </label>
                <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    className={formStyles.formInput}
                    value={patientFormData.patientName}
                    onChange={handleChange}
                    placeholder="Enter patient's full name"
                    required
                    aria-required="true"
                />
            </div>

            <div className={formStyles.formRow}>
                <div className={formStyles.formGroup}>
                    <label htmlFor="date" className={formStyles.formLabel}>
                    Date <span className={formStyles.required}>*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className={formStyles.formInput}
                        value={patientFormData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        aria-required="true"
                    />
                </div>

                <div className={formStyles.formGroup}>
                    <label htmlFor="time" className={formStyles.formLabel}>
                        Time <span className={formStyles.required}>*</span>
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        className={formStyles.formInput}
                        value={patientFormData.time}
                        onChange={handleChange}
                        required
                        aria-required="true"
                    />
                </div>

                <div className={formStyles.formGroup}>
                    <label htmlFor="time" className={formStyles.formLabel}>
                        Time <span className={formStyles.required}>*</span>
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        className={formStyles.formInput}
                        value={patientFormData.time}
                        onChange={handleChange}
                        required
                        aria-required="true"
                    />
                </div>
            </div>
                <div className={formStyles.formActions}>
                    <button
                        type="button"
                        className={`${formStyles.btn} ${formStyles.btnCancel}`}
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`${formStyles.btn} ${formStyles.btnPrimary}`}
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                    </button>
                </div>
            
        </form>
    );

}

export default AddPatientForm;