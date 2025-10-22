# Updated Role Permissions Summary

## Overview

This document summarizes the **updated** role-based access control (RBAC) permissions as per the new requirements dated October 21, 2025.

---

## 🎯 Role Permissions Matrix

### Complete Permission Breakdown

| Feature | Admin | Doctor | Nurse | Staff | Patient |
|---------|-------|--------|-------|-------|---------|
| **Appointments** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ |
| **ICD-10 Manager** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Nurse Notes** | ✅ Full | ❌ | ✅ Full | ❌ | ❌ |
| **Notifications** | ✅ Full | ✅ Full | ✅ Full | ❌ | ❌ |
| **User Management** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Health Records** | ✅ Full | ✅ Full | ✅ Full | ❌ | ❌ |
| **Archives** | ✅ Full | ❌ | ✅ View/Restore | ❌ | ❌ |
| **Settings** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ |
| **Reports** | ✅ View | ✅ View | ✅ View | ✅ View | ❌ |

**Legend:**
- ✅ Full = Add, Edit, Delete, Archive (if applicable)
- ✅ View = View Only
- ✅ View/Restore = View and Restore from Archives
- ❌ = No Access

---

## 📋 Detailed Role Permissions

### 1️⃣ Admin Role (Code: 5150)

**Full System Access**

#### ✅ Permissions (Add, Edit, Delete, Archive)

**a. Appointments**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**b. ICD-10 Manager**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**c. Nurse Notes**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**d. Notifications**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete

**e. User Management** (patient, nurse, doctor, staff)
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**f. Health Records**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**g. Archives**
- ✅ View
- ✅ Restore
- ✅ Permanent Delete

**h. Settings**
- ✅ View
- ✅ Edit

**i. Reports**
- ✅ View
- ✅ Generate
- ✅ Export

---

### 2️⃣ Doctor Role (Code: 4001)

**Medical Staff Access - NO User Management**

#### ✅ Permissions (Add, Edit, Delete)

**a. Appointments**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**b. Notifications**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete

**c. Health Records**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**d. User Management**
- ❌ **CANNOT ACCESS** (patient, nurse, doctor, staff)

**e. Settings**
- ✅ View
- ✅ Edit

**f. Reports**
- ✅ View Only

#### ❌ NO Access To:
- ICD-10 Manager
- Nurse Notes
- User Management
- Archives

---

### 3️⃣ Nurse Role (Code: 3001)

**Nursing Staff Access - NO User Management**

#### ✅ Permissions (Add, Edit, Delete)

**a. Appointments**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**b. Nurse Notes**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**c. Notifications**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete

**d. Health Records**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**e. Archives**
- ✅ View
- ✅ Restore
- ❌ No Permanent Delete

**f. User Management**
- ❌ **CANNOT ACCESS** (patient, nurse, doctor, staff)

**g. Settings**
- ✅ View
- ✅ Edit

**h. Reports**
- ✅ View Only

#### ❌ NO Access To:
- ICD-10 Manager
- User Management
- Archives Permanent Delete

---

### 4️⃣ Staff Role (Code: 6001)

**Administrative Staff - Limited Access**

#### ✅ Permissions (Add, Edit, Delete)

**a. Appointments**
- ✅ View
- ✅ Add
- ✅ Edit
- ✅ Delete
- ✅ Archive

**b. User Management**
- ❌ **CANNOT ACCESS** (patient, nurse, doctor, staff)

**c. Settings**
- ✅ View
- ✅ Edit

**d. Reports**
- ✅ View Only

#### ❌ NO Access To:
- ICD-10 Manager
- Nurse Notes
- Notifications
- User Management
- Health Records
- Archives

---

### 5️⃣ Patient Role (Code: 2001)

**NO ACCESS - Cannot Login to Website**

#### ❌ No Permissions

Patients **cannot log in** to the admin website. They have **zero permissions**.

---

## 🔐 Permission Constants Used

### Core Permissions

```javascript
// Appointments
APPOINTMENTS_VIEW
APPOINTMENTS_ADD
APPOINTMENTS_EDIT
APPOINTMENTS_DELETE
APPOINTMENTS_ARCHIVE

// ICD-10 Manager
ICD_VIEW
ICD_ADD
ICD_EDIT
ICD_DELETE
ICD_ARCHIVE

// Nurse Notes
NURSE_NOTES_VIEW
NURSE_NOTES_ADD
NURSE_NOTES_EDIT
NURSE_NOTES_DELETE
NURSE_NOTES_ARCHIVE

// Notifications
NOTIFICATIONS_VIEW
NOTIFICATIONS_ADD
NOTIFICATIONS_EDIT
NOTIFICATIONS_DELETE

// User Management
USER_MANAGEMENT_VIEW
USER_MANAGEMENT_ADD
USER_MANAGEMENT_EDIT
USER_MANAGEMENT_DELETE
USER_MANAGEMENT_ARCHIVE

// Health Records
HEALTH_RECORDS_VIEW
HEALTH_RECORDS_ADD
HEALTH_RECORDS_EDIT
HEALTH_RECORDS_DELETE
HEALTH_RECORDS_ARCHIVE

// Archives
ARCHIVES_VIEW
ARCHIVES_RESTORE
ARCHIVES_DELETE_PERMANENT

// Settings
SETTINGS_VIEW
SETTINGS_EDIT

// Reports
REPORTS_VIEW
REPORTS_GENERATE
REPORTS_EXPORT
```

