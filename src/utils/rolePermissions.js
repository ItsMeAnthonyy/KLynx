/**
 * Role-Based Access Control (RBAC) System
 * 
 * This module defines roles, permissions, and provides helper functions
 * for checking user permissions throughout the application.
 */

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

export const ROLES = {
    ADMIN: 5150,
    DOCTOR: 4001,
    NURSE: 3001,
    STAFF: 6001,
    PATIENT: 2001,
    GUEST: 7001
};

export const ROLE_NAMES = {
    [ROLES.ADMIN]: 'Admin',
    [ROLES.DOCTOR]: 'Doctor',
    [ROLES.NURSE]: 'Nurse',
    [ROLES.STAFF]: 'Staff',
    [ROLES.PATIENT]: 'Patient',
    [ROLES.GUEST]: 'Guest'
};

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

export const PERMISSIONS = {
    // Appointments
    APPOINTMENTS_VIEW: 'appointments.view',
    APPOINTMENTS_ADD: 'appointments.add',
    APPOINTMENTS_EDIT: 'appointments.edit',
    APPOINTMENTS_DELETE: 'appointments.delete',
    APPOINTMENTS_ARCHIVE: 'appointments.archive',
    
    // ICD-10 Manager
    ICD_VIEW: 'icd.view',
    ICD_ADD: 'icd.add',
    ICD_EDIT: 'icd.edit',
    ICD_DELETE: 'icd.delete',
    ICD_ARCHIVE: 'icd.archive',
    
    // Nurse Notes
    NURSE_NOTES_VIEW: 'nurse_notes.view',
    NURSE_NOTES_ADD: 'nurse_notes.add',
    NURSE_NOTES_EDIT: 'nurse_notes.edit',
    NURSE_NOTES_DELETE: 'nurse_notes.delete',
    NURSE_NOTES_ARCHIVE: 'nurse_notes.archive',
    
    // Notifications
    NOTIFICATIONS_VIEW: 'notifications.view',
    NOTIFICATIONS_ADD: 'notifications.add',
    NOTIFICATIONS_EDIT: 'notifications.edit',
    NOTIFICATIONS_DELETE: 'notifications.delete',
    
    // User Management
    USER_MANAGEMENT_VIEW: 'user_management.view',
    USER_MANAGEMENT_ADD: 'user_management.add',
    USER_MANAGEMENT_EDIT: 'user_management.edit',
    USER_MANAGEMENT_DELETE: 'user_management.delete',
    USER_MANAGEMENT_ARCHIVE: 'user_management.archive',
    
    // Individual User Account Actions (aliases for clarity)
    USERS_VIEW: 'user_management.view',
    USERS_ADD: 'user_management.add',
    USERS_EDIT: 'user_management.edit',
    USERS_DELETE: 'user_management.delete',
    USERS_ARCHIVE: 'user_management.archive',
    
    // Health Records
    HEALTH_RECORDS_VIEW: 'health_records.view',
    HEALTH_RECORDS_ADD: 'health_records.add',
    HEALTH_RECORDS_EDIT: 'health_records.edit',
    HEALTH_RECORDS_DELETE: 'health_records.delete',
    HEALTH_RECORDS_ARCHIVE: 'health_records.archive',
    
    // Archives
    ARCHIVES_VIEW: 'archives.view',
    ARCHIVES_RESTORE: 'archives.restore',
    ARCHIVES_DELETE_PERMANENT: 'archives.delete_permanent',
    
    // Settings
    SETTINGS_VIEW: 'settings.view',
    SETTINGS_EDIT: 'settings.edit',
    
    // Reports
    REPORTS_VIEW: 'reports.view',
    REPORTS_GENERATE: 'reports.generate',
    REPORTS_EXPORT: 'reports.export',
    
    // Dashboard
    DASHBOARD_VIEW: 'dashboard.view',
    DASHBOARD_ADMIN: 'dashboard.admin',
    
    // Patient Records (for compatibility)
    PATIENTS_VIEW: 'patients.view',
    PATIENTS_ADD: 'patients.add',
    PATIENTS_EDIT: 'patients.edit',
    PATIENTS_DELETE: 'patients.delete',
    
    // Consultations (for compatibility)
    CONSULTATIONS_VIEW: 'consultations.view',
    CONSULTATIONS_ADD: 'consultations.add',
    CONSULTATIONS_EDIT: 'consultations.edit',
    CONSULTATIONS_DELETE: 'consultations.delete',
    
    // Prescriptions (for compatibility)
    PRESCRIPTIONS_VIEW: 'prescriptions.view',
    PRESCRIPTIONS_ADD: 'prescriptions.add',
    PRESCRIPTIONS_EDIT: 'prescriptions.edit',
    PRESCRIPTIONS_DELETE: 'prescriptions.delete',
    
    // Prenatal (for compatibility)
    PRENATAL_VIEW: 'prenatal.view',
    PRENATAL_ADD: 'prenatal.add',
    PRENATAL_EDIT: 'prenatal.edit',
    PRENATAL_DELETE: 'prenatal.delete',
    
    // Immunization (for compatibility)
    IMMUNIZATION_VIEW: 'immunization.view',
    IMMUNIZATION_ADD: 'immunization.add',
    IMMUNIZATION_EDIT: 'immunization.edit',
    IMMUNIZATION_DELETE: 'immunization.delete',
    
    // Animal Bite (for compatibility)
    ANIMAL_BITE_VIEW: 'animal_bite.view',
    ANIMAL_BITE_ADD: 'animal_bite.add',
    ANIMAL_BITE_EDIT: 'animal_bite.edit',
    ANIMAL_BITE_DELETE: 'animal_bite.delete',
    
    // Emergency Access
    EMERGENCY_ACCESS: 'emergency.access'
};

