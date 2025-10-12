# Frontend API Architecture

## 📁 Directory Structure

```
apps/frontend/src/
├── utils/
│   └── fetcher.js              # HTTP client wrapper with error handling
├── services/                   # API service layer (client-side)
│   ├── index.js               # Central export for all services
│   ├── ResidentService.js     # Resident management operations
│   ├── RaffleService.js       # Raffle management operations
│   └── ParkingSpotService.js  # Parking spot management operations
└── pages/
    └── api/                    # Next.js API routes (server-side)
        ├── residents/
        │   ├── index.js       # GET /api/residents
        │   ├── [id].js        # GET/PUT/PATCH/DELETE /api/residents/:id
        │   └── [id]/
        │       ├── parking-history.js
        │       └── raffle-registration.js
        ├── raffles/
        │   ├── index.js       # GET /api/raffles
        │   ├── current.js     # GET /api/raffles/current
        │   └── [id]/
        │       └── execute.js # POST /api/raffles/:id/execute
        └── parking-spots/
            ├── index.js       # GET /api/parking-spots
            └── [id]/
                ├── assign.js  # POST /api/parking-spots/:id/assign
                └── release.js # POST /api/parking-spots/:id/release
```

## 🏗 Architecture Overview

### **1. Utils Layer (`src/utils/`)**

- **`fetcher.js`**: Core HTTP client utility
    - Wraps native `fetch` with JSON handling
    - Centralized error parsing and `ApiError` class
    - Convenience methods: `get()`, `post()`, `put()`, `patch()`, `del()`
    - Query string builder for clean URL construction

### **2. Services Layer (`src/services/`)**

- **Purpose**: Client-side API abstraction
- **Pattern**: One service file per domain
- **Usage**: Import in components and pages for data fetching
- **Benefits**:
    - Type-safe API contracts (documented via JSDoc)
    - Centralized endpoint management
    - Easy mocking for tests
    - Consistent error handling

#### Available Services:

- **`ResidentService`**: CRUD for residents, raffle registration, history
- **`RaffleService`**: Raffle management, execution, statistics
- **`ParkingSpotService`**: Spot allocation, assignments, maintenance

### **3. API Routes Layer (`src/pages/api/`)**

- **Purpose**: Next.js serverless functions (BFF pattern)
- **Pattern**: RESTful endpoints following Next.js file-based routing
- **Usage**: Called by services, handles SSR data fetching
- **Benefits**:
    - Server-side data fetching for SEO
    - API key/secret protection
    - Request validation before backend
    - Response caching strategies

## 🔄 Data Flow

```
Component/Page
    ↓ (imports service)
Services Layer (ResidentService.getAllResidents)
    ↓ (HTTP request via fetcher)
API Routes (/api/residents)
    ↓ (server-side logic)
Database Layer (lib/db.js) ← Mock for now
    ↓ (future: calls Node/Express backend)
Supabase/PostgreSQL
```

## 📝 Usage Examples

### **Example 1: Fetch Residents in a Component**

```javascript
// src/components/ResidentList/ResidentList.jsx
import { useState, useEffect } from 'react';
import { getAllResidents } from '@/services/ResidentService';

export function ResidentList() {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchResidents() {
            try {
                const data = await getAllResidents({ page: 1, limit: 20 });
                setResidents(data.residents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchResidents();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ul>
            {residents.map((r) => (
                <li key={r.id}>{r.name}</li>
            ))}
        </ul>
    );
}
```

### **Example 2: Server-Side Rendering (SSR)**

```javascript
// src/pages/residents/index.jsx
import { getAllResidents } from '@/services/ResidentService';

export async function getServerSideProps() {
    try {
        // This runs on the server, calling our API route
        const data = await getAllResidents({ page: 1, limit: 50 });

        return {
            props: {
                residents: data.residents,
                total: data.total,
            },
        };
    } catch (error) {
        return {
            props: {
                residents: [],
                error: error.message,
            },
        };
    }
}

export default function ResidentsPage({ residents, error }) {
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Residents</h1>
            {/* Render residents... */}
        </div>
    );
}
```

### **Example 3: Mutation (Create/Update)**

```javascript
// src/pages/admin/residents/new.jsx
import { useState } from 'react';
import { createResident } from '@/services/ResidentService';

export default function NewResidentPage() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const newResident = await createResident(formData);
            // Redirect to resident detail page
            window.location.href = `/admin/residents/${newResident.id}`;
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            {/* Form fields... */}
            <button type="submit">Create Resident</button>
        </form>
    );
}
```

## 🎯 API Endpoint Conventions

### RESTful Patterns

| Method   | Endpoint                                 | Description                    |
| -------- | ---------------------------------------- | ------------------------------ |
| `GET`    | `/api/residents`                         | List all residents (paginated) |
| `GET`    | `/api/residents/:id`                     | Get single resident            |
| `POST`   | `/api/residents`                         | Create new resident            |
| `PUT`    | `/api/residents/:id`                     | Full update                    |
| `PATCH`  | `/api/residents/:id`                     | Partial update                 |
| `DELETE` | `/api/residents/:id`                     | Delete resident                |
| `GET`    | `/api/residents/:id/parking-history`     | Get related data               |
| `POST`   | `/api/residents/:id/raffle-registration` | Action endpoint                |

### Query Parameters

- **Pagination**: `?page=1&limit=10`
- **Filtering**: `?building=A&hasParking=true`
- **Search**: `?search=john`
- **Sorting**: `?sort=name&order=asc`

### Response Format

```javascript
// Success (List)
{
    "residents": [...],
    "total": 100,
    "page": 1,
    "totalPages": 10
}

// Success (Single)
{
    "id": "123",
    "name": "John Doe",
    ...
}

// Error
{
    "error": "Error message",
    "message": "Detailed error description",
    "status": 400
}
```

## 🔐 Future Enhancements

### Authentication (Coming Soon)

```javascript
// src/services/AuthService.js
export async function login(credentials) { ... }
export async function logout() { ... }
export async function getCurrentUser() { ... }

// Usage in fetcher.js
const token = getAuthToken();
config.headers.Authorization = `Bearer ${token}`;
```

### Additional Services

- **`BuildingService.js`**: Building/complex management
- **`NotificationService.js`**: User notifications
- **`AnalyticsService.js`**: Reporting and analytics
- **`AuditService.js`**: Audit logs and history

### Caching Strategy

```javascript
// Example with SWR or React Query
import useSWR from 'swr';
import { getAllResidents } from '@/services/ResidentService';

function ResidentList() {
    const { data, error } = useSWR('/residents', () =>
        getAllResidents({ page: 1 }),
    );
    // Automatic caching, revalidation, and deduplication
}
```

## 🧪 Testing

### Service Tests

```javascript
// src/services/__tests__/ResidentService.test.js
import { getAllResidents } from '@/services/ResidentService';

global.fetch = jest.fn();

test('getAllResidents fetches data correctly', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ residents: [], total: 0 }),
    });

    const result = await getAllResidents();
    expect(result.residents).toEqual([]);
});
```

### API Route Tests

```javascript
// src/pages/api/residents/__tests__/index.test.js
import handler from '../index';

test('GET /api/residents returns 200', async () => {
    const req = { method: 'GET', query: {} };
    const res = { status: jest.fn(), json: jest.fn() };

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
});
```

## 📚 Resources

- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [REST API Best Practices](https://restfulapi.net/)
- [BFF Pattern](https://samnewman.io/patterns/architectural/bff/)

---

**Last Updated**: October 12, 2025
**Maintainer**: Development Team
**Version**: 1.0.0
