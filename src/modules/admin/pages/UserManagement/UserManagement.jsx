import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../../../components/Sidebar';

import styles from './UserManagement.module.css';
import axios from 'axios';
import useAuth from '../../../../hooks/useAuth';
import Header from '../../../../shared/components/Header';
import Modal from '../../../../shared/components/Modal';
import UserForm from '../../popups/UserManagement/UserForm';
import ConfirmModal from '../../popups/UserManagement/ConfirmModal';
import { getUserById } from '../../api/userApi';
//import ConfirmModal from '../../popups/UserManagement/ConfirmModal';
import { getConfirmConfig } from '../../api/confirmConfig';

import { FaPlus, FaEye, FaEdit, FaTrash, FaRandom, FaSpinner } from 'react-icons/fa';

export default function UserManagement() {
    const { auth } = useAuth();

    // Check if user has permission to access User Management
    const userRoleCode = auth?.roles?.[0];
    
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('All Roles');
    const [selectedUser, setSelectedUser] = useState(null);
    const [mode, setMode] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();

            result = result.filter(user => {
                const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                return (
                    fullName.includes(query) ||
                    (user.username && user.username.toLowerCase().includes(query)) ||
                    (user.email && user.email.toLowerCase().includes(query))
                );
            });
        }

        // Role filter
        if (filterRole !== 'All Roles') {
            result = result.filter(user => user.role === filterRole.toLowerCase());
        }

        setFilteredUsers(result);
    }, [users, searchQuery, filterRole]);

    const config = React.useMemo(() => {
        if (modalType === "confirm" && selectedUser) {
            return getConfirmConfig(mode, selectedUser);
        }
        return null;
    }, [modalType, selectedUser, mode]);

    const fetchUsers = async () => {
        setIsLoading(true);

        try {
            
            const response = await axios.get("http://localhost/api/get_users.php");   
            if (response.data.success && response.data.users) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        admins: users.filter(u => u.role === 'admin').length,
        // Optional: array of full names
        fullNames: users.map(u => `${u.first_name} ${u.last_name}`)
    };

    const getAvatarColor = (role) => {
        const colors = {
            admin: '#c53030',
            doctor: '#2c5282',
            nurse: '#22543d',
            staff: '#744210',
            guest: '#2d3748'
        };
        return colors[role] || '#4a5568';
    };

    const getRoleDisplayName = (role) => {
        const names = {
            admin: 'Admin',
            doctor: 'Doctor',
            nurse: 'Nurse',
            staff: 'Staff',
            guest: 'Guest'
        };
        return names[role] || role;
    };

    const getUserModalTitle = () => {
        if (mode === "add") return "Create User Account";

        const name = selectedUser
            ? `${selectedUser.first_name} ${selectedUser.last_name}`
            : "";

        if (mode === "view") return `View User - ${name}`;
        if (mode === "edit") return `Edit User - ${name}`;
        
        if (mode === "status") {
            return `Confirm Status Change - ${name}`;
        }

        return "";
    };

    const closeModal = () => {
        setIsOpen(false);

        // reset context
        setTimeout(() => {
            setSelectedUser(null);
            setMode(null);
            setModalType(null);
        }, 200);
    }

    const openModal = ({ mode, modalType, user = null }) => {
        setMode(mode);
        setModalType(modalType);
        setSelectedUser(user);
        setIsOpen(true);
    };

    const handleAdd = () => {
        setLoadingAction({ type: "openAdd" });

        openModal({
            mode: "add",
            modalType: "userForm"
        });

        setLoadingAction(null);
    };

    const handleView = async (id) => {
        setLoadingAction({ type: "openView", id });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            const data = await getUserById(id, "full");
            
            openModal({
                mode: "view",
                modalType: "userForm",
                user: data.data
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(null);
        }
    }

    const handleEdit = async (id) => {
        setLoadingAction({ type: "openEdit", id });

        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            const data = await getUserById(id, "full");

            openModal({
                mode: "edit",
                modalType: "userForm",
                user: data.data
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleStatus = async (id) => {
        setLoadingAction({ type: "openStatus", id });
        await new Promise(resolve => setTimeout(resolve, 200));
        const data = users.find(u => u.id === id)

        openModal({
            mode: "status",
            modalType: "confirm",
            user: data
        });

        setLoadingAction(null);
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                {/* Header */}
                <Header title="User Account Management" />

                {/* Statistics */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h2 className={styles.statNumber}>{stats.total}</h2>
                        <p className={styles.statLabel}>Total Users</p>
                    </div>
                    <div className={styles.statCard}>
                        <h2 className={styles.statNumber}>{stats.active}</h2>
                        <p className={styles.statLabel}>Active Users</p>
                    </div>
                    <div className={styles.statCard}>
                        <h2 className={styles.statNumber}>{stats.inactive}</h2>
                        <p className={styles.statLabel}>Inactive Users</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search users by name, username, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className={styles.filterButton}
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>Doctor</option>
                            <option>Nurse</option>
                            <option>Staff</option>
                            <option>Guest</option>
                        </select>
                    </div>
                </div>
                <div className={styles.createButtonContainer}>
                    <button 
                        className={styles.createButton}
                        onClick={handleAdd}
                        disabled={loadingAction === "openAdd"}
                    >
                        {loadingAction === "openAdd" ? (
                            <>
                                <FaSpinner className={styles.spin} />
                                Opening...
                            </>
                        ) : (
                            <>
                                <FaPlus size={16} />
                                Create User Account
                            </>
                        )}
                    </button>
                </div>

                {/* User Table */}
                <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>User Accounts</h3>
                        <p className={styles.tableSubtitlxe}>Showing {filteredUsers.length} of {users.length} user accounts</p>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown';
                                const initials = fullName
                                ? fullName
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .substring(0, 2)
                                : '??';

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div
                                                    className={styles.avatar}
                                                    style={{ backgroundColor: getAvatarColor(user.role) }}
                                                >
                                                    {initials}
                                                </div>
                                                <div className={styles.userInfo}>
                                                    <div className={styles.userName}>{fullName}</div>
                                                    <div className={styles.userEmail}>{user.email || 'No email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                                {getRoleDisplayName(user.role)}
                                            </span>
                                            {/* <span className={styles.department}>{user.department || 'N/A'}</span> */}
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[user.status || 'inactive']}`}>
                                                <span className={styles.statusDot}></span>
                                                {user.status
                                                    ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                                                    : 'Unknown'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.lastLogin}>
                                                <div className={styles.loginDate}>
                                                    {user.last_login ? user.last_login.split(' ')[0] : 'Never'}
                                                </div>
                                                <div className={styles.loginTime}>
                                                    {user.last_login && !user.last_login.includes('Never')
                                                        ? user.last_login.split(' ').slice(1).join(' ')
                                                        : ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button 
                                                    className={`${styles.actionButton} ${styles.view}`} 
                                                    title="View"
                                                    onClick={() => handleView(user.id)}
                                                    disabled={loadingAction?.type === "openView" && loadingAction?.id === user.id}
                                                >
                                                    {loadingAction?.type === "openView" && loadingAction?.id === user.id ? (
                                                        <FaSpinner size={16} className={styles.spin} />
                                                    ) : (
                                                        <FaEye size={16} />
                                                    )}
                                                </button>
                                                <button 
                                                    className={`${styles.actionButton} ${styles.edit}`} 
                                                    title="Edit"
                                                    onClick={() => handleEdit(user.id)}
                                                    disabled={loadingAction?.type === "openEdit" && loadingAction?.id === user.id}
                                                >
                                                    {loadingAction?.type === "openEdit" && loadingAction?.id === user.id ? (
                                                        <FaSpinner size={16} className={styles.spin} />
                                                    ) : (
                                                        <FaEdit size={16} />
                                                    )}
                                                </button>
                                                {/* <button className={`${styles.actionButton} ${styles.reset}`} title="Reset Password">
                                                    <FaRandom size={16}/>
                                                </button> */}
                                                <button 
                                                    className={`
                                                        ${styles.actionButton} 
                                                        ${styles.statusToggle} 
                                                        ${user.status === 'active' ? styles.deactivate : styles.activate}
                                                    `}
                                                    onClick={() => handleStatus(user.id)}
                                                    disabled={loadingAction?.type === "openStatus" && loadingAction?.id === user.id}
                                                >
                                                    {loadingAction?.type === "openStatus" && loadingAction?.id === user.id ? (
                                                        <>
                                                            <span className={styles.loadingContent}>
                                                                <FaSpinner className={styles.spin} />
                                                                Opening...
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        </>
                                                    )}
                                                </button>
                                                {/* <button 
                                                    className={`${styles.actionButton} ${styles.delete}`} 
                                                    title="Delete"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                    >
                                                    <FaTrash size={16} />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Create User Modal */}
                {/* {showCreateUserModal === "createUser" && (
                    <Modal onClose={() => setShowCreateUserModal(null)}>
                        <CreateUserModal 
                            onSuccess={fetchUsers}
                            onClose={() => setShowCreateUserModal(null)}
                        />
                    </Modal>
                )} */}
                {isOpen && (
                    <>
                        {modalType === "userForm" && (
                            <Modal 
                                title={getUserModalTitle()}
                                onClose={closeModal}
                            >
                                <UserForm 
                                    isOpen={isOpen} 
                                    onSuccess={fetchUsers} 
                                    mode={mode} 
                                    selectedUser={selectedUser} 
                                    onClose={closeModal} />
                                {/* {(isAdd || isEdit) && <UserForm />}
                                {isView && <UserDetails />} */}
                            </Modal>
                        )}
                        {modalType === "confirm" && config && (
                            
                            <Modal
                                title={getUserModalTitle()}
                                onClose={closeModal}
                            >
                                {console.log("CONFIG: ", config)}
                                <ConfirmModal 
                                    onSuccess={fetchUsers}
                                    mode={mode}
                                    selectedUser={selectedUser}
                                    config={config}
                                    onClose={closeModal}
                                />
                            </Modal>
                        )}
                    </>
                )}

            </main>
        </div>
    );
}