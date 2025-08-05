# Test Product Help API Endpoints
# Run this script to test all the product help API endpoints

$baseUrl = "http://localhost:8080/api"
$headers = @{ "Content-Type" = "application/json" }

Write-Host "=== Testing Product Help API ===" -ForegroundColor Green

# Test 1: Get all products
Write-Host "`n1. Testing GET /products/list" -ForegroundColor Cyan
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/products/list" -Method GET -Headers $headers
    Write-Host "✓ Products found: $($products.Count)" -ForegroundColor Green
    if ($products.Count -gt 0) {
        Write-Host "First product: $($products[0].name) (Domain: $($products[0].domain))" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get product by domain (using first product's domain)
if ($products -and $products.Count -gt 0) {
    $testDomain = $products[0].domain
    Write-Host "`n2. Testing GET /products/domain/$testDomain" -ForegroundColor Cyan
    try {
        $product = Invoke-RestMethod -Uri "$baseUrl/products/domain/$testDomain" -Method GET -Headers $headers
        Write-Host "✓ Product found: $($product.name)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 3: Get product help content (public)
    Write-Host "`n3. Testing GET /product-help/public/$testDomain" -ForegroundColor Cyan
    try {
        $helpData = Invoke-RestMethod -Uri "$baseUrl/product-help/public/$testDomain" -Method GET -Headers $headers
        Write-Host "✓ Help data retrieved:" -ForegroundColor Green
        Write-Host "  - FAQs: $($helpData.faqs.Count)" -ForegroundColor Gray
        Write-Host "  - Articles: $($helpData.articles.Count)" -ForegroundColor Gray
        Write-Host "  - FAQ Categories: $($helpData.faqCategories.Count)" -ForegroundColor Gray
        Write-Host "  - Article Categories: $($helpData.articleCategories.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 4: Search help content
    Write-Host "`n4. Testing GET /product-help/public/$testDomain/search" -ForegroundColor Cyan
    try {
        $searchResults = Invoke-RestMethod -Uri "$baseUrl/product-help/public/$testDomain/search?keyword=machine" -Method GET -Headers $headers
        Write-Host "✓ Search results:" -ForegroundColor Green
        Write-Host "  - FAQs found: $($searchResults.totalFaqs)" -ForegroundColor Gray
        Write-Host "  - Articles found: $($searchResults.totalArticles)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 5: Get public FAQs
    Write-Host "`n5. Testing GET /faq/public/product/$testDomain" -ForegroundColor Cyan
    try {
        $faqs = Invoke-RestMethod -Uri "$baseUrl/faq/public/product/$testDomain" -Method GET -Headers $headers
        Write-Host "✓ FAQs retrieved: $($faqs.content.Count) items" -ForegroundColor Green
        if ($faqs.content.Count -gt 0) {
            Write-Host "First FAQ: $($faqs.content[0].question)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 6: Get public articles
    Write-Host "`n6. Testing GET /knowledge-base/articles/public/product/$testDomain" -ForegroundColor Cyan
    try {
        $articles = Invoke-RestMethod -Uri "$baseUrl/knowledge-base/articles/public/product/$testDomain" -Method GET -Headers $headers
        Write-Host "✓ Articles retrieved: $($articles.content.Count) items" -ForegroundColor Green
        if ($articles.content.Count -gt 0) {
            Write-Host "First article: $($articles.content[0].title)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 7: Create a test ticket (public)
    Write-Host "`n7. Testing POST /product-help/public/$testDomain/ticket" -ForegroundColor Cyan
    $ticketData = @{
        title = "Test API Ticket - Machine Not Found"
        description = "This is a test ticket created via API to verify the ticket creation endpoint is working properly. The machine ABC-123 is not appearing in the inventory search results."
        category = "Technical Issue"
        priority = "MEDIUM"
        createdBy = "test@example.com"
    } | ConvertTo-Json

    try {
        $newTicket = Invoke-RestMethod -Uri "$baseUrl/product-help/public/$testDomain/ticket" -Method POST -Headers $headers -Body $ticketData
        Write-Host "✓ Ticket created successfully!" -ForegroundColor Green
        Write-Host "  - Ticket ID: $($newTicket.id)" -ForegroundColor Gray
        Write-Host "  - Status: $($newTicket.status)" -ForegroundColor Gray
        Write-Host "  - Created: $($newTicket.createdAt)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 8: Get FAQ categories
    Write-Host "`n8. Testing GET /faq/public/product/$testDomain/categories" -ForegroundColor Cyan
    try {
        $faqCategories = Invoke-RestMethod -Uri "$baseUrl/faq/public/product/$testDomain/categories" -Method GET -Headers $headers
        Write-Host "✓ FAQ Categories: $($faqCategories.Count)" -ForegroundColor Green
        $faqCategories | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 9: Get article categories
    Write-Host "`n9. Testing GET /knowledge-base/articles/public/product/$testDomain/categories" -ForegroundColor Cyan
    try {
        $articleCategories = Invoke-RestMethod -Uri "$baseUrl/knowledge-base/articles/public/product/$testDomain/categories" -Method GET -Headers $headers
        Write-Host "✓ Article Categories: $($articleCategories.Count)" -ForegroundColor Green
        $articleCategories | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Product Help API Test Complete ===" -ForegroundColor Green
Write-Host "`nTo test the frontend:" -ForegroundColor Yellow
Write-Host "1. Start the frontend: cd frontend; npm run dev" -ForegroundColor Gray
Write-Host "2. Visit the help center: http://localhost:5173/help" -ForegroundColor Gray
Write-Host "3. Visit public help: http://localhost:5173/public-help/inventory.acme.com" -ForegroundColor Gray
