# Developer Onboarding Guide

Welcome to the **Parking Management System** project!  
This guide will help you set up your environment, understand the structure, and start contributing within your first day.

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 20
- **npm** ≥ 9
- **Git**
- **Vercel CLI** (optional)
- Access to **Supabase** project credentials

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/manucomi/parking-management-system.git
cd parking-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

**Frontend** (`apps/frontend/.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend** (`apps/backend/.env`):

```bash
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SUPABASE_JWT_SECRET=your-jwt-secret
```

Request Supabase credentials from the Tech Lead.

### 4. Run development servers

```bash
# Frontend
npm run dev --workspace=apps/frontend

# Backend
npm run dev --workspace=apps/backend
```

### 5. Access local apps

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

---

## Repository Structure

```
parking-management-system/
│
├── apps/
│   ├── frontend/     → Next.js app (Resident/Admin UI)
│   └── backend/      → Express API (raffle logic, data)
│
├── docs/             → Architecture, UI, team documentation
│
├── packages/         → Shared libraries (e.g., cache service)
│
├── config/           → Env templates, build configs
│
└── README.md
```

---

## Development Workflow

### 1. Create a feature branch

```bash
git checkout -b feature/raffle-endpoint
```

### 2. Commit convention

Use clear, meaningful commit messages:

```bash
feat(raffle): add fairness algorithm
fix(api): correct resident join validation
docs(ui): update figma reference
```

### 3. Pull request process

- Push your branch and open a PR to \`main\`.
- Include:
    - **Description** of the change
    - **Linked ticket / ADR**
    - **Screenshots** (for UI changes)
- Assign reviewer (Tech Lead or peer).

---

## Testing & QA

- Unit tests with **Jest** (frontend + backend).
- E2E tests with **Playwright** (optional future).
- PRs must pass all automated tests before merge.

---

## Best Practices

- Keep PRs small and focused.
- Document every architectural or design decision in \`/docs/design-docs/adr/\`.
- Prefer reusable React components with PropTypes validation.
- Use async/await instead of nested promises.
- Follow ESLint + Prettier rules (preconfigured).

---

## Deployment Overview

- **Frontend:** Deployed via Vercel. Preview builds auto-generated per PR.
- **Backend:** Deployed via Render; updates triggered automatically on merge.
- **Database:** Supabase PostgreSQL with connection pooling.
- **Cache:** SSR caching (in-memory) for server-side rendered pages.

---

## Getting Help

- Check `/docs/architecture` for system context and architecture diagrams
- Review ADRs in `/docs/design-docs/adr` for past technical decisions
- Reference the [System Architecture](../architecture/system-architecture.md) overview
- See [Frontend Architecture](../../FRONTEND_ARCHITECTURE.md) for UI patterns

---

**Related:**

- [Delegation Plan](./delegation-plan.md)
- [System Architecture](../architecture/system-architecture.md)
- [Authentication Guide](../../AUTHENTICATION_GUIDE.md)
