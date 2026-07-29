import React, { useState, useEffect } from 'react';
import { BiCapsule, BiSearch, BiPlus } from 'react-icons/bi';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { createMedicine, getMedicines } from '../../../../api/medicinesApi';
import { toast } from '../../../../../../hooks/use-toast';
import styles from '../../../../../../shared/forms/Form.module.css';
import Modal from '../../../../../../shared/components/Modal';
import TextField from "../../../../../../shared/forms/TextField";
import Button from '../../../../../../shared/components/Button';
import FormSubheader from "../../../../../../shared/forms/FormSubheader";
import tableStyles from "./CommodityMedicineSummary.module.css";


export default function CommodityMedicineSummary({
    isModuleOpen,
    mode,
    onClose,
    visitId,
    closeCommodityMedicine,
    onSelect
    // patientFullName
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const [medicines, setMedicines] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    const emptyCommodityMedicine = {
        drugCode: '',
        genericName: '',
        form: '',
        strength: '',
        unitOfMeasure: ''
    };

    const [formData, setFormData] = useState(emptyCommodityMedicine);
    const [initialData, setInitialData] = useState(emptyCommodityMedicine);

    useEffect(() => {
        if (!isModuleOpen) return;

        fetchMedicines();
    }, [isModuleOpen, page, search, entriesPerPage]);

    const fetchMedicines = async () => {
        setLoading(true);

        try {
            
            console.log(visitId);

            const res = await getMedicines({
                search,
                page,
                limit: entriesPerPage,
            });

            if(res.success) {
                setMedicines(res.data || []);
                setTotalPages(res.totalPages || 1);
                setTotalCount(res.count || 0);
            }

        } catch (error) {
            console.error("Error medicine data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleAdd = () => {
        setFormData(emptyCommodityMedicine);
        setInitialData(emptyCommodityMedicine);
        setShowAddForm(true);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const medicineFields = [
            formData.drugCode,
            formData.genericName,
            formData.form,
            formData.strength,
            formData.unitOfMeasure,
        ];

        const hasAnyMedicineField = medicineFields.some(
            value => value.trim() !== ""
        );

        const hasAllMedicineFields = medicineFields.every(
            value => value.trim() !== ""
        );

        if (hasAnyMedicineField && !hasAllMedicineFields) {
            toast({
                title: "Incomplete Medicine",
                description: "Please complete all medicine fields.",
                className: "toast-warning",
            });

            return;
        }
        const res = await createMedicine(formData);
        toast({
            title: res.success ? 'Success!' : 'Notice',
            description: res.message,
            className: res.success ? 'toast-success' : 'toast-warning',
        });

        setShowAddForm(false);
        fetchMedicines();
    }

    return(
        <>
            <Modal
                title={
                    <>
                        <BiCapsule size={25} /> Search Commodity Medicine
                    </>
                }
                maxWidth="850px"
                onClose={closeCommodityMedicine}
            >
                <div
                    style={{
                        padding: "0.8rem 1.5rem 1.5rem",
                    }}
                >
                    <TextField
                        name="search"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by drug code or generic name..."
                        startIcon={<BiSearch size={18} />}
                        endAction={
                            <Button
                                type="button"
                                variant="primary"
                                icon={<BiPlus />}
                                onClick={handleAdd} 
                            >
                                Add Medicine
                            </Button>
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
                                    title="Add New Medicine"
                                    // subtitle="Please check all applicable choices"
                                />
                                <div
                                    className={styles.row}
                                    style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                                >
                                    <TextField
                                        label="Drug Code"
                                        name="drugCode"
                                        value={formData.drugCode}
                                        onChange={handleChange}
                                        placeholder = "e.g., PARACTAB500MG"
                                        // required
                                        // isViewMode={isViewMode}
                                        // isSaving={isSaving}
                                    />
                                    <TextField
                                        label="Generic Name"
                                        name="genericName"
                                        value={formData.genericName}
                                        onChange={handleChange}
                                        placeholder = "e.g., Paracetamol"
                                        // required
                                        // isViewMode={isViewMode}
                                        // isSaving={isSaving}
                                    />
                                    <TextField
                                        label="Form"
                                        name="form"
                                        value={formData.form}
                                        onChange={handleChange}
                                        placeholder = "e.g., Tablet"
                                        // required
                                        // isViewMode={isViewMode}
                                        // isSaving={isSaving}
                                    />
                                </div>
                                <div
                                    className={styles.row}
                                    style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                                >
                                    <TextField
                                        label="Strength"
                                        name="strength"
                                        value={formData.strength}
                                        onChange={handleChange}
                                        placeholder = "e.g., 500 mg"
                                        // required
                                        // isViewMode={isViewMode}
                                        // isSaving={isSaving}
                                    />
                                    <TextField
                                        label="Unit of Measure"
                                        name="unitOfMeasure"
                                        value={formData.unitOfMeasure}
                                        onChange={handleChange}
                                        placeholder = "e.g., Tablet"
                                        // required
                                        // isViewMode={isViewMode}
                                        // isSaving={isSaving}
                                    />
                                </div>
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
                                        {isViewMode ? "Close" : "Cancel"}
                                    </button>
                                    {!isViewMode && (
                                        <button
                                            type="submit"
                                            className={`${styles.btn} ${styles.btnPrimary}`}
                                            disabled={isSaving || isViewMode /*|| !hasChanges*/}
                                        >
                                            {isSaving ? (
                                                    <>
                                                        <span className={styles.btnContent}>
                                                            <FaSpinner className={styles.spinner} size={16} />
                                                            {isEditMode ? "Saving..." : "Creating..."}
                                                        </span>
                                                    </>
                                                ) : (
                                                    isEditMode ? "Update Record" : "Create Medicine"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    <div className={tableStyles.entriesSelector}>
                        <span>Show</span>
                        <select 
                            value={entriesPerPage} 
                            onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setPage(1); }}
                            className={tableStyles.entriesSelect}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div className={tableStyles.tableContainer}>
                        <table className={tableStyles.table}>
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className={styles.loading}>
                                            Loading...
                                        </td>
                                    </tr>
                                ) : medicines.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className={styles.emptyState}>
                                            No medicines found.
                                        </td>
                                    </tr>
                                ) : (
                                    medicines.map((med, idx) => (
                                        <tr key={med.medicineId}>
                                            <td>{(page - 1) * entriesPerPage + idx + 1}</td>
                                            <td>{med.drugCode}</td>
                                            <td>{med.genericName}</td>
                                            <td>{med.form}</td>
                                            <td>{med.strength}</td>
                                            <td>{med.unitOfMeasure}</td>
                                            <td>
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    onClick={() => {
                                                        onSelect(med);
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

                    <div className={tableStyles.pagination}>
                        <span className={tableStyles.pageInfo}>
                            Showing {medicines.length > 0 ? (page - 1) * entriesPerPage + 1 : 0} to {Math.min(page * entriesPerPage, totalCount)} of {totalCount} entries
                        </span>
                        <div className={tableStyles.pageControls}>
                            <button onClick={() => setPage(1)} disabled={page === 1} className={tableStyles.pageButton}>
                                <ChevronsLeft size={16} />
                            </button>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={tableStyles.pageButton}>
                                <ChevronLeft size={16} />
                            </button>
                            <span className={tableStyles.currentPage}>
                                Page {page} of {totalPages}
                            </span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={tableStyles.pageButton}>
                                <ChevronRight size={16} />
                            </button>
                            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className={tableStyles.pageButton}>
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}