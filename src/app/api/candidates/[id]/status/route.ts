import { NextResponse } from "next/server";

import { updateCandidateStatus } from "@/lib/candidates";
import type { CandidateStatus } from "@/lib/types";

const allowedStatuses: CandidateStatus[] = [
  "Pending",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Hired",
];

type StatusRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: StatusRouteContext) {
  try {
    const { id } = await params;
    const candidateId = Number(id);
    const body = (await request.json()) as { status?: CandidateStatus };
    const nextStatus = body.status;

    if (!Number.isFinite(candidateId) || !nextStatus || !allowedStatuses.includes(nextStatus)) {
      return NextResponse.json(
        { success: false, message: "Valid candidate ID and status are required." },
        { status: 400 },
      );
    }

    if (process.env.N8N_STATUS_WEBHOOK_URL) {
      const webhookResponse = await fetch(process.env.N8N_STATUS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          status: nextStatus,
        }),
      });

      if (!webhookResponse.ok) {
        return NextResponse.json(
          { success: false, message: "n8n status workflow failed." },
          { status: webhookResponse.status },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Status updated successfully.",
        source: "n8n",
      });
    }

    const result = await updateCandidateStatus(candidateId, nextStatus);

    return NextResponse.json({
      success: true,
      message: "Status updated successfully.",
      source: result.source,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Could not update status.",
      },
      { status: 500 },
    );
  }
}
