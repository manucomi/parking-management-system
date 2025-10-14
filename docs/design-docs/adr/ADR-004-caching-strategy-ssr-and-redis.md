# ADR 004: Caching Strategy — SSR Cache Now, Redis Later

## Status

Accepted

## Context

The MVP must deliver fast load times and minimize backend requests without incurring additional infrastructure costs.  
At the same time, we need a roadmap for scaling toward distributed caching when real-time updates and concurrent user traffic grow.

## Decision

We decided to:

1. **Implement an SSR caching layer** in the frontend using SSR caching (in-memory) that stores API responses during server-side rendering.
2. **Plan a future integration** of **Redis planned for v1.1** in the backend once the system requires cross-instance shared caching or live data synchronization.

## Consequences

### Positive Consequences

- **Immediate Performance Gains:** Improves perceived speed without extra infrastructure.
- **Cost Efficiency:** Works within free-tier constraints (Vercel + Render).
- **Future Ready:** Easy migration path toward distributed cache when usage increases.

### Negative Consequences

- **Local Scope:** SSR cache isn’t shared between instances; may lead to inconsistent states during heavy concurrency.
- **Manual Invalidation:** Requires explicit refresh after key events (e.g., raffle execution).
- **Added Complexity Later:** Redis integration will require new policies for TTL and invalidation.

In summary, this approach achieves the MVP’s performance goals efficiently, while establishing a clear scaling path for future releases.
