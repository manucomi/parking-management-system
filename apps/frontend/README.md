# mfe-error-pages

This micro front-end serves the static error pages for 404, 500, and maintenance, delivered via CloudFront on matching error codes or accessed through `/maintenance`.

## Getting started

### 1. Configure your NPM Credentials

Follow the steps in the
[NPM Authentication Guide](https://git.harvardbusiness.org/HBRG/documentation/blob/main/docs/micro-front-ends/guides/npm-auth.md#local-machine)
to configure your local machine.

### 2. Clone this project

Clone this repository with your preferred GUI, IDE, or Git CLI.

### 3. Install the NPM dependencies

```bash
npm i
```

### 4. Run the project setup script

*This script requires admin privileges. If you encounter permission issues
when you run this, you can try adding `sudo` to the `dns-alias` script.*

```bash
npm run setup
```

This script will:
- Create an alias for `mfe.dev.hbr.org` pointing to `localhost`.

### 5. Build and run the app

```bash
npm run dev
```

Navigate to https://mfe.dev.hbr.org:3000/ in your browser.
If you're using Chrome and get a warning about the site being
unsafe, type `thisisunsafe` to bypass the warning.

## Tools

### Unit Test

- Jest
- React Testing Library

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
