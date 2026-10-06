# Personal Finance App

## Project Overview

Personal Finance App is a full-stack application for tracking personal finances, investments, net worth and dashboard data.

The repository contains two independent applications:

- `apps/backend` — NestJS API
- `apps/frontend` — React/Vite frontend

The applications are not configured as npm workspaces. Each application has its own dependencies and `package-lock.json`.

Run npm commands from the relevant application directory.

Before making changes, inspect the existing implementation and follow established project patterns.

---

## Tech Stack

### Backend

- NestJS 10
- TypeScript
- Prisma 6.19.3
- PostgreSQL 16
- Passport JWT
- class-validator
- Jest
- Supertest

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Mantine
- Tailwind CSS
- styled-components
- Recharts
- Vitest
- React Testing Library

---

## Repository Structure

### Backend

Backend features are located under:

`apps/backend/src/main/<feature>/`

Features generally use the following structure:

- `controller/`
- `dto/`
- `logic/`
- `modules/`
- `schema/` or `types/`
- `utils/`

Business logic is implemented in services under `logic/`.

Prefer one service per use case.

Most services expose an `execute()` method. Follow the existing pattern of the feature being modified rather than introducing a new convention.

Backend tests are located under:

`apps/backend/src/test/`

The test structure mirrors the source structure.

### Frontend

Frontend code is located under:

`apps/frontend/src/`

Page-specific components generally follow:

`pages/<page>/parts/<part>/`

Existing parts commonly contain:

- `index.ts`
- `<name>.tsx`
- `<name>.types.ts`
- `<name>.style.ts`

API functions and related types belong in the existing `pages-apis/` or `components-apis/` structure.

Routes and path constants should follow the existing routing structure.

Prefer relative imports in application code. In tests under `src/test/`, `@/` imports are acceptable for the module under test and for `vi.mock` paths, matching existing specs. Do not convert existing imports in either direction unless explicitly requested.

---

## Development Workflow

For non-trivial tasks, do not start implementing immediately.

Use the following workflow:

1. Explore the relevant code.
2. Identify existing patterns, dependencies and affected files.
3. Explain the proposed implementation plan.
4. Wait for developer approval before making significant changes.
5. Implement the change incrementally.
6. Run the relevant tests and build/type checks.
7. Review the final diff.
8. Report:
   - what changed
   - which tests/checks were run
   - whether they passed
   - any remaining risks or follow-up work

Do not modify unrelated code.

Do not fix unrelated technical debt unless explicitly requested.

When requirements are ambiguous and the ambiguity could materially affect the implementation, ask for clarification rather than making a major architectural assumption.

---

## Backend Conventions

Follow existing NestJS feature patterns before introducing new abstractions.

Controllers should handle HTTP concerns and delegate business logic to services.

Prefer one service per use case where this matches the existing feature.

For user-owned resources, ownership must be enforced in the database query.

Prisma operations should include both the resource identifier and `userId` where appropriate.

Do not fetch a user-owned resource by ID alone and rely only on a later ownership check when the operation can be scoped by `userId`.

Use the existing `@CurrentUserId()` and `JwtAuthGuard` patterns for authenticated user-scoped endpoints.

Use DTOs and `class-validator` for request validation following existing patterns.

---

## Authentication and Security Invariants

Security-related behavior must not be weakened without explicit approval.

### Access Tokens

- Access tokens remain in memory on the frontend.
- Never store access tokens in `localStorage` or `sessionStorage`.
- Use the existing HTTP/authentication infrastructure rather than creating an alternative token-storage mechanism.

### Refresh Tokens

- Preserve the existing httpOnly cookie-based refresh-token flow.
- Refresh tokens remain hashed in the database.
- Preserve token rotation.
- Do not weaken existing cookie security settings.

### Two-Factor Authentication

- TOTP secrets must remain encrypted.
- Recovery codes must remain hashed.
- Recovery codes must remain single-use.
- Preserve the existing two-factor verification flow.

### Configuration

Authentication configuration belongs in the existing auth configuration system.

Never hard-code secrets.

Never expose, print or commit secrets from local environment files.

Use `.env.example` as the reference for required environment variables.

When adding a required environment variable, update `.env.example` appropriately without adding real secret values.

---

## Database and Prisma

The Prisma schema is located at:

`apps/backend/prisma/schema.prisma`

Use Prisma for database access and follow existing Prisma patterns.

Use appropriate Prisma `Decimal` types for financial values.

Do not silently convert financial data to floating-point representations when precision matters.

For user-owned data, scope queries by `userId`.

When changing the database schema:

1. Update `schema.prisma`.
2. Create an appropriately named migration.
3. Regenerate the Prisma client when required.
4. Run relevant tests.

