# Security Implementation Checklist

## Overview

This checklist ensures all security layers are properly implemented for the KLynx Health Center application.

---

## ✅ Backend Security (PHP)

### Core Middleware

- [x] **PermissionMiddleware.php** created in `backend/middleware/`
  - Location: `c:\Users\Rie\KLynx\backend\middleware\PermissionMiddleware.php`
  - Contains role permission mapping
  - Matches frontend rolePermissions.js exactly
  - Includes audit logging

### Protected API Endpoints

- [ ] **create-user.php** - Add permission checks
  ```php
  // GET: requirePermission('user_management.view')
  // POST: requirePermission('user_management.add')
  // PUT: requirePermission('user_management.edit')
  // DELETE: requirePermission('user_management.delete')
  ```

- [ ] **appointments.php** - Add permission checks
  ```php
  // GET: requirePermission('appointments.view')
  // POST: requirePermission('appointments.add')
  // PUT: requirePermission('appointments.edit')
  // DELETE: requirePermission('appointments.delete')
  ```

- [ ] **icd-manager.php** - Add permission checks (ADMIN ONLY)
  ```php
  // All methods: requirePermission('icd.view/add/edit/delete')
  ```

- [ ] **nurse-notes.php** - Add permission checks (ADMIN & NURSE)
  ```php
  // All methods: requirePermission('nurse_notes.view/add/edit/delete')
  ```

- [ ] **health-records.php** - Add permission checks
  ```php
  // All methods: requirePermission('health_records.view/add/edit/delete')
  ```

- [ ] **notifications.php** - Add permission checks
  ```php
  // All methods: requirePermission('notifications.view/add/edit/delete')
  ```

- [ ] **settings.php** - Add permission checks
  ```php
  // GET: requirePermission('settings.view')
  // POST/PUT: requirePermission('settings.edit')
  ```

- [ ] **reports.php** - Add permission checks
  ```php
  // GET: requirePermission('reports.view')
  ```

### Example Protected Endpoints Created

- [x] **user-management-protected.php** - Example implementation
- [x] **icd-manager-protected.php** - Example implementation
- [x] **nurse-notes-protected.php** - Example implementation
- [x] **health-records-protected.php** - Example implementation

---

## ✅ Frontend Security (React)

### Core Components

- [x] **ProtectedRoute.jsx** created
  - Location: `c:\Users\Rie\KLynx\src\components\ProtectedRoute.jsx`
  - Wraps routes to check permissions
  - Shows Unauthorized page if denied

- [x] **Unauthorized.jsx** updated
  - Location: `c:\Users\Rie\KLynx\src\components\Unauthorized.jsx`
  - Enhanced with better styling
  - Shows user info and error code
  - Provides navigation options

- [x] **PermissionGate.jsx** exists
  - Location: `c:\Users\Rie\KLynx\src\components\PermissionGate.jsx`
  - Hides UI elements based on permissions

### Route Protection

Update `src/App.jsx` to wrap routes:

- [ ] **/UserManagement** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.USER_MANAGEMENT_VIEW}>
      <UserManagement />
  </ProtectedRoute>
  ```

- [ ] **/ICDManager2** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.ICD_VIEW}>
      <ICDManager />
  </ProtectedRoute>
  ```

- [ ] **/NurseNotes** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.NURSE_NOTES_VIEW}>
      <NurseNotes />
  </ProtectedRoute>
  ```

- [ ] **/Notifications** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.NOTIFICATIONS_VIEW}>
      <Notifications />
  </ProtectedRoute>
  ```

- [ ] **/ConsultationDetail** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.HEALTH_RECORDS_VIEW}>
      <ConsultationDetail />
  </ProtectedRoute>
  ```

- [ ] **/Prescription** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.PRESCRIPTIONS_VIEW}>
      <Prescription />
  </ProtectedRoute>
  ```

- [ ] **/Prenatal** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.PRENATAL_VIEW}>
      <Prenatal />
  </ProtectedRoute>
  ```

- [ ] **/Immunization** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.IMMUNIZATION_VIEW}>
      <Immunization />
  </ProtectedRoute>
  ```

- [ ] **/AnimalBite** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.ANIMAL_BITE_VIEW}>
      <AnimalBite />
  </ProtectedRoute>
  ```

- [ ] **/Settings** - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.SETTINGS_VIEW}>
      <Settings />
  </ProtectedRoute>
  ```

- [ ] **/DiseaseReport** (Reports) - Wrap with ProtectedRoute
  ```jsx
  <ProtectedRoute permission={PERMISSIONS.REPORTS_VIEW}>
      <DiseaseReport />
  </ProtectedRoute>
  ```

### Page-Level Protection

Add component-level checks (redundant but safer):

- [x] **UserManagement.jsx** - Has component-level check
- [ ] **ICDManager2.jsx** - Add component-level check
- [ ] **NurseNotes.jsx** - Add component-level check
- [ ] **Notifications.jsx** - Add component-level check
- [ ] **ConsultationDetail.jsx** - Add component-level check
- [ ] **Settings.jsx** - Add component-level check

---

## ✅ Permission System

### Role Permissions

- [x] **rolePermissions.js** updated
  - Admin: Full access
  - Doctor: NO User Management, NO ICD-10, NO Nurse Notes
  - Nurse: NO User Management, NO ICD-10
  - Staff: Limited (Appointments, Settings, Reports only)
  - Patient: NO ACCESS (cannot login)

### Sidebar Filtering

