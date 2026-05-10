import { AppNav } from "@/components/AppNav";
import { ApplicationForm } from "@/components/ApplicationForm";
import { getJobs } from "@/lib/candidates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ApplyPage() {
  const jobs = await getJobs();

  return (
    <main className="animated-grid min-h-screen overflow-x-hidden bg-background">
      <AppNav />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="reveal-up max-w-3xl">
          <p className="text-sm font-medium text-primary">Candidate intake</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            Apply for an open role
          </h1>
          <p className="mt-4 text-muted-foreground">
            Upload your CV and HireFlow AI will route your application into the
            recruitment pipeline.
          </p>
        </div>
        <div className="reveal-up min-w-0" style={{ animationDelay: "120ms" }}>
          <ApplicationForm jobs={jobs} />
        </div>
      </section>
    </main>
  );
}
