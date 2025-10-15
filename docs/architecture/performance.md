# Performance Strategy

This document outlines the performance approach and optimizations for the Parking Management System.

## Performance Targets

| Metric             | Target               | Status |
| ------------------ | -------------------- | ------ |
| First Load         | < 3s                 | Active |
| API Response (avg) | < 500ms              | Active |
| Raffle Execution   | < 5s (100 residents) | Active |

## Implemented Optimizations

**SSR Caching:**

- SSR caching active in Next.js with in-memory strategy
- Reduces backend load and improves Time to First Byte (TTFB)
- Per-instance cache for server-side rendered pages

**Database Performance:**

- Connection pooling via Supabase (port 6543)
- Indexed foreign keys for all main relations
- Parameterized queries for optimal execution plans

**Frontend Optimization:**

- Code splitting with CSS Modules
- Component-scoped styles reduce bundle size
- SSR provides improved initial page load

## Planned Enhancements

**Redis Integration (v1.1):**

- Distributed caching layer using Redis or Upstash
- Shared cache across multiple instances
- Reduced database load for frequently accessed data

**Advanced Monitoring:**

- APM integration (e.g., Sentry, New Relic)
- Real-time performance metrics
- Alerting for performance degradation

**Additional Optimizations:**

- React Query for client-side caching
- Brotli compression for static assets
- Database query profiling and optimization

## Known Limitations & Mitigations

**Render Free Tier Sleep Mode:**

Render's free tier puts the backend to sleep after 15 minutes of inactivity, causing 30-60 second wake-up delays.

**Current Impact:**
- Users may see errors when backend is asleep
- Authentication cannot complete until backend wakes
- SSR cache is bypassed during auth check

**Proposed Mitigation:**
- Client-side localStorage cache fallback
- 5-second timeout with graceful degradation
- Optimistic UI showing cached data during wake-up
- Background polling to detect when backend is available

See [Render Sleep Mitigation Strategy](./RENDER_SLEEP_MITIGATION.md) for full implementation details.

**Alternative Solutions:**
1. Upgrade to Render paid tier ($7/month) for always-on backend
2. Implement keep-alive cron job (uses CI/CD minutes)
3. Migrate to platform with better free tier (Railway, Fly.io)

---

**Related:**

- [Render Sleep Mitigation](./RENDER_SLEEP_MITIGATION.md)
- [System Architecture](./system-architecture.md)
- [Caching Strategy ADR](../design-docs/adr/ADR-004-caching-strategy-ssr-and-redis.md)
