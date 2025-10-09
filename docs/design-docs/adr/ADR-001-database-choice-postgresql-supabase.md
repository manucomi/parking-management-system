# ADR 001: Using PostgreSQL (Supabase) for Data Persistence

## Status

Accepted

## Context

For the Parking Management System (PMS), we need a reliable relational database to store and manage data about residents, parking spots, allocations, and raffle history.

The database must support **fairness constraints**, **historical tracking**, and **multi-building scalability**, while keeping costs minimal for the MVP phase. Additionally, since the project will be hosted on free-tier environments, the database must provide a lightweight cloud-managed option that integrates easily with the backend and supports REST access.

## Decision

We decided to use **PostgreSQL** hosted on **Supabase** as the primary database.

Supabase offers a fully managed PostgreSQL instance, real-time capabilities, built-in authentication, and an accessible REST API layer—all of which align perfectly with our MVP goals and technical constraints.

## Consequences

### Positive Consequences

- **Relational Integrity:** PostgreSQL’s schema and constraint system naturally enforce the fairness model across residents and allocations.
- **Low Operational Overhead:** Supabase provides hosting, scaling, and built-in APIs under a generous free tier.
- **Future Growth:** The schema supports extension to multi-building and LPR (License Plate Recognition) modules without major refactors.
- **Developer Velocity:** Familiar SQL environment and built-in dashboard simplify development and testing.

### Negative Consequences

- **Vendor Lock-In:** Migration from Supabase to another provider would require setup effort.
- **Quota Limits:** Free-tier usage could be reached if the dataset grows significantly.
- **Security Configuration:** Row-Level Security (RLS) adds complexity and must be carefully tested.

Overall, PostgreSQL on Supabase strikes the best balance between relational rigor, developer speed, and MVP simplicity.
