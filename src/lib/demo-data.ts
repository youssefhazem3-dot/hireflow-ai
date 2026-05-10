import type {
  CandidateAnalysis,
  CandidateLog,
  CandidateRecord,
  CandidateStatus,
  Job,
} from "@/lib/types";

const now = new Date("2026-05-10T09:00:00.000Z");

function daysAgo(days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const demoJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    description:
      "Build accessible React and Next.js interfaces for a hiring automation product. Strong TypeScript, API integration, Tailwind CSS, component architecture, and testing experience required.",
    required_skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    experience_level: "Mid-level",
    created_at: daysAgo(12),
  },
  {
    id: 2,
    title: "Backend Engineer",
    description:
      "Own API design, PostgreSQL modeling, queue-based automation, Supabase integration, and secure workflow services for an AI recruiting platform.",
    required_skills: ["Node.js", "PostgreSQL", "Supabase", "APIs", "Docker"],
    experience_level: "Mid-level",
    created_at: daysAgo(9),
  },
  {
    id: 3,
    title: "AI Automation Specialist",
    description:
      "Design n8n workflows, prompt chains, OpenAI automations, document parsing, reporting, and email notification flows for recruiting operations.",
    required_skills: ["n8n", "OpenAI", "Prompt Engineering", "Automation", "Email"],
    experience_level: "Junior to Mid-level",
    created_at: daysAgo(6),
  },
];

const candidates = [
  {
    id: 1024,
    full_name: "Ahmed Ali",
    email: "ahmed@email.com",
    phone: "01000000000",
    linkedin_url: "https://linkedin.com/in/ahmed",
    portfolio_url: "https://ahmed.dev",
    position: "Frontend Developer",
    cv_file_url: "https://example.com/cvs/ahmed-ali.pdf",
    status: "Shortlisted" as CandidateStatus,
    created_at: daysAgo(1),
  },
  {
    id: 1025,
    full_name: "Mariam Hassan",
    email: "mariam@email.com",
    phone: "01020000000",
    linkedin_url: "https://linkedin.com/in/mariam",
    portfolio_url: "https://github.com/mariam",
    position: "AI Automation Specialist",
    cv_file_url: "https://example.com/cvs/mariam-hassan.pdf",
    status: "Interview" as CandidateStatus,
    created_at: daysAgo(2),
  },
  {
    id: 1026,
    full_name: "Omar Nabil",
    email: "omar@email.com",
    phone: "01030000000",
    linkedin_url: "https://linkedin.com/in/omar",
    portfolio_url: "https://github.com/omar",
    position: "Backend Engineer",
    cv_file_url: "https://example.com/cvs/omar-nabil.pdf",
    status: "Pending" as CandidateStatus,
    created_at: daysAgo(3),
  },
  {
    id: 1027,
    full_name: "Salma Youssef",
    email: "salma@email.com",
    phone: "01040000000",
    linkedin_url: "https://linkedin.com/in/salma",
    portfolio_url: "https://salma.design",
    position: "Frontend Developer",
    cv_file_url: "https://example.com/cvs/salma-youssef.pdf",
    status: "Rejected" as CandidateStatus,
    created_at: daysAgo(5),
  },
  {
    id: 1028,
    full_name: "Youssef Kamal",
    email: "youssef@email.com",
    phone: "01050000000",
    linkedin_url: "https://linkedin.com/in/youssef",
    portfolio_url: "https://github.com/youssef",
    position: "Backend Engineer",
    cv_file_url: "https://example.com/cvs/youssef-kamal.pdf",
    status: "Hired" as CandidateStatus,
    created_at: daysAgo(8),
  },
];

