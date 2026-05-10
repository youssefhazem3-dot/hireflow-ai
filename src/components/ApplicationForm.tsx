"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Send, UploadCloud } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Job } from "@/lib/types";

type ApplicationFormProps = {
  jobs: Job[];
};

export function ApplicationForm({ jobs }: ApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState(jobs[0]?.title ?? "");

  const selectedJob = useMemo(
    () => jobs.find((job) => job.title === selectedPosition) ?? jobs[0],
    [jobs, selectedPosition],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        success?: boolean;
        candidate_id?: number;
        message?: string;
      };

      if (!response.ok || !payload.success || !payload.candidate_id) {
        throw new Error(payload.message ?? "Could not submit application.");
      }

      router.push(`/application-success?id=${payload.candidate_id}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Candidate Application</CardTitle>
            <CardDescription>
              Submit your details and CV for AI-assisted screening.
            </CardDescription>
          </div>
          <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Secure intake
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Full name
              <Input name="full_name" placeholder="Ahmed Ali" required />
            </label>
            <label className="grid gap-2 text-sm">
              Email
              <Input
                name="email"
                type="email"
                placeholder="ahmed@email.com"
                required
              />
            </label>
            <label className="grid gap-2 text-sm">
              Phone
              <Input name="phone" placeholder="01000000000" />
            </label>
            <label className="grid gap-2 text-sm">
              LinkedIn
              <Input
                name="linkedin_url"
                type="url"
                placeholder="https://linkedin.com/in/ahmed"
              />
            </label>
            <label className="grid gap-2 text-sm">
              GitHub / Portfolio
              <Input
                name="portfolio_url"
                type="url"
                placeholder="https://github.com/ahmed"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Position
              <select
                name="position"
                value={selectedPosition}
                onChange={(event) => setSelectedPosition(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.title}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedJob ? (
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex flex-wrap gap-2">
                {selectedJob.required_skills.map((skill) => (
                  <Badge key={skill} variant="muted">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {selectedJob.description}
              </p>
            </div>
          ) : null}

          <label className="grid gap-2 text-sm">
            CV upload
            <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed bg-background p-5 text-center">
              <UploadCloud className="h-8 w-8 text-primary" />
              <Input
                name="cv"
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                className="mt-4 max-w-md"
                required
              />
            </div>
          </label>

          {error ? (
            <div className="flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <Button type="submit" size="lg" disabled={isSubmitting}>
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
