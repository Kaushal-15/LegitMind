import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'LegitMind MVP',
  description: 'Your AI-powered legal assistant.',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@6..72,400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-body antialiased ${inter.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

    