# HireFlow AI

AI-powered recruitment and CV automation platform built with Next.js, n8n, OpenAI, and Supabase.

## Features

- CV upload and parsing
- AI CV analysis
- ATS score
- Match score
- Candidate ranking
- Admin dashboard
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
3. Create a Supabase Storage bucket named `cvs`.
4. Add Supabase and OpenAI keys to `.env.local`.
5. Import n8n workflows from `/workflows`.
6. Add the n8n webhook URLs to `.env.local`.

## Environment Variables

Check `.env.example`.

## Live Demo

Add Vercel link.

## GitHub

Add repo link.

## Portfolio Description

Built an AI-powered recruitment automation platform that allows candidates to upload CVs, automatically extracts and analyzes CV content using AI, compares candidates against job descriptions, generates ATS and match scores, ranks applicants, sends automated emails, and provides an admin dashboard for recruitment management.
