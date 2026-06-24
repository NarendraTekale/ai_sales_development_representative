# AI SDR Backend

FastAPI backend for the AI Sales Development Representative application.

## Tech Stack
- **Python 3.12** + **FastAPI**
- **PostgreSQL** + **SQLAlchemy** + **Alembic**
- **OpenAI GPT-4o-mini** for lead qualification
- **Google Gemini 1.5 Flash** for email generation
- **JWT** authentication with **bcrypt** password hashing
- **Pydantic v2** validation

## Architecture

```
app/
├── api/          # Route handlers (thin controllers)
│   ├── deps.py   # Auth dependency injection
│   └── routes/   # auth.py, leads.py
├── core/         # Config, security, logging
├── db/           # SQLAlchemy session & base
├── models/       # ORM models (User, Lead)
├── schemas/      # Pydantic request/response schemas
├── repositories/ # Data access layer
├── services/     # Business logic (auth, lead, openai, gemini)
├── middleware/   # Global error handlers
└── utils/        # Shared utilities
```

## Setup

### 1. Prerequisites
- Python 3.12+
- PostgreSQL running locally

### 2. Install dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your values:
# DATABASE_URL, SECRET_KEY, OPENAI_API_KEY, GEMINI_API_KEY
```

### 4. Run database migrations
```bash
alembic upgrade head
```

### 5. Start the server
```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

## API Endpoints

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login & get JWT token |
| GET | `/api/v1/auth/me` | Get current user |

### Leads
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/leads` | Create lead |
| GET | `/api/v1/leads` | List leads (paginated, filterable) |
| GET | `/api/v1/leads/stats` | Dashboard statistics |
| GET | `/api/v1/leads/{id}` | Get lead by ID |
| PUT | `/api/v1/leads/{id}` | Update lead |
| DELETE | `/api/v1/leads/{id}` | Delete lead |
| POST | `/api/v1/leads/{id}/qualify` | AI qualification (OpenAI) |
| POST | `/api/v1/leads/{id}/generate-email` | AI email generation (Gemini) |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key (min 32 chars) |
| `ALGORITHM` | JWT algorithm (default: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token TTL (default: 1440) |
| `OPENAI_API_KEY` | OpenAI API key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `BACKEND_CORS_ORIGINS` | JSON array of allowed origins |
