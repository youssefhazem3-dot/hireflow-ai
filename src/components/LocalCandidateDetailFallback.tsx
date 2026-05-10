"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import { CandidateDetailPanel } from "@/components/CandidateDetailPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLocalCandidatesSnapshot,
  getServerLocalCandidatesSnapshot,
  subscribeLocalCandidates,
} from "@/lib/local-candidates";

type LocalCandidateDetailFallbackProps = {
  candidateId: number;
};

export function LocalCandidateDetailFallback({
  candidateId,
}: LocalCandidateDetailFallbackProps) {
  const localRecords = useSyncExternalStore(
    subscribeLocalCandidates,
    getLocalCandidatesSnapshot,
    getServerLocalCandidatesSnapshot,
  );
  const record = useMemo(
    () =>
      localRecords.find((candidate) => candidate.id === candidateId) ?? null,
    [candidateId, localRecords],
  );

  if (!record) {
    return (
      <Card className="interactive-card reveal-up">
        <CardHeader>
          <CardTitle>Candidate not found</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <p>
            This candidate is not available in the demo records for this browser.
            Connect Supabase for shared persistent candidate history.
          </p>
          <Link
            href="/admin/candidates"
            className="button-glow w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            Back to candidates
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <CandidateDetailPanel record={record} />;
}
