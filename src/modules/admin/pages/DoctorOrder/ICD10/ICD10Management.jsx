import React, { useState, useEffect } from 'react';
import { BiX, BiSearch, BiCog, BiPlus, BiPencil, BiTrash, BiChevronsLeft, BiChevronLeft, BiChevronRight, BiChevronsRight, BiErrorCircle, BiRuler, BiTransfer, BiTrip, BiPulse, BiHeart, BiTrendingUp, BiWind, BiDroplet, BiTime } from "react-icons/bi";
import { createICD10, getICD10, getICD10CategoryOptions } from '../../../api/icd10Api';
import { toast } from '../../../../../hooks/use-toast';
import ICD10CategoriesManagement from './ICD10CategoriesManagement';
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

export default function ICD10Management({ 
    isModuleOpen, 
    onClose, 
    onSelect,
    patientFullName,
    activeField
    // isAdmin 
}) {
    const [icd10CategoriesOpen, setICD10CategoriesOpen] = useState(false);
    
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [ICD10, setICD10] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const emptyICD10 = {
        code: '',
        description: '',
        categoryId: ''
    };

    const [formData, setFormData] = useState(emptyICD10);
    const [initialData, setInitialData] = useState(emptyICD10);

    useEffect(() => {
        if (!isModuleOpen) return;

        fetchICD10();
        fetchCategories();
    }, [isModuleOpen]);

    const fetchICD10 = async () => {
        setLoading(true);

        try {
            const res = await getICD10({
                searchTerm,
                currentPage, 
                pageSize
            });

            if(res.success) {
                setICD10(res.data || []);
                setTotalPages(res.totalPages || 1);
                setTotalCount(res.count || 0);
                console.log("Data?", res);
            }

        } catch (error) {
            console.error("Error icd10 data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getICD10CategoryOptions();

            if (res.success) {
                setCategories(
                    res.data.map(category => ({
                        value: category.categoryId,
                        label: category.categoryName,
                    }))
                );
            }

        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAdd = () => {
        setFormData(emptyICD10);
        setInitialData(emptyICD10);
        setShowAddForm(true);
    };

    const handleChange = (e) => {
        const { name, value, type, valueAsNumber } = e.target;

        let parsedValue;

        if (name === "categoryId") {
            parsedValue = value === "" ? null : Number(value);
        } else if (type === "number") {
            parsedValue = value === "" ? "" : valueAsNumber;
        } else {
            parsedValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasAnyICD10Field =
            formData.code.trim() !== "" ||
            formData.description.trim() !== "" ||
            formData.categoryId !== null;

        const hasAllICD10Fields =
            formData.code.trim() !== "" &&
            formData.description.trim() !== "" &&
            formData.categoryId !== null;

        if (hasAnyICD10Field && !hasAllICD10Fields) {
            toast({
                title: "Incomplete ICD10 Entry",
                description: "Please complete all ICD10 fields.",
                className: "toast-warning",
            });

            return;
        }

        const res = await createICD10(formData);
        toast({
            title: res.success ? 'Success!' : 'Notice',
            description: res.message,
            className: res.success ? 'toast-success' : 'toast-warning',
        });

        setShowAddForm(false);
        fetchICD10();
    };

    const openICD10CategoriesManagement = () => {
        setICD10CategoriesOpen(true);
    };

    const handleSelectCode = (code) => {
        onSelect(code);
        console.log("LASTTT",code);
        onClose();
    };
    
    const fieldLabels = {
        icd10_a: "A. ICD10",
        icd10_b: "B. ICD10",
        icd10_c: "C. ICD10",
    };

    return(
        <>
            <Modal
                title={
                    <>
                        Search ICD10 Code
                    </>
                }
                subtitle={
                    <>
                        Patient: {patientFullName}
                        <span style={{ margin: "0 0.5rem" }}>•</span>
                        Selecting for {fieldLabels[activeField]}
                    </>
                }
                maxWidth="850px"
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
                        placeholder="Search by code or description..."
                        startIcon={<BiSearch size={18} />}
                        endAction={
                            <>
                                <Button
                                    type="button"
                                    variant="primary"
                                    icon={<BiPlus size={18} />}
                                    onClick={handleAdd} 
                                >
                                    Add ICD10 Entry
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    icon={<BiCog size={18} />}
                                    onClick={openICD10CategoriesManagement} 
                                >
                                    Manage Categories
                                </Button>
                            </>
                        }
                    />

                    {showAddForm && (
                        <div
                            style={{
                                marginTop: "1rem",
                                border: "1px solid hsl(210, 15%, 80%)",
                                borderRadius: "0.5rem",
                                background: "#fff",
                            }}

                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "hsl(220, 90%, 60%)";
                            }}

                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "hsl(210, 15%, 80%)";
                            }}
                        >
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <FormSubheader
                                    title="Add ICD10 Entry"
                                    // subtitle="Please check all applicable choices"
                                />
                                <div
                                    className={styles.row}
                                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                                >
                                    <TextField
                                        label="ICD Code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder = "e.g., A00.0"
                                        // required
                                        // isViewMode={isViewMode}
                                        // isSaving={isSaving}
                                    />
                                    <SelectField
                                        label="Category"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        options={categories}
                                        // required={isAddMode}
                                        // isViewMode={isViewMode}
                                        // isSaving={isSaving}
                                    />
                                </div>
                                <TextareaField
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Enter details here..."
                                    // required
                                    // isViewMode={isViewMode}
                                    // isSaving={isSaving}
                                />
                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        className={`${styles.btn} ${styles.btnCancel}`}
                                        onClick={() => {
                                            setShowAddForm(false);
                                            // setErrors({});
                                        }}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`${styles.btn} ${styles.btnPrimary}`}
                                        disabled={isSaving /*|| isViewMode /*|| !hasChanges*/}
                                    >
                                        {isSaving ? (
                                                <>
                                                    <span className={styles.btnContent}>
                                                        <FaSpinner className={styles.spinner} size={16} />
                                                        Creating...
                                                    </span>
                                                </>
                                            ) : (
                                                "Create Entry"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className={tableStyles.tableContainer}>
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className={styles.loading}>
                                            Loading...
                                        </td>
                                    </tr>
                                ) : ICD10.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className={styles.emptyState}>
                                            No ICD10 codes found.
                                        </td>
                                    </tr>
                                ) : (
                                    ICD10.map((icd, idx) => (
                                        <tr 
                                            key={icd.icd10Id}
                                            onClick={() => handleSelectCode(icd)}
                                            style={{
                                                cursor: "pointer",
                                                transition: "background 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "hsl(200 95% 40% / 0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "";
                                            }}
                                        >
                                            <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                                            <td>{icd.code}</td>
                                            <td>{icd.description}</td>
                                            <td>{icd.categoryName}</td>
                                            {/* <td>
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    onClick={() => {
                                                        onSelect(icd);
                                                        onClose();
                                                    }}
                                                >
                                                    Select
                                                </Button>
                                            </td> */}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </Modal>

            {icd10CategoriesOpen && (
                <ICD10CategoriesManagement
                    isModuleOpen={icd10CategoriesOpen}
                    onClose={() => setICD10CategoriesOpen(false)}
                    refreshCategories={fetchCategories}
                />
            )}
        </>
    );
}
