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

export default async function AdminDashboardPage() {
  const [records, stats] = await Promise.all([
    getCandidateRecords(),
    getDashboardStats(),
  ]);
  const recentRecords = records.slice(0, 4);

  return (
    <main className="min-h-screen bg-background">
      <AppNav />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Admin dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">
              Recruitment Overview
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Review ranked applications, scoring quality, extracted skills, and
            automation-ready status changes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Total candidates"
            value={stats.totalCandidates}
            helper="Applications received"
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Shortlisted"
            value={stats.shortlistedCandidates}
            helper="Ready for next step"
            icon={<ShieldCheck className="h-5 w-5" />}
            tone="sky"
          />
          <MetricCard
            title="Rejected"
            value={stats.rejectedCandidates}
            helper="Closed applications"
            icon={<ClipboardList className="h-5 w-5" />}
            tone="rose"
          />
          <MetricCard
            title="Avg ATS"
            value={`${stats.averageAtsScore}%`}
            helper="CV quality score"
            icon={<Gauge className="h-5 w-5" />}
            tone="amber"
          />
          <MetricCard
            title="Avg match"
            value={`${stats.averageMatchScore}%`}
            helper="Fit against roles"
            icon={<BarChart3 className="h-5 w-5" />}
          />
        </div>

        <Charts records={records} />

        <Card>
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
