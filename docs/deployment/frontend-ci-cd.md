# Frontend CI/CD Pipeline Configuration

This document describes the continuous integration (CI) and continuous deployment (CD) pipeline for the Parking Management System – Frontend application. It covers the setup, execution flow, and how it integrates GitHub Actions with Vercel for automated validation and deployments.

---

## ⚙️ Overview

The pipeline ensures that every code change is validated before deployment and that deployments are triggered only after passing linting, testing, and build checks.

**Workflow File:**  
`.github/workflows/frontend-ci.yml`

**Deployed Environments:**

| Environment    | URL                                                                                                                | Trigger         |
| -------------- | ------------------------------------------------------------------------------------------------------------------ | --------------- |
| **Production** | 🌐 [parking-management-system-frontend-rho.vercel.app](https://parking-management-system-frontend-rho.vercel.app/) | Merge to `main` |
| **Preview**    | 🔍 Auto-generated per PR                                                                                           | Every PR commit |

> **Note:** Vercel automatically creates preview deployments for every PR, allowing reviewers to test changes before merging.

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

- **Pull Request (PR)**: Runs the full CI pipeline + changeset validation before merging.
- **Push to main**: Triggers version bump, release notes, and deployment to Vercel.

---

## 📋 Pipeline Jobs

The pipeline consists of **4 sequential jobs**:

### 1. Changeset Check (PR only) 🔍

**Purpose:** Ensures every PR includes a changeset for version tracking.

```yaml
changeset_check:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
```

**What it does:**

- Checks if `.changeset/*.md` files exist
- Blocks PR if no changeset is found
- Displays helpful error message with instructions

**How to fix if blocked:**

```bash
npm run change:add
git add .changeset/*.md
git commit -m "chore: add changeset"
```

See [Changesets Guide](./changesets-guide.md) for details.

---

### 2. Frontend CI (Lint + Test + Build) 🧪

**Purpose:** Validates code quality and functionality.

```yaml
frontend_ci:
    needs: changeset_check
    if: always() && (needs.changeset_check.result == 'success' || github.event_name == 'push')
```

**Steps:**

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

````yaml
```yaml
- name: Build Next.js App
  run: npm run build
````

---

### 3. Release (Version Bump + Release Notes) 📦

**Purpose:** Automatically update versions and generate release notes.

```yaml
release:
    needs: frontend_ci
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

**What it does:**

- Reads all changesets from `.changeset/*.md`
- Bumps version in `package.json` (semver)
- Generates/updates `CHANGELOG.md`
- Creates commit: `chore: version bump and release notes`
- Consumes the changeset files

**Example output:**

```
frontend: 1.2.3 → 1.3.0
- Added pagination to allocation table
- Fixed mobile navigation bug
```

---

### 4. Deploy (Vercel) 🚀

**Purpose:** Trigger production deployment.

```yaml
deploy:
    needs: release
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
        - name: Trigger Vercel Deploy
          env:
              VERCEL_DEPLOY_HOOK_URL: ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
          run: |
              echo "Triggering Vercel Deploy..."
              curl -X POST "$VERCEL_DEPLOY_HOOK_URL"
```

---

---

## � Preview Deployments (Vercel)

Vercel automatically creates **preview deployments** for every PR, independent of the GitHub Actions workflow.

### How it works:

1. **Open a PR** → Vercel detects the PR
2. **Auto-deploy** → Creates unique preview URL
3. **Comment on PR** → Vercel bot posts preview link
4. **Update on push** → Re-deploys on every new commit
5. **Cleanup** → Removes preview after PR is merged/closed

### Benefits:

| Benefit                     | Description                                        |
| --------------------------- | -------------------------------------------------- |
| **QA Testing**              | Reviewers can test live changes before approval    |
| **Visual Review**           | See UI changes in action, not just code            |
| **Share with Stakeholders** | Send preview link for non-technical feedback       |
| **No Config Needed**        | Works automatically with Vercel GitHub integration |

### Example Preview URL:

```
https://parking-management-system-frontend-[hash]-manucomi.vercel.app
```

> **Tip:** Look for the Vercel bot comment on your PR with the preview link! 🔗

---

## �🔐 Secrets

Required GitHub Secrets (Settings → Secrets → Actions):

- **GITHUB_TOKEN**: Auto-provided by GitHub Actions for release commits
- **VERCEL_DEPLOY_HOOK_URL**: Generated in Vercel dashboard (Project Settings → Deploy Hooks)

---

## 🌿 Branch Protection

````

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
````

### Secrets

- **VERCEL_DEPLOY_HOOK_URL**:  
  Defined in your repo's GitHub Secrets (Settings → Secrets → Actions).  
  This hook is generated in the Vercel dashboard under Project Settings → Deploy Hooks.

---

## 🌿 Branch Protection

To ensure safe merges, the `main` branch is protected:

- Direct pushes are disabled
- Merges require at least one PR approval
- PRs must pass **all CI checks** before merging:
    - ✅ Changeset exists
    - ✅ Linting passes
    - ✅ Tests pass with 90% coverage
    - ✅ Build succeeds

This guarantees that only validated, documented, and reviewed code reaches production.

---

## ✅ Validation Summary

| Stage         | Command                                | Purpose                                                    | Blocks PR? |
| ------------- | -------------------------------------- | ---------------------------------------------------------- | ---------- |
| **Changeset** | Auto-check                             | Ensures all changes are documented for release notes       | ✅ Yes     |
| **Lint**      | `npm run lint`                         | Ensures consistent code style and detects potential issues | ✅ Yes     |
| **Test**      | `npm run test`                         | Runs unit tests using Jest (90% coverage required)         | ✅ Yes     |
| **Build**     | `npm run build`                        | Validates production build for Next.js                     | ✅ Yes     |
| **Release**   | Auto (changesets)                      | Bumps version and generates CHANGELOG.md                   | ⏭️ Auto    |
| **Deploy**    | `curl -X POST $VERCEL_DEPLOY_HOOK_URL` | Triggers production deploy on Vercel                       | ⏭️ Auto    |

---

## 🔄 Complete Flow Example

### Scenario: Adding a new feature

```bash
# 1. Create feature branch
git checkout -b feat/add-pagination

# 2. Make changes
# ... code changes ...

# 3. Create changeset
npm run change:add
# Select: frontend → minor → "Added pagination to allocation table"

# 4. Commit and push
git add .
git commit -m "feat: add pagination to allocation table"
git push origin feat/add-pagination

# 5. Open PR
# GitHub Actions runs:
#   ✅ Changeset Check (PASS - changeset found)
#   ✅ Lint (PASS)
#   ✅ Test (PASS - 90%+ coverage)
#   ✅ Build (PASS)
#
# Vercel automatically:
#   🔍 Creates preview deployment
#   💬 Comments on PR with preview URL
#   🔗 https://parking-management-[hash].vercel.app

# 6. Review & Test
# - Code review by team
# - Test preview deployment
# - Approve PR

# 7. Get approval and merge
# GitHub Actions runs:
#   ⏭️ Release (auto-bumps: 1.2.0 → 1.3.0, updates CHANGELOG)
#   ⏭️ Deploy (triggers Vercel)

# 7. Live in production! 🎉
```

---

## 🧭 Future Improvements

| Improvement                 | Description                                                    | Status                     |
| --------------------------- | -------------------------------------------------------------- | -------------------------- |
| **Preview Deployments**     | Automatic preview deployments on each PR for QA validation     | ✅ **Active** (via Vercel) |
| Parallel CI Jobs            | Split lint/test/build into separate jobs for faster execution  | 📋 Planned                 |
| Automated Lighthouse Audits | Integrate Lighthouse CI to check performance and accessibility | 📋 Planned                 |
| Slack Notifications         | Notify team on deploy success or failure                       | 📋 Planned                 |
| Release Tags                | Auto-create Git tags for each release version                  | 📋 Planned                 |
| E2E Testing                 | Add Playwright/Cypress tests to CI pipeline                    | 📋 Planned                 |

---

## 🧾 References

### Internal Documentation

- [Changesets Guide](./changesets-guide.md) - Version management workflow
- [Vercel Preview Deployments](./vercel-preview-deployments.md) - PR preview deployments guide

### External Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Vercel – Build & Deploy Settings](https://vercel.com/docs/concepts/deployments/overview)
- [Vercel Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

**Last updated:** 2025-10-12