// ============================================================================
// ROLE PERMISSIONS MAPPING
// ============================================================================

export const ROLE_PERMISSIONS = {
    // ========================================================================
    // ADMIN - Full Access
    // ========================================================================
    [ROLES.ADMIN]: [
        // Appointments (Add, Edit, Delete, Archive)
        PERMISSIONS.APPOINTMENTS_VIEW,
        PERMISSIONS.APPOINTMENTS_ADD,
        PERMISSIONS.APPOINTMENTS_EDIT,
        PERMISSIONS.APPOINTMENTS_DELETE,
        PERMISSIONS.APPOINTMENTS_ARCHIVE,
        
        // ICD-10 Manager (Add, Edit, Delete, Archive)
        PERMISSIONS.ICD_VIEW,
        PERMISSIONS.ICD_ADD,
        PERMISSIONS.ICD_EDIT,
        PERMISSIONS.ICD_DELETE,
        PERMISSIONS.ICD_ARCHIVE,
        
        // Nurse Notes (Add, Edit, Delete, Archive)
        PERMISSIONS.NURSE_NOTES_VIEW,
        PERMISSIONS.NURSE_NOTES_ADD,
        PERMISSIONS.NURSE_NOTES_EDIT,
        PERMISSIONS.NURSE_NOTES_DELETE,
        PERMISSIONS.NURSE_NOTES_ARCHIVE,
        
        // Notifications
        PERMISSIONS.NOTIFICATIONS_VIEW,
        PERMISSIONS.NOTIFICATIONS_ADD,
        PERMISSIONS.NOTIFICATIONS_EDIT,
        PERMISSIONS.NOTIFICATIONS_DELETE,
        
        // User Management (Add, Edit, Delete, Archive)
        PERMISSIONS.USER_MANAGEMENT_VIEW,
        PERMISSIONS.USER_MANAGEMENT_ADD,
        PERMISSIONS.USER_MANAGEMENT_EDIT,
        PERMISSIONS.USER_MANAGEMENT_DELETE,
        PERMISSIONS.USER_MANAGEMENT_ARCHIVE,
        
        // Health Records (Add, Edit, Delete, Archive)
        PERMISSIONS.HEALTH_RECORDS_VIEW,
        PERMISSIONS.HEALTH_RECORDS_ADD,
        PERMISSIONS.HEALTH_RECORDS_EDIT,
        PERMISSIONS.HEALTH_RECORDS_DELETE,
        PERMISSIONS.HEALTH_RECORDS_ARCHIVE,
        
        // Archives (Full Access)
        PERMISSIONS.ARCHIVES_VIEW,
        PERMISSIONS.ARCHIVES_RESTORE,
        PERMISSIONS.ARCHIVES_DELETE_PERMANENT,
        
        // Settings
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_EDIT,
        
        // Reports (View Only)
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_GENERATE,
        PERMISSIONS.REPORTS_EXPORT,
        
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.DASHBOARD_ADMIN,
        
        // Legacy permissions for compatibility
        PERMISSIONS.PATIENTS_VIEW,
        PERMISSIONS.PATIENTS_ADD,
        PERMISSIONS.PATIENTS_EDIT,
        PERMISSIONS.PATIENTS_DELETE,
        PERMISSIONS.CONSULTATIONS_VIEW,
        PERMISSIONS.CONSULTATIONS_ADD,
        PERMISSIONS.CONSULTATIONS_EDIT,
        PERMISSIONS.CONSULTATIONS_DELETE,
        PERMISSIONS.PRESCRIPTIONS_VIEW,
        PERMISSIONS.PRESCRIPTIONS_ADD,
        PERMISSIONS.PRESCRIPTIONS_EDIT,
        PERMISSIONS.PRESCRIPTIONS_DELETE,
        PERMISSIONS.PRENATAL_VIEW,
        PERMISSIONS.PRENATAL_ADD,
        PERMISSIONS.PRENATAL_EDIT,
        PERMISSIONS.PRENATAL_DELETE,
        PERMISSIONS.IMMUNIZATION_VIEW,
        PERMISSIONS.IMMUNIZATION_ADD,
        PERMISSIONS.IMMUNIZATION_EDIT,
        PERMISSIONS.IMMUNIZATION_DELETE,
        PERMISSIONS.ANIMAL_BITE_VIEW,
        PERMISSIONS.ANIMAL_BITE_ADD,
        PERMISSIONS.ANIMAL_BITE_EDIT,
        PERMISSIONS.ANIMAL_BITE_DELETE,
        PERMISSIONS.EMERGENCY_ACCESS
    ],
    
    // ========================================================================
    // DOCTOR - Limited Access
    // Doctor Role Access (Add, Edit, Delete):
    // a. Appointment (can also be archived)
    // b. notification 
    // c. health record (can also be archived)
    // d. user managements (CANNOT access patient, nurse, doctor, staff)
    // e. settings
    // f. Reports (can be viewed)
    // ========================================================================
    [ROLES.DOCTOR]: [
        // Appointments (Add, Edit, Delete, Archive)
        PERMISSIONS.APPOINTMENTS_VIEW,
        PERMISSIONS.APPOINTMENTS_ADD,
        PERMISSIONS.APPOINTMENTS_EDIT,
        PERMISSIONS.APPOINTMENTS_DELETE,
        PERMISSIONS.APPOINTMENTS_ARCHIVE,
        
        // Notifications (Add, Edit, Delete)
        PERMISSIONS.NOTIFICATIONS_VIEW,
        PERMISSIONS.NOTIFICATIONS_ADD,
        PERMISSIONS.NOTIFICATIONS_EDIT,
        PERMISSIONS.NOTIFICATIONS_DELETE,
        
        // Health Records (Add, Edit, Delete, Archive)
        PERMISSIONS.HEALTH_RECORDS_VIEW,
        PERMISSIONS.HEALTH_RECORDS_ADD,
        PERMISSIONS.HEALTH_RECORDS_EDIT,
        PERMISSIONS.HEALTH_RECORDS_DELETE,
        PERMISSIONS.HEALTH_RECORDS_ARCHIVE,
        
        // User Management - CANNOT ACCESS
        // NO USER MANAGEMENT PERMISSIONS FOR DOCTORS
        
        // Settings (View & Edit)
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_EDIT,
        
        // Reports (View Only)
        PERMISSIONS.REPORTS_VIEW,
        
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,
        
        // Legacy permissions for compatibility (health records related)
        PERMISSIONS.PATIENTS_VIEW,
        PERMISSIONS.PATIENTS_ADD,
        PERMISSIONS.PATIENTS_EDIT,
        PERMISSIONS.PATIENTS_DELETE,
        PERMISSIONS.CONSULTATIONS_VIEW,
        PERMISSIONS.CONSULTATIONS_ADD,
        PERMISSIONS.CONSULTATIONS_EDIT,
        PERMISSIONS.CONSULTATIONS_DELETE,
        PERMISSIONS.PRESCRIPTIONS_VIEW,
        PERMISSIONS.PRESCRIPTIONS_ADD,
        PERMISSIONS.PRESCRIPTIONS_EDIT,
        PERMISSIONS.PRESCRIPTIONS_DELETE,
        PERMISSIONS.PRENATAL_VIEW,
        PERMISSIONS.PRENATAL_ADD,
        PERMISSIONS.PRENATAL_EDIT,
        PERMISSIONS.PRENATAL_DELETE,
        PERMISSIONS.IMMUNIZATION_VIEW,
        PERMISSIONS.IMMUNIZATION_ADD,
        PERMISSIONS.IMMUNIZATION_EDIT,
        PERMISSIONS.IMMUNIZATION_DELETE,
        PERMISSIONS.ANIMAL_BITE_VIEW,
        PERMISSIONS.ANIMAL_BITE_ADD,
        PERMISSIONS.ANIMAL_BITE_EDIT,
        PERMISSIONS.EMERGENCY_ACCESS
    ],
    
    // ========================================================================
    // NURSE - Medium Access
    // Nurse Role Access (Add, Edit, Delete):
    // a. Appointments (can also be archived)
    // b. nurse notes (can also be archived)
    // c. notification
    // d. health records (can also be archived)
    // e. archives 
    // f. user managements (CANNOT access patient, nurse, doctor, staff)
    // g. settings
    // h. Reports (can be viewed)
    // ========================================================================
    [ROLES.NURSE]: [
        // Appointments (Add, Edit, Delete, Archive)
        PERMISSIONS.APPOINTMENTS_VIEW,
        PERMISSIONS.APPOINTMENTS_ADD,
        PERMISSIONS.APPOINTMENTS_EDIT,
        PERMISSIONS.APPOINTMENTS_DELETE,
        PERMISSIONS.APPOINTMENTS_ARCHIVE,
        
        // Nurse Notes (Add, Edit, Delete, Archive)
        PERMISSIONS.NURSE_NOTES_VIEW,
        PERMISSIONS.NURSE_NOTES_ADD,
        PERMISSIONS.NURSE_NOTES_EDIT,
        PERMISSIONS.NURSE_NOTES_DELETE,
        PERMISSIONS.NURSE_NOTES_ARCHIVE,
        
        // Notifications (Add, Edit, Delete)
        PERMISSIONS.NOTIFICATIONS_VIEW,
        PERMISSIONS.NOTIFICATIONS_ADD,
        PERMISSIONS.NOTIFICATIONS_EDIT,
        PERMISSIONS.NOTIFICATIONS_DELETE,
        
        // Health Records (Add, Edit, Delete, Archive)
        PERMISSIONS.HEALTH_RECORDS_VIEW,
        PERMISSIONS.HEALTH_RECORDS_ADD,
        PERMISSIONS.HEALTH_RECORDS_EDIT,
        PERMISSIONS.HEALTH_RECORDS_DELETE,
        PERMISSIONS.HEALTH_RECORDS_ARCHIVE,
        
        // Archives (View & Restore)
        PERMISSIONS.ARCHIVES_VIEW,
        PERMISSIONS.ARCHIVES_RESTORE,
        
        // User Management - CANNOT ACCESS
        // NO USER MANAGEMENT PERMISSIONS FOR NURSES
        
        // Settings (View & Edit)
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_EDIT,
        
        // Reports (View Only)
        PERMISSIONS.REPORTS_VIEW,
        
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,
        
        // Legacy permissions for compatibility (health records related)
        PERMISSIONS.PATIENTS_VIEW,
        PERMISSIONS.PATIENTS_ADD,
        PERMISSIONS.PATIENTS_EDIT,
        PERMISSIONS.PATIENTS_DELETE,
        PERMISSIONS.CONSULTATIONS_VIEW,
        PERMISSIONS.CONSULTATIONS_ADD,
        PERMISSIONS.CONSULTATIONS_EDIT,
        PERMISSIONS.CONSULTATIONS_DELETE,
        PERMISSIONS.PRESCRIPTIONS_VIEW,
        PERMISSIONS.PRENATAL_VIEW,
        PERMISSIONS.PRENATAL_ADD,
        PERMISSIONS.PRENATAL_EDIT,
        PERMISSIONS.PRENATAL_DELETE,
        PERMISSIONS.IMMUNIZATION_VIEW,
        PERMISSIONS.IMMUNIZATION_ADD,
        PERMISSIONS.IMMUNIZATION_EDIT,
        PERMISSIONS.IMMUNIZATION_DELETE,
        PERMISSIONS.ANIMAL_BITE_VIEW,
        PERMISSIONS.ANIMAL_BITE_ADD,
        PERMISSIONS.ANIMAL_BITE_EDIT,
        PERMISSIONS.ANIMAL_BITE_DELETE
    ],
    
    // ========================================================================
    // STAFF - Basic Access
    // Staff Role Access (Add, Edit, Delete):
    // a. Appointments (can also be archived)
    // b. user managements (CANNOT access patient, nurse, doctor, staff)
    // c. settings
    // d. Reports (can be viewed)
    // ========================================================================
    [ROLES.STAFF]: [
        // Appointments (Add, Edit, Delete, Archive)
        PERMISSIONS.APPOINTMENTS_VIEW,
        PERMISSIONS.APPOINTMENTS_ADD,
        PERMISSIONS.APPOINTMENTS_EDIT,
        PERMISSIONS.APPOINTMENTS_DELETE,
        PERMISSIONS.APPOINTMENTS_ARCHIVE,
        
        // User Management - CANNOT ACCESS
        // NO USER MANAGEMENT PERMISSIONS FOR STAFF
        
        // Settings (View & Edit)
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_EDIT,
        
        // Reports (View Only)
        PERMISSIONS.REPORTS_VIEW,
        
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW
    ],
    
    // ========================================================================
    // PATIENT - NO ACCESS (Cannot login to website)
    // Patient Role Access: NONE - Patients cannot log in the website
    // ========================================================================
    [ROLES.PATIENT]: [
        // NO PERMISSIONS - Patients cannot login to the website
    ],
    
    // ========================================================================
    // GUEST - NO ACCESS
    // ========================================================================
    [ROLES.GUEST]: [
        // NO PERMISSIONS
    ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a role has a specific permission
 * @param {number} role - The role code
 * @param {string} permission - The permission to check
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
};

/**
 * Check if a role has any of the specified permissions
 * @param {number} role - The role code
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (role, permissions) => {
    return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 * @param {number} role - The role code
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (role, permissions) => {
    return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 * @param {number} role - The role code
 * @returns {string[]}
 */
export const getRolePermissions = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};

