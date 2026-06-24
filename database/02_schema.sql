-- =============================================================================
-- AI SDR — Step 2: Full Database Schema
-- =============================================================================
-- This is the MANUAL version of the schema (no Alembic needed).
-- Use this if you want to inspect or recreate the schema without running migrations.
--
-- NOTE: If you use Alembic (recommended), you do NOT need to run this file.
--       Alembic creates this schema automatically with: alembic upgrade head
--
-- To run manually:
--   psql -U postgres -d ai_sdr_db -f 02_schema.sql
-- =============================================================================

-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- Lead status lifecycle: new → qualified → contacted → (converted | rejected)
CREATE TYPE leadstatus AS ENUM (
    'new',
    'qualified',
    'contacted',
    'converted',
    'rejected'
);

-- =============================================================================
-- TABLE: users
-- =============================================================================
-- Stores registered user accounts.
-- Passwords are NEVER stored in plain text — only bcrypt hashes.
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id            UUID         NOT NULL DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_unique UNIQUE (email)
);

-- Index on email for fast login lookups
CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);

COMMENT ON TABLE users IS 'Registered user accounts for the AI SDR application';
COMMENT ON COLUMN users.id IS 'UUID primary key';
COMMENT ON COLUMN users.email IS 'Unique email address used for login';
COMMENT ON COLUMN users.password_hash IS 'bcrypt hash with 12 rounds — never plain text';
COMMENT ON COLUMN users.created_at IS 'Account creation timestamp (UTC)';
COMMENT ON COLUMN users.updated_at IS 'Last modification timestamp (UTC)';

-- =============================================================================
-- TABLE: leads
-- =============================================================================
-- Stores sales leads and all AI-generated results.
-- Each lead belongs to exactly one user (user_id foreign key).
-- Deleting a user cascade-deletes all their leads.
-- =============================================================================

CREATE TABLE IF NOT EXISTS leads (
    -- Identity
    id                       UUID         NOT NULL DEFAULT gen_random_uuid(),
    user_id                  UUID         NOT NULL,

    -- Lead core information (required at creation)
    name                     VARCHAR(255) NOT NULL,
    email                    VARCHAR(255) NOT NULL,
    company                  VARCHAR(255) NOT NULL,
    job_title                VARCHAR(255) NOT NULL,
    industry                 VARCHAR(255) NOT NULL,

    -- Pipeline status
    status                   leadstatus   NOT NULL DEFAULT 'new',

    -- AI Qualification (set by OpenAI GPT-4o-mini)
    qualification_score      FLOAT,              -- 0.0 to 100.0
    qualification_reason     TEXT,               -- AI's written explanation

    -- AI Email Generation (set by Google Gemini)
    generated_email_subject  VARCHAR(500),       -- Email subject line
    generated_email_body     TEXT,               -- Full email body text
    generated_email_cta      TEXT,               -- Call to action string

    -- Timestamps
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT leads_pkey PRIMARY KEY (id),
    CONSTRAINT leads_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

-- Index on user_id for fast per-user lead queries
CREATE INDEX IF NOT EXISTS ix_leads_user_id ON leads(user_id);

-- Optional: Index on status for filtering queries
CREATE INDEX IF NOT EXISTS ix_leads_status ON leads(status);

-- Optional: Index on qualification_score for min_score filter queries
CREATE INDEX IF NOT EXISTS ix_leads_qualification_score ON leads(qualification_score);

COMMENT ON TABLE leads IS 'Sales leads with AI qualification scores and generated emails';
COMMENT ON COLUMN leads.id IS 'UUID primary key';
COMMENT ON COLUMN leads.user_id IS 'FK to users.id — lead ownership, cascade delete';
COMMENT ON COLUMN leads.name IS 'Full name of the prospect';
COMMENT ON COLUMN leads.email IS 'Contact email of the prospect';
COMMENT ON COLUMN leads.company IS 'Company the prospect works at';
COMMENT ON COLUMN leads.job_title IS 'Job title — used for AI scoring and email personalisation';
COMMENT ON COLUMN leads.industry IS 'Industry sector — used for AI scoring and email personalisation';
COMMENT ON COLUMN leads.status IS 'Pipeline stage: new → qualified → contacted → converted/rejected';
COMMENT ON COLUMN leads.qualification_score IS 'AI score 0-100 assigned by OpenAI GPT-4o-mini';
COMMENT ON COLUMN leads.qualification_reason IS 'AI explanation for the qualification score';
COMMENT ON COLUMN leads.generated_email_subject IS 'AI-generated email subject line (Gemini)';
COMMENT ON COLUMN leads.generated_email_body IS 'AI-generated full email body text (Gemini)';
COMMENT ON COLUMN leads.generated_email_cta IS 'AI-generated call to action (Gemini)';

-- =============================================================================
-- TRIGGER: auto-update updated_at on row change
-- =============================================================================
-- PostgreSQL does not auto-update updated_at like MySQL does.
-- This trigger fires on every UPDATE and sets updated_at to NOW().
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER leads_set_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================================================
-- VERIFY SCHEMA
-- =============================================================================
-- Run these to confirm the schema was created correctly:
--
--   \dt                           -- list all tables
--   \d users                      -- describe users table
--   \d leads                      -- describe leads table
--   SELECT typname, enumlabel FROM pg_enum JOIN pg_type ON pg_type.oid = pg_enum.enumtypid WHERE typname = 'leadstatus';
-- =============================================================================
