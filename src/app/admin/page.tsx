import {
  BarChart3,
  ClipboardList,
  Gauge,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AppNav } from "@/components/AppNav";
import { CandidateTable } from "@/components/CandidateTable";
import { Charts } from "@/components/Charts";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCandidateRecords, getDashboardStats } from "@/lib/candidates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [records, stats] = await Promise.all([
    getCandidateRecords(),
    getDashboardStats(),
  ]);
  const recentRecords = records.slice(0, 4);

  return (
    <main className="animated-grid min-h-screen overflow-x-hidden bg-background">
      <AppNav />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="reveal-up flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Admin dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Recruitment Overview
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Review ranked applications, scoring quality, extracted skills, and
            automation-ready status changes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              title: "Total candidates",
              value: stats.totalCandidates,
              helper: "Applications received",
              icon: <Users className="h-5 w-5" />,
              tone: "primary" as const,
            },
            {
              title: "Shortlisted",
              value: stats.shortlistedCandidates,
              helper: "Ready for next step",
              icon: <ShieldCheck className="h-5 w-5" />,
              tone: "sky" as const,
            },
            {
              title: "Rejected",
              value: stats.rejectedCandidates,
              helper: "Closed applications",
              icon: <ClipboardList className="h-5 w-5" />,
              tone: "rose" as const,
            },
            {
              title: "Avg ATS",
              value: `${stats.averageAtsScore}%`,
              helper: "CV quality score",
              icon: <Gauge className="h-5 w-5" />,
              tone: "amber" as const,
            },
            {
              title: "Avg match",
              value: `${stats.averageMatchScore}%`,
              helper: "Fit against roles",
              icon: <BarChart3 className="h-5 w-5" />,
              tone: "primary" as const,
            },
          ].map((metric, index) => (
            <div
              key={metric.title}
              className="reveal-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <MetricCard {...metric} />
            </div>
          ))}
        </div>

        <div className="reveal-up" style={{ animationDelay: "160ms" }}>
          <Charts records={records} />
        </div>

        <Card className="interactive-card reveal-up" style={{ animationDelay: "220ms" }}>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <CandidateTable records={recentRecords} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
