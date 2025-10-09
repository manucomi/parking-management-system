# ADR 003: Using Node.js + Express for the Backend API

## Status

Accepted

## Context

The backend service must expose RESTful APIs for resident management, raffle execution, and allocation tracking.  
It should be simple to maintain, fast to iterate, and deployable under a free-tier environment such as Render. The backend must also be extensible to include features like scheduled raffles, Redis caching, and license plate recognition integrations in later phases.

## Decision

We decided to build the backend using **Node.js** with **Express**.

This combination offers flexibility, simplicity, and a large ecosystem. It allows rapid prototyping and easy integration with PostgreSQL and Supabase, while staying lightweight enough for a single service architecture.

## Consequences

### Positive Consequences

- **Simplicity:** Small footprint and fast development cycle for MVP.
- **Flexibility:** Easy to add middleware, custom routes, and integrations.
- **Familiarity:** The team has strong experience with Node.js, reducing learning curve.

### Negative Consequences

- **Monolithic Scope:** If not modularized, the codebase could grow complex over time.
- **Scalability Ceiling:** At higher scale, Express might need to evolve toward a service-based model.

Overall, Node.js with Express provides a clean, pragmatic foundation for rapid backend delivery under MVP constraints, with room to evolve later.
