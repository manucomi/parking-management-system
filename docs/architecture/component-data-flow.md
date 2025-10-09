# Component Data Flow

This document describes how data moves between components of the **Parking Management System**.

---

## High-Level Flow

1. **Resident Actions**

   - Resident logs in via Next.js frontend.
   - The frontend calls `/api/residents` to fetch or register the user.
   - On “Join Raffle”, it calls `/api/raffle/join`.

2. **Raffle Processing**

   - Admin triggers `/api/raffle/run` from the dashboard.
   - The backend selects eligible residents from the database.
   - Assignments are persisted in the `allocations` table.
   - Historical records are logged in `history` for fairness tracking.

3. **Data Retrieval**

   - Frontend fetches data via REST:
     - `/api/allocations` → List of current assignments.
     - `/api/spots` → Available or assigned spots.
   - API responses are cached during SSR by the `NetworkFirstCacheService` class in the Next.js app.
   - Cached responses reduce latency for repeated requests and improve SEO performance.

4. **UI Update**

   - Hooks (`useResidents`, `useAllocations`) manage client-side state.
   - Components re-render using React’s unidirectional data flow and Context.
   - When a new allocation or raffle result is fetched, the cached SSR data can be revalidated using client-side hydration.

5. **Raffle Rotation**

   - Currently triggered manually by an Admin through the UI.
   - The same API endpoint (`/api/raffle/run`) can be called automatically by a scheduler every 90 days.
   - This approach avoids code duplication and keeps allocation logic centralized.
   - Future automation options include:
     - Cron jobs (Render Scheduler, GitHub Actions, or Cloud Scheduler).
     - Event-driven triggers when integrating with Redis Streams or Kafka.

---

## Data Model Summary

| Entity          | Description                                     | Key Fields                                     |
| --------------- | ----------------------------------------------- | ---------------------------------------------- |
| **Resident**    | Registered user eligible for raffles.           | id, name, email, last_assigned_at              |
| **ParkingSpot** | Represents a physical parking spot.             | id, building, level, is_available              |
| **Allocation**  | Maps resident to parking spot.                  | id, resident_id, spot_id, assigned_at          |
| **History**     | Records past allocations for fairness tracking. | id, resident_id, spot_id, start_date, end_date |

---

### SSR Caching Layer (MVP)

- During server-side rendering (Next.js), a `NetworkFirstCacheService` caches API responses temporarily.
- Cached data includes resident lists, allocation summaries, and raffle history.
- This approach reduces backend calls on high-traffic pages.
- In future iterations, this layer will be replaced or complemented by a shared Redis cache for distributed environments.

---

## Request/Response Example

### POST `/api/raffle/run`

**Request:**

```json
{
  "triggeredBy": "admin",
  "cycleDate": "2025-03-01"
}
```

**Response:**

```json
{
  "status": "success",
  "allocations": [
    { "residentId": 1, "spotId": 12, "assignedAt": "2025-03-01T00:00:00Z" },
    { "residentId": 2, "spotId": 5, "assignedAt": "2025-03-01T00:00:00Z" }
  ]
}
```
