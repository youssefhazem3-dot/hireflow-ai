import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AppNav } from "@/components/AppNav";
import { CandidateDetailPanel } from "@/components/CandidateDetailPanel";
import { LocalCandidateDetailFallback } from "@/components/LocalCandidateDetailFallback";
import { getCandidateRecord } from "@/lib/candidates";

type CandidateDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CandidateDetailsPage({
  params,
}: CandidateDetailsPageProps) {
  const { id } = await params;
  const record = await getCandidateRecord(Number(id));

  return (
    <main className="min-h-screen bg-background">
      <AppNav />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/candidates"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
