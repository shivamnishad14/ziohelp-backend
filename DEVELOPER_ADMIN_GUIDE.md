# 🎯 **How to Register Developer Admin**

## 📋 **Overview**
There are multiple ways to register a developer admin in the ZioHelp system. Choose the method that best fits your needs.

---

## 🚀 **Method 1: Through Application Interface (Recommended)**

### Step 1: Login as Super Admin
1. Go to http://localhost:5173
2. Login with: `admin@ziohelp.com` / `password123`
3. You'll be redirected to the Admin Dashboard

### Step 2: Access User Management
1. In the admin dashboard, click on **"User Management"** in the sidebar
2. Or navigate to: http://localhost:5173/admin/users

### Step 3: Create New Developer
1. Click the **"Create New User"** button
2. Fill in the developer details:
   ```
   Name: Developer Name
   Email: developer@yourcompany.com
   Password: securepassword123
   Role: DEVELOPER
   Product: Select appropriate product
   ```
3. Click **"Create User"**

### Step 4: Developer Login
The new developer can now:
1. Go to http://localhost:5173/login
2. Login with: `developer@yourcompany.com` / `securepassword123`
3. Access the Developer Dashboard at: http://localhost:5173/developer/dashboard

---

## 🗄️ **Method 2: Direct Database Insert**

### Step 1: Connect to Database
```bash
psql -h localhost -U ziohelpuser -d ziohelpdb
```

### Step 2: Run SQL Script
```sql
-- Add new developer admin user
INSERT INTO "user" (id, full_name, email, password, approved, active, organization_id, created_at) VALUES
(17, 'Developer Admin', 'developer@ziohelp.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', true, true, 1, NOW());

-- Assign DEVELOPER role
INSERT INTO user_roles (user_id, role_id) VALUES
(17, 2); -- DEVELOPER role

-- Optional: Also assign ADMIN role for admin privileges
-- INSERT INTO user_roles (user_id, role_id) VALUES
-- (17, 1); -- ADMIN role
```

### Step 3: Verify Creation
```sql
SELECT u.full_name, u.email, r.name as role 
FROM "user" u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN role r ON ur.role_id = r.id 
WHERE u.email = 'developer@ziohelp.com';
```

---

## 🔧 **Method 3: Using the SQL Script File**

### Step 1: Run the SQL Script
```bash
# Navigate to project directory
cd ziohelp-backend

# Run the SQL script
psql -h localhost -U ziohelpuser -d ziohelpdb -f ADD_DEVELOPER_ADMIN.sql
```

### Step 2: Login with New Developer
- **Email**: developer@ziohelp.com
- **Password**: password123

---

## 🎯 **Developer Admin Capabilities**

### ✅ **What Developer Admins Can Do:**
1. **Access Developer Dashboard**: http://localhost:5173/developer/dashboard
2. **View Assigned Tickets**: All tickets assigned to them
3. **Resolve Tickets**: Change ticket status and add resolutions
4. **Add Comments**: Respond to ticket comments
5. **View Analytics**: Performance metrics and ticket trends
6. **Manage Profile**: Update personal information

### 🔒 **What They Cannot Do:**
1. Create new users
2. Assign roles to other users
3. Access admin-only features
4. Manage system settings
5. View all tickets (only assigned ones)

---

## 🛠️ **Troubleshooting**

### Issue: "User not found" error
**Solution:**
1. Check if user exists in database
2. Verify email spelling
3. Ensure user is approved and active

### Issue: "Invalid role" error
**Solution:**
1. Verify role exists in database
2. Check role assignment in user_roles table
3. Ensure role name matches exactly

### Issue: "Cannot access developer dashboard"
**Solution:**
1. Verify user has DEVELOPER role
2. Check if user is active
3. Ensure proper role assignment

---

## 📊 **Current Developer Users**

Based on the seed data, these users already have DEVELOPER role:
- **Bob**: bob@beta.com
- **David**: david@delta.com  
- **Frank**: frank@zeta.com
- **Heidi**: heidi@theta.com
- **Niaj**: niaj@mu.com

**Password for all**: `password123`

---

## 🎉 **Success Verification**

After creating a developer admin, verify success by:

1. **Login Test**: Developer can login successfully
2. **Dashboard Access**: Can access developer dashboard
3. **Role Verification**: Shows "DEVELOPER" role in profile
4. **Ticket Access**: Can view assigned tickets
5. **Functionality**: Can resolve tickets and add comments

---

## 🚀 **Quick Start Commands**

```bash
# Start backend
cd ziohelp-backend
mvn spring-boot:run

# Start frontend (in new terminal)
cd frontend
npm run dev

# Access application
# Backend: http://localhost:8080
# Frontend: http://localhost:5173
# Swagger: http://localhost:8080/swagger-ui.html
```

**Developer Admin Login:**
- **Email**: developer@ziohelp.com
- **Password**: password123
- **Dashboard**: http://localhost:5173/developer/dashboard 