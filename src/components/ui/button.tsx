import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "button-glow bg-primary text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80",
        outline:
          "border bg-background/80 text-foreground shadow-sm shadow-black/5 backdrop-blur hover:border-primary/40 hover:bg-secondary hover:text-secondary-foreground",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        destructive:
          "button-glow bg-destructive text-destructive-foreground shadow-lg shadow-destructive/15 hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
