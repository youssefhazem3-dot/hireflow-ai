# HireFlow AI Project Report

## Project Overview

HireFlow AI is an AI-powered recruitment and CV automation platform. The app lets candidates apply for roles by submitting their contact details, links, position, and CV. Recruiters can review applications in an admin dashboard with AI-generated summaries, ATS scores, match scores, skills, recommendations, status updates, charts, CSV export, and candidate deletion.

Live deployment:

- Vercel: https://hireflow-ai-delta.vercel.app
- GitHub: https://github.com/youssefhazem3-dot/hireflow-ai

Current latest commit:

- `db3d301` - `Add candidate deletion`

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Recharts
- Supabase Database
- Supabase Storage
- OpenAI API integration with demo fallback
- n8n workflow templates
- Vercel deployment

## Main Pages Built

### Public Pages

- `/`
  - Modern landing page
  - Animated dashboard preview
  - Problem statement
  - Workflow steps
  - Feature list
  - Tech stack
  - Screenshot-style portfolio cards

- `/apply`
  - Candidate application form
  - Full name, email, phone, LinkedIn, portfolio/GitHub, position, CV upload
  - Job-specific skill preview
  - Form validation
  - Supabase-backed CV upload when configured
  - Demo fallback when Supabase is missing

- `/application-success`
  - Submission confirmation page
  - Displays application ID
  - Links back to apply or dashboard

### Admin Pages

- `/admin`
  - Recruitment overview dashboard
  - Candidate metrics
  - Recent applications
  - Charts for status, scores, skills, and timeline

- `/admin/candidates`
  - Candidate table
  - Search
  - Status filter
  - Position filter
  - Sort by match score or newest
  - CSV export
  - Import old browser demo records
  - Delete candidate action

- `/admin/candidates/[id]`
  - Candidate detail page
  - Candidate information
  - AI summary
  - Extracted skills
  - Strengths and weaknesses
  - ATS and match scores
  - AI recommendation
  - Suggested email
  - Status update
  - Logs
  - Danger Zone delete button

## Core Features Implemented

### Candidate Application Flow

- Built candidate form in `src/components/ApplicationForm.tsx`.
- Added API route at `src/app/api/applications/route.ts`.
- Validates required fields.
- Extracts CV text from uploaded files.
- Uploads CVs to Supabase Storage bucket `cvs` when Supabase is connected.
- Saves candidates and AI analysis into Supabase.
- Falls back to demo mode when Supabase is not configured.
- Returns a candidate ID and redirects to success page.

### CV Text Extraction

- Added CV parsing helper in `src/lib/pdf.ts`.
- Fixed Vercel PDF parsing crash caused by `DOMMatrix` issues from `pdf-parse`.
- Added graceful fallback text when PDF extraction is unavailable.

### AI Analysis

- Added AI analysis logic in `src/lib/ai.ts`.
- Supports OpenAI when `OPENAI_API_KEY` is configured.
- Uses deterministic demo analysis when OpenAI is missing.
- Produces:
  - Extracted skills
  - Experience level
  - Education summary
  - CV summary
  - Strengths
  - Weaknesses
  - ATS score
  - Match score
  - Recommendation
  - Suggested email

### Supabase Persistence

- Added Supabase admin client in `src/lib/supabase.ts`.
- Added shared candidate database logic in `src/lib/candidates.ts`.
- Added schema in `database/schema.sql`.
- Added RLS helper script in `database/rls.sql`.
- Added dynamic admin routes so candidate data is fetched fresh from the database.
- Confirmed live API returns `source: "supabase"` after keys were added.

### Demo and Portfolio Data

- Added polished demo candidates in `src/lib/demo-data.ts`.
- Demo candidates now appear alongside real Supabase candidates to keep the portfolio dashboard populated.
- Demo candidates are labeled with a `Demo` badge.
- Demo candidates are read-only and are not inserted into the real Supabase database.
- Added local browser persistence for demo-mode applications in `src/lib/local-candidates.ts`.
- Added import flow to move old browser-only demo applications into Supabase.

### Candidate Status Updates

- Added status update API route:
  - `src/app/api/candidates/[id]/status/route.ts`
- Supported statuses:
  - Pending
  - Shortlisted
  - Interview
  - Rejected
  - Hired
- Updates Supabase candidate status.
- Adds candidate logs.
- Demo portfolio candidates are protected as read-only.

### Candidate Deletion

- Added DELETE API route:
  - `src/app/api/candidates/[id]/route.ts`
- Added table delete button.
- Added detail page Danger Zone delete button.
- Real Supabase candidates can be deleted.
- Candidate analysis and logs are removed by cascade delete.
- Uploaded CV file removal is attempted for files stored in the `cvs` bucket.
- Demo portfolio candidates cannot be deleted because they are not real database rows.
- Old browser-only local candidates can be removed locally.

### Dashboard and Charts

- Built reusable metrics in `src/components/MetricCard.tsx`.
- Built charts in `src/components/Charts.tsx`.
- Added:
  - Candidates by status
  - Average score by position
  - Top extracted skills
  - Applications over time