- [x] **Sidebar.jsx** implements role-based filtering
  - File Maintenance hidden for unauthorized users
  - User Management hidden for non-admins
  - ICD-10 hidden for non-admins
  - Nurse Notes hidden for unauthorized users

---

## ✅ Testing

### Backend Testing

- [ ] Test User Management API as Doctor (should fail)
- [ ] Test User Management API as Nurse (should fail)
- [ ] Test User Management API as Staff (should fail)
- [ ] Test User Management API as Admin (should succeed)
- [ ] Test ICD-10 API as Doctor (should fail)
- [ ] Test ICD-10 API as Admin (should succeed)
- [ ] Test Nurse Notes API as Doctor (should fail)
- [ ] Test Nurse Notes API as Nurse (should succeed)
- [ ] Test Patient login attempt (should be blocked)

### Frontend Testing

- [ ] Login as Doctor → Navigate to `/UserManagement` (should see Access Denied)
- [ ] Login as Nurse → Navigate to `/ICDManager2` (should see Access Denied)
- [ ] Login as Staff → Navigate to `/NurseNotes` (should see Access Denied)
- [ ] Login as Admin → Navigate to all pages (should have access)
- [ ] Check sidebar visibility for each role
- [ ] Check button visibility for each role
- [ ] Verify no API calls made for unauthorized actions

---

## 🔧 Implementation Steps

### Step 1: Backend Setup (Priority: HIGH)

1. Copy `PermissionMiddleware.php` to your backend folder
2. Update existing API files one by one:
   - Add `require_once '../middleware/PermissionMiddleware.php';`
   - Add permission checks at the top
   - Test each endpoint after updating

### Step 2: Frontend Route Protection (Priority: MEDIUM)

1. Import `ProtectedRoute` in `App.jsx`
2. Wrap each protected route
3. Test navigation after each update

### Step 3: Component-Level Protection (Priority: LOW)

1. Add permission checks inside each component
2. Return `<Unauthorized />` if no access
3. Test each component

### Step 4: Testing (Priority: HIGH)

1. Create test accounts for each role
2. Test all scenarios in checklist
3. Document any issues
4. Fix and re-test

---

## 📝 Quick Copy-Paste Code

### For PHP Endpoints:

```php
<?php
// Add at the top of every protected endpoint
session_start();
require_once '../middleware/PermissionMiddleware.php';

try {
    PermissionMiddleware::requireAuth();
    
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            PermissionMiddleware::requirePermission('feature.view');
            break;
        case 'POST':
            PermissionMiddleware::requirePermission('feature.add');
            break;
        case 'PUT':
            PermissionMiddleware::requirePermission('feature.edit');
            break;
        case 'DELETE':
            PermissionMiddleware::requirePermission('feature.delete');
            break;
    }
    
    PermissionMiddleware::logAccess('/api/endpoint-name', true);
    
} catch (Exception $e) {
    PermissionMiddleware::logAccess('/api/endpoint-name', false);
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Access denied']);
    exit;
}

// Your API logic here (safe - permissions already checked)
```

### For React Components:

```jsx
import useAuth from '../../../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../../utils/rolePermissions';
import Unauthorized from '../../../components/Unauthorized';

const YourComponent = () => {
    const { auth } = useAuth();
    const userRoleCode = auth?.roles?.[0];
    const hasAccess = hasPermission(userRoleCode, PERMISSIONS.FEATURE_VIEW);
    
    if (!hasAccess) {
        return (
            <Unauthorized 
                title="Access Denied"
                message="You do not have permission to access this feature."
            />
        );
    }
    
    // Component content
    return <div>Your protected content</div>;
};
```

### For React Routes:

```jsx
import ProtectedRoute from './components/ProtectedRoute';
import { PERMISSIONS } from './utils/rolePermissions';

<Route 
    path="/YourFeature" 
    element={
        <ProtectedRoute permission={PERMISSIONS.FEATURE_VIEW}>
            <YourFeature />
        </ProtectedRoute>
    }
/>
```

---

## 🎯 Success Criteria

- [x] PermissionMiddleware.php created and documented
- [ ] All API endpoints have permission checks
- [ ] All protected routes wrapped with ProtectedRoute
- [ ] All protected pages have component-level checks
- [ ] Unauthorized page displays properly
- [ ] Sidebar hides unauthorized items
- [ ] All tests pass
- [ ] Audit logging works
- [ ] Patient login is blocked
- [ ] 403 errors return for unauthorized requests

---

## 📚 Documentation

- [x] **BACKEND_VALIDATION_GUIDE.md** - Complete backend security guide
- [x] **RBAC_IMPLEMENTATION_GUIDE.md** - Complete RBAC guide
- [x] **SIDEBAR_RBAC_GUIDE.md** - Sidebar filtering guide
- [x] **UPDATED_ROLE_PERMISSIONS_SUMMARY.md** - Updated permissions
- [x] **SECURITY_CHECKLIST.md** - This file

---

## ⚠️ Security Reminders

1. **NEVER** trust client-side data
2. **ALWAYS** validate permissions on the server
3. **NEVER** rely only on frontend hiding
4. **ALWAYS** check session role, not request data
5. **NEVER** assume user won't try to bypass UI
6. **ALWAYS** test with different roles
7. **NEVER** expose sensitive data in error messages
8. **ALWAYS** log access attempts for audit trail

---

*Last Updated: October 22, 2025*
*Status: Implementation In Progress*
