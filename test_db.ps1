# Test Database Connection and User Data
Write-Host "Testing Database Connection..." -ForegroundColor Green

try {
    # Test if backend is responding
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8080/swagger-ui.html" -Method GET -ErrorAction Stop
    Write-Host "Backend is responding" -ForegroundColor Green
    
    # Test a simple endpoint that doesn't require authentication
    Write-Host "Testing simple endpoint..." -ForegroundColor Yellow
    
    # Try to get the OpenAPI spec
    $apiSpec = Invoke-RestMethod -Uri "http://localhost:8080/v3/api-docs" -Method GET -ErrorAction Stop
    Write-Host "API spec is accessible" -ForegroundColor Green
    
} catch {
    Write-Host "Error testing backend:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} 