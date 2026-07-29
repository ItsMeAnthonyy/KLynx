import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import EmergencyButton from '../../../components/EmergencyButton';
import ProfileDropdown from '../../../components/ProfileDropdown';
// import { User, Clock, AlertCircle, Filter, Search, Plus, AlertTriangle } from 'lucide-react';
import { BiPlay, BiClipboard, BiUser, BiCheckCircle, BiTime, BiErrorCircle, BiSearch, BiPlus, BiErrorAlt, BiXCircle } from "react-icons/bi";
import { useToast } from '../../../hooks/use-toast';
import { getQueue, updateQueueStatus/*, removeFromQueue*/ } from '../api/queueManagementApi';
// import { checkQueueLimits, startQueueLimitMonitor } from '@/services/queueLimitService';
import AddWalkInModal from '../popups/addWalkInModal';
import styles from './QueueManagement.module.css';
import useAuth from '../../../hooks/useAuth';
import axios from "axios";
import TextField from "../../../shared/forms/TextField";
import SelectField from "../../../shared/forms/SelectField";
import FormSubheader from "../../../shared/forms/FormSubheader";
import Button from '../../../shared/components/Button';

const STATUS_COLORS = {
    waiting: '#F59E0B',
    in_service: '#10B981',
    finished_service: '#6B7280'
};

const PRIORITY_COLORS = {
    routine: '#6B7280',
    urgent: '#F97316',
    emergency: '#EF4444'
};

/*
Assigned Provider in forms - auto assigned it to logged in user but never locked
Fix patient consent format
*/

