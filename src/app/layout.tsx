import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { getLocale, getMessages } from 'next-intl/server'
import IntlProvider from '@/components/providers/IntlProvider'
import ToastProvider from '@/components/providers/ToastProvider'
import FeedbackButton from '@/components/FeedbackButton'
import CookieBanner from '@/components/CookieBanner'
import { getOrganizationSchema, getWebsiteSchema } from '@/lib/seo/schema'
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
  metadataBase: new URL('https://www.jobnachbar.com'),
  title: {
    default: 'JobNachbar - Jobs in Zeven und Umgebung',
    template: '%s | JobNachbar',
  },
  description: 'Die lokale Jobbörse für Zeven, Rotenburg und den Landkreis Rotenburg (Wümme). Finde Jobs in deiner Nähe oder qualifizierte Bewerber aus der Region.',
  keywords: [
    'Jobs Zeven',
    'Stellenangebote Rotenburg',
    'Arbeit Landkreis Rotenburg',
    'Jobs in der Nähe',
    'Lokale Jobbörse',
    'Regionale Stellenangebote',
    'Minijob Zeven',
    'Teilzeit Rotenburg',
    'JobNachbar',
  ],
  authors: [{ name: 'JobNachbar' }],
  creator: 'JobNachbar',
  publisher: 'JobNachbar',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JobNachbar',
  },
  formatDetection: {
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'JobNachbar - Jobs in Zeven und Umgebung',
    description: 'Die lokale Jobbörse für Zeven, Rotenburg und den Landkreis Rotenburg (Wümme).',
    url: 'https://www.jobnachbar.com',
    siteName: 'JobNachbar',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JobNachbar - Lokale Jobs in Zeven und Umgebung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobNachbar - Jobs in Zeven und Umgebung',
    description: 'Die lokale Jobbörse für Zeven, Rotenburg und den Landkreis Rotenburg (Wümme).',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon.svg' },
    ],
  },
  alternates: {
    canonical: 'https://www.jobnachbar.com',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getOrganizationSchema(), getWebsiteSchema()]),
          }}
        />
      </head>
      <body className={inter.className}>
        <IntlProvider locale={locale} messages={messages}>
          {children}
          <FeedbackButton />
          <CookieBanner />
          <ToastProvider />
        </IntlProvider>
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