/**
 * Get role name from role code
 * @param {number} role - The role code
 * @returns {string}
 */
export const getRoleName = (role) => {
    return ROLE_NAMES[role] || 'Unknown';
};

/**
 * Get role code from username (format: ROLE_username)
 * @param {string} username - The username
 * @returns {number|null}
 */
export const getRoleFromUsername = (username) => {
    if (!username) return null;
    
    const upperUsername = username.toUpperCase();
    
    if (upperUsername.startsWith('ADMIN_')) return ROLES.ADMIN;
    if (upperUsername.startsWith('DOCTOR_')) return ROLES.DOCTOR;
    if (upperUsername.startsWith('NURSE_')) return ROLES.NURSE;
    if (upperUsername.startsWith('STAFF_')) return ROLES.STAFF;
    if (upperUsername.startsWith('PATIENT_')) return ROLES.PATIENT;
    
    return null;
};

/**
 * Get dashboard route based on role
 * @param {number} role - The role code
 * @returns {string}
 */
export const getDashboardRoute = (role) => {
    switch (role) {
        case ROLES.ADMIN:
        case ROLES.DOCTOR:
        case ROLES.NURSE:
        case ROLES.STAFF:
            return '/DashboardAlt';
        case ROLES.PATIENT:
            return '/Patient-Dashboard';
        default:
            return '/';
    }
};
