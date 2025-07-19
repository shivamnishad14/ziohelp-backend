# ZioHelp Backend

AI-powered Helpdesk SaaS backend using Spring Boot and PostgreSQL.

## Features
- Role-based access control
- Guest ticket creation
- Ticket assignment, status, comment
- JWT Auth
- Email notifications
- WebSocket notifications
- Docker support

## API Documentation

The backend exposes a RESTful API. You can access the Swagger UI for interactive API documentation after starting the server at:

```
http://localhost:8080/swagger-ui.html
```

### Main Endpoints

- **Auth**
  - `POST /api/auth/login` — User login
  - `POST /api/auth/register` — User registration
  - `POST /api/auth/logout` — User logout
  - `GET /api/auth/me` — Get current user
- **Users**
  - `GET /api/users` — List users
  - `POST /api/users` — Create user
  - `PUT /api/users/{id}` — Update user
  - `DELETE /api/users/{id}` — Delete user
- **Tickets**
  - `GET /api/tickets` — List tickets
  - `POST /api/tickets` — Create ticket
  - `PUT /api/tickets/{id}` — Update ticket
  - `DELETE /api/tickets/{id}` — Delete ticket
- **Products**
  - `GET /api/products` — List products
  - `POST /api/products` — Create product
  - `PUT /api/products/{id}` — Update product
  - `DELETE /api/products/{id}` — Delete product
- **FAQ**
  - `GET /api/faq` — List FAQs
  - `POST /api/faq` — Create FAQ
  - `PUT /api/faq/{id}` — Update FAQ
  - `DELETE /api/faq/{id}` — Delete FAQ
- **Notifications**
  - `GET /api/notifications` — List notifications
  - `POST /api/notifications` — Create notification

> For a full list and details, see Swagger UI.

## Environment Variables

Set the following environment variables (or add to `src/main/resources/application.properties`):

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ziohelp
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email_user
EMAIL_PASSWORD=your_email_password
```

## Run Locally

```bash
mvn clean install
java -jar target/ziohelp-backend.jar
```

## Docker

```bash
docker-compose up --build
```

## Running Tests

```bash
mvn test
```

## Deployment

- Ensure environment variables are set for production
- Build the JAR: `mvn clean package`
- Deploy the JAR to your server or use Docker
- For Docker: `docker-compose up --build -d`

## Troubleshooting

- **Database connection errors:** Check your PostgreSQL credentials and network.
- **Port conflicts:** Ensure port 8080 is free or change it in `application.properties`.
- **Email not sending:** Verify SMTP settings and credentials.
- **JWT errors:** Ensure `JWT_SECRET` is set and matches between backend and frontend.

## Support

For support and questions, please open an issue in the repository.
