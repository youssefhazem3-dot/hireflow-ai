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
  primary: "bg-primary/10 text-primary",
  amber: "bg-amber-500/10 text-amber-300",
  rose: "bg-rose-500/10 text-rose-300",
  sky: "bg-sky-500/10 text-sky-300",
};

export function MetricCard({
  title,
  value,
  helper,
  icon,
  tone = "primary",
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md",
            toneClasses[tone],
          )}
        >
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}
