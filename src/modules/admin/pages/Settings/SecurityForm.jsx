import { useState, useEffect } from 'react';
import styles from './SecurityForm.module.css';
import forms from './forms.module.css';
import { updatePassword } from "../../api/settingApi";

import { toast } from '../../../../hooks/use-toast';

export default function SecurityForm() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid =
        formData.currentPassword.trim() &&
        formData.newPassword.trim() &&
        formData.confirmPassword.trim();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        try {
            setIsSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await updatePassword(formData);

            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            toast({
                title: 'Success!',
                description: 'Password updated successfully.',
                className: 'toast-success',
            });

        }  catch (err) {
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
                <h3>Change Password</h3>
                <p className={forms.cardDescription}>Update your password to keep your account secure</p>
            </div>
            <div className={forms.cardContent}>
                <form onSubmit={handleSubmit}>
                    <div className={forms.formGroup}>
                        <label 
                            htmlFor="currentPassword">Current Password</label>
                        <input 
                            id="currentPassword"
                            name="currentPassword"
                            type="password" 
                            value={formData.currentPassword}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                    </div>
                    <div className={forms.formGroup}>
                        <label htmlFor="newPassword">New Password</label>
                        <input 
                            id="newPassword" 
                            name="newPassword"
                            type="password" 
                            value={formData.newPassword}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                    </div>
                    <div className={forms.formGroup}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input 
                            id="confirmPassword" 
                            name="confirmPassword"
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                    </div>
                    <div className={forms.formActions}>
                        <button 
                            type="submit" 
                            className={forms.saveButton}
                            disabled={isSaving || !isFormValid}
                        >
                            {isSaving ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}