import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';
import formStyles from './AddPatientForm.module.css';
import { BiSearchAlt } from "react-icons/bi";
import FamilyIdSearchModal from './FamilyIdSearchModal';
import { toast } from '../../../hooks/use-toast';

import { submitPatientData } from '../services/patientService';

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
        philhealthNumber: '',
        country: 'Philippines',
        streetName: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        familyId: '',
        familyMember: '',
    });

    const [isFamilyIdSearchModalOpen, setIsFamilyIdSearchModalOpen] = useState(false);
    const [dateOfBirthError, setDateOfBirthError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [sexError, setSexError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [streetNameError, setStreetNameError] = useState('');
    const [regionError, setRegionError] = useState('');
    const [provinceError, setProvinceError] = useState('');
    const [cityError, setCityError] = useState('');
    const [barangayError, setBarangayError] = useState('');
    const [familyIdError, setFamilyIdError] = useState('');
    const [familyMemberError, setFamilyMemberError] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFamilyIdSelect = (family) => {
        setPatientFormData(prev => ({
            ...prev,
            familyId: family.familyId,
        }));
    };

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
        if (name === 'streetName') {
            if (value) {
                setStreetNameError('');
            }
        }
        if (name === 'region') {
            if (value) {
                setRegionError('');
            }
        }
        if (name === 'province') {
            if (value) {
                setProvinceError('');
            }
        }
        if (name === 'city') {
            if (value) {
                setCityError('');
            }
        }
        if (name === 'barangay') {
            if (value) {
                setBarangayError('');
            }
        }
        if (name === 'familyId') {
            if (value) {
                setFamilyIdError('');
            }
        }
        if (name === 'familyMember') {
            if (value) {
                setFamilyMemberError('');
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

    const handlePhoneNumberBlur = (e) => {
        const value = e.target.value;

        if (value.includes("X")) {
            setPhoneNumberError("Phone number is incomplete.");
            return;
        }

        // Remove dashes to check raw digits
        const digitsOnly = value.replace(/-/g, "");

        // Check if it starts with "09"
        if (!digitsOnly.startsWith("09")) {
            setPhoneNumberError("Phone number must start with 09.");
            return;
        }

        // All good
        setPhoneNumberError("");
    }

    const handleStreetNameBlur = () => {
        if (!patientFormData.streetName) {
            setStreetNameError('Street Name is required.');
        }
    };

    const handleRegionBlur = () => {
        if (!patientFormData.region) {
            setRegionError('Region is required.');
        }
    };

    const handleProvinceBlur = () => {
        if (!patientFormData.province) {
            setProvinceError('Province is required.');
        }
    };

    const handleCityBlur = () => {
        if (!patientFormData.city) {
            setCityError('City is required.');
        }
    };

    const handleBarangayBlur = () => {
        if (!patientFormData.barangay) {
            setBarangayError('Barangay is required.');
        }
    };

    const handleFamilyIdBlur = (e) => {
        const value = e.target.value;

        if (!value) {
            setFamilyIdError('Family ID is required.');
            console.log(value);
        } else {
            setFamilyIdError('');
        }
    }

    const handleFamilyMemberBlur = () => {
        if (!patientFormData.familyMember) {
            setFamilyMemberError('Family Member is required.');
        }
    }
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !patientFormData.lastName.trim() ||
            !patientFormData.firstName.trim() ||
            !patientFormData.dateOfBirth.trim() ||
            !patientFormData.age.trim() ||
            !patientFormData.sex.trim() ||
            !patientFormData.streetName.trim() ||
            !patientFormData.region.trim() ||
            !patientFormData.province.trim() ||
            !patientFormData.city.trim() ||
            !patientFormData.barangay.trim() ||
            !patientFormData.familyId.trim() ||
            !patientFormData.familyMember.trim()
        ) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try{
            await submitPatientData(patientFormData);

            toast({
                title: "Success!",
                description: "Patient Profile has been created successfully",
                className: "toast-success",
            });

            setPatientFormData({
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
                philhealthNumber: '',
                country: 'Philippines',
                streetName: '',
                region: '',
                province: '',
                city: '',
                barangay: '',
                familyId: '',
                familyMember: '',
            });
            onSuccess();
            
        } catch(error){
            toast({
                title: error.message.includes("Validation") ? "Validation Error" : "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <>
            <form className={formStyles.consultationForm} onSubmit={handleSubmit}>
                <div className={formStyles.formRow4}>
                    <div className={formStyles.formGroup}>  
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="lastName" className={formStyles.formLabel}>
                                Last Name <span className={formStyles.required}>*</span>
                            </label>
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
                        </div>
                        {lastNameError && <div className={formStyles.errorMessage}>{lastNameError}</div>}
                    </div>

                    <div className={formStyles.formGroup}>  
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="firstName" className={formStyles.formLabel}>
                                First Name <span className={formStyles.required}>*</span>
                            </label>
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
                        </div>
                        {firstNameError && <div className={formStyles.errorMessage}>{firstNameError}</div>}
                    </div>

                    <div className={formStyles.formGroup}>  
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="middleName" className={formStyles.formLabel}>
                                Middle Name
                            </label>
                            <input
                                type="text"
                                id="middleName"
                                name="middleName"
                                className={formStyles.formInput}
                                value={patientFormData.middleName}
                                onChange={handleChange}
                                placeholder="Middle Name"
                            />
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>  
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="suffix" className={formStyles.formLabel}>
                                Suffix
                            </label>
                            <input
                                type="text"
                                id="suffix"
                                name="suffix"
                                className={formStyles.formInput}
                                value={patientFormData.suffix}
                                onChange={handleChange}
                                placeholder="Suffix"
                            />
                        </div>
                    </div>

                </div>

                <div className={formStyles.formRow4}>
                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="dateOfBirth" className={formStyles.formLabel}>
                                Date of Birth <span className={formStyles.required}>*</span>
                            </label>
                            <DatePicker
                                id="dateOfBirth"
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
                            {dateOfBirthError && (
                                <div className={formStyles.errorMessage}>{dateOfBirthError}</div>
                            )}
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>  
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="age" className={formStyles.formLabel}>
                                Age <span className={formStyles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="age"
                                name="age"
                                className={formStyles.formInput}
                                value={patientFormData.age}
                                placeholder="Age"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="sex" className={formStyles.formLabel}>
                                Sex <span className={formStyles.required}>*</span>
                            </label>
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
                        </div>
                        {sexError && <div className={formStyles.errorMessage}>{sexError}</div>}
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="civilStatus" className={formStyles.formLabel}>
                                Civil Status
                            </label>
                            <select
                                id="civilStatus"
                                name="civilStatus"
                                className={formStyles.formInput}
                                value={patientFormData.civilStatus}
                                onChange={handleChange}
                            >
                                
                                <option value="" hidden>Civil Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Separated">Separated</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={formStyles.formRow3}>
                    <div className={formStyles.formGroup}>  
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="occupation" className={formStyles.formLabel}>
                                Occupation
                            </label>
                            <input
                                type="text"
                                id="occupation"
                                name="occupation"
                                className={formStyles.formInput}
                                value={patientFormData.occupation}
                                onChange={handleChange}
                                placeholder="Occupation"
                            />
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="firstName" className={formStyles.formLabel}>
                                Educational Attainment
                            </label>
                            <select
                                id="educationalAttainment"
                                name="educationalAttainment"
                                className={formStyles.formInput}
                                value={patientFormData.educationalAttainment}
                                onChange={handleChange}
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
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="phoneNumber" className={formStyles.formLabel}>
                                Phone Number
                            </label>
                            <InputMask
                                mask="9999-999-9999"
                                id="phoneNumber"
                                name="phoneNumber"
                                className={formStyles.formInput}
                                value={patientFormData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                onBlur={(e) => handlePhoneNumberBlur(e)}                                
                                maskChar={'X'}
                                inputMode="numeric"
                                pattern="\d{4}-\d{3}-\d{4}"
                            >
                                {(inputProps) => <input {...inputProps} type="tel" />}
                            </InputMask>
                        </div>
                        {phoneNumberError && <div className={formStyles.errorMessage}>{phoneNumberError}</div>}
                    </div>

                </div>

                <div className={formStyles.formGroup}>
                    <div className={formStyles.inputWrapper}>
                        <label htmlFor="philhealthNumber" className={formStyles.formLabel}>
                            Philhealth Number
                        </label>
                        <InputMask
                            mask="99-999999999-9"
                            id="philhealthNumber"
                            name="philhealthNumber"
                            className={formStyles.formInput}
                            value={patientFormData.philhealthNumber}
                            onChange={handleChange}
                            placeholder="Philhealth Number"
                            maskChar={'X'}
                            inputMode="numeric"
                            pattern="\d{2}-\d{9}-\d{1}"
                        >
                        </InputMask>
                    </div>
                </div>


                <div className={formStyles.formRow4}>
                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="country" className={formStyles.formLabel}>
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                className={formStyles.formInput}
                                value={patientFormData.country}
                                onChange={handleChange}
                            >
                                
                                <option value="" hidden>Country</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Korea">Korea</option>
                                <option value="Japan">Japan</option>
                            </select>
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="streetName" className={formStyles.formLabel}>
                                Street Name <span className={formStyles.required}>*</span>
                            </label>
                            <select
                                id="streetName"
                                name="streetName"
                                className={`${formStyles.formInput} ${formStyles.selectInput} ${streetNameError ? formStyles.inputError : ''}`}
                                value={patientFormData.streetName}
                                onChange={handleChange}
                                onBlur={handleStreetNameBlur}
                                aria-invalid={!!streetNameError}
                                required
                            >
                                
                                <option value="" hidden>Street Name</option>
                                <option value="kayumanggi">Kayumanggi</option>
                                <option value="karunungan">Karunungan</option>
                                <option value="kalinisan">Kalinisan</option>
                                <option value="katapangan">Katapangan</option>
                                <option value="kagitingan">Kagitingan</option>
                                <option value="katatagan">Katatagan</option>
                                <option value="karangalan">Karangalan</option>
                                <option value="katapatan">Katapatan</option>
                                <option value="kasipagan">Kasipagan</option>
                                <option value="kahusayan">Kahusayan</option>
                                <option value="kabutihan">Kabutihan</option>
                                <option value="katalinuhan">Katalinuhan</option>
                                <option value="kabanalan">Kabanalan</option>
                                <option value="kaayusan">Kaayusan</option>
                                <option value="kabayanihan">Kabayanihan</option>
                                <option value="kalayaan">Kalayaan</option>
                            </select>
                        </div>
                        {streetNameError && <div className={formStyles.errorMessage}>{streetNameError}</div>}
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="region" className={formStyles.formLabel}>
                                Region <span className={formStyles.required}>*</span>
                            </label>
                            <select
                                id="region"
                                name="region"
                                className={`${formStyles.formInput} ${formStyles.selectInput} ${regionError ? formStyles.inputError : ''}`}
                                value={patientFormData.region}
                                onChange={handleChange}
                                onBlur={handleRegionBlur}
                                aria-invalid={!!regionError}
                                required
                            >
                                
                                <option value="" hidden>Region</option>
                                <option value="region_1">Region 1</option>
                                <option value="region_2">Region 2</option>
                                <option value="region_3">Region 3</option>
                                <option value="region_4a">Region 4-A</option>
                                <option value="region_4b">Region 4-B</option>
                                <option value="region_5">Region 5</option>
                                <option value="region_6">Region 6</option>
                                <option value="region_7">Region 7</option>
                                <option value="region_8">Region 8</option>
                                <option value="region_9">Region 9</option>
                                <option value="region_10">Region 10</option>
                                <option value="region_11">Region 11</option>
                                <option value="region_12">Region 12</option>
                                <option value="region_13">Region 13</option>
                                <option value="ncr">NCR</option>
                                <option value="car">CAR</option>
                            </select>
                        </div>
                        {regionError && <div className={formStyles.errorMessage}>{regionError}</div>}
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="province" className={formStyles.formLabel}>
                                Province <span className={formStyles.required}>*</span>
                            </label>
                            <select
                                id="province"
                                name="province"
                                className={`${formStyles.formInput} ${formStyles.selectInput} ${provinceError ? formStyles.inputError : ''}`}
                                value={patientFormData.province}
                                onChange={handleChange}
                                onBlur={handleProvinceBlur}
                                required
                                aria-invalid={!!provinceError}
                            >
                                
                                <option value="" hidden>Province</option>
                                <option value="rizal">Rizal</option>
                                <option value="bulacan">Bulacan</option>
                            </select>
                        </div>
                        {provinceError && <div className={formStyles.errorMessage}>{provinceError}</div>}
                    </div>
                </div>

                <div className={formStyles.formRow2}>
                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="city" className={formStyles.formLabel}>
                                City/Municipality <span className={formStyles.required}>*</span>
                            </label>
                            <select
                                id="city"
                                name="city"
                                className={`${formStyles.formInput} ${formStyles.selectInput} ${cityError ? formStyles.inputError : ''}`}
                                value={patientFormData.city}
                                onChange={handleChange}
                                onBlur={handleCityBlur}
                                aria-invalid={!!cityError}
                                required
                            >
                                
                                <option value="" hidden>City</option>
                                <option value="cainty">Cainta</option>
                                <option value="san_juan_city">San Juan City</option>
                            </select>
                        </div>
                        {cityError && <div className={formStyles.errorMessage}>{cityError}</div>}
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="barangay" className={formStyles.formLabel}>
                                Barangay <span className={formStyles.required}>*</span>
                            </label>
                            <select
                                id="barangay"
                                name="barangay"
                                className={`${formStyles.formInput} ${formStyles.selectInput} ${barangayError ? formStyles.inputError : ''}`}
                                value={patientFormData.barangay}
                                onChange={handleChange}
                                onBlur={handleBarangayBlur}
                                aria-invalid={!!barangayError}
                                required
                            >
                                
                                <option value="" hidden>Barangay</option>
                                <option value="san_andres">San Andres</option>
                                <option value="sto_domingo">Sto. Domingo</option>
                                <option value="san_isidro">San Isidro</option>
                                <option value="santo_nino">Santo Niño</option>
                                <option value="santa_rosa">Santa Rosa</option>
                                <option value="san_juan">San Juan</option>
                                <option value="san_roque">San Roque</option>
                            </select>
                        </div>
                        {barangayError && <div className={formStyles.errorMessage}>{barangayError}</div>}
                        
                    </div>
                </div>

                <div className={formStyles.formRow2}>
                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="familyId" className={formStyles.formLabel}>
                                Family ID <span className={formStyles.required}>*</span>
                            </label>
                            <div className={formStyles.inputWithIcon}>
                                <InputMask
                                    id="familyId"
                                    name="familyId"
                                    className={`${formStyles.formInput} ${familyIdError ? formStyles.inputError : ''}`}
                                    value={patientFormData.familyId}
                                    onChange={handleChange}
                                    placeholder="Family ID"
                                    onBlur={(e) => handleFamilyIdBlur(e)}
                                    required
                                    maskChar={'X'}
                                    aria-required="true"
                                    inputMode="numeric"
                                >
                                </InputMask>
                                <button
                                    type="button"
                                    className={formStyles.iconButton}
                                    onClick={() => setIsFamilyIdSearchModalOpen(true)}
                                    aria-label="Search for patient with family id"
                                    >
                                    <BiSearchAlt size={18} />
                                </button>
                            </div>
                            {familyIdError && <div className={formStyles.errorMessage}>{familyIdError}</div>}
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>
                        <div className={formStyles.inputWrapper}>
                            <label htmlFor="familyMember" className={formStyles.formLabel}>
                                Family Member <span className={formStyles.required}>*</span>
                            </label>
                            <select
                                id="familyMember"
                                name="familyMember"
                                className={`${formStyles.formInput} ${formStyles.selectInput} ${familyMemberError ? formStyles.inputError : ''}`}
                                value={patientFormData.familyMember}
                                onChange={handleChange}
                                onBlur={handleFamilyMemberBlur}
                                aria-invalid={!!familyMemberError}
                                required
                            >
                                
                                <option value="" hidden>Family Member</option>
                                <option value="kalayaan">Head of the Family</option>
                                <option value="karangalan">Father</option>
                                <option value="karangalan">Mother</option>
                                <option value="karangalan">Daughter</option>
                                <option value="karangalan">Son</option>
                                <option value="karangalan">Other, Specify</option>
                            </select>
                        </div>
                        {familyMemberError && <div className={formStyles.errorMessage}>{familyMemberError}</div>}
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

            <FamilyIdSearchModal 
                isOpen={isFamilyIdSearchModalOpen}
                onClose={() => setIsFamilyIdSearchModalOpen(false)}
                onSelect={handleFamilyIdSelect}
            />
        </>

    );
}

export default AddPatientForm;