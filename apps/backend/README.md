# Personal Finance Tracker

A full-stack personal finance application built with React, NestJS, Prisma, and PostgreSQL.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Mantine

### Backend

- NestJS
- TypeScript
- Prisma

### Database

- PostgreSQL

### Infrastructure

- Docker
- Docker Compose
- Nginx

---

## Run with Docker

Docker Compose starts the complete application:

- PostgreSQL
- NestJS backend
- React frontend served by Nginx

### 1. Configure Docker environment variables

From `apps/backend`:

```bash
cp .env.example .env.docker
```

Configure the required environment variables in `.env.docker`.

For Docker, the database host must be the Compose service name `postgres`:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/personal_finance?schema=public
PORT=3000
FRONTEND_ORIGIN=http://localhost:8080
```

Add your JWT secrets as well.

> `.env.docker` contains local secrets and must not be committed to Git.

### 2. Start the application

From `apps/backend`:

```bash
npm run docker:up
```

This builds and starts all containers.

The application is available at:

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000/api`
- Health endpoint: `http://localhost:3000/api/health`
- PostgreSQL: `localhost:5432`

### 3. Check container status

```bash
docker compose ps
```

PostgreSQL and the backend should report:

```text
(healthy)
```

The backend health check also verifies the connection to PostgreSQL.

### 4. Stop the application

```bash
npm run docker:down
```

The PostgreSQL data is persisted in a Docker volume and is not deleted by this command.

---

## Run locally for development

You can also run the application directly on your machine while using Docker only for PostgreSQL.

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Configure the local environment

```bash
cp .env.example .env
```

For local development, the database is reached through `localhost`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/personal_finance?schema=public
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
```

### 3. Initialize Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Start the backend

```bash
npm run start:dev
```

### 5. Start the frontend

From `apps/frontend`:

```bash
npm install
npm run dev
```

---

## Docker Architecture

```text
Browser
  │
  ├── localhost:8080 → Frontend (Nginx)
  │
  └── localhost:3000 → Backend (NestJS)
                              │
                              └── postgres:5432 → PostgreSQL
```

Docker Compose manages service startup and networking.

PostgreSQL must become healthy before the backend starts. The backend must then pass its `/api/health` readiness check before the frontend starts.

---

## Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/2fa/verify`
- `GET /api/auth/me`

## Notes

- Refresh tokens are stored hashed in the database.
- Access token TTL defaults to 15 minutes.
- Refresh token TTL defaults to 7 days.
- 2FA is scaffolded but not fully implemented yet.
- Prisma manages the finance and portfolio domain schema.
