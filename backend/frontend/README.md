# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# ZioHelp Frontend

A modern React frontend for the ZioHelp ticket management system built with:

- **React 19** with TypeScript
- **Vite** for development and building
- **TailwindCSS** for styling
- **TanStack Router** for routing
- **TanStack React Query** for data fetching
- **Axios** for API communication
- **Zod** for validation

## Features

### Authentication
- Login with username/password
- JWT token-based authentication
- Protected routes
- Auto-logout on token expiration

### Dashboard
- Overview statistics (total tickets, open/closed tickets, total users)
- Recent tickets table
- Real-time data updates

### Ticket Management
- View all tickets with status, priority, and details
- Create new tickets with title, description, and priority
- Update ticket status (Open, In Progress, Closed)
- Filter and search tickets

### User Management
- View all users with roles and status
- Create new users with username, email, password, and role
- Enable/disable user accounts
- Role-based access control

### Menu Management
- Role-based menu items display
- Hierarchical menu structure
- Active/inactive menu items
- Menu statistics

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API Integration

The frontend connects to the backend API at `http://localhost:8080/api` with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Dashboard
- `GET /dashboard/stats` - Dashboard statistics

### Tickets
- `GET /tickets` - Get all tickets
- `POST /tickets` - Create new ticket
- `PUT /tickets/{id}/status` - Update ticket status

### Users
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PUT /users/{id}/status` - Enable/disable user

### Menu
- `GET /menu/items` - Get menu items for current user role

## Demo Credentials

- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`

## Architecture

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.tsx     # Navigation bar
│   └── ProtectedRoute.tsx # Route protection
├── features/          # Feature-based modules
│   ├── auth/          # Authentication
│   ├── dashboard/     # Dashboard page
│   ├── tickets/       # Ticket management
│   ├── users/         # User management
│   └── menu/          # Menu management
├── services/          # API services
│   └── api.ts         # Axios configuration
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## Key Technologies

- **TypeScript** for type safety
- **React Query** for server state management
- **TailwindCSS** for responsive design
- **Axios interceptors** for request/response handling
- **LocalStorage** for token persistence
- **Error boundaries** for error handling

## Build Process

The app uses Vite for fast development and optimized production builds:

- Hot Module Replacement (HMR) in development
- TypeScript compilation
- CSS processing with PostCSS and Tailwind
- Code splitting and lazy loading
- Tree shaking for optimal bundle size

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
