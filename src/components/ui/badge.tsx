import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "muted";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variant === "default" &&
          "border-primary/30 bg-primary/10 text-primary",
        variant === "outline" && "border-border bg-transparent text-foreground",
        variant === "muted" && "border-border bg-muted text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
