import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  FileSearch,
  MailCheck,
  Network,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { AppNav } from "@/components/AppNav";
import { Badge } from "@/components/ui/badge";

const features = [
  "CV upload and parsing",
  "AI CV analysis",
  "ATS and match scores",
  "Candidate ranking",
  "Admin dashboard",
  "n8n workflow automation",
  "Supabase database",
  "Automated emails",
];

const stack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Recharts",
  "Supabase",
  "OpenAI API",
  "n8n",
  "Vercel",
];

const workflowSteps = [
  { label: "Apply", icon: UploadCloud },
  { label: "Parse CV", icon: FileSearch },
  { label: "Analyze", icon: Bot },
  { label: "Rank", icon: Sparkles },
  { label: "Notify", icon: MailCheck },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <AppNav />

      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden border-b">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-[6%] top-12 h-[72%] w-[88%] rounded-lg border bg-card shadow-2xl shadow-black/40">
            <div className="flex h-12 items-center justify-between border-b px-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                admin / candidates
              </span>
            </div>
            <div className="grid h-[calc(100%-3rem)] gap-4 p-5 lg:grid-cols-[260px_1fr]">
              <div className="hidden rounded-lg border bg-background/70 p-4 lg:block">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="mt-6 grid gap-3">
                  {["Pending", "Shortlisted", "Interview", "Hired"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-md border bg-card p-3"
                    >
                      <span className="text-xs text-muted-foreground">{item}</span>
                      <span className="h-2 w-10 rounded bg-primary/60" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[87, 91, 32, 8].map((value, index) => (
                    <div key={value} className="rounded-lg border bg-background/70 p-4">
                      <div className="h-3 w-20 rounded bg-muted" />
                      <div className="mt-4 font-mono text-3xl font-semibold">
                        {value}
                        {index < 2 ? "%" : ""}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                  <div className="rounded-lg border bg-background/70 p-4">
                    <div className="mb-4 h-4 w-40 rounded bg-muted" />
                    <div className="grid gap-3">
                      {["Ahmed Ali", "Mariam Hassan", "Omar Nabil"].map(
                        (candidate, index) => (
                          <div
                            key={candidate}
                            className="grid grid-cols-[1fr_80px_80px] items-center gap-3 rounded-md border bg-card p-3"
                          >
                            <span className="text-sm">{candidate}</span>
                            <span className="font-mono text-sm text-emerald-300">
                              {87 - index * 5}%
                            </span>
                            <span className="h-6 rounded bg-primary/15" />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-background/70 p-4">
                    <div className="mb-5 h-4 w-28 rounded bg-muted" />
                    <div className="flex h-44 items-end gap-3">
                      {[56, 88, 72, 92, 64].map((height, index) => (
                        <span
                          key={height}
                          className="w-full rounded-t bg-primary/70"
                          style={{ height: `${height}%`, opacity: 0.55 + index * 0.08 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-background/30" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl pb-10">
            <Badge className="mb-5 border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              AI recruitment automation
            </Badge>
            <h1 className="text-5xl font-semibold tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              HireFlow AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A smart recruitment platform for CV intake, AI scoring, candidate
              ranking, automated emails, and recruiter dashboards.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/apply"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Apply now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex h-11 items-center justify-center rounded-md border bg-background/70 px-5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-medium text-primary">Problem statement</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              Manual CV screening is slow, inconsistent, and hard to audit.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Recruiters lose hours reading mismatched CVs.",
              "Candidate data sits across inboxes and spreadsheets.",
              "Status updates and reports are easy to forget.",
            ].map((item) => (
              <div key={item} className="rounded-lg border bg-card p-5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-primary">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal">
                Candidate Form to Admin Dashboard
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              The application can run in demo mode, then connect to Supabase,
              OpenAI, n8n, Gmail, or SMTP for the full automation flow.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="rounded-lg border bg-card p-5">
                <step.icon className="h-6 w-6 text-primary" />
                <p className="mt-5 font-mono text-xs text-muted-foreground">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 font-semibold">{step.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              A complete MVP for a recruitment automation portfolio project.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-lg border p-4">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-medium text-primary">Tech stack</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              Built with modern app, AI, automation, and database tools.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {stack.map((item) => (
              <Badge key={item} variant="muted" className="h-9 px-3 text-sm">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-medium text-primary">Screenshots</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              Dashboard-first screens for recruiter workflows.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "AI Scores", icon: Sparkles },
              { label: "Candidate Ranking", icon: Network },
              { label: "Supabase Data", icon: Database },
              { label: "Email Automation", icon: MailCheck },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border bg-card p-5">
                <item.icon className="h-5 w-5 text-primary" />
                <div className="mt-8 h-2 rounded bg-muted" />
                <div className="mt-3 h-2 w-2/3 rounded bg-muted" />
                <p className="mt-5 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
