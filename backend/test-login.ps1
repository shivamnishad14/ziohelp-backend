Write-Host "Testing Login API..." -ForegroundColor Green

$uri = "http://localhost:8080/api/auth/login"
$headers = @{
    "Content-Type" = "application/json"
}

# Test case 1: Valid credentials
$body = @{
    "email" = "admin@ziohelp.com"
    "password" = "password123"
} | ConvertTo-Json

Write-Host "`nTest Case 1: Valid Login" -ForegroundColor Yellow
Write-Host "Request Body: $body"

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
    Write-Host "Success! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Response: $errorBody" -ForegroundColor Red
    }
}

# Test case 2: Invalid password
$body = @{
    "email" = "admin@ziohelp.com"
    "password" = "wrongpassword"
} | ConvertTo-Json

Write-Host "`nTest Case 2: Invalid Password" -ForegroundColor Yellow
Write-Host "Request Body: $body"

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
} catch {
    Write-Host "Expected error (invalid credentials):" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Response: $errorBody" -ForegroundColor Red
    }
}

# Test case 3: Invalid email
$body = @{
    "email" = "nonexistent@ziohelp.com"
    "password" = "password123"
} | ConvertTo-Json

Write-Host "`nTest Case 3: Invalid Email" -ForegroundColor Yellow
Write-Host "Request Body: $body"

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
} catch {
    Write-Host "Expected error (invalid credentials):" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Response: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`nTests completed!" -ForegroundColor Green
