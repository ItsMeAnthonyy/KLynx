import React, { useState, useEffect } from 'react';
import { BiX } from "react-icons/bi";
import { createICD10Code/*, updateICD10Code*/ } from '../api/icd10Api';
import { getICD10Categories } from '../api/icd10Api';
import { useToast } from '../../../hooks/use-toast';
import styles from './ICD10Modals.module.css';

export default function AddICD10Modal({ isOpen, onClose, editingCode }) {
    const { toast } = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        category_id: ''
    });

    useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (editingCode) {
        setFormData({
          code: editingCode.code || '',
          description: editingCode.description || '',
          category_id: editingCode.category_id || ''
        });
      } else {
        setFormData({ code: '', description: '', category_id: '' });
      }
    }
  }, [isOpen, editingCode]);

    const fetchCategories = async () => {
        try {
            const data = await getICD10Categories();
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.code.trim() || !formData.description.trim()) {
            toast({ title: 'Error', description: 'Code and description are required', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                code: formData.code.trim(),
                description: formData.description.trim(),
                category_id: formData.category_id || null
            };

        if (editingCode) {
            await updateICD10Code(editingCode.id, payload);
            toast({ title: 'Success', description: 'ICD10 code updated' });
        } else {
            await createICD10Code(payload);
            toast({ title: 'Success', description: 'ICD10 code created' });
        }
        onClose();
        } catch (error) {
            console.error('Error saving ICD10 code:', error);
            toast({ title: 'Error', description: error.message || 'Failed to save ICD10 code', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modalSmall}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {editingCode ? 'Edit ICD10 Entry' : 'Add ICD10 Entry'}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <BiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>ICD Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., A00.0"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Enter description..."
              rows="3"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat.ID} value={cat.ID}>{cat.Category}</option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Saving...' : (editingCode ? 'Update' : 'Add Entry')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}