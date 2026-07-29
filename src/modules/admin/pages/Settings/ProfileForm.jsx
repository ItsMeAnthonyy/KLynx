import { useState, useEffect } from 'react';
import styles from './ProfileForm.module.css';
import forms from './forms.module.css';
import { updateProfile } from "../../api/settingApi";

import useAuth from '../../../../hooks/useAuth';
import { toast } from '../../../../hooks/use-toast';

export default function ProfileForm() {
    const { auth, setAuth } = useAuth();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: ""
    });
    const [initialData, setInitialData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const data = {
            userId: auth.userId,
            firstName: auth.userFirstName,
            lastName: auth.userLastName,
            email: auth.userEmail,
            phoneNumber: auth.userPhoneNumber,
            role: auth.userRole
        };
        setFormData(data);
        setInitialData(data);
    }, [auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const hasChanges = () => {
        return (
            formData.firstName !== initialData.firstName ||
            formData.lastName !== initialData.lastName ||
            formData.email !== initialData.email ||
            formData.phoneNumber !== initialData.phoneNumber
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasChanges()) return;
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const result = await updateProfile(formData);
            if (result.success) {
                setAuth(prev => ({
                    ...prev,
                    userFirstName: result.data.firstName,
                    userLastName: result.data.lastName,
                    userPhoneNumber: result.data.phoneNumber
                }));
            }
            
            toast({
                title: 'Success!',
                description: 'Profile updated successfully.',
                className: 'toast-success',
            });

        } catch (err) {
            toast({
            title: 'Error',
            description: err.message || 'Something went wrong.',
            variant: 'destructive',
        });
        } finally {
            setIsSaving(false);
        }
    };

    return(
        <div className={forms.card}>
            <div className={forms.cardHeader}>
                <h3>Profile Information</h3>
                <p className={forms.cardDescription}>Update your personal information and contact details</p>
            </div>
            <div className={forms.cardContent}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={forms.formGroup}>
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
                        <div className={forms.formGroup}>
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                    <div className={styles.formGrid}>
                        <div className={forms.formGroup}>
                            <label>Email Address:</label>
                            <div className={forms.inputWithIcon}>
                                <i className={`fas fa-envelope`}></i>
                                <input
                                    name="email"
                                    value={formData.email}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className={forms.formGroup}>
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <div className={forms.inputWithIcon}>
                                <i className={`fas fa-phone`}></i>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={forms.formGroup}>
                        <label>Role:</label>
                        <input
                            name="role"
                            value={formData.role}
                            disabled
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="submit"
                            className={forms.saveButton}
                            disabled={isSaving || !hasChanges()}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}