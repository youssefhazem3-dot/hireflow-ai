import { NextResponse } from "next/server";

import { deleteCandidate } from "@/lib/candidates";

type CandidateRouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: CandidateRouteContext) {
  try {
    const { id } = await params;
    const candidateId = Number(id);

    if (!Number.isFinite(candidateId)) {
      return NextResponse.json(
        { success: false, message: "Valid candidate ID is required." },
        { status: 400 },
      );
    }

    const result = await deleteCandidate(candidateId);

    return NextResponse.json({
      success: true,
      message: "Candidate deleted successfully.",
      source: result.source,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Could not delete candidate.",
      },
      { status: 500 },
    );
  }
}
