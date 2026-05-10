import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase";
import type { CandidateRecord, CandidateStatus, Recommendation } from "@/lib/types";

export const runtime = "nodejs";

const statuses = new Set<CandidateStatus>([
  "Pending",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Hired",
]);

const recommendations = new Set<Recommendation>(["Shortlist", "Review", "Reject"]);

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

function asNullableString(value: unknown) {
  const text = asString(value);
  return text ? text : null;
}

function asDate(value: unknown) {
  const text = asString(value);
  const date = text ? new Date(text) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function asStatus(value: unknown) {
  return typeof value === "string" && statuses.has(value as CandidateStatus)
    ? (value as CandidateStatus)
    : "Pending";
}

function asRecommendation(value: unknown) {
  return typeof value === "string" && recommendations.has(value as Recommendation)
    ? (value as Recommendation)
    : "Review";
}

async function findJobId(position: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("jobs")
    .select("id")
    .eq("title", position)
    .maybeSingle();

  return typeof data?.id === "number" ? data.id : null;
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        message: "Supabase is not configured, so local records cannot be imported.",
      },
      { status: 400 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    records?: CandidateRecord[];
  };
  const records = Array.isArray(body.records) ? body.records.slice(0, 50) : [];

  if (!records.length) {
    return NextResponse.json(
      { success: false, message: "No local candidate records were provided." },
      { status: 400 },
    );
  }

  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const fullName = asString(record.full_name);
    const email = asString(record.email).toLowerCase();
    const position = asString(record.position);
    const createdAt = asDate(record.created_at);

    if (!fullName || !email || !position) {
      skipped += 1;
      continue;
    }

    const { data: existingCandidate } = await supabase
      .from("candidates")
      .select("id")
      .eq("email", email)
      .eq("position", position)
      .eq("created_at", createdAt)
      .maybeSingle();

    if (existingCandidate?.id) {
      skipped += 1;
      continue;
    }

    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .insert({
        full_name: fullName,
        email,
        phone: asNullableString(record.phone),
        linkedin_url: asNullableString(record.linkedin_url),
        portfolio_url: asNullableString(record.portfolio_url),
        position,
        cv_file_url: asNullableString(record.cv_file_url),
        status: asStatus(record.status),
        created_at: createdAt,
      })
      .select("id")
      .single();

    if (candidateError || !candidate?.id) {
      skipped += 1;
      continue;
    }

    const candidateId = candidate.id as number;

    if (record.analysis) {
      await supabase.from("candidate_analysis").insert({
        candidate_id: candidateId,
        job_id: await findJobId(position),
        extracted_skills: asStringArray(record.analysis.extracted_skills),
        experience_level: asString(record.analysis.experience_level, "Review"),
        education_summary: asString(record.analysis.education_summary),
        cv_summary: asString(record.analysis.cv_summary),
        strengths: asStringArray(record.analysis.strengths),
        weaknesses: asStringArray(record.analysis.weaknesses),
        ats_score: asNumber(record.analysis.ats_score, 0),
        match_score: asNumber(record.analysis.match_score, 0),
        recommendation: asRecommendation(record.analysis.recommendation),
        suggested_email: asString(record.analysis.suggested_email),
        created_at: asDate(record.analysis.created_at),
      });
    }

    const recordLogs = Array.isArray(record.logs) ? record.logs : [];
    const logs = recordLogs.length
      ? recordLogs.map((log) => ({
          candidate_id: candidateId,
          action: asString(log.action, "Imported Local Record"),
          details: asString(log.details, "Imported from browser demo storage."),
          created_at: asDate(log.created_at),
        }))
      : [
          {
            candidate_id: candidateId,
            action: "Imported Local Record",
            details: "Imported from browser demo storage.",
            created_at: new Date().toISOString(),
          },
        ];

    await supabase.from("candidate_logs").insert(logs);
    imported += 1;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/candidates");

  return NextResponse.json({
    success: true,
    imported,
    skipped,
    message: `Imported ${imported} local candidate record(s).`,
  });
}
