-- Run this in Supabase SQL Editor after database/schema.sql.
-- It is safe to run again if RLS is already enabled.

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_logs ENABLE ROW LEVEL SECURITY;

-- This app does not read or write Supabase directly from the browser.
-- All candidate operations go through Next.js API routes using the server-only
-- Supabase service role key, so no anon/authenticated policies are required.
--
-- Result:
-- - Browser users cannot directly read/write candidate tables with the anon key.
-- - The deployed Next.js backend can still create candidates and read dashboard data.
