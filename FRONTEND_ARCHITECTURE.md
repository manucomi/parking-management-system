# Frontend Architecture

Entry point for frontend design, architecture, and implementation documentation.

## SSR Implementation

The app uses `getServerSideProps` with `createServerClient` from `@supabase/ssr` for server-side authentication and data fetching. This ensures authenticated sessions are verified before rendering protected pages.

## Authentication Hooks

- `useAuth.js`: Handles login, signup, logout operations
- Middleware automatically refreshes tokens on each request
- SSR client validates sessions in `getServerSideProps`

For complete authentication details, see [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md).

## Documentation Index

### System Architecture

- [Architecture Overview](docs/architecture/architecture-overview.md)
- [Domain Model](docs/architecture/domain-model.md)
- [Security](docs/architecture/security.md)
- [Performance](docs/architecture/performance.md)

### Design Decisions

- [Design Document](docs/design-docs/design-doc.md)
- [Architecture Decision Records](docs/design-docs/adr/)

### Requirements

- [Project Specification](docs/requirements/project-spec.md)
- [System Requirements](docs/requirements/requirements.md)

---

**Related:**

- [Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [Design References](./docs/ui/DESIGN-REFERENCES.md)
- [System Architecture](./docs/architecture/system-architecture.md)
