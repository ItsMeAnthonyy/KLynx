import React, { useState, useEffect } from 'react';
import { X, Search, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getMedicines, createMedicine } from '../api/medicineApi';
import useAuth from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/use-toast';
import styles from './PrescriptionModals.module.css';

export default function MedicineSearchModal({ isOpen, onClose, onSelect }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [newMedicine, setNewMedicine] = useState({
    drug_code: '',
    generic_name: '',
    form: '',
    strength: '',
    unit_of_measure: ''
  });

  const { auth } = useAuth();
  const isAdmin  = auth?.userRole?.includes("admin");

  useEffect(() => {
    if (isOpen) {
      fetchMedicines();
    }
  }, [isOpen, page, search, entriesPerPage]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const result = await getMedicines(search, page, entriesPerPage);
      setMedicines(result.data || []);
      setTotalPages(result.totalPages);
      setTotalCount(result.count);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelect = (medicine) => {
    onSelect(medicine);
    onClose();
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await createMedicine(newMedicine);
      toast({ title: 'Success', description: 'Medicine added successfully' });
      setShowAddForm(false);
      setNewMedicine({ drug_code: '', generic_name: '', form: '', strength: '', unit_of_measure: '' });
      fetchMedicines();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Search Commodity Medicine</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by drug code or generic name..."
              value={search}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowAddForm(true)} 
              className={styles.addButton}
            >
              <Plus size={16} /> Add Medicine
            </button>
          )}
        </div>

        <div className={styles.entriesSelector}>
          <span>Show</span>
          <select 
            value={entriesPerPage} 
            onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setPage(1); }}
            className={styles.entriesSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddMedicine} className={styles.addMedicineForm}>
            <h3>Add New Medicine</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label>Drug Code *</label>
                <input
                  type="text"
                  value={newMedicine.drug_code}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, drug_code: e.target.value }))}
                  placeholder="e.g., PARACTAB500MG"
                  required
                />
              </div>
              <div className={styles.formField}>
                <label>Generic Name *</label>
                <input
                  type="text"
                  value={newMedicine.generic_name}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, generic_name: e.target.value }))}
                  placeholder="e.g., Paracetamol"
                  required
                />
              </div>
              <div className={styles.formField}>
                <label>Form</label>
                <input
                  type="text"
                  value={newMedicine.form}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, form: e.target.value }))}
                  placeholder="e.g., Tablet"
                />
              </div>
              <div className={styles.formField}>
                <label>Strength</label>
                <input
                  type="text"
                  value={newMedicine.strength}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, strength: e.target.value }))}
                  placeholder="e.g., 500 mg"
                />
              </div>
              <div className={styles.formField}>
                <label>Unit of Measure</label>
                <input
                  type="text"
                  value={newMedicine.unit_of_measure}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, unit_of_measure: e.target.value }))}
                  placeholder="e.g., tablet"
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={() => setShowAddForm(false)} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Save Medicine
              </button>
            </div>
          </form>
        )}

        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : medicines.length === 0 ? (
            <div className={styles.emptyState}>No medicines found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Drug Code</th>
                  <th>Generic Name</th>
                  <th>Form</th>
                  <th>Strength</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, idx) => (
                  <tr key={med.id}>
                    <td>{(page - 1) * entriesPerPage + idx + 1}</td>
                    <td>{med.drug_code}</td>
                    <td>{med.generic_name}</td>
                    <td>{med.form || '-'}</td>
                    <td>{med.strength || '-'}</td>
                    <td>{med.unit_of_measure || '-'}</td>
                    <td>
                      <button 
                        onClick={() => handleSelect(med)} 
                        className={styles.selectButton}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Showing {medicines.length > 0 ? (page - 1) * entriesPerPage + 1 : 0} to {Math.min(page * entriesPerPage, totalCount)} of {totalCount} entries
          </span>
          <div className={styles.pageControls}>
            <button onClick={() => setPage(1)} disabled={page === 1} className={styles.pageButton}>
              <ChevronsLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={styles.pageButton}>
              <ChevronLeft size={16} />
            </button>
            <span className={styles.currentPage}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={styles.pageButton}>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className={styles.pageButton}>
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
