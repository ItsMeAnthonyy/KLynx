# Backend Validation & Page Protection Guide

## Overview

This guide explains how to implement backend permission validation in PHP and page-level protection in React to ensure comprehensive security for the KLynx Health Center application.

---

## 🔐 Security Layers

### 1. Frontend Protection (UI/UX Layer)
- **Sidebar** - Hides navigation links
- **PermissionGate** - Hides UI components
- **Page-level checks** - Shows "Access Denied"

⚠️ **NOT SECURE ALONE** - Users can bypass by:
- Typing URLs directly in browser
- Using browser developer tools
- Making direct API calls with tools like Postman

### 2. Backend Protection (Security Layer)
- **PHP Middleware** - Validates permissions on server
- **Database validation** - Checks role before queries
- **HTTP 403 Forbidden** - Blocks unauthorized requests

✅ **THIS IS THE REAL SECURITY**

---

## 🛠️ Backend Implementation

### Step 1: PermissionMiddleware.php

Location: `backend/middleware/PermissionMiddleware.php`

This PHP class provides centralized permission checking for all API endpoints.

#### Key Features:

1. **Role Permission Mapping** - Matches frontend exactly
2. **Authentication Check** - Verifies user is logged in
3. **Permission Validation** - Checks specific permissions
4. **Patient Block** - Prevents patients from logging in
5. **Audit Logging** - Tracks all access attempts

#### Basic Usage:

```php
<?php
require_once '../middleware/PermissionMiddleware.php';

// Check if user is authenticated
PermissionMiddleware::requireAuth();

// Check specific permission
PermissionMiddleware::requirePermission('user_management.view');

// Check admin only
PermissionMiddleware::requireAdmin();

// Check any of multiple permissions
PermissionMiddleware::requireAnyPermission([
    'user_management.view',
    'user_management.edit'
]);

// Check all of multiple permissions
PermissionMiddleware::requireAllPermissions([
    'user_management.edit',
    'user_management.delete'
]);
```

---

### Step 2: Protect Your API Endpoints

#### Example: User Management API

**File:** `backend/api/user-management-protected.php`

```php
<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_start();
require_once '../middleware/PermissionMiddleware.php';

// ============================================================================
// PERMISSION CHECK - This is the security layer
// ============================================================================

try {
    PermissionMiddleware::requireAuth();
    
    // Check permission based on HTTP method
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            PermissionMiddleware::requirePermission('user_management.view');
            break;
        case 'POST':
            PermissionMiddleware::requirePermission('user_management.add');
            break;
        case 'PUT':
            PermissionMiddleware::requirePermission('user_management.edit');
            break;
        case 'DELETE':
            PermissionMiddleware::requirePermission('user_management.delete');
            break;
    }
    
    // Log the access
    PermissionMiddleware::logAccess('/api/user-management', true);
    
} catch (Exception $e) {
    PermissionMiddleware::logAccess('/api/user-management', false);
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Access denied'
    ]);
    exit;
}

// Your API logic here (safe - permissions already checked)
```

#### Permission by Feature:

| Feature | GET | POST | PUT | DELETE |
|---------|-----|------|-----|--------|
| **User Management** | `user_management.view` | `user_management.add` | `user_management.edit` | `user_management.delete` |
| **ICD-10** | `icd.view` | `icd.add` | `icd.edit` | `icd.delete` |
| **Nurse Notes** | `nurse_notes.view` | `nurse_notes.add` | `nurse_notes.edit` | `nurse_notes.delete` |
| **Health Records** | `health_records.view` | `health_records.add` | `health_records.edit` | `health_records.delete` |
| **Appointments** | `appointments.view` | `appointments.add` | `appointments.edit` | `appointments.delete` |

---

### Step 3: Update Existing PHP Files

#### Find all your existing API endpoints:
```
backend/api/
  ├── create-user.php (NEEDS PROTECTION)
  ├── login.php (PUBLIC - No protection needed)
  ├── get-session.php (PUBLIC - But validates session)
  ├── appointments.php (NEEDS PROTECTION)
  ├── health-records.php (NEEDS PROTECTION)
  └── ... other files
```

#### Add permission check to each protected endpoint:

**Before (Insecure):**
```php
<?php
session_start();
require_once 'database.php';

// Anyone can access this!
$stmt = $pdo->query("SELECT * FROM users");
$users = $stmt->fetchAll();
echo json_encode($users);
```

**After (Secure):**
```php
<?php
session_start();
require_once '../middleware/PermissionMiddleware.php';
require_once 'database.php';

// Check permission first!
try {
    PermissionMiddleware::requirePermission('user_management.view');
} catch (Exception $e) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Now safe to proceed
$stmt = $pdo->query("SELECT * FROM users");
$users = $stmt->fetchAll();
echo json_encode($users);
```

---

## 🎨 Frontend Page Protection

### Step 1: ProtectedRoute Component

Location: `src/components/ProtectedRoute.jsx`

This component wraps pages to check permissions before rendering.

#### Usage in Routes:

**File:** `src/App.jsx`

