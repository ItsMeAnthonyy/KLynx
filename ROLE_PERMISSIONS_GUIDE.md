# 🔐 Role-Based Access Control (RBAC) - Complete Guide

## Overview

This document defines the **exact permissions** for each role in the KLynx Health Center system.

---

## 📊 Role Access Matrix

### Quick Reference Table

| Feature | Admin | Doctor | Nurse | Staff | Patient |
|---------|-------|--------|-------|-------|---------|
| **Appointments** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ No Access |
| **ICD-10 Manager** | ✅ Full | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access |
| **Nurse Notes** | ✅ Full | ❌ No Access | ✅ Full | ❌ No Access | ❌ No Access |
| **Notifications** | ✅ Full | ✅ Full | ✅ Full | ❌ No Access | ❌ No Access |
| **User Management** | ✅ Full | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access |
| **Health Records** | ✅ Full | ✅ Full | ✅ Full | ❌ No Access | ❌ No Access |
| **Archives** | ✅ Full | ❌ No Access | ✅ View/Restore | ❌ No Access | ❌ No Access |
| **Settings** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ No Access |
| **Reports** | 👁️ View | 👁️ View | 👁️ View | 👁️ View | ❌ No Access |
| **Login** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ **CANNOT LOGIN** |

---

## 👨‍💼 Admin Role Access (Role Code: 5150)

### ✅ Full Access to:

#### 1. **Appointments**
- ✅ Add new appointments
- ✅ Edit existing appointments
- ✅ Delete appointments
- ✅ Archive appointments

#### 2. **ICD-10 Manager**
- ✅ Add new ICD codes
- ✅ Edit existing ICD codes
- ✅ Delete ICD codes
- ✅ Archive ICD codes

#### 3. **Nurse Notes**
- ✅ Add new nurse notes
- ✅ Edit existing nurse notes
- ✅ Delete nurse notes
- ✅ Archive nurse notes

#### 4. **Notifications**
- ✅ View all notifications
- ✅ Create notifications
- ✅ Edit notifications
- ✅ Delete notifications

#### 5. **User Management** (Patient, Nurse, Doctor, Staff)
- ✅ View all users
- ✅ Add new users (all roles)
- ✅ Edit user details
- ✅ Delete users
- ✅ Archive users

#### 6. **Health Records**
- ✅ View all health records
- ✅ Add new health records
- ✅ Edit existing health records
- ✅ Delete health records
- ✅ Archive health records

#### 7. **Archives**
- ✅ View all archived items
- ✅ Restore archived items
- ✅ Permanently delete archived items

#### 8. **Settings**
- ✅ View all settings
- ✅ Modify system settings

#### 9. **Reports**
- 👁️ View reports (Read-only)
- ✅ Generate reports
- ✅ Export reports

---

## 👨‍⚕️ Doctor Role Access (Role Code: 4001)

### ✅ Has Access to:

#### 1. **Appointments**
- ✅ Add new appointments
- ✅ Edit existing appointments
- ✅ Delete appointments
- ✅ Archive appointments

#### 2. **Notifications**
- ✅ View notifications
- ✅ Create notifications
- ✅ Edit notifications
- ✅ Delete notifications

#### 3. **Health Records**
- ✅ View health records
- ✅ Add new health records
- ✅ Edit existing health records
- ✅ Delete health records
- ✅ Archive health records

#### 4. **Settings**
- ✅ View settings
- ✅ Modify settings

#### 5. **Reports**
- 👁️ View reports (Read-only)

### ❌ Does NOT Have Access to:

- ❌ **User Management** (Cannot access patient, nurse, doctor, staff management)
- ❌ **ICD-10 Manager**
- ❌ **Nurse Notes**
- ❌ **Archives**

---

## 👩‍⚕️ Nurse Role Access (Role Code: 3001)

### ✅ Has Access to:

#### 1. **Appointments**
- ✅ Add new appointments
- ✅ Edit existing appointments
- ✅ Delete appointments
- ✅ Archive appointments

#### 2. **Nurse Notes**
- ✅ Add new nurse notes
- ✅ Edit existing nurse notes
- ✅ Delete nurse notes
- ✅ Archive nurse notes

#### 3. **Notifications**
- ✅ View notifications
- ✅ Create notifications
- ✅ Edit notifications
- ✅ Delete notifications

