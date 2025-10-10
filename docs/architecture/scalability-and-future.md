# Scalability and Future Evolution

This document outlines how the **Parking Management System** is designed to scale beyond its initial MVP implementation, describing potential future features, architectural evolution, and delegation strategies.

The system’s architecture is intentionally modular — making it easy to extend functionality (e.g., multi-building support, license plate recognition, real-time monitoring) while maintaining simplicity and cost-efficiency in early phases.

---

## Scalability Strategy

### 1. Vertical Scalability (Performance)

- **Backend Optimizations:**
    - Use database indexes on frequently queried fields (`resident_id`, `building_id`, `allocated_at`).
    - Optimize raffle logic by pre-loading eligible residents in memory and using transactions for atomic fairness updates.
- **SSR Caching (MVP):**
    - The Next.js custom `NetworkFirstCacheService` reduces backend load during high-traffic periods.
    - Future replacement with Redis (Upstash) for distributed caching will support higher concurrency.
- **Asynchronous Raffle Execution:**
    - Heavy operations (raffle rotations, fairness recalculations) can run in background jobs to prevent blocking API calls.

### 2. Horizontal Scalability (Users & Buildings)

- **Multi-building Architecture:**
    - Introduce a `building_id` field in all core entities (Resident, ParkingSpot, Allocation).
    - Enable the system to scale across multiple buildings or residential complexes.
- **Multi-tenancy Readiness:**
    - Database schemas can evolve to support separate tenants (e.g., via schemas or `tenant_id` fields).
    - Supabase supports RLS (Row-Level Security) policies for tenant isolation.

### 3. Infrastructure Scalability

- **Deployment Evolution:**
    - Current MVP uses **Vercel (frontend)** and **Render (backend)** for simplicity and CI/CD automation.
    - Future versions can migrate to AWS ECS or Google Cloud Run with minimal configuration changes.
    - Infrastructure-as-Code (IaC) tools like Terraform or Pulumi could define infrastructure declaratively.
- **Caching & Event Queues:**
    - Redis (Upstash) will replace local SSR cache for shared state.
    - For real-time event distribution, consider adding **Pub/Sub** or **RabbitMQ** for event-driven updates.

---

## Future Features Roadmap

| Feature                             | Description                                                   | Architectural Impact                                                        | Delegation                      |
| ----------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------- |
| **Multi-Building Support**          | Manage allocations per building/complex.                      | Adds `building_id` foreign key, modifies fairness logic.                    | Backend engineer + DB admin.    |
| **Automated Raffle Rotation**       | Auto-run raffle every 3 months.                               | Introduces background scheduler (cron or Lambda).                           | Backend / DevOps team.          |
| **License Plate Recognition (LPR)** | Detect and validate vehicles entering/exiting parking.        | Adds external ML API integration and event ingestion layer.                 | AI/ML team + Backend.           |
| **Real-Time Monitoring**            | Show live parking spot usage.                                 | Introduces WebSockets or Server-Sent Events (SSE).                          | Full-stack dev + Backend.       |
| **Notification System**             | Alert users of raffle results and next allocations.           | Adds Notification microservice or third-party integration (e.g., SendGrid). | Full-stack dev.                 |
| **Analytics Dashboard**             | Show usage, fairness distribution, and participation metrics. | Adds data aggregation service or BI integration.                            | Data engineer / Full-stack dev. |

---

## Technical Evolution Plan

### Phase 1 — MVP (Current)

- **Architecture:** Monolithic two-service model (Next.js + Express).
- **Cache:** Local SSR cache only (`NetworkFirstCacheService`).
- **Deployment:** Vercel (frontend) + Render (backend).
- **Database:** Supabase (PostgreSQL).
- **Goal:** Validate fairness and raffle rotation logic.

### Phase 2 — Scaling & Resilience

- **Add Redis Cache** for distributed caching and quicker API responses.
- **Introduce Scheduler Service** (e.g., cron job, AWS Lambda) for automated raffles.
- **Improve Observability:** Add logging and monitoring tools like Logtail or Datadog.

### Phase 3 — Smart Automation

- **Integrate License Plate Recognition (LPR):**
    - Ingest real-time camera events via webhook.
    - Match recognized plates against registered residents.
- **Notifications:**
    - Add push/email alerts for raffle participation and spot assignments.
- **Multi-Building Expansion:**
    - Adapt allocation algorithm to support multiple complexes.

### Phase 4 — Enterprise-Ready Architecture

- **Multi-tenant Database Partitioning** for large-scale clients.
- **Microservices Refactor** for raffle logic, residents, and analytics.
- **Infrastructure Migration** to containerized deployments (AWS ECS / Cloud Run).

---

## Security and Compliance Considerations

| Area                               | Strategy                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| **Authentication & Authorization** | Use Supabase Auth or NextAuth for secure login. Admins get elevated privileges. |
| **Data Protection**                | Encrypt data in transit (HTTPS) and at rest (PostgreSQL AES).                   |
| **Access Control**                 | Apply RLS (Row-Level Security) for per-building data segmentation.              |
| **API Security**                   | Validate all inputs, sanitize user data, and prevent XSS/CSRF attacks.          |
| **Cloud Security**                 | Use least-privilege credentials for Supabase, Render, and Vercel deployments.   |

---

## Delegation & Collaboration Plan

**Core principles:**  
This project assumes a growing multidisciplinary team. As new features evolve, clear boundaries between teams are established for ownership and scalability.

| Team                    | Responsibilities                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **Frontend Team**       | Maintain SSR caching, implement UI enhancements, improve DX via Storybook & tests. |
| **Backend Team**        | Maintain raffle logic, implement multi-building and scheduling features.           |
| **AI/ML Team**          | Build and integrate license plate recognition model and event pipeline.            |
| **DevOps Team**         | Manage CI/CD pipelines, monitor resource usage, scale infrastructure.              |
| **Data/Analytics Team** | Create dashboards for usage and fairness insights.                                 |

---

## Summary

The **Parking Management System** starts as a lightweight monolithic solution but evolves into a scalable, distributed, and event-driven platform.  
By emphasizing caching, modularity, and separation of concerns, the system remains efficient today — and ready for future complexity tomorrow.

> **In short:** Build simple, scale smart.

---

**Next:**  
Proceed to [`docs/team/delegation-plan.md`](../team/delegation-plan.md) for a detailed breakdown of roles, task ownership, and onboarding strategy.
