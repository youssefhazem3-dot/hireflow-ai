import { AppNav } from "@/components/AppNav";
import { ApplicationForm } from "@/components/ApplicationForm";
import { getJobs } from "@/lib/candidates";

export default async function ApplyPage() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-background">
      <AppNav />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Candidate intake</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Apply for an open role
          </h1>
          <p className="mt-4 text-muted-foreground">
            Upload your CV and HireFlow AI will route your application into the
            recruitment pipeline.
          </p>
        </div>
        <ApplicationForm jobs={jobs} />
      </section>
    </main>
  );
}
