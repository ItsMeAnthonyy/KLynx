import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';
import formStyles from './AddPatientForm.module.css';

import 'react-datepicker/dist/react-datepicker.css';

const MaskedInput = forwardRef((props, ref) => (
    <InputMask
        mask="99/99/9999"
        {...props}
    >
        {(inputProps) => (
        <input
            {...inputProps}
            ref={ref}
            className={formStyles.formInput}
        />
        
        )}
    </InputMask>
));

const AddPatientForm = ({ onSuccess, onCancel }) => {
    const [patientFormData, setPatientFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        suffix: '',
        age: '',
        dateOfBirth: '',
        sex: '',
        civilStatus: '',
        occupation: '',
        educationalAttainment: '',
        phoneNumber: '',
        date: '',
        time: '',
        reason: '',
        notes: '',
    });
    const [dateOfBirthError, setDateOfBirthError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [sexError, setSexError] = useState('');
    const [civilStatusError, setCivilStatusError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientFormData(prev => ({ ...prev, [name]: value }));

        // Clear errors as the user types
        if (name === 'lastName') {
            if (value.trim()) {
                setLastNameError('');
            }
        }
        if (name === 'firstName') {
            if (value.trim()) {
                setFirstNameError('');
            }
        }
        if (name === 'sex') {
            if (value) {
                setSexError('');
            }
        }
        if (name === 'civilStatus') {
            if (value) {
                setCivilStatusError('');
            }
        }
    };

    const validateAndSetDate = (date, name) => {
        if (!date) {
            setPatientFormData(prev => ({ ...prev, [name]: '' }));
            setDateOfBirthError(''); // Clear error if input is cleared
            return;
        }
 
        const today = new Date();
        const birthDate = new Date(date);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
 
        if (date.getFullYear() < 1900) {
            setDateOfBirthError('Birth year must be after 1900.');
        } else if (date > new Date()) {
            setDateOfBirthError('Birth date cannot be in the future.');
        } else {
            setDateOfBirthError('');
            // Format the date to YYYY-MM-DD without timezone conversion
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setPatientFormData(prev => ({ ...prev, [name]: formattedDate, age: age.toString() }));
        }
    };

    const handleDateBlur = () => {
        // Show error only if the field is empty and has been touched
        if (!patientFormData.dateOfBirth) {
            setDateOfBirthError('Date of Birth is required.');
        }
    };

    const handleLastNameBlur = () => {
        if (!patientFormData.lastName.trim()) {
            setLastNameError('Last Name is required.');
        }
    };

    const handleFirstNameBlur = () => {
        if (!patientFormData.firstName.trim()) {
            setFirstNameError('First Name is required.');
        }
    };

    const handleSexBlur = () => {
        if (!patientFormData.sex) {
            setSexError('Sex is required.');
        }
    };

    const handleCivilStatusBlur = () => {
        if (!patientFormData.civilStatus) {
            setCivilStatusError('Civil Status is required.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return(
        <form className={formStyles.consultationForm} onSubmit={handleSubmit}>
            <div className={formStyles.formRow4}>
                <div className={formStyles.formGroup}>  
                    <div className={formStyles.inputWrapper}>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className={`${formStyles.formInput} ${lastNameError ? formStyles.inputError : ''}`}
                            value={patientFormData.lastName}
                            onChange={handleChange}
                            onBlur={handleLastNameBlur}
                            placeholder="Last Name"
                            required
                            aria-required="true"
                            aria-invalid={!!lastNameError}
                        />
                        <span className={formStyles.requiredAsterisk}>*</span>
                    </div>
                    {lastNameError && <div className={formStyles.errorMessage}>{lastNameError}</div>}
                </div>

                <div className={formStyles.formGroup}>  
                    <div className={formStyles.inputWrapper}>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className={`${formStyles.formInput} ${firstNameError ? formStyles.inputError : ''}`}
                            value={patientFormData.firstName}
                            onChange={handleChange}
                            onBlur={handleFirstNameBlur}
                            placeholder="First Name"
                            required
                            aria-required="true"
                            aria-invalid={!!firstNameError}
                        />
                        <span className={formStyles.requiredAsterisk}>*</span>
                    </div>
                    {firstNameError && <div className={formStyles.errorMessage}>{firstNameError}</div>}
                </div>

                <div className={formStyles.formGroup}>  
                    <div className={formStyles.inputWrapper}>
                        <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            className={formStyles.formInput}
                            value={patientFormData.middleName}
                            onChange={handleChange}
                            placeholder="Middle Name"
                            aria-required="true"
                        />
                    </div>
                </div>

                <div className={formStyles.formGroup}>  
                    <div className={formStyles.inputWrapper}>
                        <input
                            type="text"
                            id="suffix"
                            name="suffix"
                            className={formStyles.formInput}
                            value={patientFormData.suffix}
                            onChange={handleChange}
                            placeholder="Suffix"
                            aria-required="true"
                        />
                    </div>
                </div>

            </div>

            <div className={formStyles.formRow4}>
                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <DatePicker
                            name="dateOfBirth"
                            selected={patientFormData.dateOfBirth ? new Date(patientFormData.dateOfBirth + 'T00:00:00') : null}
                            onChange={(date) => validateAndSetDate(date, 'dateOfBirth')}
                            onBlur={handleDateBlur}
                            required
                            aria-invalid={!!dateOfBirthError}
                            placeholderText="Date of Birth"
                            customInput={<MaskedInput />}
                            dateFormat="MM/dd/yyyy"
                            wrapperClassName={formStyles.datePickerWrapper}
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={124}
                            showMonthDropdown
                            minDate={new Date('1900-01-01')}
                            maxDate={new Date()}
                        />
                        <span className={formStyles.requiredAsterisk}>*</span>
                        {dateOfBirthError && (
                            <div className={formStyles.errorMessage}>{dateOfBirthError}</div>
                        )}
                    </div>
                </div>

                <div className={formStyles.formGroup}>  
                    <div className={formStyles.inputWrapper}>
                        <input
                            type="text"
                            id="age"
                            name="age"
                            className={formStyles.formInput}
                            value={patientFormData.age}
                            placeholder="Age"
                            readOnly
                        />
                        <span className={formStyles.requiredAsterisk}>*</span>
                    </div>
                </div>

                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <select
                            id="sex"
                            name="sex"
                            className={`${formStyles.formInput} ${formStyles.selectInput} ${sexError ? formStyles.inputError : ''}`}
                            value={patientFormData.sex}
                            onChange={handleChange}
                            onBlur={handleSexBlur}
                            required
                            aria-invalid={!!sexError}
                        >
                            
                            <option value="" hidden>Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <span className={formStyles.requiredAsterisk}>*</span>
                    </div>
                    {sexError && <div className={formStyles.errorMessage}>{sexError}</div>}
                </div>

                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <select
                            id="civilStatus"
                            name="civilStatus"
                            className={`${formStyles.formInput} ${formStyles.selectInput} ${civilStatusError ? formStyles.inputError : ''}`}
                            value={patientFormData.civilStatus}
                            onChange={handleChange}
                            onBlur={handleCivilStatusBlur}
                            required
                            aria-invalid={!!civilStatusError}
                        >
                            
                            <option value="" hidden>Civil Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                        <span className={formStyles.requiredAsterisk}>*</span>
                    </div>
                    {civilStatusError && <div className={formStyles.errorMessage}>{civilStatusError}</div>}
                </div>
            </div>

            <div className={formStyles.formRow3}>
                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <select
                            id="occupation"
                            name="occupation"
                            className={`${formStyles.formInput} ${formStyles.selectInput} ${civilStatusError ? formStyles.inputError : ''}`}
                            value={patientFormData.occupation}
                            onChange={handleChange}
                            onBlur={handleCivilStatusBlur}
                            aria-invalid={!!civilStatusError}
                        >
                            
                            <option value="" hidden>Occupation</option>
                            <option value="Single">Nurse</option>
                            <option value="Married">Doctor</option>
                        </select>
                        <span className={formStyles.requiredAsterisk}>*</span>
                    </div>
                    {civilStatusError && <div className={formStyles.errorMessage}>{civilStatusError}</div>}
                </div>

                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <select
                            id="educationalAttainment"
                            name="educationalAttainment"
                            className={`${formStyles.formInput} ${formStyles.selectInput} ${civilStatusError ? formStyles.inputError : ''}`}
                            value={patientFormData.educationalAttainment}
                            onChange={handleChange}
                            onBlur={handleCivilStatusBlur}
                            aria-invalid={!!civilStatusError}
                        >
                            
                            <option value="" hidden>Educational Attainment</option>
                            <option value="none">No Formal Education</option>
                            <option value="elementary_level">Elementary Level</option>
                            <option value="elementary_graduate">Elementary Graduate</option>
                            <option value="high_school_level">High School Level</option>
                            <option value="high_school_graduate">High School Graduate</option>
                            <option value="college_level">College Level</option>
                            <option value="college_graduate">College Graduate</option>
                            <option value="vocational_graduate">Vocational Graduate</option>
                            <option value="post_graduate">Post-Graduate</option>
                        </select>
                        <span className={formStyles.requiredAsterisk}>*</span>
                    </div>
                    {civilStatusError && <div className={formStyles.errorMessage}>{civilStatusError}</div>}
                </div>

                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <InputMask
                            mask="9999-999-9999"
                            id="phoneNumber"
                            name="phoneNumber"
                            className={formStyles.formInput}
                            value={patientFormData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            required
                            maskChar={'X'}
                            aria-required="true"
                            inputMode="numeric"
                            pattern="\d{4}-\d{3}-\d{4}"
                        >
                            {(inputProps) => <input {...inputProps} type="tel" />}
                        </InputMask>
                    </div>
                </div>
            </div>

            <div className={formStyles.formRow2}>
                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <InputMask
                            mask="99-999999999-9"
                            id="philhealthNumber"
                            name="philhealthNumber"
                            className={formStyles.formInput}
                            value={patientFormData.philhealthNumber}
                            onChange={handleChange}
                            placeholder="Philhealth Number"
                            required
                            maskChar={'X'}
                            aria-required="true"
                            inputMode="numeric"
                            pattern="\d{2}-\d{9}-\d{1}"
                        >
                        </InputMask>
                    </div>
                </div>

                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <select
                            id="street"
                            name="street"
                            className={`${formStyles.formInput} ${formStyles.selectInput} ${civilStatusError ? formStyles.inputError : ''}`}
                            value={patientFormData.street}
                            onChange={handleChange}
                            onBlur={handleCivilStatusBlur}
                            aria-invalid={!!civilStatusError}
                        >
                            
                            <option value="" hidden>Street</option>
                            <option value="kalayaan">Kalayaan</option>
                            <option value="karangalan">Karangalan</option>
                        </select>
                        <span className={formStyles.requiredAsterisk}>*</span>
                    </div>
                    {civilStatusError && <div className={formStyles.errorMessage}>{civilStatusError}</div>}
                </div>
            </div>

            <div className={formStyles.formRow2}>
                <div className={formStyles.formGroup}>
                    <input
                        type="date"
                        id="appointmentDate"
                        name="date"
                        className={formStyles.formInput}
                        value={patientFormData.date}
                        onChange={handleChange}
                        //min={new Date().toISOString().split('T')[0]}
                        selected={patientFormData.date ? new Date(patientFormData.date) : null}
                        //onChange={(date) => handleDateChange(date, 'date')}
                        //placeholderText="Appointment Date"
                        required
                        aria-required="true"
                    />
                </div>

                <div className={formStyles.formGroup}>
                    <input
                        type="time" // You could also replace this with a time picker from react-datepicker
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

            <div className={formStyles.formGroup}>
                <label htmlFor="reason" className={formStyles.formLabel}>
                    Reason for Visit <span className={formStyles.required}>*</span>
                </label>
                <select
                    id="reason"
                    name="reason"
                    className={formStyles.formInput}
                    value={patientFormData.reason}
                    onChange={handleChange}
                    required
                    aria-required="true"
                >
                <option value="">Select a reason</option>
                <option value="routine-checkup">Routine Checkup</option>
                <option value="follow-up">Follow-up Appointment</option>
                <option value="new-symptoms">New Symptoms</option>
                <option value="medication-review">Medication Review</option>
                <option value="test-results">Test Results Discussion</option>
                <option value="other">Other</option>
                </select>
            </div>

            <div className={formStyles.formGroup}>
                <label htmlFor="notes" className={formStyles.formLabel}>
                    Additional Notes
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    className={formStyles.formTextarea}
                    value={patientFormData.notes}
                    onChange={handleChange}
                    placeholder="Any additional information or concerns..."
                    rows={4}
                />
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