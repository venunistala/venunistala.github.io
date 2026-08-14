import type { Metadata } from "next";
import "./globals.css";

// Type faces are deliberately not chosen here. Phase 1 selects a display, body
// and mono family and states why each suits this subject; Phase 3 wires them
// in. Until then the page renders in the platform's own UI stack rather than
// inheriting a scaffold's default as if it were a decision.

export const metadata: Metadata = {
  title: "Venu Nistala",
  description: "SDET and test platform engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
