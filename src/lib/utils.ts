import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { CandidateStatus, Recommendation } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-300";
  if (score >= 60) return "text-amber-300";
  return "text-rose-300";
}

export function statusClasses(status: CandidateStatus) {
  const variants: Record<CandidateStatus, string> = {
    Pending: "border-slate-500/40 bg-slate-500/10 text-slate-200",
    Shortlisted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    Interview: "border-sky-500/40 bg-sky-500/10 text-sky-200",
    Rejected: "border-rose-500/40 bg-rose-500/10 text-rose-200",
    Hired: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  };

  return variants[status];
}

export function recommendationClasses(recommendation: Recommendation) {
  const variants: Record<Recommendation, string> = {
    Shortlist: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    Review: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    Reject: "border-rose-500/40 bg-rose-500/10 text-rose-200",
  };

  return variants[recommendation];
}

export function toCsvValue(value: string | number | string[] | null | undefined) {
  const raw = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${raw.replaceAll('"', '""')}"`;
}
