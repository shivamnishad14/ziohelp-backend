# ZioHelp Backend

AI-powered Helpdesk SaaS backend built with Spring Boot, PostgreSQL, and Google Cloud Vertex AI.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (RBAC)
- **Ticket Management**: Complete ticket lifecycle with status tracking, comments, and history
- **Real-time Updates**: WebSocket support for live notifications and dashboard updates
- **AI Integration**: Gemini AI for chatbot, ticket analysis, and smart assistance
- **Analytics & Reporting**: Comprehensive dashboards with exportable reports
- **Email Notifications**: HTML email templates for all system events
- **Multi-tenant Support**: Organization-based data isolation
- **API Documentation**: Swagger/OpenAPI 3.0 documentation
- **Guest Ticket Flow**: Public ticket creation and tracking without login

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.5
- **Database**: PostgreSQL 15+
- **Authentication**: JWT with Spring Security
- **Real-time**: WebSocket with STOMP
- **AI**: Google Cloud Vertex AI (Gemini)
- **Email**: Spring Mail with Thymeleaf templates
- **Documentation**: Swagger/OpenAPI 3.0
- **Build Tool**: Maven
- **Java Version**: 17+

## 📋 Prerequisites

- Java 17 or higher
- PostgreSQL 15 or higher
- Maven 3.6+
- Google Cloud account (for AI features)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ziohelp-backend
```

### 2. Database Setup

```sql
-- Create database
CREATE DATABASE ziohelp;

-- Create user (optional)
CREATE USER ziohelp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ziohelp TO ziohelp_user;
```

### 3. Environment Configuration

Create `application.properties` or set environment variables:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/ziohelp
spring.datasource.username=ziohelp_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=your_jwt_secret_key_here_make_it_long_and_secure
jwt.expiration=86400000

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Google Cloud Vertex AI (Optional)
gemini.api.key=your_gemini_api_key
gemini.project.id=your_project_id
gemini.location=us-central1

# Application Configuration
app.frontend.url=http://localhost:3000
server.port=8080
```

### 4. Run the Application

```bash
# Using Maven
mvn spring-boot:run

# Or build and run
mvn clean package
java -jar target/ziohelp-backend-0.0.1-SNAPSHOT.jar
```

### 5. Access the Application

- **API Base URL**: `http://localhost:8080/api/v1`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/actuator/health`

## 🔐 Authentication

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@ziohelp.com",
  "password": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "roles": ["ADMIN"],
  "userId": 16,
  "email": "admin@ziohelp.com",
  "fullName": "ZioHelp Admin"
}
```

### Authorization

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

| Role | Permissions | Dashboard |
|------|-------------|-----------|
| **ADMIN** | Full system access, user management, analytics | `/admin/dashboard` |
| **TENANT_ADMIN** | Organization management, user management | `/tenant/dashboard` |
| **DEVELOPER** | Ticket management, technical support | `/developer/dashboard` |
| **USER** | Create/view own tickets, basic features | `/dashboard` |
| **GUEST** | Public ticket creation/tracking | No login required |

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Tickets
- `GET /api/v1/tickets` - List tickets (with pagination, search, sorting)
- `POST /api/v1/tickets/create` - Create new ticket
- `GET /api/v1/tickets/{id}` - Get ticket details
- `PUT /api/v1/tickets/{id}/update` - Update ticket
- `DELETE /api/v1/tickets/{id}/delete` - Delete ticket
- `POST /api/v1/tickets/{id}/comments/add` - Add comment
- `GET /api/v1/tickets/{id}/comments` - Get ticket comments
- `PUT /api/v1/tickets/{id}/status` - Update ticket status

### Guest Tickets
- `POST /api/v1/tickets/public-create` - Create ticket without login
- `GET /api/v1/tickets/public-track` - Track ticket by ID and email

### Users
- `GET /api/v1/users/all` - List users (admin only)
- `POST /api/v1/users/create` - Create user
- `PUT /api/v1/users/{id}/update` - Update user
- `DELETE /api/v1/users/{id}/delete` - Delete user
- `PUT /api/v1/users/{id}/role` - Update user role

