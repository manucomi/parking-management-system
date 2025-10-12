# Frontend API Quick Start Guide

Get up and running with the API integration layer in 5 minutes.

---

## 📦 What's Been Created

Your frontend now has a complete, scalable API architecture:

```
✅ Utils Layer       → fetcher.js (HTTP client)
✅ Services Layer    → ResidentService, RaffleService, ParkingSpotService
✅ API Routes        → Next.js serverless functions
✅ Database Stubs    → Mock implementations for development
```

---

## 🚀 Quick Start

### 1. **Import a Service**

```javascript
// In any component or page
import { getAllResidents, createResident } from '@/services/ResidentService';
```

### 2. **Fetch Data (Client-Side)**

```javascript
import { useState, useEffect } from 'react';
import { getAllResidents } from '@/services/ResidentService';

export function ResidentList() {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllResidents({ page: 1, limit: 20 })
            .then((data) => setResidents(data.residents))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <ul>
            {residents.map((r) => (
                <li key={r.id}>{r.name}</li>
            ))}
        </ul>
    );
}
```

### 3. **Fetch Data (Server-Side)**

```javascript
// pages/residents/index.jsx
import { getAllResidents } from '@/services/ResidentService';

export async function getServerSideProps() {
    const data = await getAllResidents({ page: 1, limit: 50 });
    return { props: { residents: data.residents } };
}

export default function ResidentsPage({ residents }) {
    return (
        <div>
            <h1>All Residents</h1>
            {residents.map((r) => (
                <div key={r.id}>{r.name}</div>
            ))}
        </div>
    );
}
```

### 4. **Create/Update Data**

```javascript
import { createResident } from '@/services/ResidentService';

async function handleSubmit(formData) {
    try {
        const newResident = await createResident({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            building: formData.building,
            apartmentNumber: formData.apartmentNumber,
            hasCar: true,
        });

        console.log('Created:', newResident);
        // Redirect or update UI
    } catch (error) {
        console.error('Failed to create resident:', error.message);
    }
}
```

### 5. **Execute a Raffle**

```javascript
import { runRaffle, getCurrentRaffle } from '@/services/RaffleService';

async function executeCurrentRaffle() {
    try {
        const currentRaffle = await getCurrentRaffle();

        if (!currentRaffle) {
            alert('No active raffle found');
            return;
        }

        const results = await runRaffle(currentRaffle.id, {
            sendNotifications: true,
            algorithm: 'random',
        });

        console.log('Winners:', results.winners);
    } catch (error) {
        console.error('Failed to run raffle:', error.message);
    }
}
```

---

## 🎨 Using with React Hooks (Recommended)

Create a custom hook for cleaner code:

```javascript
// hooks/useResidents.js
import { useState, useEffect } from 'react';
import { getAllResidents } from '@/services/ResidentService';

export function useResidents(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllResidents(params)
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [JSON.stringify(params)]);

    return { data, loading, error };
}

// Usage in component
function ResidentList() {
    const { data, loading, error } = useResidents({ page: 1, limit: 20 });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ul>
            {data.residents.map((r) => (
                <li key={r.id}>{r.name}</li>
            ))}
        </ul>
    );
}
```

---

## 🧪 Testing Your API Calls

### Test a Service Function

```javascript
// In browser console or test file
import { getAllResidents } from '@/services/ResidentService';

getAllResidents({ page: 1, limit: 5 })
    .then((data) => console.log('Residents:', data))
    .catch((error) => console.error('Error:', error));
```

### Test an API Route Directly

```bash
# In terminal
curl http://localhost:3000/api/residents?page=1&limit=5

# Or in browser
http://localhost:3000/api/residents?page=1&limit=5
```

---

## 📂 File Locations

| What               | Where                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| **HTTP Client**    | `src/utils/fetcher.js`                                                                                       |
| **Services**       | `src/services/ResidentService.js`<br>`src/services/RaffleService.js`<br>`src/services/ParkingSpotService.js` |
| **API Routes**     | `src/pages/api/residents/...`<br>`src/pages/api/raffles/...`<br>`src/pages/api/parking-spots/...`            |
| **Database Layer** | `src/lib/db.js` (stubs for now)                                                                              |
| **Documentation**  | `src/API_ARCHITECTURE.md`<br>`src/API_ENDPOINTS.md`                                                          |

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐
│  Component/Page │
└────────┬────────┘
         │ import service
         ↓
