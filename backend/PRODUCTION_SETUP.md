# Production Configuration for ZioHelp Multi-Product Help System

## Database Setup
```sql
-- This schema supports multiple products with integrated FAQ, Knowledge Base, and Ticketing system
-- All tables are already created in data.sql with proper relationships and constraints

-- Key Features:
-- 1. Products can have their own FAQs, articles, and tickets
-- 2. Public access via product domain
-- 3. Category-based organization
-- 4. Full-text search capabilities
-- 5. Role-based access control
```

## Application Properties for Production
Create application-production.properties:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/ziohelp_prod
spring.datasource.username=${DB_USERNAME:ziohelp_user}
spring.datasource.password=${DB_PASSWORD:secure_password}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=false

# Server Configuration
server.port=${PORT:8080}
server.servlet.context-path=/api

# Security Configuration
app.jwtSecret=${JWT_SECRET:mySecretKey}
app.jwtExpirationInMs=86400000

# Email Configuration
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME:your-email@company.com}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging Configuration
logging.level.com.ziohelp=INFO
logging.level.org.springframework.security=WARN
logging.pattern.file=%d{ISO8601} [%thread] %-5level %logger{36} - %msg%n
logging.file.name=logs/ziohelp.log

# Production Specific
spring.profiles.active=production
management.endpoints.web.exposure.include=health,metrics
management.endpoint.health.show-details=when-authorized
```

## Docker Configuration

### Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim

VOLUME /tmp

COPY target/ziohelp-backend-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app.jar","--spring.profiles.active=production"]
```

### docker-compose.production.yml
```yaml
version: '3.8'
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: ziohelp_prod
      POSTGRES_USER: ziohelp_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./src/main/resources/data.sql:/docker-entrypoint-initdb.d/data.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  backend:
    build: .
    environment:
      DB_USERNAME: ziohelp_user
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      MAIL_HOST: ${MAIL_HOST}
      MAIL_USERNAME: ${MAIL_USERNAME}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
    ports:
      - "8080:8080"
    depends_on:
      - database
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs

volumes:
  postgres_data:
```

## API Endpoints Overview

### Public Endpoints (No Authentication)
- `GET /api/product-help/public/{domain}` - Get all help content for a product
- `POST /api/product-help/public/{domain}/ticket` - Create support ticket
- `GET /api/product-help/public/{domain}/search` - Search help content
- `GET /api/faq/public/product/{domain}` - Get public FAQs
- `GET /api/knowledge-base/articles/public/product/{domain}` - Get public articles

### Product Management (Admin/Tenant Admin)
- `GET /api/products/list` - List all products
- `POST /api/products/create` - Create new product
- `PUT /api/products/{id}/update` - Update product
- `DELETE /api/products/{id}/delete` - Delete product

### FAQ Management
- `GET /api/faq/product/{productId}` - Get FAQs by product
- `POST /api/faq/product/{productId}` - Create FAQ for product
- `GET /api/faq/product/{productId}/search` - Search FAQs
- `GET /api/faq/product/{productId}/categories` - Get FAQ categories

### Knowledge Base Management
- `GET /api/knowledge-base/articles/product/{productId}` - Get articles by product
- `POST /api/knowledge-base/articles/product/{productId}` - Create article for product
- `GET /api/knowledge-base/articles/product/{productId}/search` - Search articles
- `GET /api/knowledge-base/articles/product/{productId}/categories` - Get article categories

### Ticket Management
- `GET /api/tickets/product/{productId}` - Get tickets by product
- `POST /api/tickets/product/{productId}` - Create ticket for product
- `GET /api/tickets/product/{productId}/search` - Search tickets
- `PUT /api/tickets/{id}/status` - Update ticket status

### Integrated Help System
- `GET /api/product-help/product/{productId}/dashboard` - Complete help dashboard
- `GET /api/product-help/product/{productId}/all` - All help content
- `GET /api/product-help/product/{productId}/search` - Search all content
- `GET /api/product-help/product/{productId}/stats` - Help statistics

## Frontend Integration

### Sample API Usage for Machine Inventory System

```javascript
// Get all help content for Machine Inventory
const response = await fetch('/api/product-help/public/inventory.acme.com');
const helpData = await response.json();

// Create a support ticket
const ticketData = {
  title: "Machine ABC-123 not appearing in search",
  description: "Unable to find machine in inventory",
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
const searchResponse = await fetch('/api/product-help/public/inventory.acme.com/search?keyword=machine');
const searchResults = await searchResponse.json();
```

## Production Deployment Steps

1. **Database Setup**
   ```bash
   # Create production database
   createdb ziohelp_prod
   psql ziohelp_prod < src/main/resources/data.sql
   ```

2. **Build Application**
   ```bash
   mvn clean package -Pproduction
   ```

3. **Set Environment Variables**
   ```bash
   export DB_PASSWORD=your_secure_password
   export JWT_SECRET=your_jwt_secret_key
   export MAIL_HOST=your_mail_host
   export MAIL_USERNAME=your_mail_username
   export MAIL_PASSWORD=your_mail_password
   ```

4. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

5. **Verify Deployment**
   ```bash
   curl http://localhost:8080/api/products/list
   curl http://localhost:8080/api/product-help/public/inventory.acme.com
   ```

## Product Configuration Examples

### Machine Inventory System (inventory.acme.com)
- **Categories**: Getting Started, Maintenance, Reports, Configuration
- **Common Issues**: Machine not found, Maintenance scheduling, Report generation
- **Integration**: Direct embedding in inventory application

### Customer Support Portal (support.beta.com)
- **Categories**: Ticket Management, Customer Experience, Automation
- **Common Issues**: Ticket escalation, Response templates, SLA management
- **Integration**: Widget embedding for customer support

### Digital Asset Manager (assets.gamma.com)
- **Categories**: File Management, Organization, Security
- **Common Issues**: File upload limits, Permission settings, Asset search
- **Integration**: Help sidebar in asset management interface

## Security Considerations

1. **API Rate Limiting**: Implement rate limiting for public endpoints
2. **CORS Configuration**: Configure appropriate CORS settings
3. **Input Validation**: Validate all input data
4. **SQL Injection Prevention**: Use parameterized queries
5. **Authentication**: JWT-based authentication for admin functions
6. **HTTPS**: Use HTTPS in production
7. **Database Security**: Use encrypted connections and strong passwords

## Monitoring and Maintenance

1. **Health Checks**: Monitor application health endpoints
2. **Log Analysis**: Monitor application logs for errors
3. **Database Monitoring**: Track database performance
4. **Content Management**: Regular review of FAQs and articles
5. **Ticket Analytics**: Monitor ticket patterns and response times

## Performance Optimization

1. **Database Indexing**: Proper indexes on search fields
2. **Caching**: Implement Redis caching for frequently accessed data
3. **Pagination**: Use pagination for large result sets
4. **Connection Pooling**: Configure database connection pooling
5. **CDN**: Use CDN for static content delivery
