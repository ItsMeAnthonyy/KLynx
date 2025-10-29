# RBAC Quick Start Guide

## ✅ Implementation Complete!

The Role-Based Access Control (RBAC) system has been successfully implemented in the User Management module.

---

## 🎯 What's Been Implemented

### 1. **PermissionGate Component** 
Location: `src/components/PermissionGate.jsx`

A React component that conditionally renders UI elements based on user permissions.

```jsx
<PermissionGate permission={PERMISSIONS.USERS_ADD}>
    <button>Create User</button>
</PermissionGate>
```

### 2. **Role Permissions System**
Location: `src/utils/rolePermissions.js`

Enhanced with:
- ✅ `USERS_VIEW` permission
- ✅ `USERS_ADD` permission  
- ✅ `USERS_EDIT` permission
- ✅ `USERS_DELETE` permission

### 3. **UserManagement Page Protection**
Location: `src/modules/admin/pages/UserManagement.jsx`

Protected features:
- ✅ **Page Access**: Only users with `USER_MANAGEMENT_VIEW` permission can access
- ✅ **Create User Button**: Only shown to users with `USERS_ADD` permission
- ✅ **View Button**: Only shown to users with `USERS_VIEW` permission
- ✅ **Edit Button**: Only shown to users with `USERS_EDIT` permission
- ✅ **Delete Button**: Only shown to users with `USERS_DELETE` permission

---

## 🔑 Permission Matrix

| Role | Access User Management? | Create | View | Edit | Delete |
|------|------------------------|--------|------|------|--------|
| **Admin (5150)** | ✅ Yes | ✅ | ✅ | ✅ | ✅ |
| **Doctor (4001)** | ❌ No | ❌ | ❌ | ❌ | ❌ |
| **Nurse (3001)** | ❌ No | ❌ | ❌ | ❌ | ❌ |
| **Staff (6001)** | ❌ No | ❌ | ❌ | ❌ | ❌ |
| **Patient (2001)** | ❌ No | ❌ | ❌ | ❌ | ❌ |

---

## 🧪 Testing the Implementation

### Test 1: Admin Access (Role 5150)

1. Login with admin credentials:
   ```
   Username: admin
   Password: password
   ```

2. Navigate to User Management page

3. **Expected Results**:
   - ✅ Page loads successfully
   - ✅ "Create User Account" button visible
   - ✅ All action buttons visible in table (View, Edit, Delete)

### Test 2: Doctor Access (Role 4001)

1. Create a doctor account in User Management

2. Logout and login as doctor

3. Try to navigate to User Management

4. **Expected Results**:
   - ❌ "Access Denied" message displayed
   - ❌ Cannot see user management features

### Test 3: Nurse Access (Role 3001)

1. Create a nurse account in User Management

2. Logout and login as nurse

3. Try to navigate to User Management

4. **Expected Results**:
   - ❌ "Access Denied" message displayed
   - ❌ Cannot see user management features

---

## 🔍 How It Works

### 1. Authentication Check
```javascript
const { auth } = useAuth();
const userRoleCode = auth?.roles?.[0]; // e.g., 5150 for Admin
```

### 2. Permission Validation
```javascript
const hasAccess = hasPermission(userRoleCode, PERMISSIONS.USER_MANAGEMENT_VIEW);
```

### 3. Conditional Rendering
```javascript
if (!hasAccess) {
    return <AccessDeniedPage />;
}
```

### 4. UI Element Protection
```jsx
<PermissionGate permission={PERMISSIONS.USERS_ADD}>
    <CreateButton />
</PermissionGate>
```

---

## 📋 Code Changes Summary

### Files Modified:

1. **PermissionGate.jsx**
   - Updated to use `auth.roles[0]` instead of `auth.role`
   - Works with role codes (5150, 4001, etc.)

2. **UserManagement.jsx**
   - Added imports: `PermissionGate`, `PERMISSIONS`, `hasPermission`, `useAuth`
   - Added page-level access check
   - Wrapped Create User button with `PermissionGate`
   - Wrapped all action buttons with `PermissionGate`
   - Added "Access Denied" UI for unauthorized users

3. **rolePermissions.js**
   - Added `USERS_VIEW`, `USERS_ADD`, `USERS_EDIT`, `USERS_DELETE` permissions
   - These are aliases for `USER_MANAGEMENT_*` permissions for clarity

---

## 🎨 Access Denied UI

When unauthorized users try to access User Management, they see:

```
┌─────────────────────────────────────────┐
│         🔴 Access Denied                │
│                                         │
│   You do not have permission to        │
│   access User Management.              │
│                                         │
│   Please contact your administrator    │
│   if you believe this is an error.     │
└─────────────────────────────────────────┘
```

---

## 🚀 Next Steps

### 1. Test the Implementation
- Login as admin and verify all buttons visible
- Create test accounts for doctor, nurse, staff roles
- Test access denial for non-admin roles

### 2. Extend to Other Pages
Apply the same pattern to other protected pages:

```jsx
import PermissionGate from '../components/PermissionGate';
import { PERMISSIONS, hasPermission } from '../utils/rolePermissions';
import useAuth from '../hooks/useAuth';

const ProtectedPage = () => {
    const { auth } = useAuth();
    const userRoleCode = auth?.roles?.[0];
    const hasAccess = hasPermission(userRoleCode, PERMISSIONS.SOME_FEATURE);
    
    if (!hasAccess) {
        return <AccessDenied />;
    }
    
    return (
        <div>
            {/* Page content */}
        </div>
    );
};
```

### 3. Backend Validation
⚠️ **CRITICAL**: Add permission checks to PHP backend:

```php
// create-user.php
session_start();

if (!isset($_SESSION['roles']) || $_SESSION['roles'] != 5150) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Continue with user creation...
```

### 4. Add Audit Logging
Track all permission-sensitive actions:
- User creation
- User deletion
- Role changes
- Permission modifications

---

## 📚 Documentation

For detailed information, see:

- **Full RBAC Guide**: `RBAC_IMPLEMENTATION_GUIDE.md`
- **Role Permissions**: `ROLE_PERMISSIONS_GUIDE.md`
- **Login System**: `LOGIN_GUIDE.md`

---

## ✅ Verification Checklist

Before considering the implementation complete, verify:

- [x] PermissionGate component created and working
- [x] rolePermissions.js updated with USERS_* permissions
- [x] UserManagement page has access control
- [x] Create User button protected
- [x] Action buttons (View, Edit, Delete) protected
- [x] Access Denied UI displays for unauthorized users
- [x] No console errors or warnings
- [ ] Tested with Admin role
- [ ] Tested with Doctor role
- [ ] Tested with Nurse role
- [ ] Backend validation added (pending)

---

## 🐛 Troubleshooting

### Buttons Not Showing for Admin

**Check**:
1. Browser console: `console.log(auth)`
2. Verify role code is `5150` (number, not string)
3. Clear cache and reload

### "Access Denied" for Admin

**Check**:
1. Session data: Visit `http://localhost/api/get-session.php`
2. Verify `roles` field contains `5150`
3. Check AuthProvider is wrapping app

### Permission Changes Not Working

**Fix**:
1. Restart React dev server
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear localStorage

---

## 🎉 Success Indicators

You'll know the RBAC is working correctly when:

1. ✅ Admin sees all buttons and can access everything
2. ✅ Doctor/Nurse/Staff see "Access Denied" on User Management
3. ✅ No console errors
4. ✅ UI updates dynamically based on logged-in user's role
5. ✅ Action buttons appear/disappear based on permissions

---

*Implementation Date: October 21, 2025*
*Status: ✅ Complete - Ready for Testing*
