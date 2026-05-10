"use client";

import { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CandidateRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type ChartsProps = {
  records: CandidateRecord[];
};

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Charts({ records }: ChartsProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const statusData = Object.entries(
    records.reduce<Record<string, number>>((acc, record) => {
      acc[record.status] = (acc[record.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const positionData = Object.entries(
    records.reduce<Record<string, { total: number; count: number }>>((acc, record) => {
      const key = record.position;
      acc[key] = acc[key] ?? { total: 0, count: 0 };
      acc[key].total += record.analysis?.match_score ?? 0;
      acc[key].count += record.analysis ? 1 : 0;
      return acc;
    }, {}),
  ).map(([position, value]) => ({
    position,
    score: Math.round(value.total / Math.max(value.count, 1)),
  }));

  const skillsData = Object.entries(
    records.reduce<Record<string, number>>((acc, record) => {
      record.analysis?.extracted_skills.forEach((skill) => {
        acc[skill] = (acc[skill] ?? 0) + 1;
      });
      return acc;
    }, {}),
  )
    .sort((first, second) => second[1] - first[1])
    .slice(0, 6)
    .map(([skill, count]) => ({ skill, count }));

  const timelineData = Object.entries(
    records.reduce<Record<string, number>>((acc, record) => {
      const key = formatDate(record.created_at);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([date, applications]) => ({ date, applications }));

  if (!mounted) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        {[
          "Candidates by Status",
          "Average Score by Position",
          "Top Extracted Skills",
          "Applications Over Time",
        ].map((title) => (
          <Card key={title} className="interactive-card">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Loading chart data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 rounded-md border border-dashed bg-muted/20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle>Candidates by Status</CardTitle>
          <CardDescription>Pipeline distribution across active stages.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={62}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="interactive-card">
        <CardHeader>
          <CardTitle>Average Score by Position</CardTitle>
          <CardDescription>Mean match score grouped by role.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={positionData}
              layout="vertical"
              margin={{ left: 34, right: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <YAxis
                dataKey="position"
                type="category"
                width={142}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="score" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="interactive-card">
        <CardHeader>
          <CardTitle>Top Extracted Skills</CardTitle>
          <CardDescription>Most frequent AI-detected candidate skills.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillsData}
              layout="vertical"
              margin={{ left: 34, right: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fill: "var(--muted-foreground)" }} />
              <YAxis
                dataKey="skill"
                type="category"
                width={120}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="interactive-card">
        <CardHeader>
          <CardTitle>Applications Over Time</CardTitle>
          <CardDescription>Recent submission trend for the recruiting queue.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Area
                dataKey="applications"
                stroke="var(--chart-4)"
                fill="var(--chart-4)"
                fillOpacity={0.22}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
