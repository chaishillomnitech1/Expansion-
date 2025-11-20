import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Omni-Dashboard | Omnitech1 Real-Time Status',
  description: 'Real-time status reporting for the ScrollVerse Network with Zakat Flow metrics, compound stability monitoring, and OmniTensor AI governance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
