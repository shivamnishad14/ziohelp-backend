# ZioHelp Multi-Product Help System

A comprehensive, production-ready help system that integrates FAQ management, Knowledge Base articles, and ticketing for multiple software products.

## 🚀 Features

### Core Functionality
- **Multi-Product Support**: Each product gets its own dedicated help system
- **FAQ Management**: Product-specific FAQs with categories and search
- **Knowledge Base**: Rich articles with markdown support and categorization
- **Ticketing System**: Product-specific support tickets with workflow management
- **Public API**: Public endpoints for seamless integration into any product
- **Admin Dashboard**: Complete management interface for content and analytics

### Product Integration Examples
- **Machine Inventory System** (`inventory.acme.com`)
- **Customer Support Portal** (`support.beta.com`) 
- **Digital Asset Manager** (`assets.gamma.com`)
- **ERP Finance Module** (`finance.acme.com`)
- **HR Management System** (`hr.beta.com`)

## 🏗️ Architecture

### Database Schema
```sql
-- Core entities with relationships
- products (id, name, domain, description, status)
- faq (id, question, answer, product_id, category, is_published)
- knowledge_base_article (id, title, content, product_id, category, is_published) 
- ticket (id, title, description, product_id, status, category, created_by)
- organizations (id, name, description)
- users (id, email, role, organization_id)
```

### API Structure
```
/api/
├── product-help/           # Integrated help system
│   ├── public/{domain}/    # Public product endpoints
│   └── product/{id}/       # Authenticated product endpoints
├── products/               # Product management
├── faq/                   # FAQ management
│   └── product/{id}/      # Product-specific FAQs
├── knowledge-base/        # Article management
│   └── articles/product/{id}/ # Product-specific articles
└── tickets/               # Ticket management
    └── product/{id}/      # Product-specific tickets
```

## 🚀 Quick Start

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb ziohelp_prod

# Initialize with sample data
psql ziohelp_prod < src/main/resources/data.sql
```

### 2. Configuration
```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ziohelp_prod
spring.datasource.username=ziohelp_user
spring.datasource.password=your_password

app.jwtSecret=your_jwt_secret
spring.mail.host=your_mail_host
```

### 3. Build & Run
```bash
# Build the application
mvn clean package

# Run with production profile
java -jar target/ziohelp-backend-*.jar --spring.profiles.active=production
```

### 4. Test the API
```bash
# Run the comprehensive test suite
powershell -ExecutionPolicy Bypass -File test-product-api.ps1
```

## 📖 API Documentation

### Public Endpoints (No Authentication)

#### Get All Help Content for a Product
```bash
GET /api/product-help/public/{domain}
# Example: GET /api/product-help/public/inventory.acme.com
```

#### Create Support Ticket
```bash
POST /api/product-help/public/{domain}/ticket
Content-Type: application/json

{
  "title": "Machine ABC-123 not appearing in search",
  "description": "Unable to find machine in inventory system",
  "category": "Technical Issue",
  "createdBy": "user@company.com",
  "priority": "HIGH"
}
```

#### Search Help Content
```bash
GET /api/product-help/public/{domain}/search?keyword=machine
```

### Product-Specific Endpoints

#### Get Product FAQs
```bash
GET /api/faq/product/{productId}
GET /api/faq/product/{productId}/category/{category}
GET /api/faq/product/{productId}/search?keyword=maintenance
```

#### Get Knowledge Base Articles
```bash
GET /api/knowledge-base/articles/product/{productId}
GET /api/knowledge-base/articles/product/{productId}/category/{category}
GET /api/knowledge-base/articles/product/{productId}/search?keyword=setup
```

#### Ticket Management
```bash
GET /api/tickets/product/{productId}
POST /api/tickets/product/{productId}
PUT /api/tickets/{ticketId}/status
```

### Admin Endpoints (Authentication Required)

#### Product Help Dashboard
```bash
GET /api/product-help/product/{productId}/dashboard
# Returns: product info, statistics, recent content, categories
```

#### Content Management
```bash
POST /api/faq/product/{productId}
POST /api/knowledge-base/articles/product/{productId}
PUT /api/faq/{id}/toggle-publication
```

## 🔧 Integration Examples

### JavaScript/React Integration
```javascript
// Get all help content for Machine Inventory
const response = await fetch('/api/product-help/public/inventory.acme.com');
const helpData = await response.json();

console.log('FAQs:', helpData.faqs.content);
console.log('Articles:', helpData.articles.content);

