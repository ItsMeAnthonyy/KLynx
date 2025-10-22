# 🔐 Login Guide - KLynx Health Center

## Quick Start - How to Login

### Method 1: Use Default Admin Account (Recommended)

If you ran the `create-users-account-table.sql` script, there's a default admin account:

**Login Credentials:**
- **Admin ID/Username**: `admin`
- **Password**: `password`

**Steps:**
1. Make sure Apache and MySQL are running in XAMPP
2. Navigate to: http://localhost:5173/Login
3. Enter:
   - Admin ID: `admin`
   - Password: `password`
4. Click **Login**
5. You should be redirected to the Consultation page

---

### Method 2: Create a New User via User Management

1. First, login with the default admin account (see Method 1)
2. Navigate to: http://localhost:5173/UserManagement
3. Click **"Create User Account"** button
4. Fill in the form:
   - Username: (e.g., `@dr_smith`)
   - Full Name: (e.g., `Dr. John Smith`)
   - Email: (e.g., `john.smith@healthcenter.com`)
   - Role: Select from dropdown (Admin, Doctor, Nurse, Staff, Guest)
   - Department: Select from dropdown
   - Click **"Generate"** to create a secure password
   - Copy the generated password (you'll need it to login!)
5. Click **"Create Account"**
6. Logout and login with the new credentials

---

## 🔄 What Just Changed in Login System

### ✅ Security Improvements Made:

1. **Password Verification Added**
   - Before: Login only checked if username exists (NO password check!)
   - After: Properly verifies password using `password_verify()`

2. **Works with New User Management System**
   - Checks `users_account` table first
   - Falls back to old `admins` table for backward compatibility

3. **Account Status Validation**
   - Prevents login if account is inactive
   - Checks if account is deleted

4. **Last Login Tracking**
   - Updates `last_login` timestamp on successful login
   - Useful for security auditing

5. **Better Error Messages**
   - "Invalid password" vs "User not found"
   - "Account is inactive" for disabled accounts

---

## 📋 Login System Architecture

### How It Works:

```
User enters credentials
        ↓
Frontend (Login.jsx) sends POST to /api/login.php
        ↓
Backend checks users_account table
        ↓
    Found user?
        ↓
    YES → Verify password with password_verify()
        ↓
    Password correct?
        ↓
    YES → Check if status = 'active'
        ↓
    Active?
        ↓
    YES → Create PHP session
        ↓
    Update last_login timestamp
        ↓
    Return user data to frontend
        ↓
Frontend saves auth data
        ↓
User is logged in! ✅
```

---

## 🗄️ Database Setup

### Step 1: Make sure the users_account table exists

Open phpMyAdmin: http://localhost/phpmyadmin

Run this query to check:
```sql
SHOW TABLES LIKE 'users_account';
```

If it returns nothing, you need to create the table:

```sql
-- Run the SQL script from:
-- C:\xampp\htdocs\api\create-users-account-table.sql
```

Or copy and paste the entire SQL script in phpMyAdmin SQL tab.

### Step 2: Verify default admin exists

```sql
SELECT * FROM users_account WHERE username = 'admin';
```

Should return 1 row with:
- username: `admin`
- email: `admin@healthcenter.com`
- role: `admin`
- status: `active`

---

## 🔑 Role Codes Reference

When you login, the system assigns a role code:

| Role    | Code  | Access Level                    |
|---------|-------|---------------------------------|
| Admin   | 5150  | Full system access              |
| Doctor  | 4001  | Patient records, prescriptions  |
| Nurse   | 3001  | Patient care, limited records   |
| Staff   | 6001  | Appointments, basic access      |
| Patient | 2001  | Own records only                |
| Guest   | 7001  | Limited read-only access        |

---

## 🧪 Testing the Login

### Test 1: Direct API Test

Open browser and go to:
```
http://localhost/api/login.php
```

Should show error:
```json
{"error": "Admin ID and password are required"}
```

This confirms the API is working!

### Test 2: Test with Postman or cURL

**Using PowerShell:**
```powershell
$body = @{
    adminID = "admin"
    password = "password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost/api/login.php" -Method POST -Body $body -ContentType "application/json" -SessionVariable session
```

Should return:
```json
{
  "success": true,
  "adminID": "1",
  "username": "admin",
  "fullName": "System Administrator",
  "email": "admin@healthcenter.com",
  "role": "admin",
  "roles": 5150
}
```

### Test 3: Test from React App

1. Open: http://localhost:5173/Login
2. Open browser console (F12)
3. Enter credentials
4. Click Login
5. Watch console for:
   - Request to `http://localhost/api/login.php`
   - Response with user data
   - Navigation to `/Consultation`

---

## 🐛 Troubleshooting

### Issue 1: "User not found"

**Possible causes:**
- `users_account` table doesn't exist
- No users in the database
- Entered wrong username

**Solution:**
```sql
-- Check if table exists
SHOW TABLES LIKE 'users_account';

-- Check users
SELECT username, email, role FROM users_account WHERE deleted_at IS NULL;
```

### Issue 2: "Invalid password"

**Cause:** Wrong password entered

**Solution:**
- Use default: `password`
- Or reset password in database:

```sql
-- Reset admin password to "password"
UPDATE users_account 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'admin';
```

### Issue 3: "Account is inactive"

**Cause:** User status is not 'active'

**Solution:**
```sql
-- Activate the account
UPDATE users_account 
SET status = 'active' 
WHERE username = 'admin';
```

### Issue 4: CORS Error

**Cause:** Apache not restarted after updating login.php

**Solution:**
1. Open XAMPP Control Panel
2. Stop Apache
3. Start Apache
4. Clear browser cache (Ctrl + Shift + Delete)
5. Hard refresh (Ctrl + Shift + R)

### Issue 5: "Cannot read properties of undefined"

**Cause:** Backend didn't return expected data structure

**Solution:**
Check browser console Network tab:
- Click on the login request
- Look at Response tab
- Should see JSON with `success: true` and user data

---

## 🔒 Security Best Practices

### After First Login:

1. **Change Default Admin Password:**
   - Go to User Management
   - Click edit on admin account
   - Set a strong password
   - Click "Force password change on next login"

2. **Create Individual User Accounts:**
   - Don't share the admin account
   - Create separate accounts for each person
   - Assign appropriate roles

3. **Enable Two-Factor Authentication (Future):**
   - Currently not implemented
   - Will be added in future updates

4. **Review Security Logs Regularly:**
   - Check last login times
   - Look for suspicious activity
   - Disable inactive accounts

---

## 📊 Session Management

### How Sessions Work:

1. **Login** → PHP creates session with user data
2. **AuthProvider** → Checks session on page load
3. **Protected Routes** → Verify user has required role
4. **Logout** → Destroy PHP session

### Check Current Session:

The `AuthProvider` automatically checks your session when you load the app.

You can see your login status in browser console:
```
Login info: { adminID: 1, roles: [5150] }
```

### Manual Session Check:

Open browser and go to:
```
http://localhost/api/get-session.php
```

If logged in, you'll see:
```json
{
  "adminID": "1",
  "username": "admin",
  "fullName": "System Administrator",
  "email": "admin@healthcenter.com",
  "role": "admin",
  "roles": 5150
}
```

If not logged in:
```json
null
```

---

## 🚀 Quick Start Checklist

```markdown
- [ ] Apache is running in XAMPP
- [ ] MySQL is running in XAMPP
- [ ] Database `react-crud` exists
- [ ] Table `users_account` exists
- [ ] Default admin user exists in database
- [ ] login.php has been updated (already done ✅)
- [ ] Apache was restarted after updating login.php
- [ ] React dev server is running (npm run dev)
- [ ] Navigate to http://localhost:5173/Login
- [ ] Enter: admin / password
- [ ] Click Login
- [ ] You should see Consultation page ✅
```

---

## 🎯 Next Steps After Login

Once logged in as admin, you can:

1. **User Management** - Create/edit/delete user accounts
2. **Dashboard** - View statistics and overview
3. **Patients** - Manage patient records
4. **Appointments** - Schedule and manage appointments
5. **Reports** - Generate health reports
6. **Settings** - Configure system settings

---

## 📝 Default Credentials Summary

| Username | Password  | Role  | Access                |
|----------|-----------|-------|-----------------------|
| admin    | password  | Admin | Full system access    |

**⚠️ IMPORTANT:** Change the default password after first login!

---

*Last Updated: October 20, 2025*  
*Login system version: 2.0 (with password verification)*  
*Status: ✅ READY TO USE*