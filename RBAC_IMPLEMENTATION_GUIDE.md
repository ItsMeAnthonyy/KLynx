# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This guide explains the complete Role-Based Access Control (RBAC) system implementation in the KLynx Health Center application. The system controls access to features and data based on user roles and permissions.

---

## 🎯 System Architecture

### Core Components

1. **rolePermissions.js** - Central permission configuration
2. **PermissionGate.jsx** - React component for conditional rendering
3. **useAuth.jsx** - Authentication hook
4. **AuthProvider.jsx** - Authentication context provider

---

## 📋 Role Definitions

### Role Codes
```javascript
ROLES = {
    ADMIN: 5150,    // Full system access
    DOCTOR: 4001,   // Medical staff with patient care access
    NURSE: 3001,    // Nursing staff with care documentation
    STAFF: 6001,    // Administrative staff
    PATIENT: 2001,  // Patients (cannot login to admin panel)
    GUEST: 7001     // Guest access (minimal permissions)
}
```

### Permission Matrix

| Feature | Admin | Doctor | Nurse | Staff | Patient |
|---------|-------|--------|-------|-------|---------|
| **User Management** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Appointments** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ |
| **ICD-10 Manager** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Nurse Notes** | ✅ Full | ❌ | ✅ Full | ❌ | ❌ |
| **Notifications** | ✅ Full | ✅ Full | ✅ Full | ❌ | ❌ |
| **Health Records** | ✅ Full | ✅ Full | ✅ Full | ❌ | ❌ |
| **Archives** | ✅ Full | ❌ | ✅ View/Restore | ❌ | ❌ |
| **Settings** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ |
| **Reports** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ |

---

## 🔑 Permission System

### Permission Naming Convention

Permissions follow this pattern: `FEATURE_ACTION`

```javascript
PERMISSIONS = {
    // User Management
    USER_MANAGEMENT_VIEW: 'user_management.view',
    USER_MANAGEMENT_ADD: 'user_management.add',
    USER_MANAGEMENT_EDIT: 'user_management.edit',
    USER_MANAGEMENT_DELETE: 'user_management.delete',
    
    // Shorter aliases
    USERS_VIEW: 'user_management.view',
    USERS_ADD: 'user_management.add',
    USERS_EDIT: 'user_management.edit',
    USERS_DELETE: 'user_management.delete',
    
    // Health Records
    HEALTH_RECORDS_VIEW: 'health_records.view',
    HEALTH_RECORDS_ADD: 'health_records.add',
    HEALTH_RECORDS_EDIT: 'health_records.edit',
    // ... and more
}
```

### Action Types

- **VIEW** - Read access to feature/data
- **ADD** - Create new records
- **EDIT** - Modify existing records
- **DELETE** - Remove records (soft delete)
- **ARCHIVE** - Archive functionality
- **RESTORE** - Restore archived items

---

## 🛠️ Implementation

### 1. PermissionGate Component

The `PermissionGate` component controls what UI elements are displayed based on permissions.

#### Basic Usage

```jsx
import PermissionGate from '../components/PermissionGate';
import { PERMISSIONS } from '../utils/rolePermissions';

// Single permission check
<PermissionGate permission={PERMISSIONS.USERS_ADD}>
    <button onClick={handleCreate}>Create User</button>
</PermissionGate>
```

#### Multiple Permissions (ANY)

```jsx
// User needs ANY of these permissions
<PermissionGate permission={[PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_EDIT]}>
    <button>Manage Users</button>
</PermissionGate>
```

#### Multiple Permissions (ALL)

```jsx
// User needs ALL of these permissions
<PermissionGate 
    permission={[PERMISSIONS.USERS_EDIT, PERMISSIONS.USERS_DELETE]} 
    requireAll={true}
>
    <button>Full Admin Access</button>
</PermissionGate>
```

#### With Fallback Content

