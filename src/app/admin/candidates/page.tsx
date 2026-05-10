import { AppNav } from "@/components/AppNav";
import { CandidateTable } from "@/components/CandidateTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCandidateRecords } from "@/lib/candidates";

export default async function CandidatesPage() {
  const records = await getCandidateRecords();

  return (
    <main className="min-h-screen bg-background">
      <AppNav />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-primary">Candidate table</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Applications
          </h1>
        </div>
        <Card>
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
