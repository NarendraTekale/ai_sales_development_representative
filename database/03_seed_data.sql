-- =============================================================================
-- AI SDR — Step 3: Seed / Sample Data
-- =============================================================================
-- This script inserts realistic test data for development and demo purposes.
--
-- IMPORTANT: Run 02_schema.sql (or alembic upgrade head) BEFORE this file.
--
-- Run with:
--   psql -U postgres -d ai_sdr_db -f 03_seed_data.sql
--
-- What this creates:
--   - 2 test users
--   - 10 sample leads for User 1 (various statuses, some with AI data)
--   - 3 sample leads for User 2
-- =============================================================================

-- =============================================================================
-- SEED USERS
-- =============================================================================
-- Password for BOTH test users is: testpassword123
-- Hash generated with bcrypt 12 rounds.
-- =============================================================================

INSERT INTO users (id, email, password_hash, created_at, updated_at)
VALUES
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'demo@aisdr.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCT8bOmMqxPqy1Q5JJt2R1O',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days'
    ),
    (
        'b1ffcd00-ad1c-5fg9-cc7e-7cc0ce491b22',
        'sales@example.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCT8bOmMqxPqy1Q5JJt2R1O',
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '15 days'
    )
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- SEED LEADS FOR USER 1 (demo@aisdr.com)
-- =============================================================================

INSERT INTO leads (
    id, user_id, name, email, company, job_title, industry, status,
    qualification_score, qualification_reason,
    generated_email_subject, generated_email_body, generated_email_cta,
    created_at, updated_at
) VALUES

-- Lead 1: Fully qualified + email generated (Technology / CTO)
(
    'c2aabc11-1111-1111-1111-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Prachi Deshmukh',
    'prachi.deshmukh@techcorp.com',
    'TechCorp Inc.',
    'Chief Technology Officer',
    'Technology',
    'qualified',
    87.0,
    'CTO at a technology company signals strong decision-making authority and budget control. Technology is a high-value vertical with active purchasing cycles and strong ROI awareness.',
    'Helping TechCorp accelerate engineering velocity by 40%',
    'Hi Prachi,

I noticed TechCorp has been scaling its engineering team rapidly over the past year — congratulations on the growth!

As CTO, I imagine you''re constantly balancing shipping new features with maintaining system reliability. We''ve helped similar tech companies reduce deployment friction by 40% while improving uptime.

I''d love to share a 5-minute case study on how we did it for a company very similar to TechCorp.

Looking forward to connecting,
[Your Name]',
    'Would you be free for a 15-minute call this Thursday or Friday to explore if this could benefit TechCorp''s engineering team?',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '18 days'
),

-- Lead 2: Qualified, no email yet (Finance / CFO)
(
    'c2aabc11-2222-2222-2222-222222222222',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Rajesh Kulkarni',
    'rajesh.kulkarni@financeflow.com',
    'FinanceFlow Ltd.',
    'Chief Financial Officer',
    'Finance',
    'qualified',
    91.0,
    'CFO at a finance company represents the highest level of budget authority. Finance industry is extremely high value. Decision-maker with direct control over procurement and technology spend.',
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '17 days'
),

-- Lead 3: Contacted (Healthcare / VP)
(
    'c2aabc11-3333-3333-3333-333333333333',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Dr. Snehal Patil',
    'snehal.patil@healthplus.org',
    'HealthPlus Systems',
    'VP of Operations',
    'Healthcare',
    'contacted',
    78.0,
    'VP of Operations in Healthcare demonstrates significant operational authority. Healthcare is a high-value industry with strong compliance and efficiency needs. VP-level typically controls operational budgets.',
    'Reducing HealthPlus operational overhead by 30% — a quick thought',
    'Hi Snehal,

Healthcare organizations like HealthPlus face unique operational challenges — balancing patient care quality with administrative efficiency under tight regulatory requirements.

As VP of Operations, I imagine compliance reporting and cross-department coordination take up significant bandwidth. We''ve helped 3 healthcare systems cut operational overhead by 30% without impacting care quality.

Happy to share how — no strings attached.

Best regards,
[Your Name]',
    'Could we schedule a 20-minute discovery call next week? I''d love to understand HealthPlus''s specific operational priorities.',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '10 days'
),

-- Lead 4: Converted (Technology / CEO)
(
    'c2aabc11-4444-4444-4444-444444444444',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Vikram Joshi',
    'vikram@startupai.io',
    'StartupAI',
    'CEO & Founder',
    'Technology',
    'converted',
    95.0,
    'CEO and Founder at a technology startup — maximum decision-making authority combined with strong innovation drive. AI/tech industry focus aligns perfectly with our value proposition.',
    'A quick idea for StartupAI''s growth trajectory',
    'Hi Vikram,

Building a startup in the AI space means moving fast while managing limited resources — I know that balance well.

We help founders like you automate the parts of your sales process that eat into product time. One of our customers went from 5 to 50 demos per month without adding headcount.

Thought this might be relevant given StartupAI''s stage.

Cheers,
[Your Name]',
    'Would a 10-minute call work this week? I can walk you through exactly how it could work for StartupAI.',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '5 days'
),

