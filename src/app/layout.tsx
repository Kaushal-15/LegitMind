import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Sorts_Mill_Goudy } from 'next/font/google';

export const metadata: Metadata = {
  title: 'LegitMind MVP',
  description: 'Your AI-powered legal assistant.',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sortsMillGoudy = Sorts_Mill_Goudy({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-sorts-mill-goudy',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={`font-body antialiased ${inter.variable} ${sortsMillGoudy.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
