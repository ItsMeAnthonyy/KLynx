import React, { useState, useEffect, useCallback } from 'react';
import { BiX, BiSearch, BiCog, BiPlus, BiPencil, BiTrash, BiChevronsLeft, BiChevronLeft, BiChevronRight, BiChevronsRight, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { getICD10Codes, deleteICD10Code } from '../api/icd10Api';
import { useToast } from '../../../hooks/use-toast';
import AddICD10Modal from './AddICD10Modal';
import ManageCategoriesModal from './ManageCategoriesModal';
import styles from './ICD10Modals.module.css';


export default function ICD10SearchModal({ isOpen, onClose, onSelect, isAdmin }) {
    const { toast } = useToast();

    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCategoriesModal, setShowCategoriesModal] = useState(false);
    const [editingCode, setEditingCode] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchCodes = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getICD10Codes(currentPage, pageSize, searchTerm);
            setCodes(result.data || []);
            setTotalPages(result.totalPages || 1);
            setTotalCount(result.count || 0);
        } catch (error) {
            console.error('Error fetching ICD10 codes:', error);
            toast({ title: 'Error', description: 'Failed to fetch ICD10 codes', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, toast]);

    useEffect(() => {
        if (isOpen) {
            fetchCodes();
        }
    }, [isOpen, fetchCodes]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        setConfirmOpen(false);

        try {
            await deleteICD10Code(deleteId);
            toast({ title: 'Success', description: 'ICD10 code deleted' });
            fetchCodes();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete ICD10 code', variant: 'destructive' });
        }
    };

    const handleEdit = (code) => {
        setEditingCode(code);
        setShowAddModal(true);
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
        setEditingCode(null);
        fetchCodes();
    };

    const handleSelectCode = (code) => {
        onSelect(code);
        console.log("LASTTT",code);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Search ICD10 Code</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <BiX size={24} />
                    </button>
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.searchContainer}>
                        <BiSearch size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by code or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {isAdmin && (
                        <div className={styles.adminButtons}>
                            <button 
                                onClick={() => setShowAddModal(true)} 
                                className={styles.addButton}
                            >
                                <BiPlus size={18} />
                                Add ICD10 Entry
                            </button>
                            <button 
                                onClick={() => setShowCategoriesModal(true)} 
                                className={styles.categoriesButton}
                            >
                                <BiCog size={18} />
                                Manage Categories
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.entriesInfo}>
                    {/* Showing {codes.length} of {totalCount} entries */}
                </div>

                <div className={styles.tableContainer}>
                    {loading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : codes.length === 0 ? (
                        <div className={styles.empty}>No ICD10 codes found</div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {codes.map((code, index) => (
                                    <tr 
                                        key={code.ID} 
                                        onClick={() => handleSelectCode(code)}
                                        className={styles.selectableRow}
                                    >
                                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                        <td className={styles.codeCell}>{code.Code}</td>
                                        <td>{code.Description}</td>
                                        <td>{code.category_name || '-'}</td>
                                        {isAdmin && (
                                            <td className={styles.actions} onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    onClick={() => handleEdit(code)} 
                                                    className={styles.editButton}
                                                    title="Edit"
                                                >
                                                    <BiPencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(code.ID)} 
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
                        Page {currentPage} of {totalPages}
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
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={styles.pageButton}
                            title="Next page"
                        >
                            <BiChevronRight size={18} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className={styles.pageButton}
                            title="Last page"
                        >
                            <BiChevronsRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <AddICD10Modal
                isOpen={showAddModal}
                onClose={handleAddModalClose}
                editingCode={editingCode}
            />

            <ManageCategoriesModal
                isOpen={showCategoriesModal}
                onClose={() => setShowCategoriesModal(false)}
                isAdmin={isAdmin}
            />

            {confirmOpen && (
                <div className={styles.confirmOverlayDelete}>
                    <div className={styles.confirmModalDelete}>
                    <p>Are you sure you want to delete this ICD10 code?</p>
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