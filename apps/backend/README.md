# Parking Management System - Backend

REST API for managing parking allocations, residents, and raffle system.

## ✅ Status: Connected to Supabase PostgreSQL

## Tech Stack

- Node.js 20+
- Express.js
- PostgreSQL (Supabase)
- pg client

## Quick Start

```bash
# Install dependencies
npm install

# Initialize database (creates tables + sample data)
npm run db:init

# Start development server
npm run dev
```

Server will run on http://localhost:4000

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Residents** | | |
| GET | `/api/residents` | List all residents |
| GET | `/api/residents/:id` | Get resident by ID |
| POST | `/api/residents` | Create new resident |
| PUT | `/api/residents/:id` | Update resident |
| DELETE | `/api/residents/:id` | Delete resident |
| **Parking Spots** | | |
| GET | `/api/spots` | List all spots |
| GET | `/api/spots/:id` | Get spot by ID |
| POST | `/api/spots` | Create new spot |
| PATCH | `/api/spots/:id` | Update spot |
| DELETE | `/api/spots/:id` | Delete spot |
| **Raffle** | | |
| GET | `/api/raffle/current` | Get active raffle |
| POST | `/api/raffle/join` | Join raffle |
| POST | `/api/raffle/run` | Execute raffle |
| GET | `/api/raffle/results` | Latest results |
| **History** | | |
| GET | `/api/history/:residentId` | Get allocation history |

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