Do not manually modify previously applied migrations unless explicitly requested.

Do not perform destructive database operations without explicit approval.

---

## Frontend Conventions

Follow existing component organization before introducing new patterns.

Reuse existing components and utilities when appropriate.

API calls should use the existing HTTP infrastructure rather than direct, ad-hoc `fetch` implementations.

Preserve the existing authentication refresh/retry behavior.

Prefer relative imports in application code. In tests under `src/test/`, `@/` imports are acceptable for the module under test and for `vi.mock` paths, matching existing specs. Do not convert existing imports in either direction unless explicitly requested.

### Styling

The frontend currently uses:

- Mantine
- Tailwind CSS
- styled-components

Do not perform broad styling migrations as part of unrelated tasks.

When modifying an existing component, follow its current styling approach unless there is an explicit decision to migrate it.

Do not introduce an additional styling framework without explicit approval.

The long-term styling strategy is still under evaluation.

---

## Cross-App Contracts

Some values must remain synchronized between the backend and frontend.

In particular, dashboard widget identifiers must remain compatible between:

- the backend `DashboardWidgetType`
- the frontend dashboard widget registry

When changing API request/response structures, inspect both applications for affected types and consumers.

Do not assume that backend and frontend types are automatically shared.

---

## Testing

### Backend Unit Tests

Backend unit tests use Jest and live under:

`apps/backend/src/test/`

Tests mirror the source structure.

Existing unit tests commonly use hand-written Prisma mocks.

Follow the existing testing style unless a task explicitly introduces a different testing strategy.

Run backend unit tests from `apps/backend`:

```bash
npm test
```

For focused work, prefer running the relevant test or suite first.

### Backend Integration Tests

Integration tests use Supertest against the application and a dedicated PostgreSQL test database.

The test database must remain isolated from development or production data.

Never bypass the existing safety checks that require the integration-test database name to end in `_test`.

Relevant commands:

```bash
npm run postgres:test
npm run test:integration
```

### Frontend Tests

Frontend tests use Vitest, jsdom and React Testing Library.

Tests live under:

`apps/frontend/src/test/`

Use the existing `renderWithProviders` helper where appropriate.

For a non-watch test run:

```bash
npm test -- --run
```

---

## Build and Validation Commands

Run commands from the relevant application directory.

### Backend

Development:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Unit tests:

```bash
npm test
```

Integration tests:

```bash
npm run test:integration
```

Prisma client generation:

```bash
npm run prisma:generate
```

### Frontend

Development:

```bash
npm run dev
```

Build and TypeScript validation:

```bash
npm run build
```

Tests:

```bash
npm test -- --run
```

Do not claim a task is validated if the relevant checks were not actually run.

If a check cannot be run, explain why.

---

## Formatting and Linting

Follow the existing Prettier configuration:

- single quotes
- semicolons
- trailing commas
- 2-space indentation
- 80-character print width

Format only files touched by the current task.

Do not run repository-wide formatting as part of an unrelated change.

The current ESLint setup has known configuration/dependency problems.

Do not attempt to fix ESLint as part of unrelated tasks.

Do not report linting as successful unless a working lint command was actually executed.

---

## Git Rules

Do not commit changes unless explicitly requested.

Do not push changes unless explicitly requested.

Do not change branches unless explicitly requested.

Do not discard existing uncommitted developer changes.

Before proposing a commit, review the relevant Git diff.

Keep changes focused on the requested task.

Do not include unrelated formatting or refactoring in a feature change.

---

## Known Technical Debt

The repository contains known technical debt and configuration inconsistencies.

Known examples include:

- the root ESLint configuration is currently not working correctly
- linting is not currently enforced by CI
- frontend CI does not currently run on pull requests
- the frontend contains both `yarn.lock` and `package-lock.json`
- a TypeScript build-info file is currently tracked
- the root package configuration may contain dependencies that belong in an application package
- multiple frontend styling approaches currently coexist

These issues should not be silently fixed during unrelated work.

If one materially affects the requested task, report it and propose a solution before expanding the scope.

---

## Agent Behaviour

Act as a coding agent working under developer supervision, not as the owner of the codebase.

Prefer understanding existing code over generating new abstractions.

Do not assume that a common industry pattern is the pattern used by this repository. Inspect the repository first.

Do not change architecture solely because another approach appears cleaner.

For significant architectural decisions, present alternatives and trade-offs before implementation.

Do not add dependencies without explaining why they are needed.

Do not remove existing functionality unless explicitly requested.

Do not hide failing tests or checks.

Never change a test merely to make an incorrect implementation pass.

When completing a task, summarize the changes and validation performed.
