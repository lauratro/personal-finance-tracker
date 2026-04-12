# Personal Finance Backend Foundation

This starter gives you the backend foundation for the portfolio project:

- NestJS app structure
- Prisma + PostgreSQL schema for the MVP domain
- Auth module skeleton with JWT access + refresh flow
- Prisma service/module wiring
- Docker Compose for local PostgreSQL

## 1) Create the Nest app

```bash
npm install -g @nestjs/cli
nest new backend
cd backend
```

Install the runtime dependencies:

```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer @prisma/client
```

Install the development dependencies:

```bash
npm install -D prisma @types/passport-jwt @types/bcrypt
```

## 2) Copy this scaffold into your Nest project

Copy the contents of this folder into your generated `backend/` project.

## 3) Start PostgreSQL locally

```bash
docker compose up -d
```

## 4) Configure environment variables

```bash
cp .env.example .env
```

Update secrets before using this outside local development.

## 5) Initialize Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 6) Run the app

```bash
npm run start:dev
```

## Suggested next implementation order

1. Finish `AuthService.verifyTwoFactor()` and add real TOTP support.
2. Add a `UsersModule` or `ProfileModule` for user settings.
3. Implement CRUD modules for accounts, categories, and transactions.
4. Add dashboard aggregation endpoints for monthly cashflow and net worth.
5. Add portfolio valuation sync jobs and AI insight generation.

## Auth endpoints in this scaffold

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/2fa/verify`
- `GET /auth/me`

## Notes

- Refresh tokens are stored hashed in the database.
- Access token TTL defaults to 15 minutes.
- Refresh token TTL defaults to 7 days.
- 2FA is intentionally scaffolded but not fully implemented yet.
- The Prisma schema already covers finance + portfolio MVP entities so you do not have to redesign the database later.