const analyses: CandidateAnalysis[] = [
  {
    id: 1,
    candidate_id: 1024,
    job_id: 1,
    extracted_skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    experience_level: "Mid-level",
    education_summary: "B.Sc. Computer Science with frontend specialization.",
    cv_summary:
      "Frontend developer with strong React, TypeScript, and dashboard delivery experience.",
    strengths: [
      "Strong match on React, Next.js, and TypeScript requirements.",
      "Portfolio includes production dashboards and API-heavy interfaces.",
      "Clear CV structure with measurable project outcomes.",
    ],
    weaknesses: [
      "Limited evidence of automated testing depth.",
      "Backend experience is mostly integration-focused.",
    ],
    ats_score: 91,
    match_score: 87,
    recommendation: "Shortlist",
    suggested_email:
      "Hello Ahmed,\n\nThank you for applying for the Frontend Developer role. Your experience with React, Next.js, and TypeScript is a strong match, and we would like to move you to the next stage.\n\nBest regards,\nHireFlow AI Team",
    created_at: daysAgo(1),
  },
  {
    id: 2,
    candidate_id: 1025,
    job_id: 3,
    extracted_skills: ["n8n", "OpenAI", "Automation", "Google Sheets", "SMTP"],
    experience_level: "Junior to Mid-level",
    education_summary: "Business information systems graduate with automation projects.",
    cv_summary:
      "Automation specialist experienced in n8n workflows, AI prompts, and reporting flows.",
    strengths: [
      "Direct n8n and OpenAI workflow experience.",
      "Relevant automated email and reporting portfolio.",
      "Good explanation of business process impact.",
    ],
    weaknesses: [
      "Less exposure to production monitoring.",
      "Needs deeper SQL examples for complex reporting.",
    ],
    ats_score: 84,
    match_score: 82,
    recommendation: "Shortlist",
    suggested_email:
      "Hello Mariam,\n\nThank you for applying. Your automation and n8n experience closely matches the role, and we would like to schedule an interview.\n\nBest regards,\nHireFlow AI Team",
    created_at: daysAgo(2),
  },
  {
    id: 3,
    candidate_id: 1026,
    job_id: 2,
    extracted_skills: ["Node.js", "PostgreSQL", "REST APIs", "Docker"],
    experience_level: "Mid-level",
    education_summary: "Software engineering graduate with backend bootcamp projects.",
    cv_summary:
      "Backend engineer with solid API and database skills, still building Supabase depth.",
    strengths: [
      "Strong API design and PostgreSQL project experience.",
      "Docker usage is visible across portfolio projects.",
    ],
    weaknesses: [
      "Supabase appears in one project only.",
      "Queue and automation experience is not yet clear.",
    ],
    ats_score: 78,
    match_score: 73,
    recommendation: "Review",
    suggested_email:
      "Hello Omar,\n\nThank you for applying. Your backend experience is relevant, and our team will review your application in more detail before confirming next steps.\n\nBest regards,\nHireFlow AI Team",
    created_at: daysAgo(3),
  },
  {
    id: 4,
    candidate_id: 1027,
    job_id: 1,
    extracted_skills: ["HTML", "CSS", "JavaScript", "Figma"],
    experience_level: "Junior",
    education_summary: "Design diploma with self-taught frontend projects.",
    cv_summary:
      "Junior frontend candidate with design strengths but limited Next.js experience.",
    strengths: [
      "Good visual design sense and clean portfolio.",
      "Solid HTML, CSS, and JavaScript foundation.",
    ],
    weaknesses: [
      "No production Next.js experience found.",
      "TypeScript and API integration examples are missing.",
    ],
    ats_score: 69,
    match_score: 54,
    recommendation: "Reject",
    suggested_email:
      "Hello Salma,\n\nThank you for your interest in the Frontend Developer role. After reviewing your application, we decided to move forward with candidates who more closely match the role requirements.\n\nBest regards,\nHireFlow AI Team",
    created_at: daysAgo(5),
  },
  {
    id: 5,
    candidate_id: 1028,
    job_id: 2,
    extracted_skills: ["Node.js", "PostgreSQL", "Supabase", "Docker", "Queues"],
    experience_level: "Senior",
    education_summary: "Computer engineering degree and cloud certification.",
    cv_summary:
      "Senior backend engineer with strong database, service design, and Supabase delivery.",
    strengths: [
      "Excellent match on Supabase, PostgreSQL, and API design.",
      "Clear production ownership and deployment experience.",
      "Strong evidence of secure backend patterns.",
    ],
    weaknesses: ["Limited explicit n8n workflow examples."],
    ats_score: 88,
    match_score: 92,
    recommendation: "Shortlist",
    suggested_email:
      "Hello Youssef,\n\nThank you for applying. Your backend and Supabase experience is an excellent fit, and we are happy to move you forward.\n\nBest regards,\nHireFlow AI Team",
    created_at: daysAgo(8),
  },
];

const logs: CandidateLog[] = [
  {
    id: 1,
    candidate_id: 1024,
    action: "AI Analysis",
    details: "Match score generated at 87%.",
    created_at: daysAgo(1),
  },
  {
    id: 2,
    candidate_id: 1024,
    action: "Status Updated",
    details: "Candidate moved from Pending to Shortlisted.",
    created_at: daysAgo(1),
  },
  {
    id: 3,
    candidate_id: 1025,
    action: "Status Updated",
    details: "Candidate moved to Interview.",
    created_at: daysAgo(1),
  },
  {
    id: 4,
    candidate_id: 1028,
    action: "Status Updated",
    details: "Candidate marked as Hired.",
    created_at: daysAgo(4),
  },
];

export const demoCandidateRecords: CandidateRecord[] = candidates.map((candidate) => ({
  ...candidate,
  analysis:
    analyses.find((analysis) => analysis.candidate_id === candidate.id) ?? null,
  logs: logs.filter((log) => log.candidate_id === candidate.id),
}));
