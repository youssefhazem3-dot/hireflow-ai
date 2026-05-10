import { NextResponse } from "next/server";

import { createCandidateApplication } from "@/lib/candidates";
import { extractTextFromUpload } from "@/lib/pdf";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function uploadCv(file: File, email: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return `demo://${file.name}`;
  }

  const extension = file.name.split(".").pop() ?? "pdf";
  const safeEmail = email.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const path = `${safeEmail}/${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from("cvs").upload(path, buffer, {
    contentType: file.type || "application/pdf",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("cvs").getPublicUrl(path);
  return data.publicUrl;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fullName = getString(formData, "full_name");
    const email = getString(formData, "email");
    const phone = getString(formData, "phone");
    const linkedinUrl = getString(formData, "linkedin_url");
    const portfolioUrl = getString(formData, "portfolio_url");
    const position = getString(formData, "position");
    const cv = formData.get("cv");

    if (!fullName || !email || !position || !(cv instanceof File) || !cv.size) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, position, and CV file are required.",
        },
        { status: 400 },
      );
    }

    const [cvText, cvFileUrl] = await Promise.all([
      extractTextFromUpload(cv),
      uploadCv(cv, email),
    ]);

    const payload = {
      full_name: fullName,
      email,
      phone,
      linkedin_url: linkedinUrl,
      portfolio_url: portfolioUrl,
      position,
      cv_file_url: cvFileUrl,
      cv_text: cvText,
    };

    if (process.env.N8N_CANDIDATE_WEBHOOK_URL) {
      const webhookResponse = await fetch(process.env.N8N_CANDIDATE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const webhookPayload = (await webhookResponse
        .json()
        .catch(() => ({}))) as Record<string, unknown>;

      if (!webhookResponse.ok) {
        return NextResponse.json(
          {
            success: false,
            message:
              typeof webhookPayload.message === "string"
                ? webhookPayload.message
                : "n8n candidate workflow failed.",
          },
          { status: webhookResponse.status },
        );
      }

      return NextResponse.json({
        success: true,
        candidate_id:
          typeof webhookPayload.candidate_id === "number"
            ? webhookPayload.candidate_id
            : Math.floor(1000 + Date.now() / 1000),
        message: "Application submitted successfully",
        source: "n8n",
      });
    }

    const result = await createCandidateApplication(payload);

    return NextResponse.json({
      success: true,
      candidate_id: result.candidate_id,
      message: "Application submitted successfully",
      source: result.source,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Application submission failed.",
      },
      { status: 500 },
    );
  }
}
