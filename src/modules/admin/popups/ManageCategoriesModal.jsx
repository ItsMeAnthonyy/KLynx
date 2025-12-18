import React, { useState, useEffect, useCallback } from 'react';
import { BiX, BiSearch, BiPlus, BiCog, BiTrash, BiCheck, BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import { getICD10Categories, createICD10Category, updateICD10Category, deleteICD10Category } from '../api/icd10Api';
import { useToast } from '../../../hooks/use-toast';
import styles from './ICD10Modals.module.css';

export default function ManageCategoriesModal({ isOpen, onClose, isAdmin }) {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const pageSize = 10;

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getICD10Categories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({ title: 'Error', description: 'Failed to fetch categories', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    const filtered = categories.filter(cat =>
      cat.Category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [searchTerm, categories]);

    const totalPages = Math.ceil(filteredCategories.length / pageSize);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
        toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
        return;
    }

    try {
        await createICD10Category(newCategoryName.trim());
        toast({ title: 'Success', description: 'Category added' });
        setNewCategoryName('');
        fetchCategories();
    } catch (error) {
        toast({ title: 'Error', description: error.message || 'Failed to add category', variant: 'destructive' });
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.ID);
    setEditingName(cat.Category);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim()) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }

    try {
      await updateICD10Category(editingId, editingName.trim());
      toast({ title: 'Success', description: 'Category updated' });
      setEditingId(null);
      setEditingName('');
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to update category', variant: 'destructive' });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    try {
      await deleteICD10Category(deleteId);
      toast({ title: 'Success', description: 'Category deleted' });
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete category. It may be in use.', variant: 'destructive' });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Manage Categories</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <BiX size={24} />
          </button>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchContainer}>
            <BiSearch size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {isAdmin && (
          <div className={styles.addCategoryRow}>
            <input
              type="text"
              placeholder="New category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className={styles.input}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button onClick={handleAddCategory} className={styles.addButton}>
              <BiPlus size={18} />
              Add Category
            </button>
          </div>
        )}

        <div className={styles.entriesInfo}>
          Showing {paginatedCategories.length} of {filteredCategories.length} entries
        </div>

        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : filteredCategories.length === 0 ? (
            <div className={styles.empty}>No categories found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Category</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((cat, index) => (
                  <tr key={cat.ID}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>
                      {editingId === cat.ID ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className={styles.editInput}
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                        />
                      ) : (
                        cat.Category
                      )}
                    </td>
                    {isAdmin && (
                      <td className={styles.actions}>
                        {editingId === cat.ID ? (
                          <button 
                            onClick={handleSaveEdit} 
                            className={styles.saveButton}
                            title="Save"
                          >
                            <BiCheck size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStartEdit(cat)} 
                            className={styles.editButton}
                            title="Edit"
                          >
                            <BiCog size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteClick(cat.ID)} 
                          className={styles.deleteButton}
                          title="Delete"
                        >
                          <BiTrash size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            Page {currentPage} of {totalPages || 1}
          </div>
          <div className={styles.pageControls}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
              title="First page"
            >
              <BiChevronsLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.pageButton}
              title="Previous page"
            >
              <BiChevronLeft size={18} />
            </button>
            <span className={styles.pageNumber}>{currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages || 1, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={styles.pageButton}
              title="Next page"
            >
              <BiChevronRight size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages || 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={styles.pageButton}
              title="Last page"
            >
              <BiChevronsRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div className={styles.confirmOverlayDelete}>
            <div className={styles.confirmModalDelete}>
            <p>Are you sure you want to delete this category?</p>
            <div className={styles.confirmActionsDelete}>
                <button 
                onClick={handleConfirmDelete} 
                className={styles.confirmButtonDelete}
                >
                Yes
                </button>
                <button 
                onClick={() => setConfirmOpen(false)} 
                className={styles.cancelButtonDelete}
                >
                Cancel
                </button>
            </div>
            </div>
        </div>
        )}
    </>
  );
}