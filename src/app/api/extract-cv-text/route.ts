import { NextResponse } from "next/server";

import { extractPdfText } from "@/lib/pdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { cv_file_url?: string };

    if (!body.cv_file_url) {
      return NextResponse.json(
        { success: false, message: "cv_file_url is required." },
        { status: 400 },
      );
    }

    const response = await fetch(body.cv_file_url);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Could not download CV file." },
        { status: 400 },
      );
    }

    const cvText = await extractPdfText(await response.arrayBuffer());

    return NextResponse.json({
      success: true,
      cv_text: cvText,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Could not extract CV text.",
      },
      { status: 500 },
    );
  }
}
