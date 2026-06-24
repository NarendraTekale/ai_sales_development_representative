-- =============================================================================
-- AI SDR — Step 1: Create Database and User
-- =============================================================================
-- Run this script as the PostgreSQL superuser (postgres).
-- Command: psql -U postgres -f 01_create_database.sql
-- =============================================================================

-- Create the database
CREATE DATABASE ai_sdr_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE ai_sdr_db IS 'AI Sales Development Representative application database';

-- (Optional) Create a dedicated application user with limited permissions
-- This is the recommended production practice instead of using the postgres superuser.
-- Uncomment and modify the lines below if you want a separate DB user:

-- CREATE USER ai_sdr_user WITH PASSWORD 'your_strong_password_here';
-- GRANT CONNECT ON DATABASE ai_sdr_db TO ai_sdr_user;
-- GRANT USAGE ON SCHEMA public TO ai_sdr_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ai_sdr_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ai_sdr_user;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ai_sdr_user;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ai_sdr_user;

-- If using the dedicated user, your DATABASE_URL in .env would be:
-- DATABASE_URL=postgresql://ai_sdr_user:your_strong_password_here@localhost:5432/ai_sdr_db