┌─────────────────────┐
│ ResidentService.js  │ ← Client-side service layer
└────────┬────────────┘
         │ fetcher.get('/api/residents')
         ↓
┌──────────────────────┐
│ /api/residents (SSR) │ ← Next.js API route
└────────┬─────────────┘
         │ database query
         ↓
┌──────────────────┐
│    lib/db.js     │ ← Database abstraction (stubs)
└────────┬─────────┘
         │ (future: Supabase/Backend)
         ↓
┌──────────────────┐
│    Database      │
└──────────────────┘
```

---

## 🎯 Common Use Cases

### Use Case 1: Display Residents Table

```javascript
import { getAllResidents } from '@/services/ResidentService';

export default function ResidentsTable() {
    const [residents, setResidents] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getAllResidents({ page, limit: 10 }).then((data) => {
            setResidents(data.residents);
        });
    }, [page]);

    return (
        <div>
            <table>
                {residents.map((r) => (
                    <tr key={r.id}>
                        <td>{r.name}</td>
                        <td>{r.email}</td>
                    </tr>
                ))}
            </table>
            <button onClick={() => setPage((p) => p - 1)}>Previous</button>
            <button onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
    );
}
```

### Use Case 2: Register for Raffle

```javascript
import { registerForRaffle } from '@/services/ResidentService';

async function handleRaffleRegistration(residentId) {
    try {
        const result = await registerForRaffle(residentId);
        alert(result.message);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
```

### Use Case 3: Assign Parking Spot

```javascript
import { assignSpot } from '@/services/ParkingSpotService';

async function assignParkingToWinner(spotId, residentId) {
    try {
        const result = await assignSpot(spotId, {
            residentId,
            startDate: new Date().toISOString(),
            endDate: new Date(
                Date.now() + 180 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            notes: 'Raffle winner - 6 months allocation',
        });
        console.log('Assignment successful:', result);
    } catch (error) {
        console.error('Assignment failed:', error.message);
    }
}
```

---

## 🔧 Customization

### Add a New Service Method

1. **Add to service file** (`src/services/ResidentService.js`):

```javascript
export async function getResidentsByBuilding(building) {
    return get(`/api/residents?building=${building}`);
}
```

2. **Add to service index** (`src/services/index.js`):

```javascript
export { getResidentsByBuilding } from './ResidentService';
```

3. **Use in component**:

```javascript
import { getResidentsByBuilding } from '@/services';
const residents = await getResidentsByBuilding('A');
```

### Add a New API Route

1. **Create route file** (`src/pages/api/residents/building/[building].js`):

```javascript
export default async function handler(req, res) {
    const { building } = req.query;
    // Implement logic...
    res.status(200).json({ residents: [] });
}
```

2. **Use from service** (already works via existing service method)

---

## 🚨 Error Handling

All service methods throw `ApiError` with these properties:

```javascript
import { getAllResidents } from '@/services/ResidentService';

try {
    const data = await getAllResidents();
} catch (error) {
    console.log(error.name); // 'ApiError'
    console.log(error.message); // Human-readable message
    console.log(error.status); // HTTP status code (404, 500, etc.)
    console.log(error.data); // Additional error data from server
}
```

---

## 📚 Next Steps

1. **Read the full architecture**: `src/API_ARCHITECTURE.md`
2. **Browse all endpoints**: `src/API_ENDPOINTS.md`
3. **Integrate with UI components**: Use services in your pages
4. **Replace database stubs**: When backend is ready, update `lib/db.js`
5. **Add authentication**: Implement `AuthService` and protect routes

---

## 💡 Tips

- ✅ **Always use services** instead of calling `fetch` directly
- ✅ **Use `getServerSideProps`** for SEO-critical pages
- ✅ **Handle loading states** for better UX
- ✅ **Display error messages** to users
- ✅ **Add pagination** for large datasets
- ✅ **Use React Query/SWR** for advanced caching (future enhancement)

---

## 🆘 Troubleshooting

### "Module not found: Can't resolve '@/services'"

- Check `jsconfig.json` has the `@/*` path mapping
- Restart your dev server: `npm run dev`

### "API route returns 404"

- Verify the file is in `src/pages/api/` directory
- Check file naming matches Next.js conventions
- Restart dev server

### "Method not allowed (405)"

- Check your HTTP method matches the route handler
- Ensure you're using the correct service method (GET/POST/PUT/DELETE)

---

**Ready to build!** 🚀

Start by importing services into your existing components and replacing hardcoded data with API calls.