- Fixed chart label clipping after visual redesign.

### Candidate Table

- Built `src/components/CandidateTable.tsx`.
- Added:
  - Search
  - Filters
  - Sorting
  - CSV export
  - Demo label
  - Import demo records
  - Delete action

### Candidate Details

- Built `src/components/CandidateDetailPanel.tsx`.
- Added score cards, skills, recommendation, suggested email, logs, status update, and deletion.
- Added read-only handling for portfolio demo candidates.

## UI and Design Work

The project was redesigned to feel more modern and portfolio-ready.

Added in `src/app/globals.css`:

- Animated grid background
- Glass panels
- Hover-lift cards
- Scan-line effects
- Border shine effects
- Reveal animations
- Button glow effects
- Reduced-motion support

Updated UI across:

- Landing page
- Apply page
- Dashboard
- Candidate table
- Candidate details
- Success page
- Navigation
- Buttons
- Cards
- Inputs

Mobile and visual issues fixed:

- Fixed mobile heading overflow.
- Fixed chart label clipping.
- Improved responsive dashboard layout.
- Protected against horizontal overflow.

## Database Design

Tables:

- `jobs`
- `candidates`
- `candidate_analysis`
- `candidate_logs`

Storage:

- Supabase Storage bucket: `cvs`

Security:

- RLS enabled for app tables.
- The app uses server-side Next.js routes with `SUPABASE_SERVICE_ROLE_KEY`.
- No service key is exposed to the browser.

## n8n Workflow Templates

Created workflow template files:

- `workflows/candidate-processing.n8n.json`
- `workflows/status-update.n8n.json`
- `workflows/daily-report.n8n.json`
- `workflows/auto-email.n8n.json`

These are templates for importing into n8n and connecting credentials/webhooks.

## Environment Variables

Documented in `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

N8N_CANDIDATE_WEBHOOK_URL=
N8N_STATUS_WEBHOOK_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

ADMIN_EMAIL=
```

Current important production values configured in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Issues Found and Fixed

### CV Upload Error on Vercel

Problem:

- Uploading CVs caused a server error from PDF parsing.

Fix:

- Changed PDF extraction to avoid crashing when parser support is unavailable.
- Added fallback text extraction behavior.

### Applications Not Appearing for Other Users

Problem:

- App was in demo mode because Vercel had no Supabase env vars.
- Demo applications were saved only in browser localStorage.

Fix:

- Connected Supabase through Vercel env vars.
- Made admin pages dynamic.
- Added shared Supabase persistence.
- Added local demo import path.

### Dashboard Looked Empty After Supabase Was Connected

Problem:

- Old demo records disappeared because the app switched from demo data to real database data.

Fix:

- Added read-only portfolio demo candidates alongside real database candidates.
- Added `Demo` badges.
- Kept fake records out of Supabase.

### Test Candidate Left in Dashboard

Problem:

- A verification candidate named `Source Check` was created during live testing.

Fix:

- Removed it from Supabase.
- Confirmed it no longer appears.

### Need Candidate Deletion

Problem:

- Admin could not delete candidates.

Fix:

- Added Supabase delete API.
- Added table and detail page delete controls.
- Protected read-only demo records.

## Deployment Work

The app has been pushed to GitHub and deployed to Vercel multiple times.

Final live URL:

- https://hireflow-ai-delta.vercel.app

Repository:

- https://github.com/youssefhazem3-dot/hireflow-ai

Recent project commits:

- `db3d301` - Add candidate deletion
- `36f0124` - Show portfolio demo candidates
- `36810f4` - Add local candidate import
- `8f6713f` - Enable Supabase RLS setup
- `ac0abdd` - Prepare shared candidate persistence
- `a00c56a` - Modernize HireFlow UI
- `ef7fe70` - Persist demo applications in browser
- `128a5fe` - Fix CV upload on Vercel
- `5bcd87a` - Add deployment links
- `6043436` - Build HireFlow AI MVP

## Verification Completed

Checks run during development:

```bash
npm run lint
npm run type-check
npm run build
```

Live checks performed:

- Landing page returns 200.
- Apply page returns 200.
- Admin candidates page returns 200.
- Application API saves to Supabase after env vars were added.
- Delete API successfully deleted a throwaway Supabase candidate.
- Portfolio demo candidates still appear.
- Verification test candidate was removed.

## Current Behavior

- New applications are saved to Supabase and visible to all users.
- Demo portfolio candidates appear in the dashboard for presentation quality.
- Demo portfolio candidates are read-only.
- Real candidates can be updated and deleted by the admin UI.
- Old browser-only demo submissions can be imported from the same browser using `Import demo records`.
- CSV export includes the currently visible/filterable candidate list.

## Remaining Optional Improvements

- Add real admin authentication with Supabase Auth.
- Add protected admin routes.
- Add email sending through SMTP, Resend, or n8n.
- Add n8n workflow screenshots.
- Add a public case study page.
- Add real screenshot images under `public/screenshots`.
- Add audit confirmation modals instead of browser `confirm`.
- Add pagination when candidate volume grows.
- Add admin role permissions.
