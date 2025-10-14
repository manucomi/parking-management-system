# Frontend API Architecture

## 📁 Directory Structure

```
apps/frontend/src/
├── utils/
│   ├── fetcher.js              # HTTP client with JWT injection
│   ├── supabaseClient.js       # Browser Supabase client
│   └── supabase/
│       ├── server.js           # SSR Supabase client
│       └── middleware.js       # Token refresh utilities
├── hooks/
│   └── useAuth.js              # Authentication hook
├── services/                   # API service layer (client-side)
│   ├── index.js               # Central export for all services
│   ├── ResidentService.js     # Resident management operations
│   ├── RaffleService.js       # Raffle management operations
│   └── ParkingSpotService.js  # Parking spot management operations
├── pages/
│   ├── index.jsx              # Login page
│   ├── admin/                 # Protected admin routes
│   │   ├── index.jsx         # Admin dashboard
│   │   ├── residents.jsx     # Resident management
│   │   ├── spots.jsx         # Parking spot management
│   │   └── raffle.jsx        # Raffle execution
│   └── resident/              # Protected resident routes
│       └── index.jsx         # Resident dashboard
└── middleware.js              # Next.js middleware for auth
```

## Architecture Overview

### 1. Authentication Layer

- **Supabase Auth**: Email/password authentication with SSR support
- **JWT Tokens**: Stored in HTTP-only cookies for security
- **Role-based Access**: Admin and resident roles stored in user metadata
- **Middleware**: Automatic token refresh on every request

### 2. Utils Layer

- **`fetcher.js`**: HTTP client with automatic JWT injection
- **`supabaseClient.js`**: Browser client for client-side auth operations
- **`supabase/server.js`**: SSR client for getServerSideProps
- **`supabase/middleware.js`**: Token refresh utilities

### 3. Hooks Layer

- **`useAuth.js`**: Authentication state and operations (login, signup, logout)

### 4. Services Layer

- Client-side API abstraction
- One service file per domain
- Used in components and pages for data fetching
- Centralized endpoint management

Available Services:

- **ResidentService**: CRUD for residents, raffle registration, history
- **RaffleService**: Raffle management, execution, statistics
- **ParkingSpotService**: Spot allocation, assignments, maintenance

## Data Flow

```
User Login
    ↓
Supabase Auth (email/password)
    ↓
JWT Token (stored in cookies)
    ↓
Protected Page (SSR check)
    ↓
Component/Service Layer
    ↓
fetcher.js (auto-injects JWT)
    ↓
Express Backend API
    ↓
JWT Verification Middleware
    ↓
Database (Supabase PostgreSQL)
```

## Authentication Flow

### Login Process

1. User submits email/password via `useAuth.login()`
2. Supabase Auth validates credentials
3. JWT token stored in HTTP-only cookies
4. User metadata includes role (admin/resident)
5. Redirect to role-specific dashboard

### Protected Routes

All admin and resident pages use SSR authentication:

- `getServerSideProps` calls `createClient(context)`
- Verifies session via `supabase.auth.getUser()`
- Redirects to login if no valid session
- Passes JWT to API calls via fetcher

### API Request Flow

1. Component calls service method (e.g., `ResidentService.getAll()`)
2. Service uses `fetcher.get()` with endpoint
3. Fetcher retrieves JWT from Supabase session
4. JWT included in Authorization header
5. Backend middleware verifies JWT
6. Request processed if valid

## API Endpoint Conventions

### Backend REST API

All endpoints require JWT authentication via Authorization header.

| Method   | Endpoint         | Description              |
| -------- | ---------------- | ------------------------ |
| `POST`   | `/auth/signup`   | Create new user account  |
| `POST`   | `/auth/login`    | Login user               |
| `POST`   | `/auth/logout`   | Logout user              |
| `POST`   | `/auth/refresh`  | Refresh access token     |
| `GET`    | `/residents`     | List all residents       |
| `GET`    | `/residents/:id` | Get single resident      |
| `POST`   | `/residents`     | Create new resident      |
| `PUT`    | `/residents/:id` | Update resident          |
| `DELETE` | `/residents/:id` | Delete resident          |
| `GET`    | `/spots`         | List parking spots       |
| `POST`   | `/raffles/run`   | Execute raffle algorithm |
| `GET`    | `/history`       | Get allocation history   |

### Response Format

```javascript
// Success
{
    "success": true,
    "data": {...}
}

// Error
{
    "success": false,
    "error": "Error message"
}
```

## Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000

# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## Resources

- [Next.js Pages Router](https://nextjs.org/docs/pages)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side)
- [REST API Best Practices](https://restfulapi.net/)

---
