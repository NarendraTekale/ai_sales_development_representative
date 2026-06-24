-- =============================================================================
-- AI SDR — Useful Admin & Debug Queries
-- =============================================================================
-- A collection of handy SQL queries for inspecting, debugging, and
-- reporting on the AI SDR database.
--
-- Run individual queries in psql or any PostgreSQL client (pgAdmin, DBeaver, etc.)
-- Connect first: psql -U postgres -d ai_sdr_db
-- =============================================================================


-- =============================================================================
-- SECTION 1: Basic Inspection
-- =============================================================================

-- List all users (never shows password hash — good practice)
SELECT id, email, created_at, updated_at
FROM users
ORDER BY created_at DESC;

-- Count total users
SELECT COUNT(*) AS total_users FROM users;

-- List all leads (most recent first)
SELECT
    l.id,
    u.email AS owner,
    l.name,
    l.company,
    l.job_title,
    l.industry,
    l.status,
    l.qualification_score,
    l.created_at
FROM leads l
JOIN users u ON u.id = l.user_id
ORDER BY l.created_at DESC;

-- Count leads per user
SELECT
    u.email,
    COUNT(l.id) AS total_leads
FROM users u
LEFT JOIN leads l ON l.user_id = u.id
GROUP BY u.email
ORDER BY total_leads DESC;


-- =============================================================================
-- SECTION 2: Dashboard Statistics (mirrors /leads/stats endpoint)
-- =============================================================================

-- Stats for a specific user (replace the UUID with a real user id)
SELECT
    COUNT(*)                                                    AS total_leads,
    COUNT(qualification_score)                                  AS qualified_leads,
    ROUND(AVG(qualification_score)::NUMERIC, 1)                 AS average_score,
    COUNT(CASE WHEN generated_email_body IS NOT NULL THEN 1 END) AS emails_generated
FROM leads
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';  -- replace with actual user id

-- Stats for ALL users (admin overview)
SELECT
    u.email,
    COUNT(l.id)                                                            AS total_leads,
    COUNT(l.qualification_score)                                           AS qualified,
    ROUND(AVG(l.qualification_score)::NUMERIC, 1)                          AS avg_score,
    COUNT(CASE WHEN l.generated_email_body IS NOT NULL THEN 1 END)         AS emails_generated
FROM users u
LEFT JOIN leads l ON l.user_id = u.id
GROUP BY u.email
ORDER BY total_leads DESC;


-- =============================================================================
-- SECTION 3: Lead Analysis
-- =============================================================================

-- Leads by status breakdown (global)
SELECT
    status,
    COUNT(*) AS count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS percentage
FROM leads
GROUP BY status
ORDER BY count DESC;

-- Top 10 highest-scored leads
SELECT
    name,
    company,
    job_title,
    industry,
    qualification_score,
    status
FROM leads
WHERE qualification_score IS NOT NULL
ORDER BY qualification_score DESC
LIMIT 10;

-- Leads by industry with average score
SELECT
    industry,
    COUNT(*) AS total,
    COUNT(qualification_score) AS scored,
    ROUND(AVG(qualification_score)::NUMERIC, 1) AS avg_score
FROM leads
GROUP BY industry
ORDER BY avg_score DESC NULLS LAST;

-- Leads that have been qualified but email not yet generated
SELECT
    name,
    email,
    company,
    job_title,
    qualification_score
FROM leads
WHERE qualification_score IS NOT NULL
  AND generated_email_body IS NULL
ORDER BY qualification_score DESC;

-- Leads with full AI pipeline complete (score + email)
SELECT
    name,
    company,
    qualification_score,
    generated_email_subject
FROM leads
WHERE qualification_score IS NOT NULL
  AND generated_email_body IS NOT NULL
ORDER BY qualification_score DESC;

-- Recently added leads (last 7 days)
SELECT
    name,
    company,
    industry,
    status,
    created_at
FROM leads
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Leads converted from new to qualified in the last 30 days
SELECT
    name,
    company,
    qualification_score,
    updated_at AS qualified_at
FROM leads
WHERE status = 'qualified'
  AND updated_at >= NOW() - INTERVAL '30 days'
ORDER BY qualification_score DESC;


-- =============================================================================
-- SECTION 4: Search Queries (mirrors backend filters)
-- =============================================================================

-- Search by name or company (case-insensitive)
SELECT name, company, status, qualification_score
FROM leads
WHERE (name ILIKE '%sarah%' OR company ILIKE '%tech%')
ORDER BY created_at DESC;

-- Filter by industry
SELECT name, company, job_title, status, qualification_score
FROM leads
WHERE industry ILIKE '%technology%'
ORDER BY qualification_score DESC NULLS LAST;

-- Filter by minimum score
SELECT name, company, job_title, qualification_score, status
FROM leads
WHERE qualification_score >= 70
ORDER BY qualification_score DESC;

-- Filter by status
SELECT name, company, qualification_score, updated_at
FROM leads
WHERE status = 'contacted'
ORDER BY updated_at DESC;


-- =============================================================================
-- SECTION 5: Data Quality Checks
-- =============================================================================

-- Find any leads with orphaned user_id (should return 0 rows — data integrity check)
SELECT l.id, l.name, l.user_id
FROM leads l
LEFT JOIN users u ON u.id = l.user_id
WHERE u.id IS NULL;

-- Find duplicate emails within a user's leads (should return 0 rows ideally)
SELECT user_id, email, COUNT(*) AS duplicates
FROM leads
GROUP BY user_id, email
HAVING COUNT(*) > 1;

-- Leads with unusually low scores that are still marked as qualified
SELECT name, company, job_title, qualification_score, status
FROM leads
WHERE qualification_score < 30
  AND status = 'qualified';

-- =============================================================================
-- SECTION 6: Cleanup (USE WITH CAUTION)
-- =============================================================================

-- Delete all leads for a specific user (testing cleanup)
-- DELETE FROM leads WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Delete a specific user and all their leads (CASCADE handles leads automatically)
-- DELETE FROM users WHERE email = 'test@example.com';

-- Reset all AI data for a lead (re-qualify from scratch)
-- UPDATE leads
-- SET qualification_score = NULL,
--     qualification_reason = NULL,
--     generated_email_subject = NULL,
--     generated_email_body = NULL,
--     generated_email_cta = NULL,
--     status = 'new'
-- WHERE id = 'your-lead-uuid-here';

-- Wipe all seed data (useful for a clean demo reset)
-- TRUNCATE TABLE leads RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE users RESTART IDENTITY CASCADE;
