# Sidebar Role-Based Access Control Guide

## Overview

The sidebar now implements role-based access control (RBAC) that dynamically shows or hides menu items based on the user's role and permissions. This ensures users only see navigation options they have access to.

---

## 🎯 Implementation Summary

### What Was Changed

1. **Added Permission Checks** - Each menu item now checks if the user has the required permission
2. **Section-Level Filtering** - Entire sections (File Maintenance, Patient Records, etc.) are hidden if user has no access
3. **Granular Control** - Individual links within sections are shown/hidden based on specific permissions
4. **Dynamic Rendering** - Sidebar adapts in real-time based on user's role

### Files Modified

- **`src/components/Sidebar.jsx`** - Updated with permission checks

---

## 📋 Permission Mapping

### Sidebar Structure

```
├── Main
│   ├── Dashboard (Always visible)
│   ├── GeoMap (Always visible)
│   └── Calendar (Always visible)
├── File Maintenance
│   ├── ICD-10 (ICD_VIEW)
│   ├── Nurse Notes (NURSE_NOTES_VIEW)
│   ├── User Management (USER_MANAGEMENT_VIEW)
│   └── Notifications (NOTIFICATIONS_VIEW)
├── Patient Records
│   ├── Patient Consultation (HEALTH_RECORDS_VIEW)
│   │   ├── Patient's Consultation (CONSULTATIONS_VIEW)
│   │   ├── Doctor's Prescription (PRESCRIPTIONS_VIEW)
│   │   └── Doctor's Note (HEALTH_RECORDS_VIEW)
│   ├── Maternal Care (HEALTH_RECORDS_VIEW)
│   │   └── Prenatal (PRENATAL_VIEW)
│   ├── Immunization Records (IMMUNIZATION_VIEW)
│   └── Animal Bite Incident Records (ANIMAL_BITE_VIEW)
├── Accounts (HEALTH_RECORDS_VIEW)
│   ├── Staff
│   ├── Doctors
│   ├── Nurse
│   └── Patients
├── Reports (REPORTS_VIEW)
│   ├── Patient Health Record
│   ├── Medical Report
│   ├── Animal Bite Incident Report
│   └── Maternal Care Report
└── Logout (Always visible)
```

---

## 🔐 Role-Based Sidebar Views

### Admin (Role Code: 5150)

**Full Access** - Sees all menu items

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
   ✅ Patient Consultation
      ✅ Patient's Consultation
      ✅ Doctor's Prescription
      ✅ Doctor's Note
   ✅ Maternal Care
      ✅ Prenatal
   ✅ Immunization Records
   ✅ Animal Bite Incident Records

✅ Accounts
   ✅ Staff
   ✅ Doctors
   ✅ Nurse
   ✅ Patients

✅ Reports
   ✅ Patient Health Record
   ✅ Medical Report
   ✅ Animal Bite Incident Report
   ✅ Maternal Care Report

✅ Logout
```

### Doctor (Role Code: 4001)

**Limited Access** - NO File Maintenance, NO User Management

```
✅ Main
   ✅ Dashboard
   ✅ GeoMap
   ✅ Calendar

❌ File Maintenance (Hidden - No access to any items)

✅ Patient Records
   ✅ Patient Consultation
      ✅ Patient's Consultation
      ✅ Doctor's Prescription
      ✅ Doctor's Note
   ✅ Maternal Care
      ✅ Prenatal
   ✅ Immunization Records
   ✅ Animal Bite Incident Records

✅ Accounts
   ✅ Staff
   ✅ Doctors
   ✅ Nurse
   ✅ Patients

✅ Reports
   ✅ Patient Health Record
   ✅ Medical Report
   ✅ Animal Bite Incident Report
   ✅ Maternal Care Report

✅ Logout
```

### Nurse (Role Code: 3001)

**Limited Access** - NO ICD-10, NO User Management

```
✅ Main
   ✅ Dashboard
   ✅ GeoMap
   ✅ Calendar

✅ File Maintenance
   ❌ ICD-10 (Hidden)
   ✅ Nurse Notes
   ❌ User Management (Hidden)
   ✅ Notifications

