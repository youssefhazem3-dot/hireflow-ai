import OpenAI from "openai";

import { demoJobs } from "@/lib/demo-data";
import type { AnalysisPayload } from "@/lib/types";
import { clampScore } from "@/lib/utils";

let openaiClient: OpenAI | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

const knownSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "n8n",
  "OpenAI",
  "Docker",
  "REST APIs",
  "Git",
  "Python",
  "Automation",
  "Email",
];

function normalizeAnalysis(value: Partial<AnalysisPayload>): AnalysisPayload {
  const matchScore = clampScore(Number(value.match_score ?? 68));
  const atsScore = clampScore(Number(value.ats_score ?? 72));

  return {
    extracted_skills: Array.isArray(value.extracted_skills)
      ? value.extracted_skills.map(String)
      : [],
    experience_level: String(value.experience_level ?? "Not specified"),
    education_summary: String(value.education_summary ?? "Not specified"),
    cv_summary: String(
      value.cv_summary ??
        "Candidate profile was analyzed against the selected job description.",
    ).slice(0, 240),
    strengths: Array.isArray(value.strengths) ? value.strengths.map(String) : [],
    weaknesses: Array.isArray(value.weaknesses)
      ? value.weaknesses.map(String)
      : [],
    ats_score: atsScore,
    match_score: matchScore,
    recommendation:
      value.recommendation === "Shortlist" ||
      value.recommendation === "Review" ||
      value.recommendation === "Reject"
        ? value.recommendation
        : matchScore >= 80
          ? "Shortlist"
          : matchScore >= 60
            ? "Review"
            : "Reject",
    suggested_email: String(
      value.suggested_email ??
        "Hello,\n\nThank you for applying. Your application has been received and will be reviewed soon.\n\nBest regards,\nHireFlow AI Team",
    ),
  };
}

function demoAnalyzeCv(cvText: string, jobDescription: string): AnalysisPayload {
  const haystack = `${cvText} ${jobDescription}`.toLowerCase();
  const extractedSkills = knownSkills.filter((skill) =>
    haystack.includes(skill.toLowerCase()),
  );
  const job = demoJobs.find((item) => jobDescription.includes(item.title));
  const requiredSkills = job?.required_skills ?? extractedSkills.slice(0, 5);
  const matchedRequired = requiredSkills.filter((skill) =>
    haystack.includes(skill.toLowerCase()),
  );
  const matchScore = clampScore(58 + matchedRequired.length * 8 + extractedSkills.length);
  const atsScore = clampScore(
    64 +
      (cvText.toLowerCase().includes("experience") ? 8 : 0) +
      (cvText.toLowerCase().includes("education") ? 6 : 0) +
      (cvText.toLowerCase().includes("skills") ? 8 : 0) +
      Math.min(cvText.length / 400, 10),
  );

  return normalizeAnalysis({
    extracted_skills: extractedSkills.length
      ? extractedSkills
      : ["Communication", "Problem Solving"],
    experience_level: matchScore >= 82 ? "Mid-level" : "Junior to Mid-level",
    education_summary:
      cvText.toLowerCase().includes("computer")
        ? "Education section indicates a technical background."
        : "Education details need manual review.",
    cv_summary:
      "Candidate profile was scored with demo AI logic until OpenAI is connected.",
    strengths: [
      matchedRequired.length
        ? `Matches ${matchedRequired.length} required skill(s): ${matchedRequired.join(", ")}.`
        : "Shows transferable experience relevant to the role.",
      "Application includes contact and portfolio information.",
    ],
    weaknesses: [
      matchedRequired.length < requiredSkills.length
        ? "Some required skills were not clearly found in the CV text."
        : "Manual review should confirm project depth and team impact.",
    ],
    ats_score: atsScore,
    match_score: matchScore,
    recommendation:
      matchScore >= 80 ? "Shortlist" : matchScore >= 60 ? "Review" : "Reject",
    suggested_email:
      matchScore >= 80
        ? "Hello,\n\nThank you for applying. Your profile is a strong match, and we would like to move you to the next stage.\n\nBest regards,\nHireFlow AI Team"
        : "Hello,\n\nThank you for applying. Your application has been received and will be reviewed by our recruitment team.\n\nBest regards,\nHireFlow AI Team",
  });
}

export async function analyzeCv({
  cvText,
  jobDescription,
}: {
  cvText: string;
  jobDescription: string;
}): Promise<AnalysisPayload> {
  const client = getOpenAI();

  if (!client) {
    return demoAnalyzeCv(cvText, jobDescription);
  }

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an expert AI recruitment assistant. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Analyze this candidate CV against the provided job description.

Return valid JSON only with this structure:
{
  "extracted_skills": [],
  "experience_level": "",
  "education_summary": "",
  "cv_summary": "",
  "strengths": [],
  "weaknesses": [],
  "ats_score": 0,
  "match_score": 0,
  "recommendation": "Shortlist | Review | Reject",
  "suggested_email": ""
}

Rules:
- ats_score should measure CV structure, clarity, keywords, and readability.
- match_score should measure how well the candidate fits the job description.
- Keep cv_summary under 40 words.
- Strengths and weaknesses should be specific.
- suggested_email should be professional and human.

CV:
${cvText}

Job Description:
${jobDescription}`,
      },
    ],
  });

  const content = completion.choices[0]?.message.content;

  if (!content) {
    return demoAnalyzeCv(cvText, jobDescription);
  }

  try {
    return normalizeAnalysis(JSON.parse(content) as Partial<AnalysisPayload>);
  } catch {
    return demoAnalyzeCv(cvText, jobDescription);
  }
}
