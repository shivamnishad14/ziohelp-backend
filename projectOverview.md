Project Overview
Name: ZioHelp (AI-powered Helpdesk SaaS)
Purpose:
A full-stack, AI-powered helpdesk system designed for SaaS use, supporting multi-tenant organizations, ticket management, real-time updates, analytics, and AI-driven assistance.

Backend (Spring Boot, Java, PostgreSQL, Google Cloud Vertex AI)
Key Features:
Authentication & Authorization: JWT-based, with role-based access control (RBAC).
Ticket Management: Full ticket lifecycle, comments, status tracking, and history.
Real-time Updates: WebSocket (STOMP) for live notifications and dashboard updates.
AI Integration: Uses Google Cloud Vertex AI (Gemini) for chatbot, ticket analysis, and smart assistance.
Analytics & Reporting: Dashboards, exportable reports.
Email Notifications: HTML emails for system events.
Multi-tenant Support: Organization-based data isolation.
API Documentation: Swagger/OpenAPI 3.0.
Guest Ticket Flow: Public ticket creation/tracking without login.
Tech Stack:
Spring Boot 3.2.5, Java 17+
PostgreSQL 15+
Maven
WebSocket, Spring Security, Thymeleaf, Swagger
API Endpoints:
Authentication: /api/v1/auth/*
Tickets: /api/v1/tickets/* (CRUD, comments, status, public ticketing)
Users: /api/v1/users/*
Dashboard/Analytics: /api/v1/dashboard/*
AI: /api/v1/ai/*
FAQ/Knowledge Base: /api/v1/faq/*
Notifications: /api/v1/notifications/*
Entities:
User, Ticket, Comment, FAQ, Notification, AuditLog, Organization
Testing:
Uses Maven for running tests.
Seed data for users, tickets, FAQs in data.sql.
Deployment:
Docker and Docker Compose supported.
Environment variables for configuration.
Frontend (React, TypeScript, shadcn/ui, Tailwind CSS)
Key Features:
Product Management: Add, edit, delete, view products.
Dashboard: Key metrics, recent activity.
Responsive Design: Desktop, tablet, mobile.
Modern UI: shadcn/ui, Tailwind CSS.
Planned: Ticket management, knowledge base, user management, analytics, JWT login, real-time updates.
Tech Stack:
React 19, TypeScript
shadcn/ui, Tailwind CSS
React Router v6, React Query, Axios, Lucide React, React Hook Form, Yup
Project Structure:
components/ (UI, layout)
pages/ (Dashboard, Products, etc.)
services/ (API integration)
types/ (TypeScript interfaces)
lib/ (utilities)
App.tsx (main app)
API Integration:
Connects to backend REST API (/api/v1/*).
WebSocket for real-time updates.
Environment variables for API and WebSocket URLs.
Development & Deployment:
Scripts for dev, build, test, lint, format.
Dockerfile example for containerized deployment.
Supports deployment to Vercel/Netlify.
Workflow
Development:
Backend:

Develop features in Spring Boot (controllers, services, repositories).
Use JPA/Hibernate for DB schema.
Test with Maven, seed data for local dev.
Document APIs with Swagger.
Deploy with Docker or directly via Maven.
Frontend:

Build UI in React with TypeScript.
Use shadcn/ui and Tailwind for styling.
Integrate with backend via Axios in services/api.ts.
Use React Query for data fetching/state.
Test and lint code.
Deploy with Docker, Vercel, or Netlify.
Authentication Flow:
User logs in via frontend (/api/v1/auth/login).
Receives JWT, stored in localStorage.
JWT sent in Authorization header for protected API calls.
Role-based routing and UI in frontend.
Ticket Workflow:
User (or guest) creates ticket via frontend.
Ticket managed via backend (CRUD, comments, status).
Real-time updates via WebSocket.
AI features (chat, analysis) available for tickets.
Analytics & Reporting:
Backend provides endpoints for dashboard stats, trends, metrics.
Frontend displays analytics in dashboard.
AI Integration:
Backend connects to Google Cloud Vertex AI for chat, ticket analysis, FAQ suggestions, etc.
Frontend exposes these features via UI.
Project Status
In Progress: Some features are implemented, others are planned (see frontend README for planned features).
Backend: Core ticketing, authentication, and AI endpoints are present. Multi-tenant and notification support included.
Frontend: Product management and dashboard are implemented. Ticket management, knowledge base, and user management are planned.