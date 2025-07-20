# HelpDesk Admin Frontend

A professional admin dashboard for managing products and support tickets in a helpdesk system. Built with React, TypeScript, and shadcn/ui.

## Features

### 🎯 Core Features
- **Product Management**: Add, edit, delete, and view products
- **Dashboard**: Overview with key metrics and recent activity
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

### 🚀 Planned Features
- **Ticket Management**: View, assign, and manage support tickets
- **Knowledge Base**: Create and manage help articles
- **User Management**: Assign admins and manage user permissions
- **Analytics**: Product-specific metrics and reporting
- **Authentication**: JWT-based login system
- **Real-time Updates**: WebSocket integration for live updates

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Forms**: React Hook Form + Yup validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file in the root directory. The following variables are required:

```env
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_WEBSOCKET_URL=ws://localhost:8080/ws
REACT_APP_ENV=development
```

**Other optional variables:**
- `REACT_APP_ANALYTICS_KEY` (for analytics integration)
- `REACT_APP_GEMINI_API_KEY` (for AI features)
- `REACT_APP_FEATURE_FLAGS` (comma-separated list for feature toggles)

> Adjust the URLs and variables as needed for your environment (development, staging, production).

### Example `.env` for Production
```env
REACT_APP_API_URL=https://api.yourdomain.com/api/v1
REACT_APP_WEBSOCKET_URL=wss://api.yourdomain.com/ws
REACT_APP_ENV=production
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── table.tsx
│   └── layout/       # Layout components
│       ├── Layout.tsx
│       ├── Sidebar.tsx
│       └── Header.tsx
├── pages/            # Page components
│   ├── Dashboard.tsx
│   └── Products.tsx
├── services/         # API services
│   └── api.ts
├── types/            # TypeScript interfaces
│   └── index.ts
├── lib/              # Utility functions
│   └── utils.ts
└── App.tsx           # Main app component
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier
- `npm eject` - Eject from Create React App

## API Integration

The frontend is designed to work with a RESTful API. The API service layer is already set up in `src/services/api.ts`.

> For full API documentation, see the backend's Swagger UI at `http://localhost:8080/swagger-ui.html` after starting the backend server.

### Main Endpoints

- **Products**: `/api/v1/products`
- **Users**: `/api/v1/users`
- **Tickets**: `/api/v1/tickets`
- **Authentication**: `/api/v1/auth/*`
- **FAQ/Knowledge Base**: `/api/v1/knowledge-base/*`
- **Notifications**: `/api/v1/notifications/*`
- **Analytics**: `/api/v1/analytics/*`

## Testing & Linting

- **Run tests:**
  ```bash
  npm test
  ```
  - For coverage report:
    ```bash
    npm test -- --coverage
    ```
- **Run linter:**
  ```bash
  npm run lint
  ```
- **Fix lint errors automatically:**
  ```bash
  npm run lint -- --fix
  ```
- **Format code:**
  ```bash
  npm run format
  ```

## Component Usage

### Using shadcn/ui Components

```tsx
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation item in `src/components/layout/Sidebar.tsx`

## Styling

The project uses Tailwind CSS with shadcn/ui design tokens. Custom styles can be added in `src/index.css`.

### Color Scheme
- Primary: Blue (`blue-600`)
- Secondary: Gray (`gray-600`)
- Success: Green (`green-600`)
- Warning: Orange (`orange-600`)
- Error: Red (`red-600`)

## Development

### Adding New shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

### Code Style
- Use TypeScript for all components
- Follow React functional component patterns
- Use React Query for data fetching
- Implement proper error handling
- Add loading states for better UX

## Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Deploying to Vercel/Netlify
- Connect your GitHub repo and set environment variables in the dashboard.
- Set build command: `npm run build`
- Set output directory: `build`
- Ensure your backend API is accessible from the deployed frontend (CORS, HTTPS, etc.)

### Deploying with Docker
- Create a `Dockerfile` (if not present):
  ```dockerfile
  FROM node:18-alpine as build
  WORKDIR /app
  COPY . .
  RUN npm install && npm run build
  FROM nginx:alpine
  COPY --from=build /app/build /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```
- Build and run:
  ```bash
  docker build -t ziohelp-frontend .
  docker run -p 3000:80 ziohelp-frontend
  ```

## Troubleshooting

- **API connection errors:**
  - Check `REACT_APP_API_URL` and backend server status
  - Ensure CORS is enabled on the backend for your frontend domain
- **WebSocket issues:**
  - Ensure `REACT_APP_WEBSOCKET_URL` is correct and backend WebSocket is running
- **CORS errors:**
  - Make sure backend CORS settings allow requests from your frontend domain
- **Build errors:**
  - Ensure Node.js and npm versions match prerequisites
  - Delete `node_modules` and reinstall if you see dependency errors
- **Login issues:**
  - Ensure backend returns JWT and roles in the login response
  - Check browser console for errors
- **Role-based routing issues:**
  - Make sure roles are stored in localStorage and used in route protection logic

## FAQ

**Q: How do I change the backend API URL?**
A: Update `REACT_APP_API_URL` in your `.env` file and restart the frontend server.

**Q: How do I add a new environment variable?**
A: Add it to your `.env` file and reference it in your code with `process.env.REACT_APP_*`.

**Q: How do I run tests and see coverage?**
A: Run `npm test -- --coverage`.

**Q: How do I debug login or authentication issues?**
A: Check the network tab in your browser dev tools, ensure the backend is running, and verify the login response includes a JWT and roles.

**Q: How do I deploy to production?**
A: Build with `npm run build` and deploy the `build/` directory to your hosting provider. Set environment variables for production in your hosting dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
