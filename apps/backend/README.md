# Parking Management System - Backend

REST API for managing parking allocations, residents, and raffle system.

## ✅ Status: Connected to Supabase PostgreSQL

## Tech Stack

- Node.js 20+
- Express.js
- PostgreSQL (Supabase)
- Supabase Auth
- JWT for API authentication
- pg client

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Initialize database (creates tables + sample data)
npm run db:init

# Start development server
npm run dev
```

Server will run on http://localhost:4000

## Authentication

All API endpoints (except `/health` and `/auth/*`) require JWT authentication.

### Auth Endpoints

```bash
# Sign up
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "admin"
  }'

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Logout
curl -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Protected Endpoints

Include JWT token in Authorization header:

```bash
curl http://localhost:4000/api/residents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing the API

### Health Check

```bash
curl http://localhost:4000/health
```

### Residents

```bash
# Get all residents
curl http://localhost:4000/api/residents

# Get resident by ID
curl http://localhost:4000/api/residents/1

# Create resident
curl -X POST http://localhost:4000/api/residents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Cooper",
    "email": "alice@example.com",
    "phone": "1112223333",
    "building": "C",
    "apartment_number": "301",
    "has_car": true
  }'
```

### Parking Spots

```bash
# Get all spots
curl http://localhost:4000/api/spots

# Get available spots only
curl http://localhost:4000/api/spots?status=available

# Create spot
curl -X POST http://localhost:4000/api/spots \
  -H "Content-Type: application/json" \
  -d '{
    "number": "C-001",
    "building": "C",
    "level": "1",
    "type": "regular"
  }'
```

### Raffle

```bash
# Get current raffle
curl http://localhost:4000/api/raffle/current

# Join raffle (residentId 1)
curl -X POST http://localhost:4000/api/raffle/join \
  -H "Content-Type: application/json" \
  -d '{"residentId": 1}'

# Execute raffle (admin)
curl -X POST http://localhost:4000/api/raffle/run

# Get latest results
curl http://localhost:4000/api/raffle/results
```

### History

```bash
# Get allocation history for resident
curl http://localhost:4000/api/history/1
```

## API Endpoints

### Authentication

| Method | Endpoint        | Description          | Auth Required |
| ------ | --------------- | -------------------- | ------------- |
| POST   | `/auth/signup`  | Create user account  | No            |
| POST   | `/auth/login`   | Login user           | No            |
| POST   | `/auth/logout`  | Logout user          | Yes           |
| POST   | `/auth/refresh` | Refresh access token | Yes           |

### Residents

| Method | Endpoint             | Description        | Auth Required |
| ------ | -------------------- | ------------------ | ------------- |
| GET    | `/api/residents`     | List all residents | Yes           |
| GET    | `/api/residents/:id` | Get resident       | Yes           |
| POST   | `/api/residents`     | Create resident    | Yes (Admin)   |
| PUT    | `/api/residents/:id` | Update resident    | Yes (Admin)   |
| DELETE | `/api/residents/:id` | Delete resident    | Yes (Admin)   |

### Parking Spots

| Method | Endpoint         | Description    | Auth Required |
| ------ | ---------------- | -------------- | ------------- |
| GET    | `/api/spots`     | List all spots | Yes           |
| GET    | `/api/spots/:id` | Get spot       | Yes           |
| POST   | `/api/spots`     | Create spot    | Yes (Admin)   |
| PATCH  | `/api/spots/:id` | Update spot    | Yes (Admin)   |
| DELETE | `/api/spots/:id` | Delete spot    | Yes (Admin)   |

### Raffle

| Method | Endpoint              | Description       | Auth Required |
| ------ | --------------------- | ----------------- | ------------- |
| GET    | `/api/raffle/current` | Get active raffle | Yes           |
| POST   | `/api/raffle/join`    | Join raffle       | Yes           |
| POST   | `/api/raffle/run`     | Execute raffle    | Yes (Admin)   |
| GET    | `/api/raffle/results` | Latest results    | Yes           |

### History

| Method | Endpoint                   | Description            | Auth Required |
| ------ | -------------------------- | ---------------------- | ------------- |
| GET    | `/api/history/:residentId` | Get allocation history | Yes           |

## Scripts

```bash
npm run dev      # Development with auto-reload
npm start        # Production
npm run lint     # ESLint check
npm run db:init  # Initialize database
```

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
PORT=4000
DATABASE_URL=postgresql://postgres.xxx:yyy@aws-0-region.pooler.supabase.com:6543/postgres
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase Auth
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-key
```

## Database Schema

- `residents` - User information
- `parking_spots` - Parking locations
- `raffles` - Raffle instances
- `raffle_participants` - Raffle registrations
- `allocation_history` - Historical assignments

## Deployment to Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy
