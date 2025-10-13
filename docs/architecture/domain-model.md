# Domain Model

Entities and relationships for Parking Management System.

## Database Schema Diagram

```
┌─────────────────────┐
│     residents       │
├─────────────────────┤
│ 🔑 id (int4)        │
│ ◆  name (varchar)   │
│ ◆  email (varchar)  │◄────┐
│ ◇  phone (varchar)  │     │
│ ◆  building         │     │
│ ◆  apartment_number │     │
│ ◇  has_car (bool)   │     │
│ ◇  created_at       │     │
│ ◇  updated_at       │     │
└─────────────────────┘     │
         │                  │
         │ 1:N              │
         ▼                  │
┌─────────────────────┐     │
│ raffle_participants │     │
├─────────────────────┤     │
│ 🔑 id (int4)        │     │
│ ◇  raffle_id ───────┼─────┼──┐
│ ◇  resident_id ─────┼─────┘  │
│ ◇  registered_at    │        │
└─────────────────────┘        │
         │                     │
         │ N:1                 │
         ▼                     │
┌─────────────────────┐        │
│      raffles        │◄───────┘
├─────────────────────┤
│ 🔑 id (int4)        │
│ ◇  status (varchar) │
│ ◇  created_at       │
│ ◇  executed_at      │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│ allocation_history  │
├─────────────────────┤
│ 🔑 id (int4)        │
│ ◇  resident_id ─────┼───┐
│ ◇  spot_id ─────────┼───┼──┐
│ ◇  raffle_id        │   │  │
│ ◇  assigned_at      │   │  │
│ ◇  released_at      │   │  │
└─────────────────────┘   │  │
                          │  │
         ┌────────────────┘  │
         │                   │
         ▼                   │
┌─────────────────────┐      │
│   parking_spots     │◄─────┘
├─────────────────────┤
│ 🔑 id (int4)        │
│ ◆  number (varchar) │
│ ◆  building         │
│ ◇  level (varchar)  │
│ ◇  type (varchar)   │
│ ◇  status (varchar) │
│ ◇  assigned_to ─────┼──► residents(id)
│ ◇  created_at       │
│ ◇  updated_at       │
└─────────────────────┘
```

**Legend:**

- 🔑 = Primary Key
- ◆ = Required Field (NOT NULL)
- ◇ = Optional Field / Foreign Key
- ─► = Foreign Key Relationship

## Entities

### 1. Residents

Stores information about complex residents.

**Key Fields:**

- `email` - Unique identifier for authentication
- `has_car` - Eligibility for parking raffle
- `building` + `apartment_number` - Physical location

**Relationships:**

- Can participate in multiple raffles (via `raffle_participants`)
- Can have one current parking assignment (`parking_spots.assigned_to`)
- Has historical parking allocations (`allocation_history`)

---

### 2. Parking Spots

Available parking spaces in the complex.

**Key Fields:**

- `number` - Spot identifier (e.g., "A-001")
- `building` + `number` - Unique constraint
- `status` - "available" or "occupied"
- `type` - "regular", "electric", "handicap"
- `assigned_to` - Current resident FK

**Relationships:**

- Belongs to one resident at a time (1:1 with `residents`)
- Has historical assignments (`allocation_history`)

---

### 3. Raffles

Raffle events for parking allocation.

**Key Fields:**

- `status` - "active" or "completed"
- `created_at` - When raffle was opened
- `executed_at` - When winners were selected

**Relationships:**

- Has many participants (via `raffle_participants`)
- Results in allocations (`allocation_history`)

---

### 4. Raffle Participants

Junction table for raffle registration.

**Key Fields:**

- `raffle_id` + `resident_id` - Unique constraint
- `registered_at` - Registration timestamp

**Relationships:**

- Many-to-Many between `residents` and `raffles`

---

### 5. Allocation History

Historical record of parking assignments.

**Key Fields:**

- `assigned_at` - When assignment was made
- `released_at` - When spot was freed (NULL = current)
- `raffle_id` - Which raffle resulted in allocation

**Relationships:**

- Links `residents` to `parking_spots` with temporal data
- Tracks assignment source (raffle or manual)

---

## Business Rules

1. **Raffle Eligibility:**
    - Only residents with `has_car = true` can participate
    - One registration per resident per raffle (enforced by UNIQUE constraint)

2. **Parking Assignment:**
    - One spot per resident at a time
    - When raffle executes, available spots randomly assigned to participants
    - Previous assignment released before new assignment

3. **Data Integrity:**
    - Foreign keys ensure referential integrity
    - CASCADE deletes on participants prevent orphans
    - SET NULL on raffle deletion preserves history

4. **Status Management:**
    - `parking_spots.status` updated when assigned/released
    - `raffles.status` changes from "active" to "completed" after execution
    - `allocation_history.released_at` set when spot freed

---

## Indexes

Performance optimization for common queries:

```sql
-- Lookup indexes
idx_residents_email
idx_parking_spots_status
idx_raffles_status

-- Foreign key indexes
idx_parking_spots_assigned_to
idx_raffle_participants_raffle_id
idx_raffle_participants_resident_id
idx_allocation_history_resident_id
idx_allocation_history_spot_id
idx_allocation_history_raffle_id
```

---

## Implementation

See `/apps/backend/src/models/` for:

- `schema.sql` - Full database schema
- `DOMAIN_MODEL.md` - Detailed entity documentation
