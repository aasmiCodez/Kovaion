# Secure MERN User Management System

Security-first MERN starter with strict RBAC and object-level authorization.

## What This Project Implements

- Backend: Node.js + Express + MongoDB + Redis
- Frontend: React (Vite)
- Auth: JWT in HttpOnly cookies
  - Access token: 15 minutes
  - Refresh token: rotating, stored/revoked in Redis
- Authorization:
  - RBAC: `admin` and `user`
  - Object-level policy: users can access only their own `_id` (admin bypass where intended)
- Security controls:
  - `helmet`
  - strict CORS allowlist
  - login rate limiting
  - MongoDB injection sanitization
  - Joi input validation
  - password complexity policy
  - audit logging via Winston
  - no password/sensitive fields in responses

## Folder Structure

- `backend/` Express API
- `frontend/` React app
- `docker-compose.yml` MongoDB + Redis

## Prerequisites

- Node.js 22.x
- npm 10+
- Docker Desktop (recommended for MongoDB + Redis)

## Quick Start (PowerShell, Windows)

### 1. Start infrastructure

From repository root:

```powershell
docker compose up -d
```

Check containers:

```powershell
docker ps
```

You should see:
- `secure_ums_mongo` on `27017`
- `secure_ums_redis` on `6379`

### 2. Configure and run backend

```powershell
cd backend
Copy-Item .env.example .env
```

Edit `backend/.env` and set strong secrets:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Install dependencies and run:

```powershell
npm install
npm run seed:admin
npm run dev
```

Backend runs at `http://localhost:5000`.

Health check:

```powershell
curl http://localhost:5000/api/health
```

Expected response:

```json
{"status":"ok"}
```

### 3. Configure and run frontend

Open a new terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Default Environment Values

`backend/.env.example`

- `PORT=5000`
- `CLIENT_ORIGIN=http://localhost:5173`
- `MONGO_URI=mongodb://127.0.0.1:27017/secure_ums`
- `REDIS_URL=redis://127.0.0.1:6379`
- `ACCESS_TOKEN_TTL=15m`
- `REFRESH_TOKEN_TTL_DAYS=7`
- `BCRYPT_SALT_ROUNDS=12`

`frontend/.env.example`

- `VITE_API_URL=http://localhost:5000/api`

## Auth + Access Flow

1. User logs in using `POST /api/auth/login`.
2. Server sets:
   - `accessToken` cookie (HttpOnly, short-lived)
   - `refreshToken` cookie (HttpOnly, longer-lived)
3. Protected routes read access token from cookie.
4. `POST /api/auth/refresh` rotates refresh token (old Redis token revoked, new token issued).
5. `POST /api/auth/logout`:
   - blacklists current access token in Redis
   - revokes refresh token in Redis
   - clears cookies

## Role Behavior

- `admin`
  - can list all users
  - can create users
  - can edit users
  - can view any user by ID
- `user`
  - can view only own details
  - cannot list everyone or edit others

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/refresh`
- `POST /auth/logout` (requires auth)
- `GET /auth/me` (requires auth)
- `POST /auth/register` (admin only; bootstrap convenience route)

Note: in local development, `POST /auth/forgot-password` returns a temporary `resetToken` in API response for testing. In production, send reset links via email and never expose tokens in API responses.

### Users

- `GET /users`
  - `admin`: returns all users
  - `user`: returns only own user in list form
- `GET /users/:id`
  - allowed for same user or admin only
- `POST /users` (admin only)
- `PUT /users/:id` (admin only)

### Security Data (authenticated)

- `GET /security/audit-trail`
- `GET /security/access-policies`

## Recommended Test Sequence

1. Login as seeded admin from UI.
2. Create one `user`.
3. Verify admin sees all users in dashboard.
4. Logout admin.
5. Login as normal user.
6. Verify user sees only own profile and no create/edit controls.
7. Try calling `GET /api/users/<other-id>` with user session and confirm `403`.

## Security Notes For Production

- Set `NODE_ENV=production` to enforce `secure` cookie flag.
- Use long, random secrets for JWT keys.
- Keep CORS origin strict (`CLIENT_ORIGIN` only).
- Use HTTPS at reverse proxy/load balancer.
- Replace admin bootstrap patterns with controlled provisioning flow.
- Store logs centrally and monitor audit events.

## Troubleshooting

- API fails on startup:
  - verify MongoDB and Redis containers are running
  - verify `backend/.env` exists and required keys are set
- CORS blocked in browser:
  - ensure frontend URL matches `CLIENT_ORIGIN`
- Redis auth/token issues:
  - restart Redis container and clear stale state if needed:
  ```powershell
  docker compose down
  docker compose up -d
  ```

## Useful Commands

From repository root:

```powershell
docker compose up -d
docker compose down
```

Backend:

```powershell
cd backend
npm run dev
npm run seed:admin
```

Frontend:

```powershell
cd frontend
npm run dev
```
