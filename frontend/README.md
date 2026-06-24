# AI SDR Frontend

Next.js 15 frontend for the AI Sales Development Representative application.

## Tech Stack
- **Next.js 15** + **React 19** + **TypeScript**
- **TailwindCSS** for styling
- **TanStack React Query** for server state management
- **Axios** for HTTP requests
- **React Hook Form** + **Zod** for form validation
- **Lucide React** for icons

## Architecture

```
app/             # Next.js App Router pages
├── login/       # Login page
├── register/    # Register page
└── dashboard/   # Protected dashboard
    ├── page.tsx              # Dashboard home
    └── leads/
        ├── page.tsx          # Leads list
        ├── new/page.tsx      # Create lead
        └── [id]/page.tsx     # Lead detail + AI actions

components/      # Reusable UI components
├── ui/          # Button, Input, Card, Badge, Modal, Spinner
├── auth/        # LoginForm, RegisterForm
├── dashboard/   # Navbar, Sidebar, StatsCards
└── leads/       # LeadTable, LeadForm, LeadDetails, LeadFilters

services/        # API client layer (api.ts, auth.ts, leads.ts)
hooks/           # React Query hooks (useAuth, useLeads)
types/           # TypeScript interfaces
lib/             # QueryClient config
utils/           # cn() utility
```

## Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Start development server
```bash
npm run dev
```

App runs at: http://localhost:3000

## Key Features

- **Authentication** — JWT-based login/register with auto-redirect
- **Lead Management** — Full CRUD with search, filter, pagination
- **AI Qualification** — One-click OpenAI scoring (0-100) with reason
- **AI Email Generation** — Gemini-powered personalized outreach emails
- **Dashboard** — Stats cards + recent leads overview
- **Responsive** — Mobile-friendly SaaS layout