#### 4. **Health Records**
- ✅ View health records
- ✅ Add new health records
- ✅ Edit existing health records
- ✅ Delete health records
- ✅ Archive health records

#### 5. **Archives**
- ✅ View archived items
- ✅ Restore archived items
- ❌ Cannot permanently delete

#### 6. **Settings**
- ✅ View settings
- ✅ Modify settings

#### 7. **Reports**
- 👁️ View reports (Read-only)

### ❌ Does NOT Have Access to:

- ❌ **User Management** (Cannot access patient, nurse, doctor, staff management)
- ❌ **ICD-10 Manager**

---

## 👔 Staff Role Access (Role Code: 6001)

### ✅ Has Access to:

#### 1. **Appointments**
- ✅ Add new appointments
- ✅ Edit existing appointments
- ✅ Delete appointments
- ✅ Archive appointments

#### 2. **Settings**
- ✅ View settings
- ✅ Modify settings

#### 3. **Reports**
- 👁️ View reports (Read-only)

### ❌ Does NOT Have Access to:

- ❌ **User Management** (Cannot access patient, nurse, doctor, staff management)
- ❌ **Health Records**
- ❌ **Nurse Notes**
- ❌ **Notifications**
- ❌ **ICD-10 Manager**
- ❌ **Archives**

---

## 👤 Patient Role Access (Role Code: 2001)

### ❌ **PATIENTS CANNOT LOGIN TO THE WEBSITE**

- ❌ No login access
- ❌ No permissions granted
- ❌ Cannot access any part of the system

**Note:** This is by design. Patients are managed by the system but do not have direct access to the admin/staff portal.

---

## 🔑 Role Codes Reference

| Role | Code | Numeric Value |
|------|------|---------------|
| Admin | ADMIN | 5150 |
| Doctor | DOCTOR | 4001 |
| Nurse | NURSE | 3001 |
| Staff | STAFF | 6001 |
| Patient | PATIENT | 2001 |
| Guest | GUEST | 7001 |

---

## 📋 Permission Codes

### Appointments
- `appointments.view` - View appointments
- `appointments.add` - Create new appointments
- `appointments.edit` - Modify existing appointments
- `appointments.delete` - Remove appointments
- `appointments.archive` - Archive appointments

### ICD-10 Manager
- `icd.view` - View ICD codes
- `icd.add` - Add new ICD codes
- `icd.edit` - Modify existing ICD codes
- `icd.delete` - Remove ICD codes
- `icd.archive` - Archive ICD codes

### Nurse Notes
- `nurse_notes.view` - View nurse notes
- `nurse_notes.add` - Create new nurse notes
- `nurse_notes.edit` - Modify existing nurse notes
- `nurse_notes.delete` - Remove nurse notes
- `nurse_notes.archive` - Archive nurse notes

### Notifications
- `notifications.view` - View notifications
- `notifications.add` - Create notifications
- `notifications.edit` - Modify notifications
- `notifications.delete` - Remove notifications

### User Management
- `user_management.view` - View user accounts
- `user_management.add` - Create new users
- `user_management.edit` - Modify user accounts
- `user_management.delete` - Remove users
- `user_management.archive` - Archive users

### Health Records
- `health_records.view` - View health records
- `health_records.add` - Create new health records
- `health_records.edit` - Modify existing health records
- `health_records.delete` - Remove health records
- `health_records.archive` - Archive health records

### Archives
- `archives.view` - View archived items
- `archives.restore` - Restore archived items
- `archives.delete_permanent` - Permanently delete archived items

### Settings
- `settings.view` - View system settings
- `settings.edit` - Modify system settings

### Reports
- `reports.view` - View reports
- `reports.generate` - Generate new reports
- `reports.export` - Export reports

---

## 🛡️ How to Use Permissions in Code

### Example 1: Check Single Permission

```javascript
import { hasPermission, ROLES, PERMISSIONS } from '../utils/rolePermissions';

// Check if admin can add appointments
const canAddAppointment = hasPermission(ROLES.ADMIN, PERMISSIONS.APPOINTMENTS_ADD);
console.log(canAddAppointment); // true

// Check if staff can edit users
const canEditUsers = hasPermission(ROLES.STAFF, PERMISSIONS.USER_MANAGEMENT_EDIT);
console.log(canEditUsers); // false
```

