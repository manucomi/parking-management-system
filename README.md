# Parking Management System

A scalable web platform for fair parking spot allocation in residential units, featuring automated raffle-based assignments, allocation history tracking, and a foundation for AI-powered expansions.

---

## 🎯 Project Overview

This system manages parking spot allocation for residential complexes through a transparent, automated raffle process that rotates assignments every three months. The architecture is designed with scalability in mind, laying the groundwork for future features like license plate recognition and multi-building support.

**Key Features:**

- 🎲 Fair raffle-based parking allocation
- 📊 Transparent allocation history tracking
- 👥 Separate interfaces for residents and administrators
- 🔄 3-month rotation cycles
- 🚀 Designed for future AI integration (LPR)

---

## 🏗️ Architecture at a Glance

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Next.js   │─────▶│  Express    │─────▶│  PostgreSQL  │
│  (Frontend) │      │  (Backend)  │      │  (Supabase)  │
└─────────────┘      └─────────────┘      └──────────────┘
     │                      │
     └──────────────────────┴─────────▶ SSR Cache Layer
```

**Tech Stack:**

- **Frontend:** Next.js 15 + React 19 (SSR for performance)
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL via Supabase
- **Cache:** Custom SSR cache (future: Redis/Upstash)
- **Hosting:** Vercel (FE) + Render (BE)

---

## 📚 Documentation

This project emphasizes **documentation-first development** and **architectural thinking**. Documentation has been scoped to demonstrate senior-level understanding within assessment timeframe constraints.

> 💡 **Note on Documentation Depth:** Given the take-home assessment timeline (~1 week), documentation focuses on demonstrating architectural thinking and coverage of key concerns. Production implementation would expand on testing strategies, detailed incident response procedures, and comprehensive API documentation.

### Core Documentation

- **[Frontend Architecture](./FRONTEND_ARCHITECTURE.md)** — Entry point to all docs
- **[System Architecture](./docs/architecture/system-architecture.md)** — C4 diagrams and component breakdown
- **[Design Document](./docs/design-docs/design-doc.md)** — High-level design decisions
- **[Architecture Decision Records](./docs/design-docs/adr/)** — Why we made key technical choices

### Planning & Strategy

- **[Requirements](./docs/requirements/requirements.md)** — Functional and non-functional requirements
- **[Delegation Plan](./docs/team/delegation-plan.md)** — How to structure team collaboration
- **[Onboarding Guide](./docs/team/onboarding-guide.md)** — Get new developers up to speed
- **[Scalability Strategy](./docs/architecture/scalability-and-future.md)** — Growth and evolution path

### Technical Deep-Dives

- **[Security Strategy](./docs/architecture/security.md)** — Auth, data protection, and threat mitigation
- **[Performance Considerations](./docs/architecture/performance.md)** — Caching, indexing, and optimization
- **[Domain Model](./docs/architecture/domain-model.md)** — Data relationships and business logic

---

## 🚀 Quick Start

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

# Run development servers
npm run dev
```

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

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

This project follows a **collaborative engineering workflow**:

1. Create a feature branch
2. Make changes with clear commit messages
3. Open a PR with description and tests
4. Get reviewed and merge

See [Delegation Plan](./docs/team/delegation-plan.md) for team collaboration details.

---

## 📋 Roadmap

### ✅ MVP (Current)

- [x] Architecture and design documentation
- [x] Component-based UI structure
- [x] Basic raffle flow (in progress)
- [ ] Core API endpoints
- [ ] Database schema implementation

### 🚧 Phase 2 — Automation & Scale

- [ ] Automated raffle scheduling
- [ ] Redis caching layer
- [ ] Multi-building support
- [ ] Monitoring and logging

### 🔮 Phase 3 — AI Integration

- [ ] License Plate Recognition API
- [ ] Real-time parking status
- [ ] Notification system
- [ ] Analytics dashboard

---

## 🔒 Security & Performance

- **Authentication:** Planned integration with Supabase Auth
- **Data Protection:** HTTPS, encrypted storage, input validation
- **Performance:** SSR caching, database indexing, async operations
- **Scalability:** Horizontal scaling ready, cloud-agnostic design

See detailed documentation:

- [Security Strategy](./docs/architecture/security.md)
- [Performance Guide](./docs/architecture/performance.md)

---

## 📄 License

This is a demonstration project created as part of a Senior Engineer promotion assessment.

---

## 🙋 About This Project

This project was created as part of a **promotion assessment**, with emphasis on:

- Architectural design and system thinking
- Documentation and communication
- Scalability and performance considerations
- Team collaboration and delegation strategies

For a complete assessment overview, see [ASSESSMENT_SUMMARY.md](./ASSESSMENT_SUMMARY.md).
