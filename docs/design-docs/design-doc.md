# Parking Management System — High-Level Design Document

## 1. Overview

This document outlines the **high-level architecture design** for the **Parking Management System (PMS)** — a scalable web platform for fair parking spot allocation in residential units.

The goal is to design a modular and maintainable system that:

- Automates **raffle-based parking assignments** every three months.
- Tracks resident allocation history to ensure fairness.
- Lays the foundation for **future AI integrations**, such as **license plate recognition** and **real-time vehicle detection**.

This document summarizes architectural goals, high-level design, alternatives considered, and risk mitigation strategies.

---

## 2. Context

Current residential parking systems often rely on manual management, which leads to inconsistencies and potential bias.  
The PMS aims to introduce transparency and automation in allocation cycles while keeping the system lightweight, low-cost, and ready for future enhancements.

The system is part of a broader **smart community ecosystem**, designed to integrate with sensors and AI-based modules over time.

![System Context Diagram](../architecture/system-context-diagram.jpeg)

---

## 3. Goals and Non-Goals

### ✅ Goals

- **Fairness & Transparency** — Automate parking spot assignments to avoid human bias.
- **Scalability** — Support multiple buildings and future AI-powered modules.
- **Maintainability** — Clear modular boundaries between frontend, backend, and data layers.
- **Performance** — Optimize via SSR caching and efficient database queries.
- **Cost-Efficiency** — Use free-tier cloud services for MVP deployment.
- **Extendability** — Enable plug-in architecture for future LPR (License Plate Recognition) modules.

### 🚫 Non-Goals

- Building a mobile app (web responsive only for MVP).
- Implementing full AI pipelines (only placeholders and endpoints are prepared).
- Managing payments or non-parking resident services.

---

## 4. High-Level Design

The PMS follows a **three-tier architecture** with strong separation of concerns:

- **Frontend:** Next.js application for residents and admins.  
  Handles UI, SSR caching, and data fetching.
- **Backend:** Node.js + Express API for business logic and data orchestration.  
  Encapsulates the raffle engine, resident management, and audit trails.
- **Database:** Supabase (PostgreSQL) with strict relational modeling for consistency.
- **Cache:**
  - SSR-level caching via custom `NetworkFirstCacheService`.
  - Future upgrade path to Redis (Upstash) for distributed, shared cache.
- **Hosting:**
  - Frontend: **Vercel** (automatic PR previews).
  - Backend: **Render** (auto-deploy from GitHub).

### Container Diagram

![Container Diagram](../architecture/container-diagram.jpeg)

---

### Architectural Style

- **Component-Based Architecture (React)** — Each view (Dashboard, Raffle, Residents) is a modular unit.
- **API-Driven Integration** — All UI interactions go through versioned REST endpoints.
- **Server-Side Rendering (SSR)** — For improved SEO and first-load performance.
- **Progressive Enhancement** — Supports offline/low-network caching fallback.
- **Monorepo Setup** — Uses Turborepo for unified builds and shared configuration.
- **Extensible API Layer** — Designed to integrate ML or IoT modules in future phases.

---

### Core Modules

| Module                  | Description                                              | Owner              |
| ----------------------- | -------------------------------------------------------- | ------------------ |
| **Resident Management** | Registration, profile management, and raffle opt-in/out. | Frontend + Backend |
| **Raffle Engine**       | Fair allocation algorithm with 3-month rotation.         | Backend            |
| **Allocation Tracking** | Tracks assignments and fairness history.                 | Backend            |
| **Admin Dashboard**     | UI for admins to trigger raffles and monitor activity.   | Frontend           |
| **SSR Cache Service**   | Custom caching utility for data reuse during SSR.        | Frontend           |
| **Future LPR Module**   | Placeholder for real-time license plate ingestion.       | Backend + ML       |

---

## 5. Technology Stack

| Layer              | Technology                                                   | Purpose                            |
| ------------------ | ------------------------------------------------------------ | ---------------------------------- |
| **Frontend**       | Next.js 15 + React 19                                        | SSR, routing, component-based UI   |
| **Backend**        | Node.js + Express                                            | Business logic, API endpoints      |
| **Database**       | PostgreSQL (Supabase)                                        | Resident & allocation persistence  |
| **Cache**          | Custom SSR cache (NetworkFirstCacheService) → Redis (future) | Performance                        |
| **Infrastructure** | Vercel (FE) + Render (BE)                                    | Free-tier deployment & CI/CD       |
| **Tooling**        | ESLint, Prettier, Turborepo                                  | Code quality and build performance |

---

## 6. Alternatives Considered

| Option                        | Reason for Rejection                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| **Pure SPA (React only)**     | Lacked SSR, slower initial load, and no SEO benefits.                       |
| **Remix**                     | Excellent SSR support, but team lacks experience; higher ramp-up time.      |
| **Next.js + API routes only** | Preferred explicit backend separation for modularity.                       |
| **MongoDB**                   | Simple, but relational data model (PostgreSQL) ensures fairness tracking.   |
| **Redis MVP**                 | Deferred for now; SSR cache meets performance goals under free-tier limits. |

---

## 7. Timeline (Proposal)

| Phase                                | Focus                                            | Duration     |
| ------------------------------------ | ------------------------------------------------ | ------------ |
| **Phase 1 — Architecture & Docs**    | System design, diagrams, ADRs, and setup         | Week 1       |
| **Phase 2 — MVP Implementation**     | Core raffle flow, resident registration          | Week 2–3     |
| **Phase 3 — Testing & Optimization** | Cache integration, QA, and docs update           | Week 4       |
| **Phase 4 — Scalability Prep**       | Setup Redis, LPR endpoints, multi-building model | Future Phase |

---

## 8. Risks and Mitigation

| Risk                            | Description                                      | Mitigation                                   |
| ------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| **Raffle fairness bugs**        | Errors in rotation could bias assignments.       | Use history-based exclusion + test datasets. |
| **Supabase downtime**           | Cloud DB unavailability during raffle execution. | SSR cache fallback + retry logic.            |
| **Scaling limits (free tiers)** | Free-tier quotas on Render/Vercel.               | Progressive migration path to AWS/GCP.       |
| **Team onboarding**             | New devs misaligned on architecture.             | Documentation-first + ADR review process.    |
| **AI/LPR integration**          | Complex ML workloads not MVP-ready.              | Define contracts early; delegate to ML team. |

---

## 9. Open Questions

- Should the raffle rotation be time-triggered automatically (cron) or manually triggered by admins?
- Will license plate recognition use a third-party service (e.g., AWS Rekognition, OpenCV) or an internal ML pipeline?
- Should multi-building support follow a multi-tenant database model?
- Will we introduce GraphQL for optimized client queries in future versions?

---

## 10. Appendix

### References

- [System Architecture Overview](../architecture/architecture-overview.md)
- [Component Data Flow](../architecture/component-data-flow.md)
- [Delegation Plan](../team/delegation-plan.md)
- [ADR Records](../design-docs/adr/)
- [Figma Mockups](../ui/ui-overview.md)

---
