import React, { useState, useEffect } from 'react';
import styles from './UserForm.module.css';
import { BiX, BiUser, BiCalendar, BiTime, BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { FaPlus, FaEye, FaEdit, FaTrash, FaRandom, FaSpinner } from 'react-icons/fa';
const ROLES = [
    { value: 'admin', label: 'Admin' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'staff', label: 'Staff' }
];
import { toast } from '../../../../hooks/use-toast';
import { createUser, updateProfile, test } from "../../api/userApi"

export default function UserForm({ isOpen, onSuccess, mode, selectedUser, onClose }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [formData, setFormData] = useState({});

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    useEffect(() => {
        if (!isOpen) return;
        console.log("SELECTED: ", selectedUser);
        if ((mode === "edit" || mode === "view") && selectedUser) {
            const data = {
                userId: selectedUser.id || '',
                lastName: selectedUser.last_name || '',
                firstName: selectedUser.first_name || '',
                emailAddress: selectedUser.email || '',
                userRole: selectedUser.role || '',
                phoneNumber: selectedUser.phone_number || '',
                status: selectedUser.status || '',
                lastLogin: selectedUser.last_login || '', // RAW
                tempPassword: ''
            };

            setFormData(data);
            setInitialData(data);
        } else {
            const emptyData = {
                userId: '',
                lastName: '',
                firstName: '',
                emailAddress: '',
                userRole: '',
                tempPassword: '',
                forcePasswordChange: false,
                sendWelcomeEmail: false
            };

            setFormData(emptyData);
            setInitialData(emptyData);
        }

    }, [isOpen, mode, selectedUser]);

    const hasChanges =
        initialData &&
        JSON.stringify(formData) !== JSON.stringify(initialData);
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return;
        if (!hasChanges) return;
        setIsSaving(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (isAddMode) {
                const result = await createUser(formData);
                toast({
                    title: 'Success!',
                    description: 'User Account created successfully.',
                    className: 'toast-success',
                });

                // const result = await test();
            }
            
            if (isEditMode) {
                const result = await updateProfile(formData);
                toast({
                    title: 'Success!',
                    description: 'User Account Profile updated successfully.',
                    className: 'toast-success',
                });
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            toast({
            title: 'Error',
            description: err.message || 'Something went wrong.',
            variant: 'destructive',
        });
        } finally {
            setIsSaving(false);
        }
    }

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

    const setFieldValue = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString.replace(' ', 'T'));

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Password generation function
    const generateSecurePassword = () => {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        // Ensure at least one of each type
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
        password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
        password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
        
        // Fill the rest
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    };

    return(
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>
                        Last Name{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        className={styles.input}
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={isSaving || isViewMode}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>
                        First Name{isAddMode &&<span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        className={styles.input}
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={isSaving || isViewMode}
                        required
                    />
                </div>
            </div>
            <div className={styles.field}>
                <label>
                    Email Address{isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                </label>
                <input
                    type="email"
                    name="emailAddress"
                    className={styles.input}
                    value={formData.emailAddress}
                    onChange={handleChange}
                    disabled={isSaving || isViewMode}
                    required
                />
            </div>
            <div className={styles.field}>
                <label>
                    User Role{isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                </label>
                {isViewMode ? (
                    <input
                        type="text"
                        className={styles.input}
                        value={
                            ROLES.find(r => r.value === formData.userRole)?.label || ''
                        }
                        disabled
                    />
                ) : (
                    <select
                        name="userRole"
                        className={styles.select}
                        value={formData.userRole}
                        onChange={handleChange}
                        disabled={isSaving || isViewMode}
                        required
                    >
                        <option value="" hidden>Select user role...</option>
                        {ROLES.map((priority) => (
                            <option key={priority.value} value={priority.value}>
                                {priority.label}
                            </option>
                        ))}
                    </select>
                )} 
            </div>
            {!isViewMode && (
                <div className={styles.field}>
                    <label>
                        {isEditMode ? "Password (optional)" : "Temporary Password"}
                        {isAddMode && <span style={{ color: '#e53e3e' }}>*</span>}
                    </label>
                    <div className={styles.passwordRow}>
                        <input
                            type="text"
                            name="tempPassword"
                            className={styles.input}
                            value={formData.tempPassword}
                            placeholder="Enter secure password"
                            onChange={handleChange}
                            disabled={isSaving || isViewMode}
                            required={isAddMode}
                        />
                        <button
                            type="button"
                            className={styles.generateBtn}
                            onClick={() => {
                                const password = generateSecurePassword();
                                setFieldValue('tempPassword', password);
                            }}
                            disabled={isSaving || isViewMode}
                        >
                            <FaRandom size={14} />
                            Generate
                        </button>
                    </div>
                </div>
            )}
            {isAddMode && (
                <div className={styles.optionsSection}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="forcePasswordChange"
                            className={styles.checkbox}
                            checked={formData.forcePasswordChange}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                        <span className={styles.checkboxText}>
                            Force password change on first login
                        </span>
                    </label>

                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="sendWelcomeEmail"
                            className={styles.checkbox}
                            checked={formData.sendWelcomeEmail}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                        <span className={styles.checkboxText}>
                            Send welcome email with login instructions
                        </span>
                    </label>
                </div>
            )}
            {!isAddMode && (
                <>
                <div className={styles.field}>
                    <label>
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        className={styles.input}
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={isSaving || isViewMode || isAddMode}
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>
                            Status
                        </label>
                        <input
                            type="text"
                            name="status"
                            className={styles.input}
                            value={formData.status}
                            onChange={handleChange}
                            disabled={isSaving || isViewMode || isAddMode || isEditMode}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>
                            Last Login
                        </label>
                        <input
                            type="text"
                            name="lastLogin"
                            className={styles.input}
                            value={formatDateTime(formData.lastLogin)}
                            onChange={handleChange}
                            disabled={isSaving || isViewMode || isAddMode || isEditMode}
                        />
                    </div>
                </div>
                </>
            )}
            {!isViewMode && (
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnCancel}`}
                        onClick={() => {
                            onClose();
                            setErrors({});
                        }}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        disabled={isSaving || isViewMode || !hasChanges}
                    >
                        {isSaving ? (
                                <>
                                    <span className={styles.btnContent}>
                                        <FaSpinner className={styles.spinner} size={16} />
                                        {isEditMode ? "Saving..." : "Creating..."}
                                    </span>
                                </>
                            ) : (
                                isEditMode ? "Save Changes" : "Create User"
                        )}
                    </button>
                </div>
            )}

        </form>
    );
}