const QueueManagement = () => {

    const [loading, setLoading] = useState(true);
    const [queueItems, setQueueItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const [page, setPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [totalPages, setTotalPages] = useState(1);
    const [showWalkInModal, setShowWalkInModal] = useState(false);
    const [queueWarnings, setQueueWarnings] = useState([]);
    const [providers, setProviders] = useState([]);
    const { toast } = useToast();
    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const timer = setTimeout(() => {
                fetchQueue();
                // checkLimits();
                fetchProviders(setProviders);
            }, 500);

            // cleanup (important)
            return () => clearTimeout(timer);
        }
    }, [currentUser]);

    useEffect(() => {
        applyFilters();
    }, [queueItems, statusFilter, searchTerm, entriesPerPage]);

    const checkUser = async () => {
        if (auth.userId) {
            setCurrentUser(auth.userId);
            setIsAdmin(auth?.userRole?.includes("admin"));
        }
    };

    const fetchQueue = async () => {
        setLoading(true);

        try {
            const providerId = isAdmin ? null : currentUser;
            const data = await getQueue(providerId);
            setQueueItems(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load queue',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProviders = async (setProviders) => {
        try {
            const { data } = await axios.get(
      'http://localhost/api/get_providers.php'
    );

            //if (!data.success) throw new Error(data.message);

            setProviders(data || []);
        } catch (error) {
            console.error('Error fetching providers:', error);
        }
    };

    const applyFilters = () => {
        let filtered = queueItems;
        console.log("FILTERED",filtered);

        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(item => {
                const fullName = `${item.patient_last_name}, ${item.patient_first_name}`;
                return fullName.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        setFilteredItems(filtered);
    };

    const handleStatusChange = async (id, visitId, patientId, newStatus) => {
        try {
            await updateQueueStatus(id, visitId, newStatus);
            
            toast({ title: 'Service Started' });
            
            //fetchQueue();

            navigate(`/patient/${patientId}/visit/${visitId}`);
        } catch (error) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
        }
    };

    // const handleCancel = async (id) => {
    //     if (!window.confirm('Cancel this queue entry?')) return;

    //     try {
    //     await removeFromQueue(id, currentUser.id, 'Cancelled by staff');
    //     toast({ title: 'Queue entry cancelled' });
    //     fetchQueue();
    //     } catch (error) {
    //     toast({
    //         title: 'Error',
    //         description: error.message,
    //         variant: 'destructive',
    //     });
    //     }
    // };

    const handleProviderChange = async (queueId, newProviderId) => {
    try {
        console.log("CHECLKKK",queueId,newProviderId )
        const { data } = await axios.post(
            'http://localhost/api/update_queue_provider.php',
            { queueId, providerId: newProviderId }
        );

        if (!data.success) throw new Error(data.message);

        toast({ title: 'Provider updated' });
        fetchQueue(); // refresh queue list
    } catch (error) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
    }
};


    const calculateWaitingTime = (addedAt) => {
        const minutes = Math.floor((new Date() - new Date(addedAt)) / 60000);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    return(
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Queue Management</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <EmergencyButton />
                        <ProfileDropdown 
                            email={auth.userEmail || "Email"}
                            name= {auth.userFirstName + " " + auth.userLastName || "User"}
                        />
                    </div>
                </div>
                <div
                    style={{
                        padding: "0.8rem 1.5rem 1.5rem",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "1rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <BiUser size={26} />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statLabel}>Total Queue</span>
                                {loading ? (
                                    <div className={`${styles.spinner} ${styles.spinnerSmall}`}></div>
                                ) : (
                                    <span className={styles.statValue}>
                                        {queueItems.length}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <BiTime size={26} />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statLabel}>Waiting</span>
                                {loading ? (
                                    <div className={`${styles.spinner} ${styles.spinnerSmall}`}></div>
                                ) : (
                                    <span className={styles.statValue}>
                                        {queueItems.filter(i => i.status === "waiting").length}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <BiErrorCircle size={26} />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statLabel}>In Service</span>
                                {loading ? (
                                    <div className={`${styles.spinner} ${styles.spinnerSmall}`}></div>
                                ) : (
                                    <span className={styles.statValue}>
                                        {queueItems.filter(i => i.status === "in_service").length}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <BiCheckCircle size={26} />
                            </div>

                            <div className={styles.statContent}>
                                <span className={styles.statLabel}>Finished</span>
                                {loading ? (
                                    <div className={`${styles.spinner} ${styles.spinnerSmall}`}></div>
                                ) : (
                                    <span className={styles.statValue}>
                                        {queueItems.filter(i => i.status === "finished_service").length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <TextField
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search patient..."
                        startIcon={<BiSearch size={18} />}
                        endAction={
                            <>
                            <SelectField
                                name="status"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                options={[
                                    { value: 'all', label: 'All Status' },
                                    { value: 'waiting', label: 'Waiting' },
                                    { value: 'in_service', label: 'In Service' },
                                    { value: 'finished', label: 'Finished' }
                                ]}
                                // required={isAddMode}
                                // isViewMode={isViewMode}
                                // isSaving={isSaving}
                                hideLabel={true}
                            />

                            <Button
                                type="button"
                                variant="primary"
                                icon={<BiPlus size={18} />}
                                onClick={() => setShowWalkInModal(true)}
                            >
                                Add Walk-In
                            </Button>
                            </>
                        }
                    />
                    <div className={styles.queueContainer}>
                        <table className={styles.queueTable}>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Provider</th>
                                    <th>Type</th>
                                    <th>Priority</th>
                                    <th>Waiting Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className={styles.loadingCell}>
                                            <div className={styles.loadingContent}>
                                                <div className={`${styles.spinner} ${styles.spinnerMedium}`}></div>
                                                <p>Loading queue data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className={styles.emptyState}>
                                            <BiErrorCircle size={48} />
                                            <p>No patients in queue.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className={styles.patientInfo}>
                                                    <div>
                                                        <div className={styles.patientName}>
                                                            {item.patient_last_name},{" "}
                                                            {item.patient_first_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {isAdmin &&
                                                item.status !== "finished_service" ? (
                                                    <select
                                                        value={
                                                            item.assigned_provider_id || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleProviderChange(item.id, e.target.value)
                                                        }
                                                        className={styles.inlineSelect}
                                                    >
                                                        <option value="">
                                                            Unassigned
                                                        </option>

                                                        {providers.map((provider) => (
                                                            <option
                                                                key={provider.id}
                                                                value={provider.id}
                                                            >
                                                                {provider.last_name},{" "}
                                                                {provider.first_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span>
                                                        {item.provider_first_name
                                                            ? `${item.provider_last_name}, ${item.provider_first_name}`
                                                            : "Unassigned"}
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <span className={styles.typeBadge}>
                                                    {item.consultation_type?.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={styles.priorityBadge}
                                                    style={{
                                                        backgroundColor:
                                                            PRIORITY_COLORS[
                                                                item.priority
                                                            ],
                                                    }}
                                                >
                                                    {item.priority}
                                                </span>
                                            </td>

                                            <td>
                                                <div className={styles.waitingCell}>
                                                    <BiTime size={16} />

                                                    {calculateWaitingTime(
                                                        item.added_at
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={styles.statusBadge}
                                                    style={{
                                                        backgroundColor:
                                                            STATUS_COLORS[item.status],
                                                    }}
                                                >
                                                    {item.status.replace("_", " ")}
                                                </span>
                                            </td>

                                            <td>
                                                <div className={styles.actionGroup}>
                                                    {item.status === "waiting" && (
                                                        <Button
                                                            variant="primary"
                                                            icon={<BiPlay size={16} />}
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    item.id,
                                                                    item.visit_id,
                                                                    item.patient_id,
                                                                    "in_service"
                                                                )
                                                            }
                                                        >
                                                            Start
                                                        </Button>
                                                    )}

                                                    {item.status === "in_service" && (
                                                        <Button
                                                            variant="primary"
                                                            icon={<BiClipboard size={16} />}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/patient/${item.patient_id}/visit/${item.visit_id}`
                                                                )
                                                            }
                                                        >
                                                            Open Visit
                                                        </Button>
                                                    )}

                                                    {isAdmin &&
                                                        item.status !==
                                                            "finished_service" && (
                                                            <Button
                                                                variant="secondary"
                                                                icon={<BiXCircle size={16} />}
                                                                onClick={() =>
                                                                    handleCancel(item.id)
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.summaryFooter}>
                        <div className={styles.entriesSection}>
                            <span>Show</span>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => {
                                    setEntriesPerPage(Number(e.target.value));
                                    setPage(1);
                                }}
                                className={styles.entriesSelect}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>entries</span>
                        </div>

                        <div className={styles.paginationInfo}>
                            Showing{" "}
                            {filteredItems.length === 0
                                ? 0
                                : (page - 1) * entriesPerPage + 1}
                            {" - "}
                            {Math.min(
                                page * entriesPerPage,
                                filteredItems.length
                            )}{" "}
                            of {filteredItems.length}
                        </div>

                        <div className={styles.pagination}>
                            <button
                                className={styles.pageButton}
                                disabled={page === 1}
                                onClick={() => setPage(1)}
                            >
                                {"<<"}
                            </button>

                            <button
                                className={styles.pageButton}
                                disabled={page === 1}
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                            >
                                {"<"}
                            </button>

                            <span className={styles.currentPage}>
                                {page}
                            </span>

                            <button
                                className={styles.pageButton}
                                disabled={page === totalPages}
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(totalPages, p + 1)
                                    )
                                }
                            >
                                {">"}
                            </button>

                            <button
                                className={styles.pageButton}
                                disabled={page === totalPages}
                                onClick={() => setPage(totalPages)}
                            >
                                {">>"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {showWalkInModal && (
                <AddWalkInModal
                    onClose={() => setShowWalkInModal(false)}
                    onSuccess={fetchQueue}
                    currentUserId={currentUser}
                />
            )}
        </div>

    );

};

export default QueueManagement;