import { revalidatePath } from "next/cache";

import { analyzeCv } from "@/lib/ai";
import { demoCandidateRecords, demoJobs } from "@/lib/demo-data";
import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  AnalysisPayload,
  Candidate,
  CandidateAnalysis,
  CandidateApplicationInput,
  CandidateLog,
  CandidateRecord,
  CandidateStatus,
  DashboardStats,
  Job,
} from "@/lib/types";

const displayDemoIdOffset = 900000;

function isDisplayDemoCandidateId(candidateId: number) {
  return candidateId >= displayDemoIdOffset;
}

function fallbackRecords() {
  return withDisplayDemoRecords([]);
}

function toDisplayDemoRecord(record: CandidateRecord): CandidateRecord {
  const id = record.id + displayDemoIdOffset;

  return {
    ...record,
    id,
    source: "demo",
    read_only: true,
    analysis: record.analysis
      ? {
          ...record.analysis,
          id: record.analysis.id + displayDemoIdOffset,
          candidate_id: id,
        }
      : null,
    logs: record.logs.map((log) => ({
      ...log,
      id: log.id + displayDemoIdOffset,
      candidate_id: id,
    })),
  };
}

function withDisplayDemoRecords(records: CandidateRecord[]) {
  const existingEmails = new Set(
    records.map((record) => record.email.toLowerCase()),
  );
  const displayDemoRecords = demoCandidateRecords
    .filter((record) => !existingEmails.has(record.email.toLowerCase()))
    .map(toDisplayDemoRecord);

  return [
    ...records.map((record) => ({ ...record, source: "supabase" as const })),
    ...displayDemoRecords,
  ].sort(
    (first, second) =>
      new Date(second.created_at).getTime() - new Date(first.created_at).getTime(),
  );
}

export async function getJobs(): Promise<Job[]> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return demoJobs;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return demoJobs;
  }

  return data as Job[];
}

export async function getCandidateRecords(): Promise<CandidateRecord[]> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return fallbackRecords();
  }

  const { data: candidateData, error: candidateError } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (candidateError) {
    return fallbackRecords();
  }

  if (!candidateData?.length) {
    return withDisplayDemoRecords([]);
  }

  const candidates = candidateData as Candidate[];
  const candidateIds = candidates.map((candidate) => candidate.id);

  const [{ data: analysisData }, { data: logData }] = await Promise.all([
    supabase
      .from("candidate_analysis")
      .select("*")
      .in("candidate_id", candidateIds),
    supabase
      .from("candidate_logs")
      .select("*")
      .in("candidate_id", candidateIds)
      .order("created_at", { ascending: false }),
  ]);

  const analyses = (analysisData ?? []) as CandidateAnalysis[];
  const logs = (logData ?? []) as CandidateLog[];

  return withDisplayDemoRecords(
    candidates.map((candidate) => ({
      ...candidate,
      analysis:
        analyses.find((analysis) => analysis.candidate_id === candidate.id) ?? null,
      logs: logs.filter((log) => log.candidate_id === candidate.id),
    })),
  );
}

export async function getCandidateRecord(id: number) {
  const records = await getCandidateRecords();
  return records.find((record) => record.id === id) ?? null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const records = await getCandidateRecords();
  const recordsWithAnalysis = records.filter((record) => record.analysis);

  return {
    totalCandidates: records.length,
    shortlistedCandidates: records.filter(
      (record) => record.status === "Shortlisted" || record.status === "Interview",
    ).length,
    rejectedCandidates: records.filter((record) => record.status === "Rejected")
      .length,
    averageAtsScore: Math.round(
      recordsWithAnalysis.reduce(
        (total, record) => total + (record.analysis?.ats_score ?? 0),
        0,
      ) / Math.max(recordsWithAnalysis.length, 1),
    ),
    averageMatchScore: Math.round(
      recordsWithAnalysis.reduce(
        (total, record) => total + (record.analysis?.match_score ?? 0),
        0,
      ) / Math.max(recordsWithAnalysis.length, 1),
    ),
  };
}