---

## 📊 Quick Reference Table

### Feature Access Summary

| Feature | Admin | Doctor | Nurse | Staff | Patient |
|---------|:-----:|:------:|:-----:|:-----:|:-------:|
| Appointments | ✅ | ✅ | ✅ | ✅ | ❌ |
| ICD-10 Manager | ✅ | ❌ | ❌ | ❌ | ❌ |
| Nurse Notes | ✅ | ❌ | ✅ | ❌ | ❌ |
| Notifications | ✅ | ✅ | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Health Records | ✅ | ✅ | ✅ | ❌ | ❌ |
| Archives (View) | ✅ | ❌ | ✅ | ❌ | ❌ |
| Archives (Restore) | ✅ | ❌ | ✅ | ❌ | ❌ |
| Archives (Delete) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ | ✅ | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 🎨 Sidebar Menu Visibility

### Admin Sidebar
```
✅ Main
   ✅ Dashboard
   ✅ GeoMap
   ✅ Calendar

✅ File Maintenance
   ✅ ICD-10
   ✅ Nurse Notes
   ✅ User Management
   ✅ Notifications

✅ Patient Records
   ✅ All Sub-items

✅ Accounts
   ✅ All Sub-items

✅ Reports
   ✅ All Reports
```

### Doctor Sidebar
```
✅ Main
   ✅ Dashboard
   ✅ GeoMap
   ✅ Calendar

❌ File Maintenance (HIDDEN)

✅ Patient Records
   ✅ All Sub-items

✅ Accounts
   ✅ All Sub-items

✅ Reports
   ✅ All Reports
```

### Nurse Sidebar
```
✅ Main
   ✅ Dashboard
   ✅ GeoMap
   ✅ Calendar

✅ File Maintenance
   ❌ ICD-10 (HIDDEN)
   ✅ Nurse Notes
   ❌ User Management (HIDDEN)
   ✅ Notifications

✅ Patient Records
   ✅ All Sub-items

✅ Accounts
   ✅ All Sub-items

✅ Reports
   ✅ All Reports
```

### Staff Sidebar
```
✅ Main
   ✅ Dashboard
   ✅ GeoMap
   ✅ Calendar

❌ File Maintenance (HIDDEN)

❌ Patient Records (HIDDEN)

❌ Accounts (HIDDEN)

✅ Reports
   ✅ All Reports
```

### Patient Sidebar
```
❌ CANNOT LOGIN - No access to admin panel
```

---

## 🔧 Implementation Notes

### 1. User Management Access

**IMPORTANT:** The requirement states:
- Doctor: "user managements (cannot access patient, nurse, doctor, staff)"
- Nurse: "user managements (cannot access patient, nurse, doctor, staff)"
- Staff: "user managements (cannot access patient, nurse, doctor, staff)"

**Implementation:** Since they "cannot access patient, nurse, doctor, staff" (which is all user types), this means they have **NO user management access at all**.

Therefore:
- ✅ Admin: Full User Management access
- ❌ Doctor: NO User Management access
- ❌ Nurse: NO User Management access
- ❌ Staff: NO User Management access

### 2. Archive Access

**Archives** are only accessible to:
- ✅ Admin: Full access (View, Restore, Permanent Delete)
- ✅ Nurse: Limited access (View, Restore only)
- ❌ Doctor: No access
- ❌ Staff: No access

### 3. ICD-10 Manager Access

**ICD-10 Manager** is only accessible to:
- ✅ Admin: Full access
- ❌ All other roles: No access

### 4. Reports Access

**Reports** are view-only for all roles except Admin:
- ✅ Admin: View, Generate, Export
- ✅ Doctor: View only
- ✅ Nurse: View only
- ✅ Staff: View only

---

## 🧪 Testing Checklist

### Admin Testing
- [ ] Can access all 9 features
- [ ] Can Add/Edit/Delete in all applicable features
- [ ] Can Archive items in appointments, ICD-10, nurse notes, user management, health records
- [ ] Can access Archives section
- [ ] Can permanently delete from Archives
- [ ] User Management page accessible
- [ ] All sidebar sections visible

