# Frontend CI/CD Pipeline Configuration

This document describes the continuous integration (CI) and continuous deployment (CD) pipeline for the Parking Management System – Frontend application. It covers the setup, execution flow, and how it integrates GitHub Actions with Vercel for automated validation and deployments.

---

## Overview

The pipeline ensures that every code change is validated before deployment and that deployments are triggered only after passing linting, testing, and build checks.

**Workflow File:**  
`.github/workflows/frontend-ci.yml`

**Deployed Environment:**  
Vercel – `apps/frontend`

---

## Workflow Triggers

The workflow runs under two conditions:

```yaml
on:
    pull_request:
        branches: [main]
        paths:
            - 'apps/frontend/**'
            - '.github/workflows/frontend-ci.yml'
            - 'package.json'
            - 'turbo.json'
    push:
        branches: [main]
        paths:
            - 'apps/frontend/**'
            - '.github/workflows/frontend-ci.yml'
            - 'package.json'
            - 'turbo.json'
```

- **Pull Request (PR)**: Runs the full CI pipeline before merging.
- **Push to main**: Triggers deployment to Vercel (via webhook) after validation passes.

---

## CI Steps

The CI job validates the frontend app through several automated checks:

```yaml
jobs:
    frontend_ci:
        name: Validate Frontend (Lint + Test + Build)
        runs-on: ubuntu-latest
        defaults:
            run:
                working-directory: apps/frontend
```

### Steps:

1. **Checkout Repository**

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```

2. **Setup Node.js**

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
      node-version: 20
      cache: 'npm'
```

3. **Install Dependencies**

```yaml
- name: Install dependencies
  run: npm ci
```

4. **Run Linter**

```yaml
- name: Run Linter
  run: npm run lint
```

5. **Run Tests**

```yaml
- name: Run Tests
  run: npm run test
```

6. **Build App**

```yaml
- name: Build Next.js App
  run: npm run build
```

---

## CD: Deployment to Vercel

Once the CI job completes successfully and the commit is merged into `main`, a secondary job triggers the Vercel Deploy Hook:

```yaml
deploy:
    name: Deploy to Vercel (on merge)
    needs: frontend_ci
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
        - name: Checkout repository
          uses: actions/checkout@v4

        - name: Trigger Vercel Deploy
          env:
              VERCEL_DEPLOY_HOOK_URL: ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
          run: |
              echo "Triggering Vercel Deploy..."
              curl -X POST "$VERCEL_DEPLOY_HOOK_URL"
```

### Secrets

- **VERCEL_DEPLOY_HOOK_URL**:  
  Defined in your repo's GitHub Secrets (Settings → Secrets → Actions).  
  This hook is generated in the Vercel dashboard under Project Settings → Deploy Hooks.

---

## Branch Protection

To ensure safe merges, the `main` branch is protected:

- Direct pushes are disabled.
- Merges require at least one PR approval.
- PRs must pass all CI checks before merging.

This guarantees that only validated and reviewed code reaches production.

---

## Validation Summary

| Stage  | Command                                | Purpose                                                     |
| ------ | -------------------------------------- | ----------------------------------------------------------- |
| Lint   | `npm run lint`                         | Ensures consistent code style and detects potential issues. |
| Test   | `npm run test`                         | Runs unit tests using Jest.                                 |
| Build  | `npm run build`                        | Validates production build for Next.js.                     |
| Deploy | `curl -X POST $VERCEL_DEPLOY_HOOK_URL` | Triggers production deploy on Vercel.                       |

---

## Future Improvements

| Improvement                 | Description                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| Preview Deployments         | Trigger temporary preview deployments on each PR for QA validation. |
| Parallel CI Jobs            | Split lint/test/build into separate jobs for faster execution.      |
| Automated Lighthouse Audits | Integrate Lighthouse CI to check performance and accessibility.     |
| Slack Notifications         | Notify team on deploy success or failure.                           |

---

## References

- [Vercel – Build & Deploy Settings](https://vercel.com/docs/concepts/deployments/overview)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

**Last updated:** 2025-10-12
