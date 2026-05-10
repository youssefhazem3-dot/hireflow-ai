"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpDown, Download, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getLocalCandidatesSnapshot,
  getServerLocalCandidatesSnapshot,
  subscribeLocalCandidates,
} from "@/lib/local-candidates";
import type { CandidateRecord, CandidateStatus } from "@/lib/types";
import { formatDate, scoreTone, statusClasses, toCsvValue } from "@/lib/utils";

type CandidateTableProps = {
  records: CandidateRecord[];
};

const statuses: Array<CandidateStatus | "All"> = [
  "All",
  "Pending",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Hired",
];

export function CandidateTable({ records }: CandidateTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CandidateStatus | "All">("All");
  const [position, setPosition] = useState("All");
  const [sortKey, setSortKey] = useState<"date" | "match">("match");
  const localRecords = useSyncExternalStore(
    subscribeLocalCandidates,
    getLocalCandidatesSnapshot,
    getServerLocalCandidatesSnapshot,
  );

  const allRecords = useMemo(() => {
    const recordIds = new Set(localRecords.map((record) => record.id));
    return [
      ...localRecords,
      ...records.filter((record) => !recordIds.has(record.id)),
    ];
  }, [localRecords, records]);

  const positions = useMemo(
    () => ["All", ...Array.from(new Set(allRecords.map((record) => record.position)))],
    [allRecords],
  );

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return allRecords
      .filter((record) => {
        const matchesQuery =
          record.full_name.toLowerCase().includes(normalizedQuery) ||
          record.email.toLowerCase().includes(normalizedQuery) ||
          record.analysis?.extracted_skills
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesStatus = status === "All" || record.status === status;
        const matchesPosition = position === "All" || record.position === position;

        return matchesQuery && matchesStatus && matchesPosition;
      })
      .sort((first, second) => {
        if (sortKey === "date") {
          return (
            new Date(second.created_at).getTime() -
            new Date(first.created_at).getTime()
          );
        }

        return (
          (second.analysis?.match_score ?? 0) - (first.analysis?.match_score ?? 0)
        );
      });
  }, [allRecords, position, query, sortKey, status]);

  function exportCsv() {
    const header = [
      "Candidate name",
      "Email",
      "Position",
      "Match score",
      "ATS score",
      "Status",
      "Experience level",
      "Skills",
      "Date submitted",
    ];
    const rows = filteredRecords.map((record) => [
      record.full_name,
      record.email,
      record.position,
      record.analysis?.match_score ?? "",
      record.analysis?.ats_score ?? "",
      record.status,
      record.analysis?.experience_level ?? "",
      record.analysis?.extracted_skills ?? [],
      formatDate(record.created_at),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => toCsvValue(value)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hireflow-candidates.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search candidates or skills"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as CandidateStatus | "All")
            }
            className="h-10 rounded-md border border-input bg-background/80 px-3 text-sm shadow-sm shadow-black/5 outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            className="h-10 rounded-md border border-input bg-background/80 px-3 text-sm shadow-sm shadow-black/5 outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {positions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setSortKey(sortKey === "match" ? "date" : "match")}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortKey === "match" ? "Match score" : "Newest"}
          </Button>
          <Button variant="secondary" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>ATS</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Date submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow
              key={record.id}
              className="transition-colors duration-200 hover:bg-primary/5"
            >
              <TableCell>
                <Link
                  href={`/admin/candidates/${record.id}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {record.full_name}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">{record.email}</p>
              </TableCell>
              <TableCell>{record.position}</TableCell>
              <TableCell>
                <span
                  className={`font-mono text-base font-semibold ${scoreTone(
                    record.analysis?.match_score ?? 0,
                  )}`}
                >
                  {record.analysis?.match_score ?? 0}%
                </span>
              </TableCell>
              <TableCell>
                <span className="font-mono text-base">
                  {record.analysis?.ats_score ?? 0}%
                </span>
              </TableCell>
              <TableCell>
                <Badge className={statusClasses(record.status)}>{record.status}</Badge>
              </TableCell>
              <TableCell>{record.analysis?.experience_level ?? "Review"}</TableCell>
              <TableCell>{formatDate(record.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!filteredRecords.length ? (
        <div className="rounded-lg border border-dashed bg-background/60 p-8 text-center text-sm text-muted-foreground backdrop-blur">
          No candidates match the current filters.
        </div>
      ) : null}
    </div>
  );
}
