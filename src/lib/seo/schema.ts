const SITE_URL = 'https://www.jobnachbar.com'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JobNachbar',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Die lokale Jobbörse für Zeven, Rotenburg und den Landkreis Rotenburg (Wümme).',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zeven',
      addressRegion: 'Niedersachsen',
      addressCountry: 'DE',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 53.2975,
        longitude: 9.2744,
      },
      geoRadius: '30000',
    },
    sameAs: [],
  }
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'JobNachbar',
    url: SITE_URL,
    description: 'Lokale Jobbörse für Zeven und Umgebung',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zeven',
      postalCode: '27404',
      addressRegion: 'Niedersachsen',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.2975,
      longitude: 9.2744,
    },
    areaServed: [
      { '@type': 'City', name: 'Zeven' },
      { '@type': 'City', name: 'Rotenburg (Wümme)' },
      { '@type': 'City', name: 'Bremervörde' },
      { '@type': 'City', name: 'Sittensen' },
      { '@type': 'City', name: 'Tarmstedt' },
      { '@type': 'City', name: 'Scheeßel' },
      { '@type': 'City', name: 'Gnarrenburg' },
    ],
    priceRange: '€-€€',
  }
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JobNachbar',
    url: SITE_URL,
    description: 'Die lokale Jobbörse für Zeven, Rotenburg und Umgebung',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/jobs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

interface JobPostingData {
  id: string
  title: string
  description: string
  company: string
  location: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY' | 'CONTRACTOR' | 'INTERN'
  salary?: {
    min?: number
    max?: number
    currency?: string
    period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
  }
  datePosted: string
  validThrough?: string
}

export function getJobPostingSchema(job: JobPostingData) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'JobNachbar',
      value: job.id,
    },
    datePosted: job.datePosted,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressRegion: 'Niedersachsen',
        addressCountry: 'DE',
      },
    },
    employmentType: job.employmentType,
  }

  if (job.validThrough) {
    schema.validThrough = job.validThrough
  }

  if (job.salary) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency || 'EUR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: job.salary.period || 'MONTH',
      },
    }
  }

  return schema
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
