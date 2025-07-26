# ZioHelp User Management API Test Script
# Update these variables as needed
$baseUrl = "http://localhost:8080/api"
$adminEmail = "admin@ziohelp.com"
$adminPassword = "password123"

# Helper: Perform login and get JWT
Write-Host "Logging in as admin..."

# Add both email and username for login compatibility
$adminUsername = "adminuser"
$loginBody = @{
    email = $adminEmail
    username = $adminUsername
    password = $adminPassword
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$jwt = $loginResponse.token
if (-not $jwt) { Write-Error "Login failed!"; exit 1 }
$headers = @{ Authorization = "Bearer $jwt" }

Write-Host "JWT acquired: $jwt`n"

# 1. GET /users/me
Write-Host "GET /users/me"
Invoke-RestMethod -Uri "$baseUrl/users/me" -Headers $headers -Method Get

# 2. PUT /users/me
Write-Host "`nPUT /users/me"
$updateMeBody = @{ name = "Admin Updated" } | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/users/me" -Headers $headers -Method Put -Body $updateMeBody -ContentType "application/json"

# 3. GET /users
Write-Host "`nGET /users"
$users = Invoke-RestMethod -Uri "$baseUrl/users" -Headers $headers -Method Get
$firstUserId = $users.content[0].id

# 4. POST /users
Write-Host "`nPOST /users"
$newUserBody = @{
    name = "Test User"
    email = "testuser@ziohelp.com"
    password = "password123"
    role = "USER"
    productId = 1
} | ConvertTo-Json
$newUser = Invoke-RestMethod -Uri "$baseUrl/users" -Headers $headers -Method Post -Body $newUserBody -ContentType "application/json"
$newUserId = $newUser.id

# 5. PUT /users/{userId}/toggle-active
Write-Host "`nPUT /users/$newUserId/toggle-active"
Invoke-RestMethod -Uri "$baseUrl/users/$newUserId/toggle-active" -Headers $headers -Method Put

# 6. PUT /users/{userId}/approve-admin
Write-Host "`nPUT /users/$newUserId/approve-admin"
Invoke-RestMethod -Uri "$baseUrl/users/$newUserId/approve-admin" -Headers $headers -Method Put

# 7. PUT /users/{userId}/reject-admin
Write-Host "`nPUT /users/$newUserId/reject-admin"
Invoke-RestMethod -Uri "$baseUrl/users/$newUserId/reject-admin" -Headers $headers -Method Put

# 8. GET /users/{userId}/roles
Write-Host "`nGET /users/$newUserId/roles"
Invoke-RestMethod -Uri "$baseUrl/users/$newUserId/roles" -Headers $headers -Method Get

# 9. POST /users/{userId}/roles
Write-Host "`nPOST /users/$newUserId/roles"
$roleBody = @{ role = "DEVELOPER" } | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/users/$newUserId/roles" -Headers $headers -Method Post -Body $roleBody -ContentType "application/json"

# 10. GET /users/roles
Write-Host "`nGET /users/roles"
Invoke-RestMethod -Uri "$baseUrl/users/roles" -Headers $headers -Method Get

# 11. GET /users/pending-admins
Write-Host "`nGET /users/pending-admins"
Invoke-RestMethod -Uri "$baseUrl/users/pending-admins" -Headers $headers -Method Get

# 12. GET /users/count
Write-Host "`nGET /users/count"
Invoke-RestMethod -Uri "$baseUrl/users/count" -Headers $headers -Method Get

# 13. GET /users/by-org/{orgId}
Write-Host "`nGET /users/by-org/1"
Invoke-RestMethod -Uri "$baseUrl/users/by-org/1" -Headers $headers -Method Get

# 14. GET /users/all
Write-Host "`nGET /users/all"
Invoke-RestMethod -Uri "$baseUrl/users/all" -Headers $headers -Method Get

# 15. DELETE /users/{userId}/roles/{roleName}
Write-Host "`nDELETE /users/$newUserId/roles/DEVELOPER"
Invoke-RestMethod -Uri "$baseUrl/users/$newUserId/roles/DEVELOPER" -Headers $headers -Method Delete

# 16. DELETE /users/{userId}
Write-Host "`nDELETE /users/$newUserId"
Invoke-RestMethod -Uri "$baseUrl/users/$newUserId" -Headers $headers -Method Delete

Write-Host "`nAll user management API endpoints tested."