export async function createCandidateApplication(input: CandidateApplicationInput) {
  const jobs = await getJobs();
  const job =
    jobs.find((item) => item.title === input.position) ??
    jobs.find((item) => item.title.includes(input.position)) ??
    jobs[0];

  const analysis = await analyzeCv({
    cvText:
      input.cv_text ||
      `${input.full_name} applied for ${input.position}. Portfolio: ${
        input.portfolio_url ?? "not provided"
      }.`,
    jobDescription: `${job.title}\n${job.description}\nRequired skills: ${job.required_skills.join(
      ", ",
    )}`,
  });

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    const candidateId = Math.floor(1000 + Date.now() / 1000);
    const createdAt = new Date().toISOString();

    return {
      candidate_id: candidateId,
      candidate: {
        id: candidateId,
        full_name: input.full_name,
        email: input.email,
        phone: input.phone || null,
        linkedin_url: input.linkedin_url || null,
        portfolio_url: input.portfolio_url || null,
        position: input.position,
        cv_file_url: input.cv_file_url || null,
        status: "Pending",
        created_at: createdAt,
        analysis: {
          id: candidateId,
          candidate_id: candidateId,
          job_id: job.id,
          ...analysis,
          created_at: createdAt,
        },
        logs: [
          {
            id: candidateId,
            candidate_id: candidateId,
            action: "Application Submitted",
            details: `Candidate applied for ${input.position}.`,
            created_at: createdAt,
          },
        ],
      } satisfies CandidateRecord,
      analysis,
      source: "demo",
    };
  }

  const { data: candidate, error: candidateError } = await supabase
    .from("candidates")
    .insert({
      full_name: input.full_name,
      email: input.email,
      phone: input.phone || null,
      linkedin_url: input.linkedin_url || null,
      portfolio_url: input.portfolio_url || null,
      position: input.position,
      cv_file_url: input.cv_file_url || null,
      status: "Pending",
    })
    .select("*")
    .single();

  if (candidateError || !candidate) {
    throw new Error(candidateError?.message ?? "Could not create candidate");
  }

  const savedCandidate = candidate as Candidate;

  const analysisPayload: AnalysisPayload & {
    candidate_id: number;
    job_id: number;
  } = {
    ...analysis,
    candidate_id: savedCandidate.id,
    job_id: job.id,
  };

  const { error: analysisError } = await supabase
    .from("candidate_analysis")
    .insert(analysisPayload);

  if (analysisError) {
    throw new Error(analysisError.message);
  }

  await supabase.from("candidate_logs").insert({
    candidate_id: savedCandidate.id,
    action: "Application Submitted",
    details: `Candidate applied for ${input.position}.`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/candidates/${savedCandidate.id}`);

  return {
    candidate_id: savedCandidate.id,
    candidate: null,
    analysis,
    source: "supabase",
  };
}

export async function updateCandidateStatus(
  candidateId: number,
  status: CandidateStatus,
) {
  if (isDisplayDemoCandidateId(candidateId)) {
    throw new Error("Portfolio demo candidates are read-only.");
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { success: true, source: "demo" };
  }

  const { error } = await supabase
    .from("candidates")
    .update({ status })
    .eq("id", candidateId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("candidate_logs").insert({
    candidate_id: candidateId,
    action: "Status Updated",
    details: `Candidate status changed to ${status}.`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/candidates/${candidateId}`);

  return { success: true, source: "supabase" };
}

function getCvStoragePath(cvFileUrl: string | null) {
  if (!cvFileUrl) {
    return null;
  }

  const marker = "/storage/v1/object/public/cvs/";
  const markerIndex = cvFileUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(cvFileUrl.slice(markerIndex + marker.length));
}

export async function deleteCandidate(candidateId: number) {
  if (isDisplayDemoCandidateId(candidateId)) {
    throw new Error("Portfolio demo candidates are read-only.");
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { success: true, source: "demo" };
  }

  const { data: candidate, error: readError } = await supabase
    .from("candidates")
    .select("id,cv_file_url")
    .eq("id", candidateId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (!candidate) {
    throw new Error("Candidate not found.");
  }

  const storagePath = getCvStoragePath(candidate.cv_file_url as string | null);

  if (storagePath) {
    await supabase.storage.from("cvs").remove([storagePath]);
  }

  const { error: deleteError } = await supabase
    .from("candidates")
    .delete()
    .eq("id", candidateId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/candidates/${candidateId}`);

  return { success: true, source: "supabase" };
}
