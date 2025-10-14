# Monorepo CI/CD Strategy

## Overview

This monorepo contains both **frontend** (Next.js) and **backend** (Express) applications. Each has its own CI/CD pipeline that runs independently based on which files are modified.

## Workflows

### Frontend CI/CD (`frontend-ci.yml`)

**Triggers when:**

- Changes in `apps/frontend/**`
- Changes in `.github/workflows/frontend-ci.yml`
- Changes in `.changeset/**` or root config files

**Jobs:**

1. Check Changeset (PR only)
2. Validate Frontend (Lint + Test + Build)
3. Version Bump & Release Notes (main only)
4. Deploy to Vercel (main only)

### Backend CI/CD (`backend-ci.yml`)

**Triggers when:**

- Changes in `apps/backend/**`
- Changes in `.github/workflows/backend-ci.yml`
- Changes in `.changeset/**` or root config files

**Jobs:**

1. Check Changeset (PR only)
2. Validate Backend (Lint + Build)
3. Version Bump & Release Notes (main only)
4. Deploy to Render (main only)

## Branch Protection

### Main Branch Rules

✅ **Require pull request before merging**
✅ **Require status checks to pass**
✅ **Require branches to be up to date**

### Required Status Checks

Add **both** of these checks:

- `Validate Frontend (Lint + Test + Build)`
- `Validate Backend (Lint + Build)`

**How it works:**

- Only **relevant checks** will run based on modified files
- Checks for unmodified apps are **skipped automatically**
- GitHub treats skipped checks as passing ✅

## Examples

### Scenario 1: Frontend-only changes

```bash
# Modified files
apps/frontend/src/components/Button.jsx

# Workflows triggered
✅ Frontend CI/CD Pipeline
⏭️ Backend CI/CD Pipeline (skipped)

# Required checks
✅ Validate Frontend (Lint + Test + Build)
⏭️ Validate Backend (skipped = passes)
```

### Scenario 2: Backend-only changes

```bash
# Modified files
apps/backend/src/services/residentService.js

# Workflows triggered
⏭️ Frontend CI/CD Pipeline (skipped)
✅ Backend CI/CD Pipeline

# Required checks
⏭️ Validate Frontend (skipped = passes)
✅ Validate Backend (Lint + Build)
```

### Scenario 3: Both frontend and backend changes

```bash
# Modified files
apps/frontend/src/pages/index.jsx
apps/backend/src/routes/residentRoutes.js

# Workflows triggered
✅ Frontend CI/CD Pipeline
✅ Backend CI/CD Pipeline

# Required checks
✅ Validate Frontend (Lint + Test + Build) - must pass
✅ Validate Backend (Lint + Build) - must pass
```

## Changesets

Both applications use **changesets** for versioning:

```bash
# Create a changeset
npm run change:add

# Select which package changed
? Which packages would you like to include?
  ◯ frontend
  ◯ parking-management-backend

# Choose version bump
? What type of change is this for [package]?
  ◯ patch (bug fixes)
  ◯ minor (new features)
  ◯ major (breaking changes)
```

## Deployment Strategy

### Frontend → Vercel

- **Automatic:** Every push to `main` triggers Vercel deployment
- **Preview:** Every PR gets a preview deployment
- **Environment:** Production
- **Secrets Required:**
    - `VERCEL_DEPLOY_HOOK_URL` - Webhook URL for triggering deployments
    - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Backend → Render

- **Automatic:** Triggered via webhook after successful merge to `main`
- **Manual:** Can be triggered via Render dashboard
- **Environment:** Production
- **Secrets Required:**
    - `RENDER_DEPLOY_HOOK_URL` - Webhook URL for triggering deployments

## Local Development

```bash
# Start both apps
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:4000

# Run tests (frontend only for now)
npm test

# Lint all
npm run lint
```

## Adding New Status Checks

If you add new workflows or jobs:

1. Update this documentation
2. Add the new check name to Branch Protection Rules
3. Test with a draft PR first
4. Ensure the check skips when files aren't modified

## Troubleshooting

### "Required status check is pending"

- Check if the workflow has proper `paths` filters
- Verify the job name matches exactly in Branch Protection

### "npm ci" fails in CI

- Update root `package-lock.json` after adding backend dependencies
- Run `npm install` from root and commit

### Workflow doesn't trigger

- Check `paths` configuration in workflow
- Verify branch protection rules include the check
- Look at Actions tab for skipped workflows

## References

- [GitHub Actions - Workflow syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Changesets documentation](https://github.com/changesets/changesets)

---

**Related:**

- [Frontend CI/CD Guide](./frontend-ci-cd.md)
- [Changesets Guide](./changesets-guide.md)
- [Vercel Preview Deployments](./vercel-preview-deployments.md)
- [Frontend Workflow](../../.github/workflows/frontend-ci.yml)
- [Backend Workflow](../../.github/workflows/backend-ci.yml)