✅ Patient Records
   ✅ Patient Consultation
      ✅ Patient's Consultation
      ✅ Doctor's Prescription
      ✅ Doctor's Note
   ✅ Maternal Care
      ✅ Prenatal
   ✅ Immunization Records
   ✅ Animal Bite Incident Records

✅ Accounts
   ✅ Staff
   ✅ Doctors
   ✅ Nurse
   ✅ Patients

✅ Reports
   ✅ Patient Health Record
   ✅ Medical Report
   ✅ Animal Bite Incident Report
   ✅ Maternal Care Report

✅ Logout
```

### Staff (Role Code: 6001)

**Minimal Access** - Appointments, Settings, Reports only

```
✅ Main
   ✅ Dashboard
   ✅ GeoMap
   ✅ Calendar

❌ File Maintenance (Hidden - No access to any items)

❌ Patient Records (Hidden - No access to any items)

❌ Accounts (Hidden - No access to any items)

✅ Reports
   ✅ Patient Health Record
   ✅ Medical Report
   ✅ Animal Bite Incident Report
   ✅ Maternal Care Report

✅ Logout
```

---

## 💻 Technical Implementation

### Permission Check Function

```javascript
const checkPermission = (permission) => {
    if (!userRoleCode) return false;
    return hasPermission(userRoleCode, permission);
};
```

### Section-Level Check

```javascript
// Check if user has any File Maintenance access
const hasFileMaintenance = checkPermission(PERMISSIONS.ICD_VIEW) || 
                            checkPermission(PERMISSIONS.NURSE_NOTES_VIEW) || 
                            checkPermission(PERMISSIONS.USER_MANAGEMENT_VIEW) || 
                            checkPermission(PERMISSIONS.NOTIFICATIONS_VIEW);

// Check if user has any Patient Records access
const hasPatientRecords = checkPermission(PERMISSIONS.HEALTH_RECORDS_VIEW) || 
                           checkPermission(PERMISSIONS.IMMUNIZATION_VIEW) || 
                           checkPermission(PERMISSIONS.ANIMAL_BITE_VIEW);

// Check if user has any Reports access
const hasReports = checkPermission(PERMISSIONS.REPORTS_VIEW);
```

### Conditional Rendering

```jsx
{hasFileMaintenance && (
    <>
        <li>
            <Link to="">
                <BiFolder className="BiFolder mSidebarLogo" />
                <span><strong>File Maintenance</strong></span>
            </Link>
        </li>
        <li className="sub-mSidebar-Nondropdown">
            {checkPermission(PERMISSIONS.ICD_VIEW) && (
                <Link to="/ICDManager2">ICD-10</Link>
            )}
            {checkPermission(PERMISSIONS.NURSE_NOTES_VIEW) && (
                <Link to="/NurseNotes">Nurse Notes</Link>
            )}
            {checkPermission(PERMISSIONS.USER_MANAGEMENT_VIEW) && (
                <Link to="/UserManagement">User Management</Link>
            )}
            {checkPermission(PERMISSIONS.NOTIFICATIONS_VIEW) && (
                <Link to="/Notifications">Notifications</Link>
            )}
        </li>
    </>
)}
```

---

## 🧪 Testing

### Test Procedure

1. **Login as Admin**
   ```
   Username: admin
   Password: password
   ```
   - ✅ Verify all sections are visible
   - ✅ Verify all links are clickable
   - ✅ Check File Maintenance has 4 items
   - ✅ Check Patient Records has all sub-items

2. **Login as Doctor**
   - ✅ File Maintenance section should be hidden
   - ✅ Patient Records should be visible
   - ✅ Reports should be visible
   - ✅ Accounts should be visible

3. **Login as Nurse**
   - ✅ File Maintenance visible with only Nurse Notes and Notifications
   - ✅ ICD-10 should be hidden
   - ✅ User Management should be hidden
   - ✅ Patient Records should be visible
   - ✅ Reports should be visible

4. **Login as Staff**
   - ✅ Only Main, Reports, and Logout visible
   - ✅ File Maintenance completely hidden
   - ✅ Patient Records completely hidden
   - ✅ Accounts completely hidden

### Visual Testing

Open browser DevTools and check:

```javascript
// In console
localStorage.getItem('healthcenter_auth')
// Should show current user's role code