```jsx
<PermissionGate 
    permission={PERMISSIONS.USERS_ADD}
    fallback={<p>You don't have permission to create users.</p>}
>
    <button>Create User</button>
</PermissionGate>
```

### 2. Page-Level Access Control

Protect entire pages from unauthorized access:

```jsx
import useAuth from '../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../utils/rolePermissions';

const UserManagement = () => {
    const { auth } = useAuth();
    
    // Check permission
    const userRoleCode = auth?.roles?.[0];
    const hasAccess = userRoleCode && hasPermission(userRoleCode, PERMISSIONS.USER_MANAGEMENT_VIEW);
    
    // Show unauthorized page if no access
    if (!hasAccess) {
        return (
            <div>
                <h2>Access Denied</h2>
                <p>You do not have permission to access this page.</p>
            </div>
        );
    }
    
    // Regular page content
    return (
        <div>
            {/* Page content */}
        </div>
    );
};
```

### 3. Action Button Protection

Control individual action buttons in tables:

```jsx
<td>
    <div className={styles.actions}>
        {/* View button - requires view permission */}
        <PermissionGate permission={PERMISSIONS.USERS_VIEW}>
            <button onClick={() => handleView(user)}>
                <FaEye />
            </button>
        </PermissionGate>
        
        {/* Edit button - requires edit permission */}
        <PermissionGate permission={PERMISSIONS.USERS_EDIT}>
            <button onClick={() => handleEdit(user)}>
                <FaEdit />
            </button>
        </PermissionGate>
        
        {/* Delete button - requires delete permission */}
        <PermissionGate permission={PERMISSIONS.USERS_DELETE}>
            <button onClick={() => handleDelete(user)}>
                <FaTrash />
            </button>
        </PermissionGate>
    </div>
</td>
```

---

## 🔧 Helper Functions

### hasPermission()

Check if a role has a specific permission:

```javascript
import { hasPermission, PERMISSIONS, ROLES } from '../utils/rolePermissions';

const canEdit = hasPermission(ROLES.ADMIN, PERMISSIONS.USERS_EDIT);
// Returns: true
```

### hasAnyPermission()

Check if a role has ANY of the specified permissions:

```javascript
import { hasAnyPermission, PERMISSIONS, ROLES } from '../utils/rolePermissions';

const canManage = hasAnyPermission(
    ROLES.DOCTOR, 
    [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_EDIT]
);
// Returns: false (doctors don't have user management access)
```

### hasAllPermissions()

Check if a role has ALL of the specified permissions:

```javascript
import { hasAllPermissions, PERMISSIONS, ROLES } from '../utils/rolePermissions';

const hasFullAccess = hasAllPermissions(
    ROLES.ADMIN,
    [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_EDIT, PERMISSIONS.USERS_DELETE]
);
// Returns: true
```

### getRolePermissions()

Get all permissions for a role:

```javascript
import { getRolePermissions, ROLES } from '../utils/rolePermissions';

const adminPermissions = getRolePermissions(ROLES.ADMIN);
// Returns: ['user_management.view', 'user_management.add', ...]
```

### getRoleName()

Get human-readable role name:

```javascript
import { getRoleName, ROLES } from '../utils/rolePermissions';

const name = getRoleName(ROLES.ADMIN);
// Returns: "Admin"
```

---

## 🎨 UserManagement Implementation

### Protected Features

#### 1. Create User Button
```jsx
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
```

#### 2. Action Buttons
```jsx
<div className={styles.actions}>
    <PermissionGate permission={PERMISSIONS.USERS_VIEW}>
        <button title="View">
            <FaEye />
        </button>
    </PermissionGate>
    
    <PermissionGate permission={PERMISSIONS.USERS_EDIT}>
        <button title="Edit">
            <FaEdit />
        </button>
    </PermissionGate>
    
    <PermissionGate permission={PERMISSIONS.USERS_DELETE}>
        <button title="Delete">
            <FaTrash />
        </button>
    </PermissionGate>
</div>
```

