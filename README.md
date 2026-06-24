# AI SDR — Mini AI Sales Development Representative

> A production-quality, full-stack web application that uses **OpenAI GPT-4o-mini** and **Google Gemini 2.5 Flash** to automatically qualify sales leads and generate personalized cold emails.

---

## Table of Contents

1. [Overview](#overview)
2. [Live Features](#live-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Architecture & Data Flow](#architecture--data-flow)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [AI Integration Details](#ai-integration-details)
9. [Security](#security)
10. [Lead Status Workflow](#lead-status-workflow)
11. [Environment Variables](#environment-variables)
12. [Quick Start](#quick-start)
13. [Running Tests](#running-tests)
14. [Deployment Notes](#deployment-notes)

---

## Overview

Sales Development Representatives (SDRs) spend hours every day doing two repetitive tasks:

1. **Qualifying leads** — reading each prospect's profile and deciding if they are worth pursuing
2. **Writing outreach emails** — crafting personalized messages for every promising lead

**AI SDR automates both tasks entirely.**

- Add a lead (name, company, job title, industry)
- Click **"Qualify Lead"** → OpenAI scores them 0–100 with a written reason
- Click **"Generate Email"** → Gemini writes a full personalized cold email (subject + body + CTA)

What used to take hours now takes seconds.

---

## Live Features

| Feature | Description |
|---|---|
| **User Registration & Login** | JWT-based auth with bcrypt password hashing |
| **Protected Routes** | All lead data scoped to the authenticated user |
| **Create Lead** | Add name, email, company, job title, industry |
| **List Leads** | Paginated table with search and multi-filter support |
| **Search** | Filter leads by name, company, or email (case-insensitive) |
| **Filter by Status** | new / qualified / contacted / converted / rejected |
| **Filter by Industry** | Any industry string, partial match |
| **Filter by Min Score** | Only show leads above a score threshold |
| **Lead Detail Page** | Full view of all lead data and AI results |
| **Edit Lead** | Update any lead field |
| **Delete Lead** | Permanently remove a lead |
| **AI Qualification** | OpenAI GPT-4o-mini scores lead 0–100 with reason |
| **AI Email Generation** | Gemini writes subject, body, and CTA |
| **Re-qualify / Regenerate** | Run AI again at any time on any lead |
| **Dashboard Stats** | Total leads, qualified count, average score, emails generated |
| **Recent Leads** | Quick overview of 5 latest leads on dashboard |
| **Status Workflow** | Move leads through the sales pipeline |
| **Swagger UI** | Auto-generated interactive API docs at `/docs` |
| **Structured Logging** | JSON logs with structlog for every key event |
| **Global Error Handling** | Clean error responses, no stack trace leaks |

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.12+ | Backend language |
| FastAPI | 0.115.5 | REST API framework |
| PostgreSQL | 14+ | Relational database |
| SQLAlchemy | 2.0.36 | ORM (Object Relational Mapper) |
| Alembic | 1.14.0 | Database migrations |
| Pydantic v2 | 2.10.3 | Request/response validation |
| python-jose | 3.3.0 | JWT token creation & verification |
| passlib[bcrypt] | 1.7.4 | Password hashing (bcrypt, 12 rounds) |
| OpenAI SDK | 1.58.1 | GPT-4o-mini for lead qualification |
| google-generativeai | 0.8.3 | Gemini via OpenRouter |
| structlog | 24.4.0 | Structured JSON logging |
| httpx | 0.28.1 | HTTP client with SSL support |
| uvicorn | 0.32.1 | ASGI server |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.1.0 | React framework (App Router) |
| React | 19.0.0 | UI library |
| TypeScript | 5.7.2 | Type-safe JavaScript |
| Tailwind CSS | 3.4.17 | Utility-first styling |
| TanStack Query | 5.62.8 | Server state, caching, mutations |
| Axios | 1.7.9 | HTTP client |
| React Hook Form | 7.54.2 | Form state management |
| Zod | 3.24.1 | Schema validation |
| Lucide React | 0.469.0 | Icon library |

---

## Project Structure

```
AI SDR/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py                  # get_current_user dependency
│   │   │   └── routes/
│   │   │       ├── auth.py              # POST /register, POST /login, GET /me
│   │   │       └── leads.py             # Full leads CRUD + AI endpoints
│   │   ├── core/
│   │   │   ├── config.py                # Settings from .env via pydantic-settings
│   │   │   ├── security.py              # JWT creation, bcrypt verify
│   │   │   └── logging.py               # structlog setup
│   │   ├── db/
│   │   │   ├── base.py                  # SQLAlchemy declarative Base
│   │   │   └── session.py               # get_db() dependency
│   │   ├── middleware/
│   │   │   └── error_handler.py         # Global exception handlers
│   │   ├── models/
│   │   │   ├── user.py                  # User ORM model
│   │   │   └── lead.py                  # Lead ORM model + LeadStatus enum
│   │   ├── repositories/
│   │   │   ├── user.py                  # UserRepository (DB queries)
│   │   │   └── lead.py                  # LeadRepository (DB queries)
│   │   ├── schemas/
│   │   │   ├── auth.py                  # UserRegister, UserLogin, Token, UserOut
│   │   │   └── lead.py                  # LeadCreate, LeadUpdate, LeadOut, LeadsPage
│   │   ├── services/
│   │   │   ├── auth_service.py          # Register & login logic
│   │   │   ├── lead_service.py          # CRUD + qualify + generate_email
│   │   │   ├── openai_service.py        # GPT-4o-mini qualification & email
│   │   │   └── gemini_service.py        # Gemini email via OpenRouter
│   │   ├── utils/
│   │   │   └── pagination.py            # Pagination helpers
│   │   └── main.py                      # FastAPI app, middleware, routers
│   ├── alembic/
│   │   └── versions/
│   │       └── 001_initial_schema.py    # Creates users + leads tables
│   ├── tests/                           # Pytest test suite
│   ├── requirements.txt
│   ├── alembic.ini
│   └── .env.example
│
├── frontend/
│   ├── app/                             # Next.js App Router
│   │   ├── page.tsx                     # Root redirect to /login
│   │   ├── layout.tsx                   # Root layout
│   │   ├── providers.tsx                # QueryClientProvider wrapper
│   │   ├── globals.css                  # Tailwind base styles
│   │   ├── login/page.tsx               # Login page
│   │   ├── register/page.tsx            # Register page
│   │   └── dashboard/
│   │       ├── layout.tsx               # Sidebar + Navbar layout
│   │       ├── page.tsx                 # Dashboard home (stats + recent)
│   │       └── leads/
│   │           ├── page.tsx             # Leads list + filters
│   │           ├── new/page.tsx         # Create lead form
│   │           └── [id]/page.tsx        # Lead detail + AI actions
│   ├── components/
│   │   ├── ui/                          # Button, Input, Card, Badge, Modal, Spinner
│   │   ├── auth/                        # LoginForm, RegisterForm
│   │   ├── dashboard/                   # Navbar, Sidebar, StatsCards
│   │   └── leads/                       # LeadTable, LeadForm, LeadDetails, LeadFilters
│   ├── hooks/
│   │   ├── useAuth.ts                   # login, register, logout mutations
│   │   └── useLeads.ts                  # useLeads, useLead, useLeadStats + mutations
│   ├── services/
│   │   ├── api.ts                       # Axios instance + interceptors
│   │   ├── auth.ts                      # authApi.register, authApi.login
│   │   └── leads.ts                     # leadsApi.* methods
│   ├── types/
│   │   └── index.ts                     # TypeScript interfaces for Lead, User, etc.
│   ├── lib/
│   │   └── queryClient.ts               # TanStack Query client config
│   ├── utils/
│   │   └── cn.ts                        # clsx + tailwind-merge utility
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.local.example
│
├── database/
│   ├── 01_create_database.sql           # Create DB and user
│   ├── 02_schema.sql                    # Full schema (manual, no Alembic)
│   ├── 03_seed_data.sql                 # Sample leads for testing
│   └── 04_useful_queries.sql            # Handy admin queries
│
├── postman/
│   └── AI_SDR.postman_collection.json   # Full Postman collection
│
├── SETUP.md                             # Step-by-step setup guide
├── PRESENTATION_GUIDE.md                # Presentation script
└── README.md                            # This file
```

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│              Next.js 15 (localhost:3000)                        │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│   │  Login/  │  │Dashboard │  │  Leads   │  │ Lead Detail  │  │
│   │ Register │  │  Stats   │  │  List    │  │  + AI Panel  │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP (Axios + JWT header)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (localhost:8000)              │
│                                                                  │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────────────┐  │
│  │  Routes  │ → │   Services   │ → │     Repositories       │  │
│  │ (thin)   │   │ (business    │   │ (SQL via SQLAlchemy)   │  │
│  │          │   │  logic)      │   │                        │  │
│  └──────────┘   └──────┬───────┘   └────────────┬───────────┘  │
│                         │                         │             │
│                   ┌─────▼──────┐           ┌─────▼──────┐      │
│                   │  AI APIs   │           │ PostgreSQL  │      │
│                   │            │           │  Database   │      │
│                   │ ┌────────┐ │           └────────────┘      │
│                   │ │OpenAI  │ │                                 │
│                   │ │GPT-4o  │ │                                 │
│                   │ │ mini   │ │                                 │
│                   │ └────────┘ │                                 │
│                   │ ┌────────┐ │                                 │
│                   │ │Gemini  │ │                                 │
│                   │ │2.5Flash│ │                                 │
│                   │ └────────┘ │                                 │
│                   └────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Request Lifecycle

1. **User action** triggers an Axios call from Next.js
2. Axios automatically attaches the JWT token from `localStorage` via an interceptor
3. FastAPI validates the JWT and extracts `user_id` via the `get_current_user` dependency
4. The **Route** delegates to a **Service** which delegates to a **Repository**
5. For AI actions: the Service calls OpenAI or Gemini, saves the result to PostgreSQL, and returns it
6. FastAPI returns JSON; TanStack Query caches it and updates the UI

---

## Database Schema

### `users` table

```sql
CREATE TABLE users (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX ix_users_email ON users(email);
```

### `leads` table

```sql
CREATE TYPE leadstatus AS ENUM ('new','qualified','contacted','converted','rejected');

CREATE TABLE leads (
    id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                  UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                     VARCHAR(255) NOT NULL,
    email                    VARCHAR(255) NOT NULL,
    company                  VARCHAR(255) NOT NULL,
    job_title                VARCHAR(255) NOT NULL,
    industry                 VARCHAR(255) NOT NULL,
    status                   leadstatus   NOT NULL DEFAULT 'new',
    qualification_score      FLOAT,
    qualification_reason     TEXT,
    generated_email_subject  VARCHAR(500),
    generated_email_body     TEXT,
    generated_email_cta      TEXT,
    created_at               TIMESTAMPTZ  DEFAULT NOW(),
    updated_at               TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX ix_leads_user_id ON leads(user_id);
```

### Relationship

- **One-to-Many:** One `user` has many `leads`
- **CASCADE DELETE:** Deleting a user deletes all their leads automatically
- **Data isolation:** Every query filters by `user_id` — users cannot see each other's leads

---

## API Reference

Base URL: `http://localhost:8000/api/v1`

Interactive Swagger UI: `http://localhost:8000/docs`

### Authentication Endpoints

#### `POST /auth/register`

Create a new user account. Returns a JWT token immediately.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**Response `201`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:** `409` email already registered, `422` validation error

---

#### `POST /auth/login`

Log in with existing credentials.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**Response `200`:** Same shape as register response.

**Errors:** `401` invalid email or password

---

#### `GET /auth/me`

Get the currently authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### Leads Endpoints

All leads endpoints require: `Authorization: Bearer <token>`

---

#### `POST /leads`

Create a new lead.

**Request body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@techcorp.com",
  "company": "TechCorp Inc.",
  "job_title": "Chief Technology Officer",
  "industry": "Technology",
  "status": "new"
}
```

**Response `201`:**
```json
{
  "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Sarah Johnson",
  "email": "sarah@techcorp.com",
  "company": "TechCorp Inc.",
  "job_title": "Chief Technology Officer",
  "industry": "Technology",
  "status": "new",
  "qualification_score": null,
  "qualification_reason": null,
  "generated_email_subject": null,
  "generated_email_body": null,
  "generated_email_cta": null,
  "created_at": "2024-01-15T10:31:00Z",
  "updated_at": "2024-01-15T10:31:00Z"
}
```

---

#### `GET /leads`

List all leads for the authenticated user, with optional filters and pagination.

**Query parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | 1 | Page number (min: 1) |
| `limit` | integer | 20 | Items per page (max: 100) |
| `search` | string | — | Search name, company, industry |
| `status` | string | — | Filter by status enum value |
| `industry` | string | — | Filter by industry (partial match) |
| `min_score` | float | — | Minimum qualification score (0–100) |

**Example:** `GET /leads?page=1&limit=10&status=qualified&min_score=70`

**Response `200`:**
```json
{
  "items": [ /* array of LeadOut objects */ ],
  "total": 42,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

---

#### `GET /leads/stats`

Get dashboard statistics for the current user.

**Response `200`:**
```json
{
  "total_leads": 42,
  "qualified_leads": 28,
  "average_score": 74.3,
  "emails_generated": 15
}
```

---

#### `GET /leads/{lead_id}`

Get a single lead by its UUID.

**Response `200`:** Full `LeadOut` object.

**Errors:** `404` lead not found or belongs to another user

---

#### `PUT /leads/{lead_id}`

Update any fields of a lead. All fields are optional (partial update).

**Request body (all fields optional):**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@newtechcorp.com",
  "company": "NewTechCorp",
  "job_title": "VP of Engineering",
  "industry": "Technology",
  "status": "contacted"
}
```

**Response `200`:** Updated `LeadOut` object.

---

#### `DELETE /leads/{lead_id}`

Permanently delete a lead.

**Response `204`:** No content.

---

#### `POST /leads/{lead_id}/qualify`

Trigger AI lead qualification via **OpenAI GPT-4o-mini**.

Sends the lead's name, company, industry, and job title to GPT-4o-mini. Receives a score (0–100) and a written reason. Saves both to the database and updates status to `qualified`.

**Response `200`:**
```json
{
  "score": 87.0,
  "reason": "CTO at a technology company signals strong decision-making authority and budget control. Technology industry is a high-value vertical with active purchasing cycles."
}
```

**Errors:** `404` lead not found, `502` OpenAI API error

---

#### `POST /leads/{lead_id}/generate-email`

Trigger personalized email generation via **Google Gemini 2.5 Flash** (via OpenRouter).

Sends lead details to Gemini. Returns a complete cold outreach email with subject, body, and CTA. Saves all three to the database.

**Response `200`:**
```json
{
  "subject": "Helping TechCorp accelerate engineering velocity by 40%",
  "email": "Hi Sarah,\n\nI noticed TechCorp has been scaling its engineering team rapidly over the past year — congratulations on the growth!\n\nAs CTO, I imagine you're constantly balancing shipping new features with maintaining system reliability. We've helped similar tech companies reduce deployment friction by 40% while improving uptime.\n\nWould love to share how we did it for companies like yours.\n\nBest,\n[Your Name]",
  "cta": "Are you free for a 15-minute call this Thursday or Friday to explore if this could help TechCorp?"
}
```

**Errors:** `404` lead not found, `502` Gemini API error

---

## AI Integration Details

### OpenAI GPT-4o-mini — Lead Qualification

- **Model:** `gpt-4o-mini`
- **Temperature:** `0.3` (low — for consistent, analytical scoring)
- **Response format:** `json_object` (forced structured output)
- **Scoring criteria:**
  - Decision-making authority: C-level / VP / Director score higher
  - Industry value: Technology, Finance, Healthcare score higher
  - Company potential based on provided info
- **Output:** `score` (float 0–100) + `reason` (string)

### Google Gemini 2.5 Flash — Email Generation

- **Model:** `google/gemini-2.5-flash` via OpenRouter
- **Temperature:** `0.7` (higher — for creative, varied email copy)
- **Response format:** `json_object`
- **Email requirements enforced in prompt:**
  - Professional yet conversational tone
  - Under 150 words for the body
  - Role-specific and industry-specific value proposition
  - Clear, specific call to action
- **Output:** `subject` + `email` (body) + `cta`

---

## Security

| Concern | Implementation |
|---|---|
| Password storage | bcrypt with 12 rounds — never stored as plain text |
| Authentication | JWT signed with HS256, 24-hour expiry |
| Data isolation | All queries filter by `user_id` — cross-user access is impossible |
| Secret management | All secrets in `.env` file, never committed |
| Error messages | Generic errors returned — no internal stack traces exposed |
| CORS | Configured to specific origins only |
| Input validation | Pydantic v2 validates all request bodies and query params |
| SQL injection | SQLAlchemy ORM with parameterized queries — no raw SQL strings |
| Password minimum | Enforced at schema level — minimum 8 characters |

---

## Lead Status Workflow

```
         ┌─────────────────────────────────┐
         │                                 │
     [Create]                              │
         │                                 │
         ▼                                 │
      [ new ]                              │
         │                                 │
   [Qualify Lead]                          │
    (OpenAI AI)                            │
         │                                 │
         ▼                                 │
   [ qualified ]                           │
         │                                 │
  [Manual update]                          │
         │                                 │
         ▼                                 │
   [ contacted ]                           │
         │                                 │
    ┌────┴────┐                            │
    │         │                            │
    ▼         ▼                            │
[converted] [rejected]                     │
                                           │
   [Can update status at any time] ────────┘
```

Valid status values: `new` | `qualified` | `contacted` | `converted` | `rejected`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Example | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://postgres:pass@localhost:5432/ai_sdr_db` | PostgreSQL connection string |
| `SECRET_KEY` | Yes | `your-secret-key-min-32-chars` | JWT signing key — keep secret |
| `ALGORITHM` | No | `HS256` | JWT algorithm (default: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `1440` | Token lifetime in minutes (default: 24h) |
| `OPENAI_API_KEY` | Yes | `sk-proj-...` | From platform.openai.com |
| `GEMINI_API_KEY` | Yes | `sk-or-v1-...` | OpenRouter API key (for Gemini) |
| `BACKEND_CORS_ORIGINS` | No | `["http://localhost:3000"]` | JSON array of allowed origins |

### Frontend (`frontend/.env.local`)

| Variable | Required | Example | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:8000/api/v1` | Backend API base URL |

---

## Quick Start

See **[SETUP.md](./SETUP.md)** for the complete step-by-step guide with screenshots, troubleshooting, and platform-specific instructions.

**Fastest path (all prerequisites met):**

```bash
# 1. Database
psql -U postgres -c "CREATE DATABASE ai_sdr_db;"

# 2. Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env          # Then fill in your API keys
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# 3. Frontend (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open **http://localhost:3000** — register and start adding leads.

API docs at **http://localhost:8000/docs**

---

## Running Tests

```bash
cd backend
pytest tests/ -v
```

---

## Deployment Notes

### Backend
- Set `SECRET_KEY` to a random 64-character string in production
- Set `BACKEND_CORS_ORIGINS` to your actual frontend domain
- Use `gunicorn` + `uvicorn` workers for production: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker`
- Run `alembic upgrade head` on every deploy to apply migrations

### Frontend
- Set `NEXT_PUBLIC_API_URL` to your production backend URL
- Run `npm run build && npm start` for production
- Or deploy to Vercel — it auto-detects Next.js

### Database
- Use a managed PostgreSQL service (Supabase, Railway, AWS RDS, Neon) in production
- Enable connection pooling for high traffic

---

## License

Built as a technical assessment. All rights reserved.
