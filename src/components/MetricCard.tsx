import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string | number;
  helper: string;
  icon: ReactNode;
  tone?: "primary" | "amber" | "rose" | "sky";
};

const toneClasses = {
  primary: "bg-primary/10 text-primary ring-primary/20",
  amber: "bg-amber-500/10 text-amber-300 ring-amber-300/20",
  rose: "bg-rose-500/10 text-rose-300 ring-rose-300/20",
  sky: "bg-sky-500/10 text-sky-300 ring-sky-300/20",
};

export function MetricCard({
  title,
  value,
  helper,
  icon,
  tone = "primary",
}: MetricCardProps) {
  return (
    <Card className="interactive-card">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
          <div className="mt-4 h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("pulse-line h-full rounded-full", {
                "bg-primary": tone === "primary",
                "bg-amber-300": tone === "amber",
                "bg-rose-300": tone === "rose",
                "bg-sky-300": tone === "sky",
              })}
            />
          </div>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md ring-1",
            toneClasses[tone],
          )}
        >
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}
