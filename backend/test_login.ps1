# Test Login API Script for ZioHelp Backend
$ErrorActionPreference = 'Stop'

Write-Host "ZioHelp Login API Test Suite" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Configuration
$baseUrl = "http://localhost:8080"
$apiEndpoint = "$baseUrl/api/auth/login"
$headers = @{
    'Content-Type' = 'application/json'
    'Accept' = 'application/json'
}

function Test-ServerAvailable {
    try {
        # Try different paths until one works
        $testPaths = @('/', '/api', '/swagger-ui', '/v3/api-docs')
        foreach ($path in $testPaths) {
            try {
                Write-Host "Checking $baseUrl$path"
                try {
                    $response = Invoke-WebRequest -Uri "$baseUrl$path" -Method HEAD -TimeoutSec 5 
                    if ($response.StatusCode -lt 500) {
                        Write-Host "Server responded with status: $($response.StatusCode)"
                        return $true
                    }
                } catch [System.Net.WebException] {
                    $statusCode = [int]$_.Exception.Response.StatusCode
                    if ($statusCode -lt 500) {
                        Write-Host "Server responded with status: $statusCode"
                        return $true
                    }
                    Write-Host "Failed with status: $statusCode"
                    continue
                }
                if ($response.StatusCode -lt 500) {  # Accept any non-500 response as "available"
                    Write-Host "Server responded with status: $($response.StatusCode)"
                    return $true
                }
            } catch {
                Write-Host "Failed with: $($_.Exception.Message)"
                continue
            }
        }
        Write-Host "All paths failed"
        return $false
    }
    catch {
        Write-Host "Server check failed: $($_.Exception.Message)"
        return $false
    }
}

function Invoke-LoginTest {
    param (
        [Parameter(Mandatory=$true)]
        [string]$TestName,
        
        [Parameter(Mandatory=$true)]
        [hashtable]$TestData,
        
        [Parameter(Mandatory=$true)]
        [int]$ExpectedStatus
    )
    
    Write-Host "`nTest Case: $TestName" -ForegroundColor Yellow
    Write-Host "--------------------" -ForegroundColor Yellow
    
    # Convert test data to JSON with proper escaping
    $json = @{
        email = $TestData.email
        password = $TestData.password
    } | ConvertTo-Json -Compress
    Write-Host "Request Body: $json"
    Write-Host "Headers: $($headers | ConvertTo-Json)"

    try {
        Write-Host "Sending request to: $apiEndpoint"
        $response = Invoke-WebRequest -Uri $apiEndpoint -Method Post -Headers $headers -Body $json -UseBasicParsing
        Write-Host "[SUCCESS] Status Code: $($response.StatusCode)"
        Write-Host "Response: $($response.Content)"
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "Test passed" -ForegroundColor Green
            return $true
        }
        Write-Host "Test failed - Expected $ExpectedStatus but got $($response.StatusCode)" -ForegroundColor Red
        return $false
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "[ERROR] Status Code: $statusCode" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $body = $reader.ReadToEnd()
            $reader.Dispose()
            Write-Host "Error Details: $body" -ForegroundColor Red
        }
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "Test passed (expected error)" -ForegroundColor Green
            return $true
        }
        Write-Host "Test failed - Expected $ExpectedStatus but got $statusCode" -ForegroundColor Red
        return $false
    }
}

# Check server availability
Write-Host "`nChecking server availability..." -ForegroundColor Cyan
if (-not (Test-ServerAvailable)) {
    Write-Host "Error: Server is not available at $baseUrl" -ForegroundColor Red
    Write-Host "Please ensure the Spring Boot application is running." -ForegroundColor Yellow
    exit 1
}

Write-Host "Server is available. Running tests..." -ForegroundColor Green

# Test cases based on seed data in data.sql
$testCases = @(
    @{
        Name = "Valid login with admin email" 
        Data = @{
            email = "admin@ziohelp.com"
            password = "password123"
        }
        ExpectedStatus = 200
    },
    @{
        Name = "Valid login with USER email" 
        Data = @{
            email = "charlie@gamma.com"
            password = "password123"
        }
        ExpectedStatus = 200
    },
    @{
        Name = "Valid login with DEVELOPER email" 
        Data = @{
            email = "bob@beta.com"
            password = "password123"
        }
        ExpectedStatus = 200
    },
    @{
        Name = "Valid login with tenant admin email"
        Data = @{
            email = "eve@epsilon.com"
            password = "password123" 
        }
        ExpectedStatus = 200
    },
    @{
        Name = "Invalid password"
        Data = @{
            email = "admin@ziohelp.com"
            password = "wrongpass"
        }
        ExpectedStatus = 400
    },
    @{
        Name = "Invalid email format"
        Data = @{
            email = "not-an-email"
            password = "password123"
        }
        ExpectedStatus = 400
    },
    @{
        Name = "Empty password"
        Data = @{
            email = "admin@ziohelp.com"
            password = ""
        }
        ExpectedStatus = 400
    },
    @{
        Name = "Non-existent user email"
        Data = @{
            email = "nobody@nowhere.com"
            password = "password123"
        }
        ExpectedStatus = 400
    }
)

# Run all tests
$failedTests = 0
foreach ($test in $testCases) {
    $success = Invoke-LoginTest -TestName $test.Name -TestData $test.Data -ExpectedStatus $test.ExpectedStatus
    if (-not $success) {
        $failedTests++
    }
}

# Print summary
Write-Host "`nTest Summary" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Cyan
Write-Host "Total Tests: $($testCases.Count)"
Write-Host "Failed Tests: $failedTests" -ForegroundColor $(if ($failedTests -eq 0) { 'Green' } else { 'Red' })
$successRate = [math]::Round(100 - ($failedTests/$testCases.Count*100), 2)
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($failedTests -eq 0) { 'Green' } else { 'Yellow' })
