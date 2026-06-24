# AI SDR — Complete Setup Guide

Step-by-step instructions to get the AI SDR application running on your local machine from scratch.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Get the API Keys](#2-get-the-api-keys)
3. [Set Up PostgreSQL](#3-set-up-postgresql)
4. [Set Up the Backend](#4-set-up-the-backend)
5. [Set Up the Frontend](#5-set-up-the-frontend)
6. [Verify Everything is Running](#6-verify-everything-is-running)
7. [Optional: Load Sample Data](#7-optional-load-sample-data)
8. [Optional: Import Postman Collection](#8-optional-import-postman-collection)
9. [Troubleshooting](#9-troubleshooting)
10. [Environment Variable Reference](#10-environment-variable-reference)

---

## 1. Prerequisites

You need the following installed on your machine before starting.

### Python 3.12+

**Check if installed:**
```bash
python --version
# Should print: Python 3.12.x or higher
```

**Install if missing:**
- Windows: Download from https://www.python.org/downloads/
  - During install, check **"Add Python to PATH"**
- Mac: `brew install python@3.12`
- Linux: `sudo apt install python3.12 python3.12-venv`

---

### Node.js 18+

**Check if installed:**
```bash
node --version
# Should print: v18.x.x or higher

npm --version
# Should print: 9.x.x or higher
```

**Install if missing:**
- All platforms: Download from https://nodejs.org/ (choose LTS version)

---

### PostgreSQL 14+

**Check if installed:**
```bash
psql --version
# Should print: psql (PostgreSQL) 14.x or higher
```

**Install if missing:**

- **Windows:** Download from https://www.postgresql.org/download/windows/
  - Use the installer (includes pgAdmin GUI)
  - Remember the password you set for the `postgres` user
  - Default port: `5432`

- **Mac:** `brew install postgresql@14 && brew services start postgresql@14`

- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  ```

---

### Git

**Check if installed:**
```bash
git --version
```

**Install if missing:** https://git-scm.com/downloads

---

## 2. Get the API Keys

You need **two** API keys. Both have free tiers.

### OpenAI API Key (for lead qualification)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Click your profile → **"API Keys"** in the left sidebar
4. Click **"Create new secret key"**
5. Give it a name like `ai-sdr-local`
6. Copy the key — it starts with `sk-proj-...`
7. **Save it immediately** — you cannot see it again after closing the dialog

> Note: You need to add a payment method or purchase credits to use GPT-4o-mini. The cost per request is very low (fractions of a cent).

---

### OpenRouter API Key (for Google Gemini)

The project uses **OpenRouter** to access Google Gemini — this avoids SSL compatibility issues on Windows with the native Google SDK.

1. Go to https://openrouter.ai/
2. Sign up or log in
3. Click your profile → **"Keys"**
4. Click **"Create Key"**
5. Give it a name and copy the key — it starts with `sk-or-v1-...`

> OpenRouter has a free tier with limited credits. Add a payment method to avoid interruptions.

---

## 3. Set Up PostgreSQL

### Step 3.1 — Start PostgreSQL

**Windows:** PostgreSQL starts automatically after install. You can verify in Services (`services.msc`) — look for `postgresql-x64-14`.

**Mac:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo systemctl start postgresql
```

---

### Step 3.2 — Create the Database

Open a terminal and connect to PostgreSQL:

**Windows:**
```cmd
psql -U postgres
```
> If `psql` is not found, add PostgreSQL's bin folder to your PATH, or use the full path:
> `"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres`

**Mac/Linux:**
```bash
psql -U postgres
```

Once inside the `psql` shell (you will see `postgres=#`), run:

```sql
CREATE DATABASE ai_sdr_db;
```

Verify it was created:
```sql
\l
```
You should see `ai_sdr_db` in the list. Exit with `\q`.

**Alternative — run the provided SQL file:**
```bash
psql -U postgres -f database/01_create_database.sql
```

---

## 4. Set Up the Backend

Open a terminal in the `AI SDR` project folder.

### Step 4.1 — Navigate to the backend folder

```bash
cd backend
```

---

### Step 4.2 — Create a Python virtual environment

A virtual environment keeps this project's Python packages isolated from your system Python.

```bash
python -m venv venv
```

This creates a `venv/` folder inside `backend/`.

---

### Step 4.3 — Activate the virtual environment

**Windows (PowerShell):**
```powershell
venv\Scripts\Activate.ps1
```

> If you get a permissions error on Windows, run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
> Then try again.

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

After activation, your terminal prompt will show `(venv)` at the start.

---

### Step 4.4 — Install Python dependencies

```bash
pip install -r requirements.txt
```

This installs FastAPI, SQLAlchemy, Alembic, OpenAI SDK, and all other packages listed in `requirements.txt`.

> This may take 1–2 minutes on first run.

---

### Step 4.5 — Create your environment file

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Now open `.env` in any text editor (VS Code, Notepad, nano, etc.) and fill in your values:

```env
# Your PostgreSQL connection string
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/ai_sdr_db

# JWT secret key — generate a random string, minimum 32 characters
# You can generate one here: https://randomkeygen.com/
# Or run in Python: import secrets; print(secrets.token_hex(32))
SECRET_KEY=replace-this-with-a-random-32-character-string-minimum

# Leave these as-is
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Your OpenAI API key (starts with sk-proj-...)
OPENAI_API_KEY=sk-proj-your-openai-key-here

# Your OpenRouter API key (starts with sk-or-v1-...)
GEMINI_API_KEY=sk-or-v1-your-openrouter-key-here

# CORS — which frontend URLs are allowed to call the backend
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

> **Important:** Never commit your `.env` file to Git. It is already in `.gitignore`.

---

### Step 4.6 — Run database migrations

Alembic reads your `DATABASE_URL` and creates the `users` and `leads` tables:

```bash
alembic upgrade head
```

Expected output:
```
INFO  [alembic.runtime.migration] Context impl PostgreSQLImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 001, initial schema
```

Verify the tables were created by connecting to PostgreSQL:
```bash
psql -U postgres -d ai_sdr_db -c "\dt"
```

You should see:
```
         List of relations
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 public | leads | table | postgres
 public | users | table | postgres
```

---

### Step 4.7 — Start the backend server

```bash
uvicorn app.main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx]
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

The `--reload` flag means the server restarts automatically when you save a Python file — great for development.

**Verify it works:**
Open your browser and go to: http://localhost:8000/health

You should see:
```json
{"status": "healthy", "version": "1.0.0"}
```

**Swagger UI (interactive API docs):** http://localhost:8000/docs

---

## 5. Set Up the Frontend

Open a **new terminal** (keep the backend terminal running).

Navigate back to the `AI SDR` root folder and go into `frontend`:

```bash
cd frontend
```

### Step 5.1 — Install Node.js dependencies

```bash
npm install
```

This installs Next.js, React, Tailwind CSS, TanStack Query, and all other packages listed in `package.json`.

> This may take 1–2 minutes on first run. You may see some warnings — these are normal.

---

### Step 5.2 — Create the frontend environment file

```bash
# Windows
copy .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

Open `.env.local` and verify it looks like this:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

This tells the frontend where to find the backend API. If your backend runs on a different port, change it here.

---

### Step 5.3 — Start the frontend development server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 15.1.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 2.1s
```

---

## 6. Verify Everything is Running

You should now have:

| Service | URL | Status |
|---|---|---|
| Frontend | http://localhost:3000 | Should show the login page |
| Backend API | http://localhost:8000 | Should return `{"status":"healthy"}` |
| Swagger Docs | http://localhost:8000/docs | Should show interactive API docs |
| ReDoc | http://localhost:8000/redoc | Alternative API docs format |

### Quick end-to-end test:

1. Open http://localhost:3000
2. Click **"Register"** and create an account with any email and password
3. You should be redirected to the Dashboard
4. Click **"Add Lead"** and fill in the form (name, company, job title, industry)
5. After saving, click the lead name to open the detail page
6. Click **"Qualify Lead"** — wait 2–5 seconds for the OpenAI response
7. You should see a score (0–100) and a reason appear
8. Click **"Generate Email"** — wait 2–5 seconds for the Gemini response
9. You should see a complete email appear (subject + body + CTA)

If all 9 steps work, your setup is complete.

---

## 7. Optional: Load Sample Data

To populate the database with realistic test data for demo purposes:

```bash
psql -U postgres -d ai_sdr_db -f database/03_seed_data.sql
```

This creates:
- **2 test users:** `demo@aisdr.com` and `sales@example.com`
- **Password for both:** `testpassword123`
- **10 sample leads** for the demo user (various statuses, some with AI data already)
- **3 leads** for the second user

After running the seed, log in at http://localhost:3000 with:
- Email: `demo@aisdr.com`
- Password: `testpassword123`

---

## 8. Optional: Import Postman Collection

Use the provided Postman collection to test all API endpoints.

### Step 1 — Install Postman

Download from https://www.postman.com/downloads/ (free).

### Step 2 — Import the collection

1. Open Postman
2. Click **"Import"** (top left)
3. Drag and drop `postman/AI_SDR.postman_collection.json` into the dialog
4. Click **"Import"**

### Step 3 — Run the first request

1. Expand the **"Authentication"** folder
2. Click **"Register New User"**
3. Click **"Send"**
4. The JWT token is **automatically saved** to the `auth_token` collection variable
5. All other requests will use this token automatically

### Step 4 — Create a lead and test AI

1. Open **"Leads — CRUD"** → **"Create Lead"** → **"Send"**
   - The lead UUID is automatically saved to `{{lead_id}}`
2. Open **"AI Features"** → **"Qualify Lead"** → **"Send"**
3. Open **"AI Features"** → **"Generate Email"** → **"Send"**

---

## 9. Troubleshooting

### Backend won't start — "ModuleNotFoundError"

You probably forgot to activate the virtual environment. Make sure you see `(venv)` in your terminal prompt:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```
Then try `uvicorn app.main:app --reload --port 8000` again.

---

### "Could not connect to server" — Database error

PostgreSQL is not running. Start it:

```bash
# Mac
brew services start postgresql@14

# Linux
sudo systemctl start postgresql

# Windows — open Services and start "postgresql-x64-14"
```

Also verify your `DATABASE_URL` in `backend/.env` has the correct password.

---

### Alembic error: "relation already exists"

The tables already exist. This is fine — run:
```bash
alembic stamp head
```
This tells Alembic the current state without re-running migrations.

---

### Alembic error: "can't locate revision identified by..."

The alembic_version table has a stale entry. Connect to psql and run:
```sql
DELETE FROM alembic_version;
```
Then run `alembic upgrade head` again.

---

### "CORS error" in browser

Your `BACKEND_CORS_ORIGINS` in `backend/.env` must include your frontend URL exactly. Check it:
```env
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```
After editing `.env`, restart the backend server (Ctrl+C, then `uvicorn app.main:app --reload --port 8000`).

---

### OpenAI 401 error — "Invalid API key"

Your `OPENAI_API_KEY` in `backend/.env` is wrong or expired. Double-check it at https://platform.openai.com/api-keys.

---

### Gemini/OpenRouter error

Your `GEMINI_API_KEY` (OpenRouter key) is wrong. Verify it at https://openrouter.ai/keys. Make sure you have credits available.

---

### Frontend shows blank page or "network error"

1. Check that the backend is running at http://localhost:8000/health
2. Check `frontend/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
3. Open browser DevTools (F12) → Console tab — look for the specific error message

---

### PowerShell "cannot be loaded because running scripts is disabled"

Run this in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### Port 8000 or 3000 already in use

```bash
# Kill whatever is on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

Or change the backend port: `uvicorn app.main:app --reload --port 8001`
And update `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1`

---

## 10. Environment Variable Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Example | Notes |
|---|---|---|---|---|
| `DATABASE_URL` | Yes | — | `postgresql://postgres:pass@localhost:5432/ai_sdr_db` | Full PostgreSQL connection string |
| `SECRET_KEY` | Yes | — | `abc123...` (32+ chars) | JWT signing key. Must be secret. Generate with `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALGORITHM` | No | `HS256` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `1440` | `1440` | Token lifetime. 1440 = 24 hours |
| `OPENAI_API_KEY` | Yes | — | `sk-proj-...` | From platform.openai.com |
| `GEMINI_API_KEY` | Yes | — | `sk-or-v1-...` | OpenRouter key (not Google key directly) |
| `BACKEND_CORS_ORIGINS` | No | `["http://localhost:3000"]` | `["http://localhost:3000"]` | JSON array of allowed frontend origins |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Example | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | — | `http://localhost:8000/api/v1` | Must match backend port. Include `/api/v1` suffix. |

---

## Summary — Terminal Commands Cheat Sheet

```bash
# ── BACKEND ──────────────────────────────────────────────
cd backend
python -m venv venv
venv\Scripts\activate          # Windows PowerShell
# source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
cp .env.example .env           # then edit .env with your values
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# ── FRONTEND (new terminal) ───────────────────────────────
cd frontend
npm install
cp .env.local.example .env.local
npm run dev

# ── DATABASE (optional seed data) ─────────────────────────
psql -U postgres -d ai_sdr_db -f database/03_seed_data.sql

# ── URLS ──────────────────────────────────────────────────
# App:      http://localhost:3000
# API docs: http://localhost:8000/docs
# Health:   http://localhost:8000/health
```
