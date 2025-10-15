# Parking Management System

Scalable web platform for parking spot allocation with automated raffle-based assignments. Authentication implemented using Supabase Auth (SSR + JWT verification).

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://parking-management-system-frontend-rho.vercel.app/)
[![CI/CD](https://img.shields.io/badge/CI/CD-GitHub_Actions-blue?style=for-the-badge&logo=githubactions)](https://github.com/manucomi/parking-management-system/actions)

---

## Project Overview

This system manages parking spot allocation for residential complexes through a transparent, automated raffle process. The architecture demonstrates scalability patterns and production-ready authentication.

**Key Features:**

- Fair raffle-based parking allocation
- Transparent allocation history tracking
- Role-based access control (admin/resident)
- Automated deployment pipeline
- Foundation for AI integration (LPR)

---

## Architecture at a Glance

```
User → Vercel (Next.js SSR) → Render (Express API) → Supabase (PostgreSQL + Auth)
```

**Tech Stack:**

- **Frontend:** Next.js 15 + React 19 (SSR for performance)
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth with JWT
- **Cache:** Custom SSR cache (future: Redis/Upstash)
- **Hosting:** Vercel (Frontend) + Render (Backend)
- **CI/CD:** GitHub Actions → Vercel + Render

---

## Documentation

This project emphasizes documentation-first development and architectural thinking.

### Core Documentation

- [Architecture Overview](docs/architecture/architecture-overview.md) - System design and patterns
- [Authentication Guide](AUTHENTICATION_GUIDE.md) - Supabase Auth implementation
- [Security](docs/architecture/security.md) - Security controls and strategy
- [Performance](docs/architecture/performance.md) - Optimization and caching
- [Frontend Architecture](FRONTEND_ARCHITECTURE.md) - Frontend patterns and structure

### Additional Resources

- [Requirements](docs/requirements/requirements.md) - Functional and non-functional requirements
- [Delegation Plan](docs/team/delegation-plan.md) - Team collaboration structure
- [Onboarding Guide](docs/team/onboarding-guide.md) - Developer setup guide
- [Domain Model](docs/architecture/domain-model.md) - Data relationships and business logic

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 9
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/manucomi/parking-management-system.git
cd parking-management-system

# Install dependencies
npm install

# Set up environment variables
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env
# Edit .env files with your credentials

# Initialize database
cd apps/backend
npm run db:init
cd ../..

# Run development servers
npm run dev
```

### Access the Application

**Development:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

**Production:**

- Frontend (Live): https://parking-management-system-frontend-rho.vercel.app/

**Preview (PR deployments):**

- Automatic preview URL generated for each PR
- Check Vercel bot comment on your PR for the link

For detailed setup instructions, see the [Onboarding Guide](./docs/team/onboarding-guide.md).

---

## 🎨 UI/UX Design

All design assets and specifications are organized in `/docs/ui/`:

- **[Design References](./docs/ui/DESIGN-REFERENCES.md)** — Complete design documentation
- **[UI Overview](./docs/ui/ui-overview.md)** — Component catalog and patterns
- **[Figma Designs](./docs/ui/)** — Original design files (PDF) and exported assets
- **[SCSS Architecture](./apps/frontend/src/scss/README.md)** — Design token implementation

### Design → Code Mapping

- Color palette: `/apps/frontend/src/scss/variables/_colors.scss`
- Typography: `/apps/frontend/src/scss/variables/_typography.scss`
- Components: `/apps/frontend/src/components/`

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage
```

---

## 🏛️ Project Structure

```
parking-management-system/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # Express API server
├── docs/
│   ├── architecture/      # System design & diagrams
│   ├── design-docs/       # ADRs and design decisions
│   ├── requirements/      # Feature specs and requirements
│   ├── team/             # Collaboration and onboarding
│   └── ui/               # Design assets and mockups
├── packages/             # Shared utilities (future)
└── scripts/              # Deployment and automation scripts
```

---

## 🤝 Contributing

This project follows a **collaborative engineering workflow** with automated version management:

1. **Create a feature branch** from `main`
2. **Make changes** with clear commit messages
3. **Create a changeset**: `npm run change:add`
    - Documents what changed for release notes
    - Required for all PRs (CI will block without it)
4. **Open a PR** with description and tests
5. **Get reviewed** and merge
6. **Auto-release** - CI automatically:
    - Bumps version (semver)
    - Generates changelog
    - Deploys to production

See [Changesets Guide](./docs/deployment/changesets-guide.md) and [Delegation Plan](./docs/team/delegation-plan.md) for details.

---

## Roadmap

### MVP (Current - Completed)

- [x] Architecture and design documentation
- [x] Component-based UI structure
- [x] Supabase Auth (SSR with JWT verification)
- [x] Core API endpoints (residents, spots, raffle)
- [x] Database schema implementation
- [x] CI/CD pipeline with automated deployments

### Phase 2 — Testing & Hardening

- [ ] Backend unit and integration tests
- [ ] E2E authentication tests
- [ ] Rate limiting and API protection
- [ ] Error monitoring and logging

### Phase 3 — Additional Features

- [ ] Email notifications
- [ ] Multi-building support in UI
- [ ] Redis caching layer
- [ ] Password reset flow

### Phase 4 — AI Integration

- [ ] License Plate Recognition API
- [ ] Real-time parking status
- [ ] Analytics dashboard

---

## Security & Performance

- **Authentication:** Supabase Auth with JWT-based API protection
- **Authorization:** Role-based access control (admin/resident)
- **Data Protection:** HTTPS, HTTP-only cookies, input validation
- **Performance:** SSR caching, database indexing, connection pooling
- **Scalability:** Horizontal scaling ready, cloud-agnostic design

See detailed documentation:

- [Security Strategy](./docs/architecture/security.md)
- [Performance Guide](./docs/architecture/performance.md)

---

## Project Status

- Authentication implemented
- Backend tests pending
- Ready for production hardening