// Check which items are rendered
document.querySelectorAll('#mSidebar a').length
// Admin: ~25+ links
// Doctor: ~20+ links
// Nurse: ~20+ links
// Staff: ~8 links
```

---

## 🔄 How It Works

### 1. Authentication Check

```javascript
const { auth } = useAuth();
const userRoleCode = auth?.roles?.[0];
```

The sidebar reads the user's role code from the auth context.

### 2. Permission Validation

For each menu item, the sidebar calls:

```javascript
checkPermission(PERMISSIONS.USER_MANAGEMENT_VIEW)
```

This function:
1. Gets the user's role code
2. Looks up the role's permissions in `ROLE_PERMISSIONS`
3. Checks if the specific permission exists
4. Returns `true` or `false`

### 3. Conditional Rendering

Based on the permission check result:
- `true` → Menu item is rendered
- `false` → Menu item is not rendered (hidden from DOM)

### 4. Section Hiding

If all items in a section are hidden:
- The entire section header is hidden
- No empty sections are displayed
- Separator lines (`<hr>`) are managed appropriately

---

## 📝 Key Features

### 1. Dynamic Menu

The sidebar adapts in real-time:
- No hardcoded role checks
- Uses centralized permission system
- Easy to update permissions

### 2. Graceful Degradation

- If auth is not loaded → All items hidden (safe default)
- If permission check fails → Item is hidden (fail-safe)
- No broken links or "Access Denied" pages

### 3. Performance

- Permissions checked once on component mount
- No repeated API calls
- Uses React's conditional rendering (efficient)

### 4. Maintainability

```javascript
// To add new menu item:
{checkPermission(PERMISSIONS.NEW_FEATURE_VIEW) && (
    <Link to="/NewFeature">New Feature</Link>
)}

// To add new section:
const hasNewSection = checkPermission(PERMISSIONS.FEATURE_A) || 
                       checkPermission(PERMISSIONS.FEATURE_B);

{hasNewSection && (
    <li>New Section...</li>
)}
```

---

## 🛠️ Customization

### Adding a New Protected Menu Item

1. **Define permission** in `rolePermissions.js`:

```javascript
export const PERMISSIONS = {
    // ...existing permissions
    INVENTORY_VIEW: 'inventory.view',
};
```

2. **Assign to roles**:

```javascript
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        // ...existing permissions
        PERMISSIONS.INVENTORY_VIEW,
    ],
    // ...other roles
};
```

3. **Add to sidebar**:

```jsx
{checkPermission(PERMISSIONS.INVENTORY_VIEW) && (
    <Link to="/Inventory">Inventory</Link>
)}
```

### Creating a New Section

1. **Define section check**:

```javascript
const hasInventorySection = checkPermission(PERMISSIONS.INVENTORY_VIEW) || 
                             checkPermission(PERMISSIONS.SUPPLIES_VIEW);
```

2. **Add section with conditional**:

```jsx
{hasInventorySection && (
    <>
        <li>
            <Link to="">
                <BiBox className="mSidebarLogo" />
                <span><strong>Inventory</strong></span>
            </Link>
        </li>
        <li className="sub-mSidebar-Nondropdown">
            {checkPermission(PERMISSIONS.INVENTORY_VIEW) && (
                <Link to="/Inventory">Inventory</Link>
            )}
            {checkPermission(PERMISSIONS.SUPPLIES_VIEW) && (
                <Link to="/Supplies">Supplies</Link>
            )}
        </li>
    </>
)}
```

---

## ⚠️ Important Notes

### 1. Frontend Only

**The sidebar RBAC is for UI/UX purposes only!**

- It hides navigation links
- It does NOT prevent direct URL access
- Users can still type URLs in the browser

### 2. Backend Protection Required

**Always protect routes with backend validation:**

```php
// Example: inventory.php
session_start();