### Dashboard & Analytics
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/ticket-trends` - Get ticket trends
- `GET /api/v1/dashboard/user-activity` - Get user activity
- `GET /api/v1/dashboard/product-metrics` - Get product metrics
- `GET /api/v1/dashboard/sla-compliance` - Get SLA compliance
- `GET /api/v1/dashboard/export/report` - Export dashboard report

### AI Features
- `POST /api/v1/ai/chat` - Chat with AI assistant
- `POST /api/v1/ai/analyze-ticket` - Analyze ticket with AI
- `POST /api/v1/ai/generate-response` - Generate AI response
- `POST /api/v1/ai/search-knowledge` - Search knowledge base
- `POST /api/v1/ai/suggest-faq` - Suggest FAQ articles
- `POST /api/v1/ai/auto-categorize` - Auto-categorize tickets
- `GET /api/v1/ai/status` - Get AI service status

### FAQ/Knowledge Base
- `GET /api/v1/faq` - List FAQ articles
- `POST /api/v1/faq/create` - Create FAQ article
- `PUT /api/v1/faq/{id}/update` - Update FAQ article
- `DELETE /api/v1/faq/{id}/delete` - Delete FAQ article

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/{id}/seen` - Mark notification as seen
- `PUT /api/v1/notifications/mark-all-seen` - Mark all notifications as seen

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/ziohelp` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `ziohelp_user` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRATION` | JWT expiration time (ms) | `86400000` |
| `SPRING_MAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `SPRING_MAIL_PORT` | SMTP server port | `587` |
| `SPRING_MAIL_USERNAME` | Email username | - |
| `SPRING_MAIL_PASSWORD` | Email password | - |
| `GEMINI_API_KEY` | Google Cloud API key | - |
| `GEMINI_PROJECT_ID` | Google Cloud project ID | - |
| `GEMINI_LOCATION` | Google Cloud location | `us-central1` |
| `APP_FRONTEND_URL` | Frontend URL | `http://localhost:3000` |
| `SERVER_PORT` | Server port | `8080` |

### Database Schema

The application uses JPA/Hibernate with automatic schema generation. Key entities:

- **User**: User accounts with roles and organizations
- **Ticket**: Support tickets with status, priority, and comments
- **Comment**: Ticket comments and responses
- **FAQ**: Knowledge base articles
- **Notification**: System notifications
- **AuditLog**: User action audit trail
- **Organization**: Multi-tenant organization support

## 🧪 Testing

### Run Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthControllerTest

# Run with coverage
mvn test jacoco:report
```

### Test Data

The application includes seed data in `src/main/resources/data.sql`:

- **Admin User**: `admin@ziohelp.com` / `admin`
- **Sample Users**: Various users with different roles
- **Sample Tickets**: Test tickets for different scenarios
- **Sample FAQs**: Knowledge base articles

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/ziohelp-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
# Build Docker image
docker build -t ziohelp-backend .

# Run with environment variables
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ziohelp \
  -e SPRING_DATASOURCE_USERNAME=ziohelp_user \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  ziohelp-backend
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ziohelp
      - SPRING_DATASOURCE_USERNAME=ziohelp_user
      - SPRING_DATASOURCE_PASSWORD=your_password
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=ziohelp
      - POSTGRES_USER=ziohelp_user
      - POSTGRES_PASSWORD=your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🔍 Monitoring & Logging

### Health Checks

- **Application Health**: `GET /actuator/health`
- **Database Health**: `GET /actuator/health/db`
- **Disk Space**: `GET /actuator/health/disk`

### Logging

Logs are configured in `src/main/resources/logback-spring.xml`:

```xml
<!-- Application logs -->
<logger name="com.ziohelp" level="INFO"/>

<!-- SQL queries (development only) -->
<logger name="org.hibernate.SQL" level="DEBUG"/>
<logger name="org.hibernate.type.descriptor.sql.BasicBinder" level="TRACE"/>
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify database credentials
   - Ensure database exists

2. **JWT Token Issues**
   - Verify JWT secret is set
   - Check token expiration
   - Ensure proper Authorization header format

3. **Email Not Sending**
   - Check SMTP configuration
   - Verify email credentials
   - Test with `POST /api/v1/email/test`

4. **AI Features Not Working**
   - Verify Google Cloud credentials
   - Check API key permissions
   - Ensure project ID is correct

5. **WebSocket Connection Failed**
   - Check CORS configuration
   - Verify WebSocket endpoint
   - Test with browser WebSocket client

### Debug Mode

Enable debug logging:

```properties
logging.level.com.ziohelp=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Performance Tuning

```properties
# Database connection pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5

# JPA/Hibernate
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Cache configuration
spring.cache.type=caffeine
spring.cache.cache-names=tickets,users,faq
```

## 📚 API Documentation

### Swagger UI

Access the interactive API documentation at:
`http://localhost:8080/swagger-ui.html`

### OpenAPI Specification

Download the OpenAPI 3.0 specification:
`http://localhost:8080/v3/api-docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and API docs
- **Issues**: Create an issue on GitHub
- **Email**: support@ziohelp.com

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release
- Complete ticket management system
- AI integration with Gemini
- Real-time notifications
- Multi-tenant support
- Comprehensive analytics
- Email notifications
- Guest ticket flow
- Role-based access control
