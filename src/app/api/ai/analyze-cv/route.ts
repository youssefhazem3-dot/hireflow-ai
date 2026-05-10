import { NextResponse } from "next/server";

import { analyzeCv } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      cv_text?: string;
      job_description?: string;
    };

    if (!body.cv_text || !body.job_description) {
      return NextResponse.json(
        {
          success: false,
          message: "cv_text and job_description are required.",
        },
        { status: 400 },
      );
    }

    const analysis = await analyzeCv({
      cvText: body.cv_text,
      jobDescription: body.job_description,
    });

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Could not analyze CV.",
      },
      { status: 500 },
    );
  }
}
