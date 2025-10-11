# System Requirements

> **Note:** This document outlines core requirements for the assessment. Production would include more detailed acceptance criteria, edge cases, and regulatory requirements.

---

## Functional Requirements

### Core Features (MVP)

**FR-1: Resident Management**
- Register with email, name, unit number
- View profile and allocation history
- Opt-in/out of raffle participation

**FR-2: Parking Spot Management**
- Admins create/update/delete spots
- Track spot status (available, allocated, maintenance)
- Unique identifiers (e.g., "A-101")

**FR-3: Raffle System**
- Admin-triggered raffle execution
- Prioritize residents without recent allocations
- Exclude previous cycle winners
- Immediate visibility of results
- Audit logging

**FR-4: Allocation Tracking**
- Record all assignments with timestamps
- Display resident history
- Generate fairness reports

**FR-5: Dashboards**
- Resident: Current status, next raffle, history
- Admin: KPIs, allocations, participation

### Future Features (Phase 2+)

- Automated 3-month scheduling
- Multi-building support
- License Plate Recognition (LPR)
- Notification system

---

## Non-Functional Requirements

### Performance
- Dashboard loads < 2s (3G)
- API responses < 200ms (p95)
- Raffle execution < 5s (100 residents)
- 1,000 concurrent users supported

### Security
- HTTPS/TLS 1.3 for all traffic
- bcrypt password hashing (≥12 rounds)
- JWT-based authentication
- SQL injection prevention
- OWASP Top 10 compliance

### Scalability
- Horizontal backend scaling
- Database performant with 10,000+ residents
- Caching reduces load by 60%
- Support 50+ buildings (future)

### Reliability
- 99.5% uptime
- Daily automated backups (30-day retention)
- Atomic raffle operations
- Error logging and alerts

### Maintainability
- ESLint + Prettier enforced
- 70% test coverage (critical logic)
- ADR documentation for decisions
- Reusable component library

---

## Data Model (Core Entities)

```sql
-- Residents
CREATE TABLE residents (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit_number VARCHAR(50) NOT NULL,
  opted_in BOOLEAN DEFAULT true
);

-- Parking Spots
CREATE TABLE parking_spots (
  id UUID PRIMARY KEY,
  spot_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  type VARCHAR(20) DEFAULT 'standard'
);

-- Allocations
CREATE TABLE allocations (
  id UUID PRIMARY KEY,
  resident_id UUID REFERENCES residents(id),
  spot_id UUID REFERENCES parking_spots(id),
  allocated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);
```

---

## Success Criteria

### MVP
- ✅ Complete architecture docs (C4 diagrams)
- ✅ Functional raffle algorithm
- ✅ Working dashboards
- ⏳ Deployment pipeline
- ⏳ 60% test coverage

### Phase 2
- Automated scheduling
- Redis caching (40% faster)
- Multi-building support
- 500+ residents handled

---

## Constraints

**Technical:**
- Free-tier cloud services (MVP)
- Node.js ≥ 20
- PostgreSQL-compatible DB
- SSR support required

**Business:**
- MVP demonstrable within assessment timeframe
- LPR requires external ML team
- Multi-building deferred to post-MVP

---

## Out of Scope

- Mobile native apps
- Payment processing
- Physical gate integration
- Visitor parking
- Smart home integrations

---

**Last Updated:** October 2025  
**Status:** Living document
