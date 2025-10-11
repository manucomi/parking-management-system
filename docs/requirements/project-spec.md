# Project Specification

> **Note:** This specification covers MVP scope for the assessment. Production would include detailed test cases, edge cases, and integration specifications.

---

## Core Features

### User Roles

| Role | Capabilities |
|------|-------------|
| **Resident** | Register, view status, check history |
| **Admin** | Manage spots, trigger raffle, view reports |

---

## Key Features Detail

### 1. Resident Registration

**User Story:** _"As a resident, I want to register for parking raffle"_

**Acceptance Criteria:**
- Email, name, unit number required
- Email uniqueness validated
- Profile updatable
- Opt-out option available

**API:** `POST /api/residents`

---

### 2. Raffle Execution

**User Story:** _"As admin, I want to run fair raffle"_

**Algorithm:**
```javascript
1. Fetch opted-in residents
2. Exclude last cycle winners
3. Sort by last_allocation_date (oldest first, nulls first)
4. Match to available spots
5. Record with timestamp
```

**API:** `POST /api/raffle/execute`

---

### 3. Allocation History

**User Story:** _"As resident, I want to see my parking history"_

**Display:**
- Past allocations (date, spot, duration)
- Days since last allocation
- Fairness indicators

**API:** `GET /api/allocations?resident_id={id}`

---

## API Specification

### Residents
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/residents` | Public |
| GET | `/api/residents/:id` | Resident/Admin |
| PUT | `/api/residents/:id` | Resident/Admin |

### Parking Spots
| Method | Endpoint | Auth |
|--------|----------|------|
| GET/POST/PUT/DELETE | `/api/spots` | Admin |

### Raffle & Allocations
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/raffle/execute` | Admin |
| GET | `/api/allocations` | Admin |
| GET | `/api/allocations/active` | Public |

---

## UI Components

### Resident Dashboard
- Current allocation card (spot, expiration, days remaining)
- History table
- Raffle opt-in/out toggle

### Admin Dashboard
- KPI cards (total spots, available, participation rate)
- "Execute Raffle" button
- Recent activity log

---

## Technology Stack

**Frontend:** Next.js 15 + React 19  
**Backend:** Node.js + Express  
**Database:** PostgreSQL (Supabase)  
**Cache:** SSR cache → Redis (Phase 2)  
**Hosting:** Vercel (FE) + Render (BE)

---

## Development Phases

### Phase 1: MVP (Current)
- ✅ Architecture docs
- ✅ Component library
- ⏳ Core API endpoints
- ⏳ Database schema
- ⏳ Raffle algorithm

### Phase 2: Automation
- Scheduled raffles (cron)
- Redis caching
- Email notifications
- Enhanced reporting

### Phase 3: AI & Scale
- License Plate Recognition
- Multi-building support
- Real-time updates
- Analytics dashboard

---

## Testing Strategy

**Unit Tests:** Raffle algorithm, utilities  
**Integration Tests:** API contracts, DB operations  
**E2E Tests (Phase 2):** Complete flows

---

## Open Questions

**Assumptions:**
- Residents honest about unit numbers
- Manual raffle trigger (MVP)
- One resident per unit
- All spots equal value

**Questions:**
- Notify residents of raffle results?
- Auto-clear expired allocations?
- Grace period between cycles?

---

**Status:** MVP in progress  
**Last Updated:** October 2025
