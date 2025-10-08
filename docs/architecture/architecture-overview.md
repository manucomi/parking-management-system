# System Architecture Overview

The **Parking Management System** is designed as a modular, scalable web application that ensures fair and automated parking spot allocations within a residential complex.  
It follows a **three-tier architecture** with clear separation of concerns between presentation, application logic, and data persistence.

---

## 🧩 Architectural Drivers

| Category            | Driver         | Description                                                         |
| ------------------- | -------------- | ------------------------------------------------------------------- |
| **Primary Goal**    | Fairness       | Guarantee equitable parking spot rotations every 3 months.          |
| **Scalability**     | Growth         | Support multiple buildings or complexes in future iterations.       |
| **Maintainability** | Code structure | Clear modularity between frontend, backend, and persistence layers. |
| **Deployability**   | Simplicity     | Free-tier deployment on Vercel (frontend) and Render (backend).     |
| **Reliability**     | Data integrity | PostgreSQL (Supabase) ensures relational consistency.               |

---

## 🧱 System Layers

| Layer                | Technology            | Purpose                                                               |
| -------------------- | --------------------- | --------------------------------------------------------------------- |
| **Frontend**         | Next.js (React)       | Provides user interfaces for Residents and Admins.                    |
| **Backend API**      | Node.js with Express  | Handles raffle logic, resident management, and fairness rotation.     |
| **Database**         | PostgreSQL (Supabase) | Stores residents, parking spots, allocations, and historical records. |
| **Cache (Optional)** | Redis (Upstash)       | Caches read-heavy queries like raffle results.                        |
| **Hosting**          | Vercel + Render       | Enables automatic deployments and PR-based preview environments.      |

---

## 🗺️ C4 Architecture Diagrams

### Level 1: System Context

![System Context Diagram](./system-context-diagram.jpeg)

The context diagram shows how the system interacts with external actors (Residents, Admins) and services (Supabase, Render, Vercel).

---

### Level 2: Container Diagram

![Container Diagram](./container-diagram.jpeg)

This diagram outlines the high-level containers (Frontend, API, Database, Cache) and their communication flows.

---

### Level 3: Component Diagram

![Component Diagram](./component-diagram.jpeg)

Shows the internal structure of both frontend and backend — how Next.js components, hooks, and API endpoints map to Express services and controllers.

---

### Level 4: Sequence Diagram (Raffle Flow)

![Raffle Sequence Diagram](./sequence-diagram-raffle.jpeg)

Depicts the interaction between system parts during a parking raffle cycle, from user registration to allocation update.

---

## ⚙️ Architectural Principles

1. **Separation of Concerns**  
   Each layer (frontend, backend, DB) has clear responsibilities.
2. **Simplicity and Cost-efficiency**  
   Deployments use free-tier platforms to balance scalability and affordability.
3. **Transparency in Allocation**  
   All raffle results and histories are persisted for auditability.
4. **Extendability**  
   Modular architecture supports new features (e.g., license plate detection).

---

## 🧩 Future Evolution

| Goal                      | Evolution Path                                            |
| ------------------------- | --------------------------------------------------------- |
| Multi-building support    | Add `Building` table and extend allocation logic.         |
| License Plate Recognition | Integrate an ML pipeline (delegated to AI/DevOps team).   |
| Event-driven updates      | Replace REST calls with WebSockets or Server-Sent Events. |

---
