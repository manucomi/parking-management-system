# 🧠 Architecture Decision Records (ADRs)

This directory contains all **Architecture Decision Records** (ADRs) for the _Parking Management System_ project.

Each ADR documents a key technical or architectural decision made during the project, including its context, alternatives, reasoning, and expected impact.  
The goal is to make architectural thinking **transparent**, **traceable**, and **maintainable** over time.

---

## How We Structure ADRs

Each ADR follows this standard format:

1. **Title and Identifier** — Example: `ADR-001: Database Choice — PostgreSQL (Supabase)`
2. **Status** — Usually `Proposed`, `Accepted`, `Rejected`, or `Superseded`.
3. **Context** — The problem or technical challenge being addressed.
4. **Decision** — The chosen approach and its justification.
5. **Consequences** — The positive and negative trade-offs of the decision.

This format follows the recommendations of [Michael Nygard’s ADR pattern](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) and is widely used in modern software architecture governance.

---

## ADR Index

| ID                                                          | Title                                             | Status      | Summary                                                                              |
| ----------------------------------------------------------- | ------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| [ADR-001](./ADR-001-database-choice-postgresql-supabase.md) | **Database Choice — PostgreSQL (Supabase)**       | ✅ Accepted | Use Supabase-hosted PostgreSQL for relational storage and MVP hosting.               |
| [ADR-002](./ADR-002-frontend-framework-nextjs.md)           | **Frontend Framework — Next.js**                  | ✅ Accepted | Build the UI using React with SSR, leveraging Next.js for speed and maintainability. |
| [ADR-003](./ADR-003-backend-architecture-nodejs-express.md) | **Backend Architecture — Node.js + Express**      | ✅ Accepted | Use Node.js + Express for REST API simplicity and rapid iteration.                   |
| [ADR-004](./ADR-004-caching-strategy-ssr-and-redis.md)      | **Caching Strategy — SSR Cache Now, Redis Later** | ✅ Accepted | Implement SSR-level cache for MVP; plan Redis integration for scaling.               |

---

## Versioning & Lifecycle

- New ADRs are created whenever a **significant technical decision** is made.
- Once a decision is finalized, its status changes to **Accepted**.
- If a later ADR replaces a previous one, it will mark it as **Superseded** (e.g., ADR-007 supersedes ADR-004).

---

## Related Documentation

- [System Architecture Overview](../architecture/architecture-overview.md)
- [Component Data Flow](../architecture/component-data-flow.md)
- [Design Document](../design-doc.md)
- [Frontend Architecture Index](../../FRONTEND_ARCHITECTURE.md)

---

_This ADR log helps maintain architectural clarity and serves as a knowledge base for both current and future team members._
