import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { AppNav } from "@/components/AppNav";

type SuccessPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ApplicationSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { id } = await searchParams;

  return (
    <main className="min-h-screen bg-background">
      <AppNav />
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full rounded-lg border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-6 text-3xl font-semibold tracking-normal">
            Your application has been submitted successfully.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Application ID:{" "}
            <span className="font-mono text-foreground">#{id ?? "Demo"}</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/apply"
              className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Submit another
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
