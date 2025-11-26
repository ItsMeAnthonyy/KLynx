import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import EmergencyButton from '../../../components/EmergencyButton';
import ProfileDropdown from '../../../components/ProfileDropdown';
// import { User, Clock, AlertCircle, Filter, Search, Plus, AlertTriangle } from 'lucide-react';
import { BiUser, BiTime, BiErrorCircle, BiSearch, BiPlus, BiErrorAlt } from "react-icons/bi";
import { useToast } from '../../../hooks/use-toast';
import { getQueue/*, updateQueueStatus, removeFromQueue*/ } from '../api/queueManagementApi';
// import { checkQueueLimits, startQueueLimitMonitor } from '@/services/queueLimitService';
import AddWalkInModal from '../popups/addWalkInModal';
import styles from './QueueManagement.module.css';
import useAuth from '../../../hooks/useAuth';

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

const QueueManagement = () => {
    const [queueItems, setQueueItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showWalkInModal, setShowWalkInModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [queueWarnings, setQueueWarnings] = useState([]);
    const { toast } = useToast();
    const { auth } = useAuth();

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchQueue();
            // checkLimits();
        }
    }, [currentUser]);

    useEffect(() => {
        applyFilters();
    }, [queueItems, statusFilter, searchTerm]);

    const checkUser = async () => {
        if (auth.userId) {
            setCurrentUser(auth.userId);
            setIsAdmin(auth?.userRole?.includes("admin"));
        }
    };

    const fetchQueue = async () => {
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

    // const handleStatusChange = async (id, newStatus) => {
    //     try {
    //         await updateQueueStatus(id, newStatus);
    //         toast({ title: 'Status updated' });
    //         fetchQueue();
    //     } catch (error) {
    //     toast({
    //         title: 'Error',
    //         description: error.message,
    //         variant: 'destructive',
    //     });
    //     }
    // };

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

    const calculateWaitingTime = (addedAt) => {
        const minutes = Math.floor((new Date() - new Date(addedAt)) / 60000);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    if (loading) {
        return <div className={styles.loading}>Loading queue...</div>;
    }

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

                <div className={styles.header2}>
                    <div>
                        <div></div>
                        {queueWarnings.length > 0 && (
                            <div className={styles.warningsContainer}>
                                {queueWarnings.map(warning => (
                                    <div 
                                        key={warning.providerId} 
                                        className={`${styles.warningBanner} ${styles[warning.level]}`}
                                    >
                                        <BiErrorAlt size={20} />
                                        <span>
                                            <strong>{warning.providerName}</strong> has {warning.count} patients queued
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.stats}>
                            <div className={styles.statCard}>
                                <div className={styles.statLabel}>Waiting</div>
                                <div className={styles.statValue}>
                                    {queueItems.filter(i => i.status === 'waiting').length}
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statLabel}>In Service</div>
                                <div className={styles.statValue}>
                                    {queueItems.filter(i => i.status === 'in_service').length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                        <button onClick={() => setShowWalkInModal(true)} className={styles.newBtn}>
                            <BiPlus size={20} />
                            Add Walk-In
                        </button>
                    )}
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchContainer}>
                        <BiSearch className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Search patient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={styles.select}
                    >
                        <option value="all">All Status</option>
                        <option value="waiting">Waiting</option>
                        <option value="in_service">In Service</option>
                        <option value="finished_service">Finished</option>
                    </select>
                </div>

                <div className={styles.queueList}>
                    {filteredItems.length === 0 ? (
                        <div className={styles.emptyState}>
                            <BiErrorCircle size={48} />
                            <p>No patients in queue</p>
                        </div>
                    ) : (
                        <div className={styles.table}>
                            <div className={styles.tableHeader}>
                                <div>Patient</div>
                                <div>Provider</div>
                                <div>Type</div>
                                <div>Priority</div>
                                <div>Waiting Time</div>
                                <div>Status</div>
                                <div>Actions</div>
                            </div>

                            {filteredItems.map((item) => (
                                <div key={item.id} className={styles.tableRow}>
                                    <div className={styles.patientCell}>
                                        <BiUser size={18} className={styles.icon} />
                                        <span>{item.patient_last_name}, {item.patient_first_name}</span>
                                    </div>

                                    <div>
                                        {item.provider_last_name && item.provider_first_name
                                        ? `${item.provider_last_name}, ${item.provider_first_name}`
                                        : 'Unassigned'}
                                    </div>

                                    <div className={styles.typeCell}>
                                        {item.consultation_type?.replace('_', ' ')}
                                    </div>

                                    <div>
                                        <span
                                            className={styles.priorityBadge}
                                            style={{ backgroundColor: PRIORITY_COLORS[item.priority] }}
                                        >
                                            {item.priority}
                                        </span>
                                    </div>

                                    <div className={styles.timeCell}>
                                        <BiTime size={16} />
                                        {calculateWaitingTime(item.added_at)}
                                    </div>

                                    <div>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ backgroundColor: STATUS_COLORS[item.status] }}
                                        >
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className={styles.actionsCell}>
                                        {item.status === 'waiting' && (
                                            <button
                                                onClick={() => handleStatusChange(item.id, 'in_service')}
                                                className={styles.actionBtn}
                                            >
                                                Start Service
                                            </button>
                                        )}

                                        {isAdmin && item.status !== 'finished_service' && (
                                            <button
                                                onClick={() => handleCancel(item.id)}
                                                className={styles.cancelBtn}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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