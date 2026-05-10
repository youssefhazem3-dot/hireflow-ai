import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AppNav } from "@/components/AppNav";
import { CandidateDetailPanel } from "@/components/CandidateDetailPanel";
import { LocalCandidateDetailFallback } from "@/components/LocalCandidateDetailFallback";
import { getCandidateRecord } from "@/lib/candidates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CandidateDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CandidateDetailsPage({
  params,
}: CandidateDetailsPageProps) {
  const { id } = await params;
  const record = await getCandidateRecord(Number(id));

  return (
    <main className="animated-grid min-h-screen overflow-x-hidden bg-background">
      <AppNav />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/candidates"
          className="reveal-up inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:-translate-x-0.5 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to candidates
        </Link>
        {record ? (
          <CandidateDetailPanel record={record} />
        ) : (
          <LocalCandidateDetailFallback candidateId={Number(id)} />
        )}
      </section>
    </main>
  );
}
