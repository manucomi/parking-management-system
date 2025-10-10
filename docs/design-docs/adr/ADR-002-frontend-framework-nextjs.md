# ADR 002: Using Next.js for the Frontend Application

## Status

Accepted

## Context

The Parking Management System requires a modern frontend framework capable of delivering both **resident-facing** and **admin-facing** interfaces.  
The application needs to support **server-side rendering (SSR)** for performance, SEO, and caching benefits, while also allowing fast feature iteration and clean modularization.

## Decision

We decided to use **Next.js** (React) as the framework for building the frontend application.

Next.js offers an ideal mix of SSR, static generation, routing simplicity, and deployment flexibility. The team already has extensive experience with React and Next.js, reducing ramp-up time and enabling rapid development.

## Consequences

### Positive Consequences

- **Fast Iteration:** The team can leverage existing Next.js expertise for quick MVP delivery.
- **Performance:** SSR improves load time and SEO for resident and admin dashboards.
- **Integrated Caching:** Built-in SSR cache and incremental rendering support our performance goals.
- **Developer Experience:** Excellent tooling, TypeScript support, and ecosystem maturity.
- **Community and Ecosystem:** Next.js has a strong community and ecosystem, providing us with a wealth of resources, plugins, and third-party integrations that can enhance our development process and application capabilities.

### Negative Consequences

- **SSR Complexity:** Requires careful management of data fetching boundaries between client and server.
- **Deployment Coupling:** Hosting SSR pages on Vercel ties part of the runtime to Vercel’s infra (acceptable for MVP).

In conclusion, Next.js provides the right balance of performance, flexibility, and developer efficiency to meet both MVP and long-term goals.
