import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireFlow AI",
  description:
    "AI-powered recruitment and CV automation platform built with Next.js, Supabase, OpenAI, and n8n.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
