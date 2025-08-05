# ZioHelp Multi-Product Help System - API Testing Script
# Test all product-specific endpoints

# Set base URL
$baseUrl = "http://localhost:8080/api"

# Colors for output
$green = "Green"
$red = "Red"
$yellow = "Yellow"

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Description" -ForegroundColor $yellow
    Write-Host "  $Method $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "  ✓ SUCCESS" -ForegroundColor $green
        return $response
    }
    catch {
        Write-Host "  ✗ FAILED: $($_.Exception.Message)" -ForegroundColor $red
        return $null
    }
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "ZioHelp Multi-Product API Test Suite" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Test 1: Get all products
Write-Host "`n1. PRODUCT MANAGEMENT TESTS" -ForegroundColor Cyan
$products = Test-Endpoint -Method "GET" -Url "$baseUrl/products/list" -Description "Get all products"

# Test 2: Get product by ID
Test-Endpoint -Method "GET" -Url "$baseUrl/products/1" -Description "Get product by ID (1)"

# Test 3: Get public help for Machine Inventory
Write-Host "`n2. PUBLIC HELP SYSTEM TESTS" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/product-help/public/inventory.acme.com" -Description "Get public help for Machine Inventory"

# Test 4: Get public FAQs for Machine Inventory
Test-Endpoint -Method "GET" -Url "$baseUrl/faq/public/product/inventory.acme.com" -Description "Get public FAQs for Machine Inventory"

# Test 5: Get public articles for Machine Inventory
Test-Endpoint -Method "GET" -Url "$baseUrl/knowledge-base/articles/public/product/inventory.acme.com" -Description "Get public articles for Machine Inventory"

# Test 6: Create a public ticket
Write-Host "`n3. PUBLIC TICKET CREATION" -ForegroundColor Cyan
$ticketData = @{
    title = "Test API Ticket"
    description = "This is a test ticket created via API"
    category = "Technical Issue"
    createdBy = "test@example.com"
    priority = "MEDIUM"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/product-help/public/inventory.acme.com/ticket" -Description "Create public ticket" -Body $ticketData

# Test 7: Product-specific FAQ tests
Write-Host "`n4. PRODUCT-SPECIFIC FAQ TESTS" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/faq/product/1" -Description "Get FAQs for product 1"
Test-Endpoint -Method "GET" -Url "$baseUrl/faq/product/1/categories" -Description "Get FAQ categories for product 1"
Test-Endpoint -Method "GET" -Url "$baseUrl/faq/product/1/search?keyword=machine" -Description "Search FAQs for 'machine'"

# Test 8: Product-specific Knowledge Base tests
Write-Host "`n5. PRODUCT-SPECIFIC KNOWLEDGE BASE TESTS" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/knowledge-base/articles/product/1" -Description "Get articles for product 1"
Test-Endpoint -Method "GET" -Url "$baseUrl/knowledge-base/articles/product/1/categories" -Description "Get article categories for product 1"
Test-Endpoint -Method "GET" -Url "$baseUrl/knowledge-base/articles/product/1/search?keyword=maintenance" -Description "Search articles for 'maintenance'"

# Test 9: Product help dashboard (requires authentication)
Write-Host "`n6. AUTHENTICATED HELP SYSTEM TESTS" -ForegroundColor Cyan
Write-Host "Note: These tests may fail without proper authentication" -ForegroundColor Yellow

Test-Endpoint -Method "GET" -Url "$baseUrl/product-help/product/1/dashboard" -Description "Get help dashboard for product 1"
Test-Endpoint -Method "GET" -Url "$baseUrl/product-help/product/1/all" -Description "Get all help content for product 1"
Test-Endpoint -Method "GET" -Url "$baseUrl/product-help/product/1/stats" -Description "Get help statistics for product 1"

# Test 10: Search across all content types
Write-Host "`n7. INTEGRATED SEARCH TESTS" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/product-help/product/1/search?keyword=inventory" -Description "Search all content for 'inventory'"
Test-Endpoint -Method "GET" -Url "$baseUrl/product-help/product/1/category/Getting%20Started" -Description "Get content by category"

# Test 11: Product content management
Write-Host "`n8. CONTENT MANAGEMENT TESTS (May require authentication)" -ForegroundColor Cyan

# Create FAQ
$faqData = @{
    question = "Test FAQ Question"
    answer = "Test FAQ Answer"
    category = "API Testing"
    isPublished = $true
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/faq/product/1" -Description "Create FAQ for product 1" -Body $faqData

# Create Article
$articleData = @{
    title = "Test Article"
    content = "This is a test article created via API"
    category = "API Testing"
    author = "API Test"
    isPublished = $true
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/knowledge-base/articles/product/1" -Description "Create article for product 1" -Body $articleData

# Test 12: Health and status endpoints
Write-Host "`n9. SYSTEM HEALTH TESTS" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/../actuator/health" -Description "Check application health"

# Test 13: Product-specific statistics
Write-Host "`n10. STATISTICS AND ANALYTICS" -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Url "$baseUrl/faq/product/1/stats" -Description "Get FAQ statistics for product 1"
Test-Endpoint -Method "GET" -Url "$baseUrl/knowledge-base/articles/product/1/stats" -Description "Get article statistics for product 1"

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "API Testing Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Review any failed tests above"
Write-Host "2. Set up proper authentication for admin endpoints"
Write-Host "3. Configure database with sample data"
Write-Host "4. Test with different product domains"
Write-Host "5. Verify CORS settings for frontend integration"

Write-Host "`nProduct URLs to test in browser:" -ForegroundColor Green
Write-Host "- Machine Inventory: $baseUrl/product-help/public/inventory.acme.com"
Write-Host "- Support Portal: $baseUrl/product-help/public/support.beta.com"
Write-Host "- Asset Manager: $baseUrl/product-help/public/assets.gamma.com"

Write-Host "`nSample Integration Code:" -ForegroundColor Green
Write-Host @"
// JavaScript example for Machine Inventory integration
const helpResponse = await fetch('$baseUrl/product-help/public/inventory.acme.com');
const helpData = await helpResponse.json();
console.log('FAQs:', helpData.faqs);
console.log('Articles:', helpData.articles);

// Create support ticket
const ticketData = {
  title: 'Machine not found in search',
  description: 'Unable to locate machine ABC-123',
  category: 'Technical Issue',
  createdBy: 'user@company.com'
};
const ticketResponse = await fetch('$baseUrl/product-help/public/inventory.acme.com/ticket', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(ticketData)
});
"@
