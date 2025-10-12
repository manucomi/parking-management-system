# Parking Management System - Frontend

Next.js application for managing parking spot allocation through automated raffles.

[![Live Demo](https://img.shields.io/badge/Live-Vercel-black?logo=vercel)](https://parking-management-system-frontend-rho.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)

---

## 🌐 Live Demo

**Production:** [https://parking-management-system-frontend-rho.vercel.app/](https://parking-management-system-frontend-rho.vercel.app/)

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 9

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router + SSR)
- **UI Library:** React 19
- **Styling:** SCSS Modules + CSS Variables
- **Testing:** Jest + React Testing Library
- **Documentation:** Storybook
- **Linting:** ESLint + Stylelint
- **CI/CD:** GitHub Actions → Vercel

---

## 📦 Available Scripts

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start development server on port 3000 |
| `npm run build`         | Build production bundle               |
| `npm run start`         | Start production server               |
| `npm run lint`          | Run ESLint and Stylelint              |
| `npm run lint:fix`      | Fix linting issues automatically      |
| `npm test`              | Run Jest tests                        |
| `npm run test:watch`    | Run tests in watch mode               |
| `npm run test:coverage` | Generate coverage report              |
| `npm run storybook`     | Launch Storybook component explorer   |

---

## 🧪 Testing

The project maintains **90%+ test coverage** across all components.

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Coverage Thresholds

- Statements: 90%
- Branches: 90%
- Functions: 90%
- Lines: 90%

---

## 📚 Component Library

All UI components are documented in Storybook:

```bash
npm run storybook
```

**Components include:**

- Layout components (Sidebar, Topbar, AdminSidebar)
- UI elements (Button, Card, Modal, Table, Tabs)
- Forms (FormInput, SearchBar)
- Domain-specific (Banner, BannerRaffle, KpiCard, CountDown)

---

## 🎨 Styling Architecture

The project uses a **modern SCSS architecture** with:

- **CSS Modules** for component-scoped styles
- **Design tokens** organized in `/src/scss/variables/`
- **Utility classes** for common patterns
- **Responsive design** with mobile-first approach

See [SCSS Documentation](./src/scss/README.md) for details.

---

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.scss
│   │   ├── Button.test.jsx
│   │   └── Button.stories.jsx
│   └── ...
├── pages/               # Next.js pages/routes
│   ├── _app.jsx
│   ├── index.jsx
│   ├── admin/
│   └── resident/
├── scss/                # Global styles & variables
│   ├── variables/
│   │   ├── _colors.scss
│   │   ├── _typography.scss
│   │   └── _spacing.scss
│   └── manifest.scss
├── lib/                 # Utility functions
└── data/                # Mock data
```

---

## 🔄 CI/CD Pipeline

Every push to `main` triggers an automated deployment to Vercel:

1. **Linting** - Code quality checks
2. **Testing** - Unit tests with coverage validation
3. **Building** - Production build verification
4. **Deploy** - Automatic deployment to Vercel

See [CI/CD Documentation](../../docs/deployment/frontend-ci-cd.md) for details.

---

## 📖 Documentation

- **[Frontend Architecture](../../FRONTEND_ARCHITECTURE.md)** - High-level overview
- **[Component Documentation](../../docs/ui/ui-overview.md)** - UI component catalog
- **[SCSS Architecture](./src/scss/README.md)** - Styling system
- **[CI/CD Pipeline](../../docs/deployment/frontend-ci-cd.md)** - Deployment process

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Open a PR with clear description

---

## 📄 License

This is a demonstration project created for a Senior Engineer promotion assessment.

---

**Last updated:** 2025-10-12

Run the tests with

```bash
npm test
```

### Linters

#### ESLint

Without automatic fixes:

```bash
npm run lint:js
```

With automatic fixes:

```bash
npm run lint:js:fix
```

#### Stylelint

Without automatic fixes:

```bash
npm run lint:scss
```

With automatic fixes:

```bash
npm run lint:scss:fix
```

#### All linters

Without automatic fixes:

```bash
npm run lint
```

With automatic fixes:

```bash
npm run lint:fix
```

### Changesets

#### Changeset with version bump

This is the most typical changeset to create. It will bump the version of the app and trigger a release to prod in `main`.

```bash
npm run change:add
```

#### Empty changeset with no version bump

Use this when you don't need to bump the version and trigger a release. This is typically used for CI or tooling changes.

```bash
npm run change:add:empty
```
