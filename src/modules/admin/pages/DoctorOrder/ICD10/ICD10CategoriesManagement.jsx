import React, { useState, useEffect } from 'react';
import { BiX, BiSearch, BiCog, BiPlus, BiPencil, BiTrash, BiChevronsLeft, BiChevronLeft, BiChevronRight, BiChevronsRight, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { createICD10Category, getICD10Categories } from '../../../api/icd10Api';
import { toast } from '../../../../../hooks/use-toast';
import styles from '../../../../../shared/forms/Form.module.css';
import Modal from '../../../../../shared/components/Modal';
import TextField from "../../../../../shared/forms/TextField";
import Button from '../../../../../shared/components/Button';
import SelectField from "../../../../../shared/forms/SelectField";
import TextareaField from "../../../../../shared/forms/TextareaField";
import FormSubheader from "../../../../../shared/forms/FormSubheader";
import tableStyles from "../Prescription/CommodityMedicine/CommodityMedicineSummary.module.css";

/*
SEARCH FIELD
EDIT
DELETE
PAGINATION
*/

export default function ICD10CategoriesManagement({
    isModuleOpen,
    onClose,
    refreshCategories
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const emptyICD10Categories = {
        categoryName: ''
    };

    const [formData, setFormData] = useState(emptyICD10Categories);
    const [initialData, setInitialData] = useState(emptyICD10Categories);

    useEffect(() => {
        if (!isModuleOpen) return;

        fetchCategories();
    }, [isModuleOpen]);

    const fetchCategories = async () => {
        setLoading(true);

        try {
            const res = await getICD10Categories({
                search,
                page,
                limit: entriesPerPage,
            });

            console.log("Check: ", res);
            if (res.success) {
                setCategories(res.data || []);
            }

        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        console.log("What: ", formData);
        if (!formData.categoryName.trim()) {
            toast({ 
                title: "Incomplete ICD10 Categories Entry",
                description: "Please fill the field.",
                className: "toast-warning",
            });
            return;
        }

        const res = await createICD10Category(formData);
        toast({
            title: res.success ? 'Success!' : 'Notice',
            description: res.message,
            className: res.success ? 'toast-success' : 'toast-warning',
        });

        await fetchCategories();
        await refreshCategories();
    };

    const handleChange = (e) => {
        const { name, value, type, valueAsNumber } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:
                type === "number"
                    ? (value === "" ? "" : valueAsNumber)
                    : value,
        }));
    };

    return(
        <Modal
            title={
                <>
                    Manage Categories
                </>
            }
            onClose={onClose}
        >
            <div
                style={{
                    padding: "0.8rem 1.5rem 1.5rem",
                }}
            >
                <TextField
                    // name="search"
                    // value={search}
                    // onChange={handleSearch}
                    placeholder="Search categories..."
                    startIcon={<BiSearch size={18} />}
                />
                <TextField
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    placeholder="New category name..."
                    endAction={
                        <Button
                            type="button"
                            variant="primary"
                            icon={<BiPlus size={18} />}
                            onClick={handleAdd} 
                        >
                            Add Category Entry
                        </Button>
                    }
                />

                <div className={tableStyles.tableContainer}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className={styles.loading}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className={styles.emptyState}>
                                        No ICD10 categories found.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat, idx) => (
                                    <tr key={cat.categoryId}>
                                        <td>{(page - 1) * entriesPerPage + idx + 1}</td>
                                        <td>{cat.categoryName}</td>
                                        <td>
                                            <Button
                                                type="button"
                                                variant="primary"
                                                onClick={() => {
                                                    onSelect(cat);
                                                    closeCommodityMedicine();
                                                }}
                                            >
                                                Select
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
}