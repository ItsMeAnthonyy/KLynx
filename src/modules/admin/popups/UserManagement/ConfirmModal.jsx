import { useState, useEffect } from 'react';
import styles from './ConfirmModal.module.css';
import { toast } from '../../../../hooks/use-toast';
import { updateStatus } from "../../api/userApi"

export default function ConfirmModal({ onSuccess, mode, selectedUser, config, onClose }) {

    const [isSaving, setIsSaving] = useState(false);

    const isStatusMode = mode === "status";

    const handleConfirm = async () => {
        setIsSaving(true);
        if (!isStatusMode) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            if (isStatusMode) {
                const newStatus =
                    selectedUser.status === "active" ? "inactive" : "active";
                const result = await updateStatus(selectedUser.id, newStatus);
                toast({
                    title: 'Success!',
                    description: 'User Account Status updated successfully.',
                    className: 'toast-success',
                });

                onSuccess?.();
                onClose();
            }

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

    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <p>{config.message}</p>
                {config.note && <p className={styles.note}>{config.note}</p>}
            </div>
            <div className={styles.actions}>
                <button onClick={onClose} disabled={isSaving}>
                    Cancel
                </button>

                <button
                    onClick={handleConfirm}
                    disabled={isSaving}
                    className={`${styles.confirmBtn} ${styles[config.variant]}`}
                >
                    {isSaving ? "Processing..." : config.confirmText}
                </button>
            </div>
        </div>
    );
}