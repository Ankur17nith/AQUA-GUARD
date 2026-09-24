import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ClientProviders } from '@/components/providers/ClientProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AQUA//GUARD | Climate Risk Intelligence, Digital Twin & Action Platform',
  description: 'AI-powered environmental decision intelligence combining real-world Conduit@Empathy observations, satellite telemetry, and physical simulation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <ClientProviders>
          <Navbar />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto min-w-0 bg-slate-950 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
