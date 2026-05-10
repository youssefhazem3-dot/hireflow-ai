"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CandidateRecord, CandidateStatus } from "@/lib/types";
import {
  formatDate,
  recommendationClasses,
  scoreTone,
  statusClasses,
} from "@/lib/utils";

type CandidateDetailPanelProps = {
  record: CandidateRecord;
};

const statuses: CandidateStatus[] = [
  "Pending",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Hired",
];

export function CandidateDetailPanel({ record }: CandidateDetailPanelProps) {
  const [status, setStatus] = useState<CandidateStatus>(record.status);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function updateStatus() {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/candidates/${record.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Could not update status.");
      }

      setMessage("Status updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update status.");
    } finally {
      setIsSaving(false);
    }
  }

  const analysis = record.analysis;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{record.full_name}</CardTitle>
                <CardDescription>
                  {record.position} • Applied {formatDate(record.created_at)}
                </CardDescription>
              </div>
              <Badge className={statusClasses(status)}>{status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="mt-1 font-medium">{record.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="mt-1 font-medium">{record.phone ?? "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">LinkedIn</p>
              <p className="mt-1 break-all font-medium">
                {record.linkedin_url ?? "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Portfolio</p>
              <p className="mt-1 break-all font-medium">
                {record.portfolio_url ?? "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Summary
            </CardTitle>
            <CardDescription>
              Extracted recruiting signal from the candidate CV.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <p className="text-sm leading-6 text-muted-foreground">
              {analysis?.cv_summary ?? "No AI summary available yet."}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Match score</p>
                <p
                  className={`mt-2 font-mono text-4xl font-semibold ${scoreTone(
                    analysis?.match_score ?? 0,
                  )}`}
                >
                  {analysis?.match_score ?? 0}%
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">ATS score</p>
                <p className="mt-2 font-mono text-4xl font-semibold">
                  {analysis?.ats_score ?? 0}%
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis?.extracted_skills.map((skill) => (
                <Badge key={skill} variant="muted">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm text-muted-foreground">
                {(analysis?.strengths ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-amber-300" />
                Weaknesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm text-muted-foreground">
                {(analysis?.weaknesses ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <aside className="grid gap-5 content-start">
        <Card>
          <CardHeader>
            <CardTitle>Recommendation</CardTitle>
            <CardDescription>AI decision support for recruiter review.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {analysis ? (
              <Badge className={recommendationClasses(analysis.recommendation)}>
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                {analysis.recommendation}
              </Badge>
            ) : null}
            <label className="grid gap-2 text-sm">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as CandidateStatus)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <Button onClick={updateStatus} disabled={isSaving}>
              {isSaving ? "Saving..." : "Update status"}
            </Button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Suggested Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
              {analysis?.suggested_email ?? "No suggested email available."}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {record.logs.map((log) => (
                <div key={log.id} className="rounded-md border bg-muted/20 p-3">
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{log.details}</p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {formatDate(log.created_at)}
                  </p>
                </div>
              ))}
              {!record.logs.length ? (
                <p className="text-sm text-muted-foreground">No logs yet.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
