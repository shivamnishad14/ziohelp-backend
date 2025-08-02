# PowerShell script to test user registration via backend API
$apiUrl = "http://localhost:8080/api/auth/register"
$payload = @{
    email = "shivam@gmail.com"
    password = "Shivam@123"
    fullName = "shivam"
    username = "shivamnishad"
    role = "ADMIN"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $payload -ContentType "application/json"
    $response | ConvertTo-Json
} catch {
    Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "Raw Response Body:`n$body"
    try {
        $json = $body | ConvertFrom-Json
        if ($json.message) { Write-Host "Error Message: $($json.message)" }
        elseif ($json.error) { Write-Host "Error: $($json.error)" }
        else { Write-Host "Parsed JSON: $($json | ConvertTo-Json)" }
    } catch {
        Write-Host "Response is not valid JSON."
    }
}