#### 3. Page Access Control
```jsx
// At component level
const { auth } = useAuth();
const userRoleCode = auth?.roles?.[0];
const hasAccess = userRoleCode && hasPermission(userRoleCode, PERMISSIONS.USER_MANAGEMENT_VIEW);

if (!hasAccess) {
    return <UnauthorizedPage />;
}
```

---

## 🔐 Security Best Practices

### 1. Backend Validation

⚠️ **IMPORTANT**: Frontend permission checks are for UX only. Always validate permissions on the backend.

```php
// Example: create-user.php
session_start();

// Check if user has permission
if (!isset($_SESSION['role']) || $_SESSION['role'] !== '5150') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Proceed with user creation
```

### 2. Never Trust Frontend

- Frontend gates hide UI elements but don't prevent API calls
- Users can modify JavaScript in browser
- Always check permissions server-side before any database operation

### 3. Audit Logging

Log all permission-sensitive actions:

```javascript
const handleDeleteUser = async (userId) => {
    // Log the action
    await axios.post('/api/audit-log.php', {
        action: 'USER_DELETE',
        userId: userId,
        performedBy: auth.adminID,
        timestamp: new Date().toISOString()
    });
    
    // Proceed with deletion
    await axios.delete(`/api/users/${userId}`);
};
```

---

## 🧪 Testing Permission Gates

### Test Scenarios

1. **Admin Role (5150)**
   - ✅ Should see Create User button
   - ✅ Should see all action buttons (View, Edit, Delete)
   - ✅ Should access User Management page

2. **Doctor Role (4001)**
   - ❌ Should NOT see Create User button
   - ❌ Should NOT see any action buttons
   - ❌ Should see "Access Denied" on User Management page

3. **Nurse Role (3001)**
   - ❌ Should NOT see Create User button
   - ❌ Should NOT see any action buttons
   - ❌ Should see "Access Denied" on User Management page

4. **Staff Role (6001)**
   - ❌ Should NOT see Create User button
   - ❌ Should NOT see any action buttons
   - ❌ Should see "Access Denied" on User Management page

### Testing Steps

1. **Login as Admin**
   ```
   Username: admin
   Password: password
   ```
   Navigate to User Management → Verify full access

2. **Login as Doctor**
   - Create a doctor account
   - Try to access User Management
   - Should see "Access Denied"

3. **Login as Nurse**
   - Create a nurse account
   - Try to access User Management
   - Should see "Access Denied"

---

## 📊 Current Implementation Status

### ✅ Completed

- [x] PermissionGate component created
- [x] rolePermissions.js with full permission set
- [x] Page-level access control in UserManagement
- [x] Create User button protected
- [x] View, Edit, Delete action buttons protected
- [x] Auth context integration
- [x] Helper functions (hasPermission, hasAnyPermission, etc.)

### 🚧 Pending

- [ ] Backend permission validation in PHP
- [ ] Audit logging system
- [ ] Role assignment validation (prevent self-demotion)
- [ ] Permission inheritance system
- [ ] Custom permission groups

---

## 🔄 How Authentication Works

### 1. Login Flow

```
User Login → login.php validates credentials → Creates session
→ Stores role code in $_SESSION['roles'] → Frontend retrieves via get-session.php
→ AuthProvider stores in context → Components check permissions
```

### 2. Session Structure

```php
// PHP Session
$_SESSION = [
    'adminID' => 1,
    'roles' => 5150  // Role code
];
```

### 3. Frontend Auth State

```javascript
// React Auth Context
auth = {
    adminID: 1,
    roles: [5150]  // Array with role code
}
```

### 4. Permission Check Flow

```
Component renders → PermissionGate checks auth.roles[0]
→ Calls hasPermission(roleCode, permission)
→ Looks up role in ROLE_PERMISSIONS
→ Checks if permission exists in role's permission array
→ Returns true/false → Renders or hides component
```