```jsx
import ProtectedRoute from './components/ProtectedRoute';
import { PERMISSIONS } from './utils/rolePermissions';

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route 
                path="/UserManagement" 
                element={
                    <ProtectedRoute permission={PERMISSIONS.USER_MANAGEMENT_VIEW}>
                        <UserManagement />
                    </ProtectedRoute>
                }
            />
            
            <Route 
                path="/ICDManager2" 
                element={
                    <ProtectedRoute permission={PERMISSIONS.ICD_VIEW}>
                        <ICDManager />
                    </ProtectedRoute>
                }
            />
            
            <Route 
                path="/NurseNotes" 
                element={
                    <ProtectedRoute permission={PERMISSIONS.NURSE_NOTES_VIEW}>
                        <NurseNotes />
                    </ProtectedRoute>
                }
            />
            
            {/* Multiple permissions (ANY) */}
            <Route 
                path="/HealthRecords" 
                element={
                    <ProtectedRoute 
                        permission={[
                            PERMISSIONS.HEALTH_RECORDS_VIEW,
                            PERMISSIONS.HEALTH_RECORDS_ADD
                        ]}
                    >
                        <HealthRecords />
                    </ProtectedRoute>
                }
            />
            
            {/* Multiple permissions (ALL) */}
            <Route 
                path="/AdminPanel" 
                element={
                    <ProtectedRoute 
                        permission={[
                            PERMISSIONS.USER_MANAGEMENT_VIEW,
                            PERMISSIONS.SETTINGS_EDIT
                        ]}
                        requireAll={true}
                    >
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
```

---

### Step 2: Component-Level Protection

Add permission checks inside components for additional security:

**File:** `src/modules/admin/pages/UserManagement.jsx`

```jsx
import useAuth from '../../../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../../utils/rolePermissions';
import Unauthorized from '../../../components/Unauthorized';

const UserManagement = () => {
    const { auth } = useAuth();
    const userRoleCode = auth?.roles?.[0];
    
    // Check permission at component level
    const hasAccess = hasPermission(userRoleCode, PERMISSIONS.USER_MANAGEMENT_VIEW);
    
    if (!hasAccess) {
        return (
            <Unauthorized 
                title="Access Denied"
                message="You do not have permission to access User Management."
            />
        );
    }
    
    // Regular component rendering
    return (
        <div>
            <h1>User Management</h1>
            {/* ... component content ... */}
        </div>
    );
};
```

---

## 🧪 Testing Security

### Backend Testing

#### Test 1: Direct API Call (Without Auth)
```bash
# Should return 401 Unauthorized
curl http://localhost/api/user-management.php
```

#### Test 2: Direct API Call (With Auth but Wrong Role)
```bash
# Login as Doctor first, then:
curl http://localhost/api/user-management.php \
  --cookie "PHPSESSID=your_session_id"

# Should return 403 Forbidden
```

#### Test 3: Direct API Call (With Correct Role)
```bash
# Login as Admin first, then:
curl http://localhost/api/user-management.php \
  --cookie "PHPSESSID=your_session_id"

# Should return 200 OK with data
```

### Frontend Testing

#### Test 1: Direct URL Access
1. Login as Doctor
2. Type `/UserManagement` in browser
3. Should see "Access Denied" page
4. Check Network tab - no API call should be made

#### Test 2: Sidebar Navigation
1. Login as Nurse
2. Sidebar should NOT show "ICD-10" link
3. If user manually navigates to `/ICDManager2`:
   - Should see "Access Denied" page
   - No data should be loaded

#### Test 3: Button Visibility
1. Login as Staff
2. Visit any page
3. Create/Edit/Delete buttons should be hidden
4. Check DOM - buttons should not exist (not just hidden with CSS)

---

## 📊 Security Checklist

### Backend

- [ ] PermissionMiddleware.php created in `backend/middleware/`
- [ ] All API endpoints include permission checks
- [ ] User Management API requires `user_management.*` permissions
- [ ] ICD-10 API requires `icd.*` permissions (Admin only)
- [ ] Nurse Notes API requires `nurse_notes.*` permissions (Admin & Nurse)
- [ ] Health Records API requires `health_records.*` permissions
- [ ] Appointments API requires `appointments.*` permissions
- [ ] Settings API requires `settings.*` permissions
- [ ] Reports API requires `reports.view` permission
- [ ] Patient login is blocked (role 2001 = 403)
- [ ] All endpoints return 403 for unauthorized access
- [ ] Audit logging is enabled
- [ ] CORS headers properly configured

### Frontend

- [ ] ProtectedRoute component created
- [ ] All protected routes wrapped with ProtectedRoute
- [ ] UserManagement page checks permissions
- [ ] ICDManager page checks permissions
- [ ] NurseNotes page checks permissions
- [ ] HealthRecords pages check permissions
- [ ] Unauthorized component styled properly
- [ ] Sidebar hides unauthorized links
- [ ] PermissionGate hides unauthorized buttons
- [ ] No API calls made for unauthorized actions

---

## 🔄 Update Workflow

### When Adding New Protected Feature:

