import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CelestialBackground } from '@/components/ui/CelestialBackground';

export const metadata: Metadata = {
  title: 'Kashmiri Pandit Digital Companion',
  description: 'Your trusted guide to Kashmiri Pandit traditions, festivals, rituals, and heritage — powered by the Kashmiri Pandit Panchang (Sapta Rishi Samvat).',
  keywords: 'Kashmiri Pandit, KP Panchang, Sapta Rishi Samvat, Herath, Navreh, KP festivals, Kashmir heritage',
};

// Without this, mobile browsers render the page at desktop width (zoomed-out & tiny).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Apply saved theme before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('kp-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}",
          }}
        />
      </head>
      <body className="kp-pattern-bg min-h-screen flex flex-col">
        <CelestialBackground />
        {/* Decorative saffron accent line at the very top */}
        <div className="h-1 w-full bg-gradient-to-r from-saffron-400 via-amber-400 to-saffron-600" />
        <Navbar />
        <ScrollProgress />
        <main className="flex-1 page-enter">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
