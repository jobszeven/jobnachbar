import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#E63946',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'JobNachbar - Jobs in deiner Nähe',
  description: 'Die lokale Jobbörse für Zeven, Rotenburg und Umgebung. Finde deinen Traumjob oder passende Bewerber – schnell, einfach und regional.',
  keywords: 'Jobs, Stellenanzeigen, Zeven, Rotenburg, Arbeit, Karriere, Bewerbung, regional, lokal',
  authors: [{ name: 'JobNachbar' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JobNachbar',
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: 'JobNachbar - Jobs in deiner Nähe',
    description: 'Die lokale Jobbörse für Zeven, Rotenburg und Umgebung.',
    url: 'https://jobnachbar.com',
    siteName: 'JobNachbar',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobNachbar - Jobs in deiner Nähe',
    description: 'Die lokale Jobbörse für Zeven, Rotenburg und Umgebung.',
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon.svg' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
