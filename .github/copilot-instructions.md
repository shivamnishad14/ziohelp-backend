# GitHub Copilot Instructions for ZioHelp Project

## Project Overview
ZioHelp is an AI-powered Helpdesk SaaS application with a Spring Boot backend and React frontend.

## Technical Stack

### Backend (Spring Boot)
- Java 17
- Spring Boot 3.2.5
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL database
- WebSocket for real-time features
- Email service integration
- Swagger/OpenAPI documentation
- Google Cloud Vertex AI integration

### Frontend (React)
- React with TypeScript
- Radix UI components
- React Query for API state management
- React Hook Form for forms
- STOMP/WebSocket for real-time features
- Tailwind CSS for styling

## Code Organization

### Backend Structure
- `src/main/java/com/ziohelp/` - Main application code
- `src/main/resources/` - Configuration files and templates
- `src/test/` - Test cases

### Frontend Structure
- `frontend/src/components/` - Reusable UI components
- `frontend/src/context/` - React context providers
- `frontend/src/hooks/` - Custom React hooks
- `frontend/src/services/` - API services
- `frontend/src/types/` - TypeScript type definitions
- `frontend/src/utils/` - Utility functions

## Coding Guidelines

### Backend Guidelines
1. Follow Spring Boot best practices and conventions
2. Use constructor injection for dependencies
3. Implement proper error handling with custom exceptions
4. Write unit tests for business logic
5. Document APIs with OpenAPI annotations
6. Follow RESTful API design principles
7. Use JPA entities with proper relationships
8. Implement proper validation using Bean Validation

### Frontend Guidelines
1. Use TypeScript for all new code
2. Create reusable components in `components/` directory
3. Use React Query for API calls
4. Implement proper form validation with React Hook Form
5. Use Radix UI components for accessibility
6. Follow the existing component structure
7. Use custom hooks for shared logic
8. Maintain proper type definitions

## Common Tasks

### Adding New API Endpoints
1. Create appropriate DTOs
2. Implement service layer logic
3. Create controller with proper annotations
4. Document with OpenAPI annotations
5. Add corresponding frontend API service
6. Update TypeScript types

### Adding New Features
1. Consider multi-tenant implications
2. Implement proper authorization checks
3. Add necessary database migrations
4. Update API documentation
5. Consider real-time update requirements
6. Add proper error handling
7. Include audit logging where needed

### Security Considerations
1. Always use RBAC annotations
2. Validate input data
3. Use prepared statements for SQL
4. Implement rate limiting where needed
5. Follow security best practices
6. Handle sensitive data appropriately

## AI Integration Guidelines
1. Use appropriate AI model settings
2. Implement proper error handling for AI calls
3. Consider rate limits and costs
4. Cache responses where appropriate
5. Validate AI responses before using

## Testing Requirements
1. Write unit tests for business logic
2. Include integration tests for APIs
3. Test multi-tenant scenarios
4. Verify WebSocket functionality
5. Test error scenarios
6. Validate email notifications
