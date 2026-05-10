# HireFlow AI

AI-powered recruitment and CV automation platform built with Next.js, n8n, OpenAI, and Supabase.

## Features

- CV upload and parsing
- AI CV analysis
- ATS score
- Match score
- Candidate ranking
- Admin dashboard
- Candidate deletion
- Automated emails
- n8n workflow automation
- Supabase database
- Vercel deployment

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Recharts
- n8n
- OpenAI API
- Supabase
- PostgreSQL
- Vercel

## Architecture

Candidate Form -> Supabase Storage -> n8n Webhook -> CV Parser -> OpenAI Analysis -> PostgreSQL -> Admin Dashboard -> Email Automation

## Screenshots

Add screenshots in `/public/screenshots` after deployment or local browser capture.

## Workflows

The exported n8n workflow templates are available in the `/workflows` folder:

- `candidate-processing.n8n.json`
- `status-update.n8n.json`
- `daily-report.n8n.json`
- `auto-email.n8n.json`

## How To Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs with demo data by default. To connect real services:

1. Copy `.env.example` to `.env.local`.
2. Create a Supabase project and run `database/schema.sql`.
3. If tables already exist, run `database/rls.sql` to enable Row Level Security.
4. Create a Supabase Storage bucket named `cvs`.
5. Add Supabase and OpenAI keys to `.env.local`.
6. Import n8n workflows from `/workflows`.
7. Add the n8n webhook URLs to `.env.local`.

## Shared Candidate Persistence

New applications are shared between users only when Supabase is configured. Without
`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, the app runs in demo
mode and stores newly submitted candidates in the current browser only.

For Vercel production, add these environment variables to the project, then
redeploy:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

After Supabase is connected, `/admin` and `/admin/candidates` read fresh database
records on every request, so applications submitted by one person appear for
other recruiters and browsers.

If you submitted applications before Supabase was connected, those records were
stored only in that browser as demo data. Open `/admin/candidates` from that
same browser and click `Import demo records` to move them into Supabase.

The dashboard also appends read-only portfolio demo candidates to Supabase data
so the live demo stays visually complete without inserting fake applicants into
the real database.

## Row Level Security

Run `database/rls.sql` in the Supabase SQL Editor after creating the tables.
RLS is enabled on the application tables, and the app still works because all
database access happens through server-side Next.js routes using
`SUPABASE_SERVICE_ROLE_KEY`.

## Environment Variables

Check `.env.example`.

## Live Demo

[https://hireflow-ai-delta.vercel.app](https://hireflow-ai-delta.vercel.app)

## GitHub

[https://github.com/youssefhazem3-dot/hireflow-ai](https://github.com/youssefhazem3-dot/hireflow-ai)

## Portfolio Description

Built an AI-powered recruitment automation platform that allows candidates to upload CVs, automatically extracts and analyzes CV content using AI, compares candidates against job descriptions, generates ATS and match scores, ranks applicants, sends automated emails, and provides an admin dashboard for recruitment management.
