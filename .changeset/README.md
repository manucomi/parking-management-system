# Changesets

This folder contains changeset files that describe changes to the project.

## What is a changeset?

A changeset is a piece of information about changes made in a branch or commit. It holds three key pieces of information:

1. **Which packages need to be released**
2. **What version bump (patch, minor, major)**
3. **A changelog entry describing the change**

## How to create a changeset

```bash
npm run change:add
```

This will prompt you to select the package(s) that changed, the type of change (patch/minor/major), and a summary.

## Example changeset file

After running the command, a file like `quick-foxes-sing.md` will be created:

```markdown
---
'frontend': minor
---

Added pagination to parking allocation table for better UX
```

## When are changesets consumed?

When code is merged to `main`, the CI/CD pipeline:

1. Reads all changeset files
2. Bumps versions in `package.json`
3. Generates/updates `CHANGELOG.md`
4. Commits changes
5. Deletes the consumed changesets

## Learn more

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Internal Guide](../docs/deployment/changesets-guide.md)
