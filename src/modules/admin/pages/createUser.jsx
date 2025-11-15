import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from '@/contexts/AuthContext';
import Select from 'react-select';

import { BiUser, BiUserCheck, BiMailSend, BiLock, BiErrorCircle } from "react-icons/bi";
import styles from './CreateUser.module.css';
import { createUser } from '../api/userApi';


const CreateUser = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);


    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Please fill in required fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const res = await createUser(email, password);
            if (res.data.error) throw new Error(res.data.error);
            const { success, user_id, error: userError } = res.data;
            
            if (!success) throw new Error(userError || "User creation failed");

            const profileRes = await createProfile(user_id, firstName, lastName, middleName, suffix);
            const { error: profileError } = profileRes.data;
            if (profileError) throw new Error(profileError);
            

            if (success) {
                console.log("New User ID:", user_id);
                setSuccess('Account created successfully!');
                setPassword('');
            }

        } catch(err) {
            setError(err.message || 'Failed to create user');
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        
                    </div>
                    <h1 className={styles.title}>Create User</h1>
                    <p className={styles.subtitle}>
                        Create a user account
                    </p>
                </div>

                <form onSubmit={handleCreateUser} className={styles.form}>
                    {/* <div className={styles.formGroup}>
                        <label htmlFor="firstName" className={styles.label}>
                            <BiUser size={18} />
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className={styles.input}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            autoComplete="given-name"
                            required
                        />
                    </div> */}
                    {/* <div className={styles.formGroup}>
                        <label htmlFor="lastName" className={styles.label}>
                            <BiUser size={18} />
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className={styles.input}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            autoComplete="family-name"
                            required
                        />
                    </div> */}
                    {/* <div className={styles.formGroup}>
                        <label htmlFor="middleName" className={styles.label}>
                            <BiUser size={18} />
                            Middle Name (Optional)
                        </label>
                        <input
                            type="text"
                            id="middleName"
                            className={styles.input}
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            placeholder="Enter your middle name"
                            autoComplete="middle-name"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="suffix" className={styles.label}>
                            <BiUser size={18} />
                            Suffix (Optional)
                        </label>
                        <input
                            type="text"
                            id="suffix"
                            className={styles.input}
                            value={suffix}
                            onChange={(e) => setSuffix(e.target.value)}
                            placeholder="Enter your suffix"
                            autoComplete="honorific-suffix"
                        />
                    </div> */}
                    <div className={styles.formGroup}>
                        <label htmlFor="role" className={styles.label}>
                            <BiUser size={18} />
                            Role
                        </label>
                        <Select
                            id="role"
                            value={role ? { value: role, label: role.charAt(0).toUpperCase() + role.slice(1) } : null}
                            onChange={(option) => setRole(option?.value || null)}
                            options={[
                                { value: 'staff', label: 'Staff' },
                                { value: 'admin', label: 'Admin' },
                                { value: 'doctor', label: 'Doctor' },
                                { value: 'nurse', label: 'Nurse' },
                                { value: 'dentist', label: 'Dentist' },
                                { value: 'physician', label: 'Physician' },
                                { value: 'midwife', label: 'Midwife' },
                            ]}
                            placeholder="Select role"
                            className={styles.reactSelect}
                            classNamePrefix="select"
                            isClearable
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            <BiMailSend size={18} />
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            <BiLock size={18} />
                            Password *
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'}
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            required
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <BiErrorCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className={styles.success}>
                            <BiErrorCircle size={18} />
                            <span>{success}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Submit'}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default CreateUser;