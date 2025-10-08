# Component Data Flow

This document describes how data moves between components of the **Parking Management System**.

---

## 🧭 High-Level Flow

1. **Resident Actions**

   - Resident logs in via Next.js frontend.
   - The frontend calls `/api/residents` to fetch or register the user.
   - On “Join Raffle”, it calls `/api/raffle/join`.

2. **Raffle Processing**

   - Admin triggers `/api/raffle/run` from the dashboard.
   - The backend selects eligible residents from the database.
   - Assignments are persisted in the `allocations` table.

3. **Data Retrieval**

   - Frontend fetches data via REST:
     - `/api/allocations` → List of current assignments.
     - `/api/spots` → Available or assigned spots.
   - Optional caching of results via Redis.

4. **UI Update**
   - Hooks (`useResidents`, `useAllocations`) manage state.
   - Components re-render using React’s data flow and Context.

---

## 🧩 Data Model Summary

| Entity          | Description                                     | Key Fields                                     |
| --------------- | ----------------------------------------------- | ---------------------------------------------- |
| **Resident**    | Registered user eligible for raffles.           | id, name, email, last_assigned_at              |
| **ParkingSpot** | Represents a physical parking spot.             | id, building, level, is_available              |
| **Allocation**  | Maps resident to parking spot.                  | id, resident_id, spot_id, assigned_at          |
| **History**     | Records past allocations for fairness tracking. | id, resident_id, spot_id, start_date, end_date |

---

## 🔄 Request/Response Example

### POST `/api/raffle/run`

**Request:**

```json
{
  "triggeredBy": "admin",
  "cycleDate": "2025-03-01"
}
```
