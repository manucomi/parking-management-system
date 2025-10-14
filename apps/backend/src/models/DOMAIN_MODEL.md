# Domain Model - Parking Management System

## Entity Relationship Diagram

This document describes the domain model and relationships between entities in the Parking Management System.

## Authentication Integration

User authentication is managed by **Supabase Auth** with the following integration:

- User accounts stored in Supabase `auth.users` table
- Additional user metadata in `residents` table linked by email
- JWT tokens issued by Supabase for API authentication
- Backend middleware verifies JWT tokens for protected endpoints

---

## Entities

### 1. **residents**

Stores information about residential complex residents.

| Field            | Type      | Constraints      | Description                         |
| ---------------- | --------- | ---------------- | ----------------------------------- |
| id               | int4      | PRIMARY KEY      | Unique identifier                   |
| name             | varchar   | NOT NULL         | Resident's full name                |
| email            | varchar   | UNIQUE, NOT NULL | Contact email                       |
| phone            | varchar   |                  | Contact phone                       |
| building         | varchar   | NOT NULL         | Building identifier (A, B, C, etc.) |
| apartment_number | varchar   | NOT NULL         | Apartment number                    |
| has_car          | bool      | DEFAULT false    | Whether resident owns a car         |
| created_at       | timestamp | DEFAULT NOW()    | Record creation timestamp           |
| updated_at       | timestamp | DEFAULT NOW()    | Last update timestamp               |

**Relationships:**

- One resident can have many raffle participations (1:N with `raffle_participants`)
- One resident can have many historical allocations (1:N with `allocation_history`)
- One resident can be assigned to one parking spot at a time (1:1 with `parking_spots.assigned_to`)

---

### 2. **parking_spots**

Represents available parking spaces in the complex.

| Field       | Type      | Constraints                 | Description                             |
| ----------- | --------- | --------------------------- | --------------------------------------- |
| id          | int4      | PRIMARY KEY                 | Unique identifier                       |
| number      | varchar   | NOT NULL                    | Spot number (A-001, B-102, etc.)        |
| building    | varchar   | NOT NULL                    | Building identifier                     |
| level       | varchar   | DEFAULT '1'                 | Parking level/floor                     |
| type        | varchar   | DEFAULT 'regular'           | Spot type (regular, electric, handicap) |
| status      | varchar   | DEFAULT 'available'         | Current status (available, occupied)    |
| assigned_to | int4      | FOREIGN KEY → residents(id) | Currently assigned resident             |
| created_at  | timestamp | DEFAULT NOW()               | Record creation timestamp               |
| updated_at  | timestamp | DEFAULT NOW()               | Last update timestamp                   |

**Constraints:**

- UNIQUE(building, number) - No duplicate spots per building

**Relationships:**

- One spot can be assigned to one resident (1:1 with `residents`)
- One spot can have many historical allocations (1:N with `allocation_history`)

---

### 3. **raffles**

Tracks raffle events for parking spot allocation.

| Field       | Type      | Constraints      | Description                       |
| ----------- | --------- | ---------------- | --------------------------------- |
| id          | int4      | PRIMARY KEY      | Unique identifier                 |
| status      | varchar   | DEFAULT 'active' | Raffle status (active, completed) |
| created_at  | timestamp | DEFAULT NOW()    | When raffle was created           |
| executed_at | timestamp |                  | When raffle was executed          |

**Relationships:**

- One raffle can have many participants (1:N with `raffle_participants`)
- One raffle can result in many allocations (1:N with `allocation_history`)

---

### 4. **raffle_participants**

Junction table tracking which residents are registered for each raffle.

| Field         | Type      | Constraints                 | Description            |
| ------------- | --------- | --------------------------- | ---------------------- |
| id            | int4      | PRIMARY KEY                 | Unique identifier      |
| raffle_id     | int4      | FOREIGN KEY → raffles(id)   | Reference to raffle    |
| resident_id   | int4      | FOREIGN KEY → residents(id) | Reference to resident  |
| registered_at | timestamp | DEFAULT NOW()               | Registration timestamp |

**Constraints:**

- UNIQUE(raffle_id, resident_id) - Resident can only register once per raffle

**Relationships:**

- Many-to-Many relationship between `residents` and `raffles`

---

### 5. **allocation_history**

Historical record of parking spot assignments.

| Field       | Type      | Constraints                     | Description                    |
| ----------- | --------- | ------------------------------- | ------------------------------ |
| id          | int4      | PRIMARY KEY                     | Unique identifier              |
| resident_id | int4      | FOREIGN KEY → residents(id)     | Assigned resident              |
| spot_id     | int4      | FOREIGN KEY → parking_spots(id) | Assigned parking spot          |
| raffle_id   | int4      | FOREIGN KEY → raffles(id)       | Related raffle (if applicable) |
| assigned_at | timestamp | DEFAULT NOW()                   | When assignment was made       |
| released_at | timestamp |                                 | When spot was released         |

**Relationships:**

- Links residents to parking spots with temporal data
- Tracks which raffle resulted in the allocation

---

## Relationship Summary

```
residents (1) ←→ (N) raffle_participants (N) ←→ (1) raffles
    ↓                                                  ↓
    ↓ (1:N)                                          ↓ (1:N)
    ↓                                                  ↓
allocation_history (N) ←→ (1) parking_spots
```

### Key Relationships:

1. **Resident ← Raffle Participation**
    - A resident can participate in multiple raffles
    - A raffle can have multiple participants

2. **Resident ← Parking Spot Assignment**
    - A resident can be assigned to one parking spot at a time (`parking_spots.assigned_to`)
    - Historical assignments are tracked in `allocation_history`

3. **Raffle → Allocation History**
    - When a raffle is executed, it creates entries in `allocation_history`
    - Links winners to their assigned parking spots

4. **Parking Spot → Allocation History**
    - Each spot maintains a history of all residents who have used it
    - Includes assignment and release timestamps

---

## Indexes

Performance-optimized indexes for common queries:

- `idx_residents_email` - Fast lookup by email
- `idx_parking_spots_status` - Quick filtering by availability
- `idx_parking_spots_assigned_to` - Efficient joins with residents
- `idx_raffles_status` - Filter active/completed raffles
- `idx_raffle_participants_raffle_id` - Fast participant lookups
- `idx_raffle_participants_resident_id` - Fast resident raffle history
- `idx_allocation_history_resident_id` - Quick resident history queries
- `idx_allocation_history_spot_id` - Fast spot history lookups
- `idx_allocation_history_raffle_id` - Raffle result queries

---

## Business Rules

1. **Raffle Registration:**
    - Residents must have `has_car = true` to participate
    - One registration per resident per raffle (enforced by UNIQUE constraint)

2. **Parking Allocation:**
    - Spots can only be assigned to one resident at a time
    - When a raffle is executed, available spots are randomly assigned to participants

3. **History Tracking:**
    - All assignments are recorded in `allocation_history`
    - `released_at` is NULL for current assignments
    - When a spot is released, `released_at` is set and `parking_spots.assigned_to` is cleared

4. **Data Integrity:**
    - Foreign keys ensure referential integrity
    - CASCADE deletes prevent orphaned records
    - SET NULL on raffle deletion preserves historical data

---

**Related:**

- [System Architecture](../../../../docs/architecture/system-architecture.md)
- [Component Data Flow](../../../../docs/architecture/component-data-flow.md)
- [Database Schema SQL](./schema.sql)
