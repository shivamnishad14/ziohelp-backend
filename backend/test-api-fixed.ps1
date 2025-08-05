# Product Help API Test Script
# This script tests all the product help API endpoints

$baseUrl = "http://localhost:8080/api"
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "=== Testing Product Help API ===" -ForegroundColor Green
Write-Host "Base URL: $baseUrl" -ForegroundColor Gray

# Test data
$testDomain = "inventory.acme.com"
$testProduct = @{
    name = "ACME Inventory System"
    domain = $testDomain
    description = "Complete inventory management solution"
    active = $true
}

try {
    # Test 1: Get all products
    Write-Host "`n1. Testing GET /products" -ForegroundColor Cyan
    $products = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET -Headers $headers
    Write-Host "Products found: $($products.Count)" -ForegroundColor Green

    # Test 2: Create a product
    Write-Host "`n2. Testing POST /products" -ForegroundColor Cyan
    $newProduct = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Headers $headers -Body ($testProduct | ConvertTo-Json)
    Write-Host "Product created with ID: $($newProduct.id)" -ForegroundColor Green
    $productId = $newProduct.id

    # Test 3: Get product by ID
    Write-Host "`n3. Testing GET /products/$productId" -ForegroundColor Cyan
    $product = Invoke-RestMethod -Uri "$baseUrl/products/$productId" -Method GET -Headers $headers
    Write-Host "Product retrieved: $($product.name)" -ForegroundColor Green

    # Test 4: Get product by domain
    Write-Host "`n4. Testing GET /products/domain/$testDomain" -ForegroundColor Cyan
    $productByDomain = Invoke-RestMethod -Uri "$baseUrl/products/domain/$testDomain" -Method GET -Headers $headers
    Write-Host "Product by domain: $($productByDomain.name)" -ForegroundColor Green

    # Test 5: Create FAQ
    Write-Host "`n5. Testing POST /faq" -ForegroundColor Cyan
    $faqData = @{
        productId = $productId
        question = "How do I add inventory items?"
        answer = "Navigate to the Inventory section and click Add Item button."
        category = "Getting Started"
        priority = 1
    }
    $newFaq = Invoke-RestMethod -Uri "$baseUrl/faq" -Method POST -Headers $headers -Body ($faqData | ConvertTo-Json)
    Write-Host "FAQ created with ID: $($newFaq.id)" -ForegroundColor Green

    # Test 6: Get FAQs for product
    Write-Host "`n6. Testing GET /faq/product/$productId" -ForegroundColor Cyan
    $faqs = Invoke-RestMethod -Uri "$baseUrl/faq/product/$productId" -Method GET -Headers $headers
    Write-Host "FAQs found: $($faqs.Count)" -ForegroundColor Green

    # Test 7: Create knowledge base article
    Write-Host "`n7. Testing POST /knowledge-base/articles" -ForegroundColor Cyan
    $articleData = @{
        productId = $productId
        title = "Inventory Management Best Practices"
        content = "This article covers best practices for managing inventory..."
        category = "Best Practices"
        tags = @("inventory", "management", "tips")
        published = $true
    }
    $newArticle = Invoke-RestMethod -Uri "$baseUrl/knowledge-base/articles" -Method POST -Headers $headers -Body ($articleData | ConvertTo-Json)
    Write-Host "Article created with ID: $($newArticle.id)" -ForegroundColor Green

    # Test 8: Get articles for product
    Write-Host "`n8. Testing GET /knowledge-base/articles/product/$productId" -ForegroundColor Cyan
    $articles = Invoke-RestMethod -Uri "$baseUrl/knowledge-base/articles/product/$productId" -Method GET -Headers $headers
    Write-Host "Articles found: $($articles.Count)" -ForegroundColor Green

    # Test 9: Search content
    Write-Host "`n9. Testing GET /search/content?productId=$productId&query=inventory" -ForegroundColor Cyan
    $searchResults = Invoke-RestMethod -Uri "$baseUrl/search/content?productId=$productId&query=inventory" -Method GET -Headers $headers
    Write-Host "Search results: $($searchResults.Count)" -ForegroundColor Green

    Write-Host "`n=== All Tests Passed! ===" -ForegroundColor Green

} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Yellow
}

Write-Host "`nTo test the frontend:" -ForegroundColor Yellow
Write-Host "1. Start the frontend: cd frontend; npm run dev" -ForegroundColor Gray
Write-Host "2. Visit the help center: http://localhost:5173/help" -ForegroundColor Gray
Write-Host "3. Visit public help: http://localhost:5173/public-help/$testDomain" -ForegroundColor Gray
