export type CandidateStatus =
  | "Pending"
  | "Shortlisted"
  | "Interview"
  | "Rejected"
  | "Hired";

export type Recommendation = "Shortlist" | "Review" | "Reject";

export type Job = {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  experience_level: string;
  created_at: string;
};

export type Candidate = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  position: string;
  cv_file_url: string | null;
  status: CandidateStatus;
  created_at: string;
};

export type CandidateAnalysis = {
  id: number;
  candidate_id: number;
  job_id: number;
  extracted_skills: string[];
  experience_level: string;
  education_summary: string;
  cv_summary: string;
  strengths: string[];
  weaknesses: string[];
  ats_score: number;
  match_score: number;
  recommendation: Recommendation;
  suggested_email: string;
  created_at: string;
};

export type CandidateLog = {
  id: number;
  candidate_id: number;
  action: string;
  details: string;
  created_at: string;
};

export type CandidateRecord = Candidate & {
  analysis: CandidateAnalysis | null;
  logs: CandidateLog[];
};

export type DashboardStats = {
  totalCandidates: number;
  shortlistedCandidates: number;
  rejectedCandidates: number;
  averageAtsScore: number;
  averageMatchScore: number;
};

export type CandidateApplicationInput = {
  full_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  position: string;
  cv_file_url?: string;
  cv_text?: string;
};

export type AnalysisPayload = Omit<
  CandidateAnalysis,
  "id" | "candidate_id" | "job_id" | "created_at"
>;