---

## 🐛 Troubleshooting

### Issue: Buttons Not Showing

**Problem**: Create User button or action buttons not visible

**Solutions**:
1. Check browser console for errors
2. Verify auth context has role code:
   ```javascript
   console.log('Auth:', auth);
   console.log('Role Code:', auth?.roles?.[0]);
   ```
3. Check if permission is in ROLE_PERMISSIONS mapping
4. Verify PermissionGate import is correct

### Issue: "Access Denied" for Admin

**Problem**: Admin user sees access denied message

**Solutions**:
1. Check session data:
   ```javascript
   // In browser console
   fetch('http://localhost/api/get-session.php', { credentials: 'include' })
       .then(r => r.json())
       .then(console.log);
   ```
2. Verify role code is 5150 (not string "5150")
3. Check AuthProvider is wrapping the app
4. Clear browser cache and localStorage

### Issue: Permission Changes Not Reflecting

**Problem**: Updated permissions in rolePermissions.js not working

**Solutions**:
1. Restart React dev server (Ctrl+C, then `npm run dev`)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check if importing from correct path
4. Verify no TypeScript/ESLint errors

---

## 📝 Adding New Permissions

### Step 1: Define Permission

Add to `rolePermissions.js`:

```javascript
export const PERMISSIONS = {
    // ... existing permissions
    
    // New feature
    INVENTORY_VIEW: 'inventory.view',
    INVENTORY_ADD: 'inventory.add',
    INVENTORY_EDIT: 'inventory.edit',
    INVENTORY_DELETE: 'inventory.delete',
};
```

### Step 2: Assign to Roles

```javascript
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        // ... existing permissions
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_ADD,
        PERMISSIONS.INVENTORY_EDIT,
        PERMISSIONS.INVENTORY_DELETE,
    ],
    [ROLES.STAFF]: [
        // ... existing permissions
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_ADD,
    ],
    // ... other roles
};
```

### Step 3: Use in Components

```jsx
import { PERMISSIONS } from '../utils/rolePermissions';
import PermissionGate from '../components/PermissionGate';

<PermissionGate permission={PERMISSIONS.INVENTORY_ADD}>
    <button>Add Inventory Item</button>
</PermissionGate>
```

---

## 🎯 Next Steps

1. **Implement Backend Validation**
   - Add permission checks to all PHP endpoints
   - Create middleware for permission validation
   - Return 403 Forbidden for unauthorized requests

2. **Add Audit Logging**
   - Create audit_logs table
   - Log all CRUD operations
   - Track who did what and when

3. **Enhance Error Handling**
   - Better error messages for permission denials
   - Toast notifications for unauthorized actions
   - Redirect to appropriate pages

4. **Add Permission UI**
   - Visual permission matrix in admin panel
   - Role editor interface
   - Permission testing tool

---

## 📚 Additional Resources

- **AuthProvider.jsx**: `src/context/AuthProvider.jsx`
- **PermissionGate.jsx**: `src/components/PermissionGate.jsx`
- **rolePermissions.js**: `src/utils/rolePermissions.js`
- **UserManagement.jsx**: `src/modules/admin/pages/UserManagement.jsx`
- **Login Guide**: `LOGIN_GUIDE.md`
- **Role Permissions Guide**: `ROLE_PERMISSIONS_GUIDE.md`

---

## ✅ Summary

The RBAC system is now fully implemented with:

- ✅ Role-based permission checking
- ✅ Component-level access control via PermissionGate
- ✅ Page-level access restrictions
- ✅ Helper functions for permission checks
- ✅ Integration with authentication system
- ✅ UI protection for Create/Edit/Delete actions

**Only Admin users (role code 5150) can access User Management features.**

All other roles (Doctor, Nurse, Staff) will see "Access Denied" when attempting to access User Management.

---

*Last Updated: October 21, 2025*
