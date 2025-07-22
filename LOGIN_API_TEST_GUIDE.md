# 🔐 **Login API Testing Guide - Swagger**

## 🎯 **Overview**
This guide shows you how to test the admin login API using Swagger UI.

---

## 🚀 **Step 1: Access Swagger UI**

### Method 1: Browser Access
1. Open your web browser
2. Go to: **http://localhost:8080/swagger-ui.html**
3. You should see the Swagger UI interface

### Method 2: Alternative URLs
If the above doesn't work, try these URLs:
- http://localhost:8080/swagger-ui/index.html
- http://localhost:8080/v3/api-docs
- http://localhost:8080/api-docs

---

## 🔍 **Step 2: Find the Login Endpoint**

1. **In Swagger UI, look for:**
   - **Auth Controller** section
   - **POST /api/auth/login** endpoint
   - Click on it to expand

2. **Endpoint Details:**
   ```
   POST /api/auth/login
   Content-Type: application/json
   ```

---

## 🧪 **Step 3: Test Admin Login**

### **Admin Credentials:**
```json
{
  "email": "admin@ziohelp.com",
  "password": "password123"
}
```

### **Test Steps:**
1. **Click "Try it out"** on the login endpoint
2. **Enter the JSON payload:**
   ```json
   {
     "email": "admin@ziohelp.com",
     "password": "password123"
   }
   ```
3. **Click "Execute"**
4. **Expected Response:**
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiJ9...",
     "userId": 16,
     "email": "admin@ziohelp.com",
     "fullName": "ZioHelp Admin",
     "roles": ["ADMIN"]
   }
   ```

---

## 🎯 **Step 4: Test Other User Logins**

### **Developer Login:**
```json
{
  "email": "bob@beta.com",
  "password": "password123"
}
```

### **User Login:**
```json
{
  "email": "charlie@gamma.com",
  "password": "password123"
}
```

### **Tenant Admin Login:**
```json
{
  "email": "olivia@nu.com",
  "password": "password123"
}
```

---

## 🔧 **Step 5: Using curl (Alternative)**

If Swagger UI is not accessible, test with curl:

### **Admin Login:**
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ziohelp.com",
    "password": "password123"
  }'
```

### **Developer Login:**
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@beta.com",
    "password": "password123"
  }'
```

---

## 📊 **Step 6: Expected Responses**

### **Successful Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkB6aW9oZWxwLmNvbSIsImlhdCI6MTYzNjU0MzIwMCwiZXhwIjoxNjM2NjI5NjAwfQ.signature",
  "userId": 16,
  "email": "admin@ziohelp.com",
  "fullName": "ZioHelp Admin",
  "roles": ["ADMIN"]
}
```

### **Error Response (Invalid Credentials):**
```json
{
  "error": "Invalid credentials",
  "message": "Bad credentials"
}
```

### **Error Response (User Not Found):**
```json
{
  "error": "User not found",
  "message": "User not found"
}
```

---

## 🛠️ **Step 7: Troubleshooting**

### **Issue: Swagger UI not accessible**
**Solutions:**
1. Check if backend is running: `netstat -an | findstr :8080`
2. Restart backend: `mvn spring-boot:run`
3. Check application.properties for Swagger config

### **Issue: Login fails with "Invalid credentials"**
**Solutions:**
1. Verify user exists in database
2. Check password is correct
3. Ensure user is approved and active

### **Issue: "User not found" error**
**Solutions:**
1. Check if user email exists in database
2. Verify user is not deleted
3. Check user approval status

---

## 🎯 **Step 8: Database Verification**

### **Check if admin user exists:**
```sql
SELECT id, full_name, email, approved, active 
FROM "user" 
WHERE email = 'admin@ziohelp.com';
```

### **Check user roles:**
```sql
SELECT u.full_name, u.email, r.name as role 
FROM "user" u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN role r ON ur.role_id = r.id 
WHERE u.email = 'admin@ziohelp.com';
```

---

## 🚀 **Step 9: Quick Test Commands**

### **Start Backend:**
```bash
cd ziohelp-backend
mvn spring-boot:run
```

### **Test Login API:**
```bash
# Test admin login
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ziohelp.com", "password": "password123"}'
```

### **Access Swagger:**
- **URL**: http://localhost:8080/swagger-ui.html
- **Alternative**: http://localhost:8080/swagger-ui/index.html

---

## 🎉 **Success Criteria**

✅ **Login API is working if:**
1. Swagger UI loads successfully
2. Login endpoint returns 200 OK
3. Response contains valid JWT token
4. User details are returned correctly
5. Role information is included

---

## 📋 **Available Test Users**

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@ziohelp.com | password123 | ADMIN | ✅ Active |
| bob@beta.com | password123 | DEVELOPER | ✅ Active |
| charlie@gamma.com | password123 | USER | ✅ Active |
| olivia@nu.com | password123 | TENANT_ADMIN | ✅ Active |

**All users are pre-approved and active in the database.** 