#### 1. Add Permission to rolePermissions.js
```javascript
export const PERMISSIONS = {
    // ... existing permissions
    NEW_FEATURE_VIEW: 'new_feature.view',
    NEW_FEATURE_ADD: 'new_feature.add',
    NEW_FEATURE_EDIT: 'new_feature.edit',
    NEW_FEATURE_DELETE: 'new_feature.delete',
};
```

#### 2. Add Permission to PHP Middleware
```php
// In PermissionMiddleware.php
private static $rolePermissions = [
    5150 => [ // Admin
        // ... existing permissions
        'new_feature.view',
        'new_feature.add',
        'new_feature.edit',
        'new_feature.delete',
    ],
    // ... other roles
];
```

#### 3. Create Protected API Endpoint
```php
<?php
session_start();
require_once '../middleware/PermissionMiddleware.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        PermissionMiddleware::requirePermission('new_feature.view');
        break;
    case 'POST':
        PermissionMiddleware::requirePermission('new_feature.add');
        break;
    // ... other methods
}

// Your API logic here
```

#### 4. Protect Frontend Route
```jsx
<Route 
    path="/NewFeature" 
    element={
        <ProtectedRoute permission={PERMISSIONS.NEW_FEATURE_VIEW}>
            <NewFeature />
        </ProtectedRoute>
    }
/>
```

#### 5. Add Component-Level Check
```jsx
const NewFeature = () => {
    const { auth } = useAuth();
    const hasAccess = hasPermission(auth?.roles?.[0], PERMISSIONS.NEW_FEATURE_VIEW);
    
    if (!hasAccess) {
        return <Unauthorized />;
    }
    
    // Component content
};
```

---

## ⚠️ Common Security Mistakes

### ❌ Mistake 1: Only Frontend Protection
```javascript
// BAD - Only hiding button
{hasPermission(role, 'users.delete') && (
    <button onClick={deleteUser}>Delete</button>
)}

// User can still call API directly!
```

### ✅ Solution: Backend + Frontend
```javascript
// GOOD - Frontend hides button
{hasPermission(role, 'users.delete') && (
    <button onClick={deleteUser}>Delete</button>
)}
```

```php
// GOOD - Backend checks permission
PermissionMiddleware::requirePermission('user_management.delete');
// Now it's secure!
```

---

### ❌ Mistake 2: Trusting Client Data
```php
// BAD - Trusting role from request
$role = $_POST['role'];
if ($role === 'admin') {
    // Allow action
}
// User can send role='admin' even if they're not!
```

### ✅ Solution: Check Session
```php
// GOOD - Check session role
if ($_SESSION['roles'] === 5150) {
    // Allow action
}
// Or better: Use middleware
PermissionMiddleware::requireAdmin();
```

---

### ❌ Mistake 3: No Permission Check on Read
```php
// BAD - No permission check
$stmt = $pdo->query("SELECT * FROM sensitive_data");
// Anyone can access!
```

### ✅ Solution: Check Even for Reads
```php
// GOOD - Check permission
PermissionMiddleware::requirePermission('sensitive_data.view');
$stmt = $pdo->query("SELECT * FROM sensitive_data");
```

---

## 📝 Quick Reference

### PHP Permission Check
```php
// Authentication only
PermissionMiddleware::requireAuth();

// Specific permission
PermissionMiddleware::requirePermission('feature.action');

// Admin only
PermissionMiddleware::requireAdmin();

// Any of multiple permissions
PermissionMiddleware::requireAnyPermission([
    'feature.view',
    'feature.edit'
]);

// All of multiple permissions
PermissionMiddleware::requireAllPermissions([
    'feature.edit',
    'feature.delete'
]);
```

### React Permission Check
```jsx
// Route protection
<ProtectedRoute permission="feature.view">
    <Component />
</ProtectedRoute>

// Component-level
const hasAccess = hasPermission(userRole, PERMISSIONS.FEATURE_VIEW);
if (!hasAccess) return <Unauthorized />;

// UI element hiding
<PermissionGate permission={PERMISSIONS.FEATURE_ADD}>
    <button>Add</button>
</PermissionGate>
```

---

## ✅ Summary

### Security Layers (All Required):

1. **Backend Validation** (Primary Security)
   - PHP middleware checks permissions
   - Returns 403 for unauthorized requests
   - Validates on every API call

2. **Frontend Route Protection** (UX Layer)
   - ProtectedRoute wraps pages
   - Shows "Access Denied" for unauthorized users
   - Prevents unnecessary API calls

3. **Frontend Component Protection** (Additional Layer)
   - Component-level permission checks
   - Hides unauthorized UI elements
   - Clean user experience

### Implementation Priority:

1. ✅ Backend protection (MUST HAVE)
2. ✅ Frontend route protection (SHOULD HAVE)
3. ✅ Frontend component protection (NICE TO HAVE)
4. ✅ Sidebar filtering (NICE TO HAVE)

**Remember:** Frontend protection is for UX. Backend protection is for security. Both are needed!

---

*Last Updated: October 22, 2025*
*Status: Backend & Frontend Protection Implemented*