### Example 2: Check Multiple Permissions (ANY)

```javascript
import { hasAnyPermission, ROLES, PERMISSIONS } from '../utils/rolePermissions';

// Check if doctor can add OR edit health records
const canManageHealthRecords = hasAnyPermission(ROLES.DOCTOR, [
    PERMISSIONS.HEALTH_RECORDS_ADD,
    PERMISSIONS.HEALTH_RECORDS_EDIT
]);
console.log(canManageHealthRecords); // true
```

### Example 3: Check Multiple Permissions (ALL)

```javascript
import { hasAllPermissions, ROLES, PERMISSIONS } from '../utils/rolePermissions';

// Check if nurse has ALL appointment permissions
const hasFullAppointmentAccess = hasAllPermissions(ROLES.NURSE, [
    PERMISSIONS.APPOINTMENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_ADD,
    PERMISSIONS.APPOINTMENTS_EDIT,
    PERMISSIONS.APPOINTMENTS_DELETE
]);
console.log(hasFullAppointmentAccess); // true
```

### Example 4: Use in Component (with PermissionGate)

```jsx
import PermissionGate from '../components/PermissionGate';
import { PERMISSIONS } from '../utils/rolePermissions';

function AppointmentPage() {
    return (
        <div>
            <h1>Appointments</h1>
            
            {/* Only show create button if user has permission */}
            <PermissionGate permissions={[PERMISSIONS.APPOINTMENTS_ADD]}>
                <button>Create Appointment</button>
            </PermissionGate>
            
            {/* Only show delete button if user has permission */}
            <PermissionGate permissions={[PERMISSIONS.APPOINTMENTS_DELETE]}>
                <button>Delete Appointment</button>
            </PermissionGate>
        </div>
    );
}
```

### Example 5: Conditional Rendering

```jsx
import { useAuth } from '../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../utils/rolePermissions';

function UserManagementPage() {
    const { auth } = useAuth();
    const userRole = auth.roles?.[0];
    
    const canAddUsers = hasPermission(userRole, PERMISSIONS.USER_MANAGEMENT_ADD);
    const canDeleteUsers = hasPermission(userRole, PERMISSIONS.USER_MANAGEMENT_DELETE);
    
    return (
        <div>
            <h1>User Management</h1>
            
            {canAddUsers && (
                <button>Add User</button>
            )}
            
            <table>
                {/* User list */}
            </table>
            
            {canDeleteUsers && (
                <button>Delete Selected</button>
            )}
        </div>
    );
}
```

---

## 🔒 Security Best Practices

### 1. **Always Check Permissions on Backend**
Frontend permission checks are for UX only. Always validate on the server:

```php
// Backend example (PHP)
if ($userRole !== 5150) { // Not admin
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}
```

### 2. **Use PermissionGate for UI Elements**
Hide buttons/features users shouldn't access:

```jsx
<PermissionGate permissions={[PERMISSIONS.USERS_DELETE]}>
    <DeleteButton />
</PermissionGate>
```

### 3. **Check Permissions Before API Calls**
Prevent unnecessary API requests:

```javascript
if (!hasPermission(userRole, PERMISSIONS.APPOINTMENTS_DELETE)) {
    alert('You do not have permission to delete appointments');
    return;
}

// Proceed with delete
await deleteAppointment(appointmentId);
```

### 4. **Implement Role-Based Routing**
Redirect unauthorized users:

```jsx
<Route 
    path="/user-management" 
    element={
        <RequireAuth allowedRoles={[ROLES.ADMIN]}>
            <UserManagement />
        </RequireAuth>
    } 
/>
```

---

## 📝 Summary

### Admin (5150)
✅ **Full access to everything**

### Doctor (4001)
✅ Appointments, Notifications, Health Records, Settings, Reports  
❌ User Management, ICD Manager, Nurse Notes, Archives

### Nurse (3001)
✅ Appointments, Nurse Notes, Notifications, Health Records, Archives, Settings, Reports  
❌ User Management, ICD Manager

### Staff (6001)
✅ Appointments, Settings, Reports  
❌ Everything else

### Patient (2001)
❌ **Cannot login - No access**

---

*Last Updated: October 20, 2025*  
*Based on client requirements*  
*Status: ✅ IMPLEMENTED*