// Create support ticket
const ticketData = {
  title: "Machine not found in search",
  description: "Unable to locate machine ABC-123",
  category: "Technical Issue",
  createdBy: "user@company.com",
  priority: "HIGH"
};

const ticketResponse = await fetch('/api/product-help/public/inventory.acme.com/ticket', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(ticketData)
});

// Search help content
const searchResponse = await fetch('/api/product-help/public/inventory.acme.com/search?keyword=maintenance');
const searchResults = await searchResponse.json();
```

### Help Widget Integration
```html
<!-- Embed help widget in your product -->
<div id="ziohelp-widget" 
     data-product-domain="inventory.acme.com"
     data-api-base="/api">
</div>

<script>
// Initialize help widget
ZioHelp.init({
  domain: 'inventory.acme.com',
  apiBase: '/api',
  showFAQs: true,
  showArticles: true,
  allowTicketCreation: true
});
</script>
```

## 🎯 Use Cases

### 1. Machine Inventory System Integration
```javascript
// Get inventory-specific help
const inventoryHelp = await fetch('/api/product-help/public/inventory.acme.com');

// Common categories: Getting Started, Maintenance, Reports, Configuration
// Common issues: Machine not found, Maintenance scheduling, Report generation
```

### 2. Customer Support Portal Integration  
```javascript
// Get support-specific help
const supportHelp = await fetch('/api/product-help/public/support.beta.com');

// Categories: Ticket Management, Customer Experience, Automation
// Features: Ticket escalation, Response templates, SLA management
```

### 3. Digital Asset Manager Integration
```javascript
// Get asset management help
const assetHelp = await fetch('/api/product-help/public/assets.gamma.com');

// Categories: File Management, Organization, Security
// Features: Upload limits, Permission settings, Asset search
```

## 📊 Sample Data

The system comes pre-loaded with:
- **5 Products**: Machine Inventory, Support Portal, Asset Manager, ERP Finance, HR System
- **10 FAQs**: Product-specific questions and answers
- **4 Knowledge Base Articles**: Detailed setup and troubleshooting guides
- **5 Sample Tickets**: Various categories and priorities
- **User Roles**: Admin, Developer, User, Guest

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin, Developer, User, Guest roles
- **Public API**: Safe public endpoints for product integration
- **Input Validation**: Comprehensive input sanitization
- **CORS Support**: Configurable cross-origin requests

## 🚀 Production Deployment

### Docker Deployment
```bash
# Using Docker Compose
docker-compose -f docker-compose.production.yml up -d
```

### Environment Variables
```bash
export DB_PASSWORD=secure_password
export JWT_SECRET=your_jwt_secret
export MAIL_HOST=smtp.company.com
export MAIL_USERNAME=noreply@company.com
export MAIL_PASSWORD=mail_password
```

### Health Monitoring
```bash
# Check application health
curl http://localhost:8080/actuator/health

# Monitor metrics
curl http://localhost:8080/actuator/metrics
```

## 🎨 Frontend Integration

### React Component Example
```jsx
import React, { useState, useEffect } from 'react';

const ProductHelp = ({ domain }) => {
  const [helpData, setHelpData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`/api/product-help/public/${domain}`)
      .then(res => res.json())
      .then(data => setHelpData(data));
  }, [domain]);

  const handleSearch = () => {
    fetch(`/api/product-help/public/${domain}/search?keyword=${searchTerm}`)
      .then(res => res.json())
      .then(data => setHelpData(data));
  };

  return (
    <div className="product-help">
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search help content..."
      />
      <button onClick={handleSearch}>Search</button>
      
      {helpData && (
        <>
          <section>
            <h3>FAQs</h3>
            {helpData.faqs.content.map(faq => (
              <div key={faq.id}>
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>
          
          <section>
            <h3>Articles</h3>
            {helpData.articles.content.map(article => (
              <div key={article.id}>
                <h4>{article.title}</h4>
                <p>{article.content.substring(0, 200)}...</p>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default ProductHelp;
```

## 📈 Analytics & Reporting

### Help Content Statistics
```javascript
// Get comprehensive statistics
const stats = await fetch('/api/product-help/product/1/stats');
const data = await stats.json();

console.log('FAQ Count:', data.faqs.total);
console.log('Article Count:', data.articles.total);
console.log('Open Tickets:', data.tickets.open);
console.log('Categories:', data.faqs.categories);
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@ziohelp.com
- Documentation: https://docs.ziohelp.com

---

**Ready for Production** ✅
- Comprehensive API testing
- Security implemented
- Database relationships optimized
- Error handling included
- Documentation complete
