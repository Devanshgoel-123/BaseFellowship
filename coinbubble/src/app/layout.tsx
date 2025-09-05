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
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'https://base-fellowship-bice.vercel.app',
    siteName: APP_NAME,
    images: [
      {
        url: 'https://base-fellowship-bice.vercel.app/api/opengraph-image',
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ['https://base-fellowship-bice.vercel.app/api/opengraph-image'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  height: 'device-height',
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
      <body className="h-screen overflow-hidden pb-16 md:pb-0">
        <ClientBackground />
        <div className="relative z-10 h-full">
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
