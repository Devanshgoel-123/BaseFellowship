import type { Metadata, Viewport } from 'next';
import { getSession } from '~/auth';
import '~/app/globals.css';
import { APP_NAME, APP_DESCRIPTION } from '~/lib/constants';
import { Providers } from './providers';
import { Montserrat } from 'next/font/google';
import { Rubik } from "next/font/google";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // choose the weights you need
});

const rubik = Rubik({
  subsets: ["latin"],  // choose character sets
  weight: ["400", "500", "700"], // choose weights you need
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  

  return (
    <html lang="en" className={`h-full ${montserrat.className} ${rubik.className}`}>
      <body className="min-h-screen">
        <ClientBackground />
        <div className="relative z-10">
          <Providers session={session}>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}

// Client component for the background image
function ClientBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <img 
        src="/assets/backgrounds/every.png" 
        alt="background"
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}