-- Lead 5: Rejected (low authority role)
(
    'c2aabc11-5555-5555-5555-555555555555',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Aniket Shinde',
    'aniket.shinde@retailco.com',
    'RetailCo',
    'Marketing Coordinator',
    'Retail',
    'rejected',
    22.0,
    'Marketing Coordinator is an individual contributor role with limited budget authority. Retail industry has lower average deal values. Unlikely to be a decision-maker for technology purchases.',
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '13 days'
),

-- Lead 6: New — not yet qualified
(
    'c2aabc11-6666-6666-6666-666666666666',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Priya Kale',
    'priya.kale@cloudnative.io',
    'CloudNative Solutions',
    'Director of Engineering',
    'Technology',
    'new',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
),

-- Lead 7: New — not yet qualified
(
    'c2aabc11-7777-7777-7777-777777777777',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Amol Gaikwad',
    'amol.gaikwad@insurancehub.com',
    'InsuranceHub Corp',
    'Head of Digital Transformation',
    'Insurance',
    'new',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),

-- Lead 8: Qualified (SaaS / VP Sales)
(
    'c2aabc11-8888-8888-8888-888888888888',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Pooja Bhosale',
    'pooja.bhosale@saasplatform.com',
    'SaaS Platform Co',
    'VP of Sales',
    'Technology',
    'qualified',
    82.0,
    'VP of Sales has direct authority over sales technology and process investments. SaaS company will have strong appreciation for automation and ROI metrics. High likelihood of budget availability.',
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '7 days'
),

-- Lead 9: Contacted + email generated (Manufacturing / COO)
(
    'c2aabc11-9999-9999-9999-999999999999',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Suresh Mhatre',
    'suresh.mhatre@manufact.in',
    'Mhatre Manufacturing Pvt. Ltd.',
    'Chief Operating Officer',
    'Manufacturing',
    'contacted',
    73.0,
    'COO of a manufacturing company controls operational budget and process improvement decisions. Manufacturing sector is increasingly investing in digital transformation. C-suite authority confirmed.',
    'Cutting Mhatre Manufacturing''s operational costs with smarter workflows',
    'Hi Suresh,

Manufacturing operations at scale face constant pressure to reduce waste and improve throughput — and I know that finding the right tools to do that without disrupting your floor is a real challenge.

We''ve helped manufacturing COOs like you reduce process overhead by 25% while improving traceability. I''d love to share the specifics.

Best,
[Your Name]',
    'Can we connect for 15 minutes this week? I have a specific case study from a Pune-based manufacturing company I think you''d find valuable.',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '9 days'
),

-- Lead 10: New (E-commerce / CRO)
(
    'c2aabc11-0000-0000-0000-000000000000',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Neha Pawar',
    'neha.pawar@ecommerceplus.com',
    'EcommercePlus',
    'Chief Revenue Officer',
    'E-Commerce',
    'new',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
)

ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SEED LEADS FOR USER 2 (sales@example.com)
-- =============================================================================

INSERT INTO leads (
    id, user_id, name, email, company, job_title, industry, status,
    qualification_score, qualification_reason,
    created_at, updated_at
) VALUES

(
    'd3bbcd22-1111-1111-1111-111111111111',
    'b1ffcd00-ad1c-5fg9-cc7e-7cc0ce491b22',
    'Nikhil Deshpande',
    'nikhil.deshpande@fintechpune.in',
    'FinTech Pune',
    'CEO',
    'Finance',
    'new',
    NULL,
    NULL,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
),
(
    'd3bbcd22-2222-2222-2222-222222222222',
    'b1ffcd00-ad1c-5fg9-cc7e-7cc0ce491b22',
    'Rupali Jadhav',
    'rupali.jadhav@healthtech.in',
    'HealthTech Maharashtra',
    'Chief Technology Officer',
    'Healthcare',
    'qualified',
    85.0,
    'CTO at a HealthTech company demonstrates strong technical decision-making authority and innovation orientation. Healthcare technology is a rapidly growing vertical.',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days'
),
(
    'd3bbcd22-3333-3333-3333-333333333333',
    'b1ffcd00-ad1c-5fg9-cc7e-7cc0ce491b22',
    'Mangesh Waghmare',
    'mangesh.waghmare@airesearch.in',
    'AI Research Labs',
    'Research Director',
    'Technology',
    'new',
    NULL,
    NULL,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
)

ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- VERIFY SEED DATA
-- =============================================================================

-- Run these to confirm data was inserted:

-- SELECT id, email, created_at FROM users ORDER BY created_at;
-- SELECT name, company, status, qualification_score FROM leads WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' ORDER BY created_at DESC;
-- SELECT COUNT(*) AS total_leads, COUNT(qualification_score) AS qualified, AVG(qualification_score) AS avg_score FROM leads WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
