import { AppNav } from "@/components/AppNav";
import { CandidateTable } from "@/components/CandidateTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCandidateRecords } from "@/lib/candidates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CandidatesPage() {
  const records = await getCandidateRecords();

  return (
    <main className="animated-grid min-h-screen overflow-x-hidden bg-background">
      <AppNav />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="reveal-up">
          <p className="text-sm font-medium text-primary">Candidate table</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            Applications
          </h1>
        </div>
        <Card className="interactive-card reveal-up" style={{ animationDelay: "120ms" }}>
          <CardHeader>
            <CardTitle>Ranked Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <CandidateTable records={records} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
