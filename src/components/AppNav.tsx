import Link from "next/link";
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  GitFork,
  LayoutDashboard,
  Send,
} from "lucide-react";

const navItems = [
  { href: "/apply", label: "Apply", icon: Send },
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/candidates", label: "Candidates", icon: FileText },
];

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold tracking-wide">HireFlow AI</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/your-username/hireflow-ai"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <GitFork className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Live Demo</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
