import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import ProfileDropdown from '../../../components/ProfileDropdown';
//import PermissionGate from '../../../components/PermissionGate';
import { BiError } from 'react-icons/bi';
import { FaPlus, FaEye, FaEdit, FaTrash, FaRandom, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import styles from './UserManagement.module.css';
//import { PERMISSIONS, hasPermission } from '../../../utils/rolePermissions';
import useAuth from '../../../hooks/useAuth';

// Mock user data
const MOCK_USERS = [
    {
        id: 'admin',
        username: 'admin',
        fullName: 'System Administrator',
        email: 'admin@healthcenter.com',
        role: 'admin',
        department: 'IT',
        status: 'active',
        lastLogin: '2024-01-20 10:30 AM',
        lastPasswordChange: '2023-12-15',
        createdAt: '2023-01-01'
    },
    {
        id: 'dr_emily',
        username: '@dr_smith',
        fullName: 'Dr. Emily Smith',
        email: 'e.smith@healthcenter.com',
        role: 'doctor',
        department: 'Internal Medicine',
        status: 'active',
        lastLogin: '2024-01-20 09:15 AM',
        lastPasswordChange: '2024-01-01',
        createdAt: '2023-03-15'
    },
    {
        id: 'sarah_j',
        username: '@nurfe.johnson',
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@healthcenter.com',
        role: 'nurse',
        department: 'Pediatrics',
        status: 'active',
        lastLogin: '2024-01-19 08:45 AM',
        lastPasswordChange: '2023-11-20',
        createdAt: '2023-05-10'
    },
    {
        id: 'lisa_c',
        username: '@receptionlist',
        fullName: 'Lisa Chen',
        email: 'l.chen@healthcenter.com',
        role: 'staff',
        department: 'Reception',
        status: 'active',
        lastLogin: '2024-01-20 08:00 AM',
        lastPasswordChange: '2023-10-15',
        createdAt: '2023-07-01'
    },
    {
        id: 'temp_user',
        username: '@temp.user',
        fullName: 'Temporary Account',
        email: 'temp@healthcenter.com',
        role: 'guest',
        department: 'Temporary',
        status: 'inactive',
        has2FA: false,
        lastLogin: '2024-01-15 02:30 PM',
        lastPasswordChange: '2024-01-15',
        createdAt: '2024-01-15'
    }
];

const UserManagement = () => {
    const { auth } = useAuth();
    
    // Check if user has permission to access User Management
    const userRoleCode = auth?.roles?.[0];
    const hasAccess = userRoleCode && hasPermission(userRoleCode, PERMISSIONS.USER_MANAGEMENT_VIEW);
    
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('All Roles');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Form state for create/edit user
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        role: '',
        department: '',
        tempPassword: '',
        permissions: {
            patientRecords: false,
            prescriptions: false,
            adminPanel: false,
            appointments: false,
            reports: false,
            emergencyAccess: false
        },
        forcePasswordChange: true,
        sendWelcomeEmail: false
    });

    // Load users from database or use mock data as fallback
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost/api/create-user.php');
                
                if (response.data.success && response.data.users) {
                    setUsers(response.data.users);
                    // Also save to localStorage as cache
                    localStorage.setItem('healthcenter_users', JSON.stringify(response.data.users));
                } else {
                    // Fallback to localStorage or mock data
                    const storedUsers = localStorage.getItem('healthcenter_users');
                    if (storedUsers) {
                        setUsers(JSON.parse(storedUsers));
                    } else {
                        setUsers(MOCK_USERS);
                        localStorage.setItem('healthcenter_users', JSON.stringify(MOCK_USERS));
                    }
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                // Fallback to localStorage or mock data
                const storedUsers = localStorage.getItem('healthcenter_users');
                if (storedUsers) {
                    setUsers(JSON.parse(storedUsers));
                } else {
                    setUsers(MOCK_USERS);
                    localStorage.setItem('healthcenter_users', JSON.stringify(MOCK_USERS));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search and role filter
    useEffect(() => {
        let result = users;

        // Search filter
        if (searchQuery) {
            result = result.filter(user =>
                user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Role filter
        if (filterRole !== 'All Roles') {
            result = result.filter(user => user.role === filterRole.toLowerCase());
        }

        setFilteredUsers(result);
    }, [users, searchQuery, filterRole]);

    // Calculate statistics
    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        admins: users.filter(u => u.role === 'admin').length,
        inactive: users.filter(u => u.status === 'inactive').length
    };



    // Password generation function
    const generateSecurePassword = () => {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        // Ensure at least one of each type
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
        password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
        password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
        
        // Fill the rest
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_@.-]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, @, ., -, and _';
        }
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.role) {
            newErrors.role = 'Please select a role';
        }
        
        if (!formData.department) {
            newErrors.department = 'Please select a department';
        }
        
        if (!formData.tempPassword) {
            newErrors.tempPassword = 'Password is required';
        } else if (formData.tempPassword.length < 8) {
            newErrors.tempPassword = 'Password must be at least 8 characters';
        }
        
        // Check for duplicate username or email
        const duplicateUsername = users.find(u => u.username.toLowerCase() === formData.username.toLowerCase());
        if (duplicateUsername) {
            newErrors.username = 'This username is already taken';
        }
        
        const duplicateEmail = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
        if (duplicateEmail) {
            newErrors.email = 'This email is already registered';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Please fix the errors in the form' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }
        
        setIsLoading(true);
        
        try {
            const newUser = {
                id: Date.now().toString(),
                username: formData.username,
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                department: formData.department,
                password: formData.tempPassword,
                status: 'active',
                has2FA: false,
                lastLogin: 'Never',
                lastPasswordChange: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString().split('T')[0],
                forcePasswordChange: formData.forcePasswordChange,
                permissions: formData.permissions
            };

            // Try to save to backend API
            try {
                const response = await axios.post('http://localhost/api/create-user.php', newUser, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    // Backend save successful - refetch users from database
                    const fetchResponse = await axios.get('http://localhost/api/create-user.php');
                    if (fetchResponse.data.success && fetchResponse.data.users) {
                        setUsers(fetchResponse.data.users);
                        localStorage.setItem('healthcenter_users', JSON.stringify(fetchResponse.data.users));
                    }
                    
                    setMessage({ 
                        type: 'success', 
                        text: `User account created successfully! ${formData.sendWelcomeEmail ? 'Welcome email sent.' : ''}` 
                    });
                } else {
                    throw new Error(response.data.message || 'Failed to create user');
                }
            } catch (apiError) {
                console.warn('Backend API not available, saving to localStorage only:', apiError);
                
                // Fallback to localStorage only
                const updatedUsers = [...users, newUser];
                setUsers(updatedUsers);
                localStorage.setItem('healthcenter_users', JSON.stringify(updatedUsers));
                
                setMessage({ 
                    type: 'success', 
                    text: 'User account created successfully! (Saved locally)' 
                });
            }

            setShowCreateModal(false);
            resetForm();
            
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            
        } catch (error) {
            console.error('Error creating user:', error);
            setMessage({ 
                type: 'error', 
                text: error.message || 'Failed to create user account. Please try again.' 
            });
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;

        const updatedUsers = users.filter(u => u.id !== selectedUser.id);
        setUsers(updatedUsers);
        localStorage.setItem('healthcenter_users', JSON.stringify(updatedUsers));

        setMessage({ type: 'success', text: 'User account deleted successfully!' });
        setShowDeleteConfirm(false);
        setSelectedUser(null);

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const resetForm = () => {
        setFormData({
            username: '',
            fullName: '',
            email: '',
            role: '',
            department: '',
            tempPassword: '',
            permissions: {
                patientRecords: false,
                prescriptions: false,
                adminPanel: false,
                appointments: false,
                reports: false,
                emergencyAccess: false
            },
            forcePasswordChange: true,
            sendWelcomeEmail: false
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('permission_')) {
            const permissionName = name.replace('permission_', '');
            setFormData(prev => ({
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [permissionName]: checked
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
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

    // Check access permission
    if (!hasAccess) {
        return (
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.content}>
                    <div style={{ 
                        padding: '2rem', 
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        margin: '2rem',
                        border: '3px solid #27374D'
                    }}>
                        <BiError size={64} color="#dc3545" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ color: '#27374D', marginBottom: '1rem' }}>Access Denied</h2>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            You do not have permission to access User Management.
                        </p>
                        <p style={{ color: '#999', fontSize: '0.9rem' }}>
                            Please contact your administrator if you believe this is an error.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>User Account Management</h1>

                    </div>
                    <div className={styles.headerRight}>
                        <button className={styles.emergencyButton}>
                            <BiError size={20} />
                            EMERGENCY MODE
                        </button>
                        {/* Temporarily removed PermissionGate for testing */}
                        <ProfileDropdown 
                            email={formData.email}
                            name={formData.fullName}
                        />
                    </div>
                </div>

                {/* Success/Error Message */}
                {message.text && (
                    <div style={{
                        padding: '12px 20px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                        fontSize: '14px',
                        fontWeight: '500',
                    }}>
                        {message.text}
                    </div>
                )}

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
                    <PermissionGate permission={PERMISSIONS.USERS_ADD}>
                        <div className={styles.createButtonContainer}>
                            <button 
                                className={styles.createButton}
                                onClick={() => setShowCreateModal(true)}
                            >
                                <FaPlus size={16} />
                                Create User Account
                            </button>
                        </div>
                    </PermissionGate>
                


                {/* User Table */}
                <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>User Accounts</h3>
                        <p className={styles.tableSubtitle}>Showing {filteredUsers.length} of {users.length} user accounts</p>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role & Department</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <div 
                                                className={styles.avatar}
                                                style={{ backgroundColor: getAvatarColor(user.role) }}
                                            >
                                                {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) : '??'}
                                            </div>
                                            <div className={styles.userInfo}>
                                                <div className={styles.userName}>{user.fullName || 'Unknown'}</div>
                                                <div className={styles.userEmail}>{user.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                            {getRoleDisplayName(user.role)}
                                        </span>
                                        <span className={styles.department}>{user.department || 'N/A'}</span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[user.status || 'inactive']}`}>
                                            <span className={styles.statusDot}></span>
                                            {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                                        </span>
                                        
                                    </td>
                                    <td>
                                        <div className={styles.lastLogin}>
                                            <div className={styles.loginDate}>
                                                {user.lastLogin ? user.lastLogin.split(' ')[0] : 'Never'}
                                            </div>
                                            <div className={styles.loginTime}>
                                                {user.lastLogin && !user.lastLogin.includes('Never') ? user.lastLogin.split(' ').slice(1).join(' ') : ''}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <PermissionGate permission={PERMISSIONS.USERS_VIEW}>
                                                <button className={`${styles.actionButton} ${styles.view}`} title="View">
                                                    <FaEye size={16} />
                                                </button>
                                            </PermissionGate>
                                            <PermissionGate permission={PERMISSIONS.USERS_EDIT}>
                                                <button className={`${styles.actionButton} ${styles.edit}`} title="Edit">
                                                    <FaEdit size={16} />
                                                </button>
                                            </PermissionGate>
                                            <PermissionGate permission={PERMISSIONS.USERS_DELETE}>
                                                <button 
                                                    className={`${styles.actionButton} ${styles.delete}`} 
                                                    title="Delete"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </PermissionGate>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create User Modal */}
                {showCreateModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <form onSubmit={handleCreateUser}>
                                <div className={styles.modalHeader}>
                                    <div className={styles.modalTitleSection}>
                                        <h2 className={styles.modalTitle}>Create New User Account</h2>
                            
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.closeButton}
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className={styles.modalBody}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>
                                                Username <span style={{ color: '#e53e3e' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                className={`${styles.formInput} ${errors.username ? styles.inputError : ''}`}
                                                placeholder="@username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.username && (
                                                <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                                    {errors.username}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>
                                                Full Name <span style={{ color: '#e53e3e' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                className={`${styles.formInput} ${errors.fullName ? styles.inputError : ''}`}
                                                placeholder="John Doe"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.fullName && (
                                                <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                                    {errors.fullName}
                                                </span>
                                            )}
                                        </div>

                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label className={styles.formLabel}>
                                                Email Address <span style={{ color: '#e53e3e' }}>*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                                                placeholder="user@healthcenter.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.email && (
                                                <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                                    {errors.email}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>
                                                User Role <span style={{ color: '#e53e3e' }}>*</span>
                                            </label>
                                            <select
                                                name="role"
                                                className={`${styles.formSelect} ${errors.role ? styles.inputError : ''}`}
                                                value={formData.role}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select role</option>
                                                <option value="admin">Admin</option>
                                                <option value="doctor">Doctor</option>
                                                <option value="nurse">Nurse</option>
                                                <option value="staff">Staff</option>
                                              
                                            </select>
                                            {errors.role && (
                                                <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                                    {errors.role}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>
                                                Department <span style={{ color: '#e53e3e' }}>*</span>
                                            </label>
                                            <select
                                                name="department"
                                                className={`${styles.formSelect} ${errors.department ? styles.inputError : ''}`}
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select department</option>
                                                <option value="IT">IT</option>
                                                <option value="Internal Medicine">Internal Medicine</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="Reception">Reception</option>
                                                <option value="Emergency">Emergency</option>
                                                <option value="Temporary">Temporary</option>
                                            </select>
                                            {errors.department && (
                                                <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                                    {errors.department}
                                                </span>
                                            )}
                                        </div>

                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label className={styles.formLabel}>
                                                Temporary Password <span style={{ color: '#e53e3e' }}>*</span>
                                            </label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    name="tempPassword"
                                                    className={`${styles.formInput} ${errors.tempPassword ? styles.inputError : ''}`}
                                                    placeholder="Enter secure password"
                                                    value={formData.tempPassword}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ flex: 1 }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const password = generateSecurePassword();
                                                        setFormData(prev => ({ ...prev, tempPassword: password }));
                                                        setErrors(prev => ({ ...prev, tempPassword: '' }));
                                                    }}
                                                    style={{
                                                        padding: '0 16px',
                                                        backgroundColor: '#4299e1',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        whiteSpace: 'nowrap',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    <FaRandom size={14} />
                                                    Generate
                                                </button>
                                            </div>
                                            {errors.tempPassword && (
                                                <span style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                                    {errors.tempPassword}
                                                </span>
                                            )}
                                            <span style={{ color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                                Password must be at least 8 characters long
                                            </span>
                                        </div>
                                    </div>


                                    <div className={styles.optionsSection}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                name="forcePasswordChange"
                                                className={styles.checkbox}
                                                checked={formData.forcePasswordChange}
                                                onChange={handleInputChange}
                                            />
                                            <span className={styles.checkboxText}>Force password change on first login</span>
                                        </label>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                name="sendWelcomeEmail"
                                                className={styles.checkbox}
                                                checked={formData.sendWelcomeEmail}
                                                onChange={handleInputChange}
                                            />
                                            <span className={styles.checkboxText}>Send welcome email with login instructions</span>
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.modalFooter}>
                                    <button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setErrors({});
                                        }}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={isLoading}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            justifyContent: 'center',
                                            opacity: isLoading ? 0.7 : 1
                                        }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <FaSpinner className="spinner" size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && selectedUser && (
                    <div className={styles.modalOverlay} onClick={() => setShowDeleteConfirm(false)}>
                        <div 
                            className={styles.modalContent} 
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: '500px' }}
                        >
                            <div className={styles.modalHeader}>
                                <div className={styles.modalTitleSection}>
                                    <h2 className={styles.modalTitle} style={{ color: '#e53e3e' }}>⚠️ Confirm Delete</h2>
                                    <p className={styles.modalSubtitle}>This action cannot be undone</p>
                                </div>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <p style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>
                                    Are you sure you want to delete this user account?
                                </p>
                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                                    <strong>User:</strong> {selectedUser.fullName}
                                </p>
                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                                    <strong>Email:</strong> {selectedUser.email}
                                </p>
                            </div>

                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.submitButton}
                                    style={{ backgroundColor: '#e53e3e' }}
                                    onClick={handleDeleteUser}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserManagement;