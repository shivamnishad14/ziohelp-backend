# Test Login API Script
Write-Host "Testing Login API..." -ForegroundColor Green

try {
    $uri = "http://localhost:8080/api/auth/login"
    $headers = @{
        "Content-Type" = "application/json"
    }
    $body = @{
        "email" = "admin@ziohelp.com"
        "password" = "password123"
    } | ConvertTo-Json

    Write-Host "Request URI: $uri" -ForegroundColor Yellow
    Write-Host "Request Body: $body" -ForegroundColor Yellow
    Write-Host "Raw JSON Body: $body" -ForegroundColor Cyan

    $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body -ContentType 'application/json; charset=utf-8' -ErrorAction Stop
    
    Write-Host "Success! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
} 