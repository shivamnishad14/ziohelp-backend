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

## Run locally
```bash
mvn clean install
java -jar target/ziohelp-backend.jar
```

## Docker
```bash
docker-compose up --build
```
