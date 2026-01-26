import type { Metadata } from 'next'

const SITE_URL = 'https://www.jobnachbar.com'
const SITE_NAME = 'JobNachbar'
const DEFAULT_DESCRIPTION =
  'Die lokale Jobbörse für Zeven, Rotenburg und Umgebung. Finde passende Jobs in deiner Nähe oder qualifizierte Bewerber aus der Region.'

export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} - Jobs in Zeven und Umgebung`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
      'Jobs Zeven',
      'Stellenangebote Rotenburg',
      'Arbeit Landkreis Rotenburg',
      'Jobs in der Nähe',
      'Lokale Jobbörse',
      'Regionale Stellenangebote',
      'Minijob Zeven',
      'Teilzeit Rotenburg',
      'Vollzeit Jobs Landkreis',
      'Arbeitgeber Zeven',
      'Bewerber Rotenburg',
      'JobNachbar',
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
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
      type: 'website',
      locale: 'de_DE',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} - Jobs in Zeven und Umgebung`,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'JobNachbar - Lokale Jobs in Zeven und Umgebung',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} - Jobs in Zeven und Umgebung`,
      description: DEFAULT_DESCRIPTION,
      images: [`${SITE_URL}/og-image.png`],
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        'de-DE': SITE_URL,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  }
}

export function getJobMetadata(job: {
  title: string
  company: string
  location: string
  description?: string
}): Metadata {
  const title = `${job.title} bei ${job.company} in ${job.location}`
  const description = job.description
    ? job.description.slice(0, 155) + '...'
    : `Jetzt bewerben: ${job.title} bei ${job.company} in ${job.location}. Lokale Jobs auf JobNachbar.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  }
}

export function getLocationMetadata(location: string): Metadata {
  const title = `Jobs in ${location} - Aktuelle Stellenangebote`
  const description = `Finde aktuelle Jobs und Stellenangebote in ${location} und Umgebung. Lokale Arbeitgeber suchen Mitarbeiter in deiner Nähe.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/jobs/standort/${location.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

export function getCategoryMetadata(category: string): Metadata {
  const title = `${category} Jobs - Stellenangebote in der Region`
  const description = `Aktuelle ${category} Stellenangebote in Zeven, Rotenburg und Umgebung. Jetzt bewerben und lokale Jobs finden.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}
