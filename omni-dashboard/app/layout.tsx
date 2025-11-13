import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omni-Dashboard | ScrollVerse OmniMap",
  description: "Real-time operational intelligence dashboard for ScrollVerse - Yield Flow Tracker, Security Health Map, and Deployment Status Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