### Doctor Testing
- [ ] Can access Appointments (Add/Edit/Delete/Archive)
- [ ] Can access Notifications (Add/Edit/Delete)
- [ ] Can access Health Records (Add/Edit/Delete/Archive)
- [ ] Can access Settings (View/Edit)
- [ ] Can access Reports (View only)
- [ ] **CANNOT** access ICD-10 Manager
- [ ] **CANNOT** access Nurse Notes
- [ ] **CANNOT** access User Management (redirect to Access Denied)
- [ ] **CANNOT** access Archives
- [ ] File Maintenance section hidden in sidebar
- [ ] User Management link hidden in sidebar

### Nurse Testing
- [ ] Can access Appointments (Add/Edit/Delete/Archive)
- [ ] Can access Nurse Notes (Add/Edit/Delete/Archive)
- [ ] Can access Notifications (Add/Edit/Delete)
- [ ] Can access Health Records (Add/Edit/Delete/Archive)
- [ ] Can access Archives (View/Restore only)
- [ ] Can access Settings (View/Edit)
- [ ] Can access Reports (View only)
- [ ] **CANNOT** access ICD-10 Manager
- [ ] **CANNOT** access User Management (redirect to Access Denied)
- [ ] **CANNOT** permanently delete from Archives
- [ ] ICD-10 link hidden in sidebar
- [ ] User Management link hidden in sidebar

### Staff Testing
- [ ] Can access Appointments (Add/Edit/Delete/Archive)
- [ ] Can access Settings (View/Edit)
- [ ] Can access Reports (View only)
- [ ] **CANNOT** access ICD-10 Manager
- [ ] **CANNOT** access Nurse Notes
- [ ] **CANNOT** access Notifications
- [ ] **CANNOT** access User Management
- [ ] **CANNOT** access Health Records
- [ ] **CANNOT** access Archives
- [ ] Only Main, Reports sections visible in sidebar
- [ ] File Maintenance, Patient Records, Accounts sections hidden

### Patient Testing
- [ ] **CANNOT** login to admin website
- [ ] Login page should reject patient credentials or show error
- [ ] No permissions granted

---

## 🔄 Changes from Previous Version

### Key Updates

1. **Doctor Role**
   - ✅ Kept: Appointments, Notifications, Health Records, Settings, Reports
   - ❌ Removed: ICD-10 Manager, Nurse Notes, Archives (per requirements)

2. **Nurse Role**
   - ✅ Kept: Appointments, Nurse Notes, Notifications, Health Records, Archives, Settings, Reports
   - ✅ Enhanced: Added full CRUD permissions for consultations, prescriptions, animal bite, prenatal
   - ❌ Confirmed: NO User Management access

3. **Staff Role**
   - ✅ Kept: Appointments, Settings, Reports
   - ❌ Removed: Unnecessary legacy permissions (patient view/add)
   - ❌ Confirmed: NO User Management access

4. **Patient Role**
   - ❌ Confirmed: Zero permissions - cannot login

---

## ⚠️ Security Reminders

### Frontend vs Backend

**Frontend (Sidebar/UI):**
- Hides navigation links
- Shows "Access Denied" pages
- Prevents UI confusion

**Backend (PHP/API):**
- ⚠️ **MUST validate permissions**
- Check role code in every endpoint
- Return 403 Forbidden for unauthorized requests

### Example Backend Check

```php
// Example: appointments.php
session_start();

$allowedRoles = [5150, 4001, 3001, 6001]; // Admin, Doctor, Nurse, Staff

if (!isset($_SESSION['roles']) || !in_array($_SESSION['roles'], $allowedRoles)) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Proceed with request
```

---

## 📝 Summary

### Role Access Levels (Simplified)

1. **Admin (5150)** - Everything ✅
2. **Doctor (4001)** - Appointments, Notifications, Health Records, Settings, Reports ✅
3. **Nurse (3001)** - Appointments, Nurse Notes, Notifications, Health Records, Archives, Settings, Reports ✅
4. **Staff (6001)** - Appointments, Settings, Reports ✅
5. **Patient (2001)** - Nothing ❌ (Cannot login)

### Who Can Access What?

| Feature | Roles with Access |
|---------|-------------------|
| Appointments | Admin, Doctor, Nurse, Staff |
| ICD-10 Manager | Admin only |
| Nurse Notes | Admin, Nurse |
| Notifications | Admin, Doctor, Nurse |
| User Management | Admin only |
| Health Records | Admin, Doctor, Nurse |
| Archives | Admin, Nurse (limited) |
| Settings | Admin, Doctor, Nurse, Staff |
| Reports | Admin, Doctor, Nurse, Staff |

---

## ✅ Implementation Status

- [x] Role permissions updated in `rolePermissions.js`
- [x] Sidebar filtering implemented
- [x] PermissionGate component working
- [x] Page-level access control in UserManagement
- [x] Documentation created
- [ ] Backend PHP validation (TO DO)
- [ ] Testing with all roles (TO DO)

---

*Last Updated: October 21, 2025*
*Version: 2.0*
*Status: Permissions Updated Per Latest Requirements*