if (!isset($_SESSION['roles']) || $_SESSION['roles'] != 5150) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Proceed with request
```

### 3. Page-Level Protection

**Each protected page should also check permissions:**

```jsx
const InventoryPage = () => {
    const { auth } = useAuth();
    const userRoleCode = auth?.roles?.[0];
    const hasAccess = hasPermission(userRoleCode, PERMISSIONS.INVENTORY_VIEW);
    
    if (!hasAccess) {
        return <UnauthorizedPage />;
    }
    
    return <div>Inventory Content</div>;
};
```

---

## 🐛 Troubleshooting

### Issue: All Menu Items Hidden

**Problem**: Sidebar shows only Main and Logout

**Solutions**:
1. Check if user is logged in:
   ```javascript
   console.log('Auth:', auth);
   console.log('Role Code:', auth?.roles?.[0]);
   ```
2. Verify session is active:
   ```javascript
   fetch('http://localhost/api/get-session.php', { credentials: 'include' })
       .then(r => r.json())
       .then(console.log);
   ```
3. Check ROLE_PERMISSIONS has the role:
   ```javascript
   import { ROLE_PERMISSIONS, ROLES } from './utils/rolePermissions';
   console.log('Admin Permissions:', ROLE_PERMISSIONS[ROLES.ADMIN]);
   ```

### Issue: Wrong Items Showing

**Problem**: User sees items they shouldn't

**Solutions**:
1. Verify role code matches:
   - Admin: 5150
   - Doctor: 4001
   - Nurse: 3001
   - Staff: 6001
2. Check ROLE_PERMISSIONS mapping is correct
3. Clear localStorage and re-login
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: Section Shows Empty

**Problem**: Section header visible but no items inside

**Solutions**:
1. Check `hasFileMaintenance` (or similar) logic
2. Verify at least one item has permission
3. Check for typos in permission constants

---

## 📊 Permission Summary Table

| Section | Permission Check | Admin | Doctor | Nurse | Staff |
|---------|-----------------|-------|--------|-------|-------|
| **Dashboard** | (none) | ✅ | ✅ | ✅ | ✅ |
| **GeoMap** | (none) | ✅ | ✅ | ✅ | ✅ |
| **Calendar** | (none) | ✅ | ✅ | ✅ | ✅ |
| **ICD-10** | `ICD_VIEW` | ✅ | ❌ | ❌ | ❌ |
| **Nurse Notes** | `NURSE_NOTES_VIEW` | ✅ | ❌ | ✅ | ❌ |
| **User Management** | `USER_MANAGEMENT_VIEW` | ✅ | ❌ | ❌ | ❌ |
| **Notifications** | `NOTIFICATIONS_VIEW` | ✅ | ✅ | ✅ | ❌ |
| **Patient Consultation** | `HEALTH_RECORDS_VIEW` | ✅ | ✅ | ✅ | ❌ |
| **Maternal Care** | `HEALTH_RECORDS_VIEW` | ✅ | ✅ | ✅ | ❌ |
| **Immunization** | `IMMUNIZATION_VIEW` | ✅ | ✅ | ✅ | ❌ |
| **Animal Bite** | `ANIMAL_BITE_VIEW` | ✅ | ✅ | ✅ | ❌ |
| **Accounts** | `HEALTH_RECORDS_VIEW` | ✅ | ✅ | ✅ | ❌ |
| **Reports** | `REPORTS_VIEW` | ✅ | ✅ | ✅ | ✅ |
| **Logout** | (none) | ✅ | ✅ | ✅ | ✅ |

---

## ✅ Summary

The sidebar now intelligently shows/hides menu items based on the user's role:

- **Admin** sees everything
- **Doctor** sees patient care features (NO File Maintenance)
- **Nurse** sees patient care + nurse notes (NO ICD-10, NO User Management)
- **Staff** sees appointments + reports only

This provides a clean, role-appropriate navigation experience while maintaining security through backend validation.

---

*Last Updated: October 21, 2025*
