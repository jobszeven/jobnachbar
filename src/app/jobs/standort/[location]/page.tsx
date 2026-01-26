import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Briefcase, Building2, ArrowRight, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { getLocationMetadata } from '@/lib/seo/metadata'
import { getBreadcrumbSchema, getLocalBusinessSchema } from '@/lib/seo/schema'

interface LocationInfo {
  name: string
  slug: string
  description: string
  population: string
  distance: string
}

const locations: Record<string, LocationInfo> = {
  zeven: {
    name: 'Zeven',
    slug: 'zeven',
    description: 'Zeven ist das Herz unserer Region und Sitz von JobNachbar. Hier findest du Jobs in Einzelhandel, Handwerk, Gastronomie und vielem mehr.',
    population: '~14.000',
    distance: '0 km',
  },
  'rotenburg-wuemme': {
    name: 'Rotenburg (Wümme)',
    slug: 'rotenburg-wuemme',
    description: 'Als Kreisstadt bietet Rotenburg (Wümme) vielfältige Jobmöglichkeiten in Verwaltung, Gesundheitswesen, Einzelhandel und Dienstleistungen.',
    population: '~22.000',
    distance: '15 km von Zeven',
  },
  bremervoerde: {
    name: 'Bremervörde',
    slug: 'bremervoerde',
    description: 'Bremervörde ist bekannt für seine lebendige Wirtschaft. Finde hier Jobs in Logistik, Produktion und lokalen Betrieben.',
    population: '~19.000',
    distance: '20 km von Zeven',
  },
  sittensen: {
    name: 'Sittensen',
    slug: 'sittensen',
    description: 'Die Gemeinde Sittensen bietet attraktive Arbeitsplätze in Handel, Handwerk und Dienstleistungen.',
    population: '~5.500',
    distance: '10 km von Zeven',
  },
  tarmstedt: {
    name: 'Tarmstedt',
    slug: 'tarmstedt',
    description: 'Tarmstedt und Umgebung bietet Jobs in Landwirtschaft, Handwerk und lokalen Unternehmen.',
    population: '~4.000',
    distance: '18 km von Zeven',
  },
  scheessel: {
    name: 'Scheeßel',
    slug: 'scheessel',
    description: 'Scheeßel ist bekannt für das Hurricane Festival, bietet aber auch ganzjährig attraktive Arbeitsplätze.',
    population: '~13.000',
    distance: '12 km von Zeven',
  },
  gnarrenburg: {
    name: 'Gnarrenburg',
    slug: 'gnarrenburg',
    description: 'Die Gemeinde Gnarrenburg bietet Arbeitsplätze in traditionellen Branchen und modernen Unternehmen.',
    population: '~4.500',
    distance: '25 km von Zeven',
  },
  sottrum: {
    name: 'Sottrum',
    slug: 'sottrum',
    description: 'Sottrum liegt zentral im Landkreis Rotenburg und bietet Jobs in verschiedenen Branchen wie Handwerk, Handel und Dienstleistungen.',
    population: '~6.500',
    distance: '20 km von Zeven',
  },
}

interface PageProps {
  params: Promise<{ location: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { location } = await params
  const locationInfo = locations[location]

  if (!locationInfo) {
    return { title: 'Nicht gefunden' }
  }

  return getLocationMetadata(locationInfo.name)
}

export function generateStaticParams() {
  return Object.keys(locations).map((location) => ({
    location,
  }))
}

export default async function LocationJobsPage({ params }: PageProps) {
  const { location } = await params
  const locationInfo = locations[location]

  if (!locationInfo) {
    notFound()
  }

  const supabase = await createClient()

  // Fetch jobs for this location
  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      employment_type,
      created_at,
      companies (
        name,
        logo_url
      )
    `)
    .eq('status', 'active')
    .ilike('location', `%${locationInfo.name}%`)
    .order('created_at', { ascending: false })
    .limit(20)

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://www.jobnachbar.com' },
    { name: 'Jobs', url: 'https://www.jobnachbar.com/jobs' },
    { name: `Jobs in ${locationInfo.name}`, url: `https://www.jobnachbar.com/jobs/standort/${location}` },
  ])

  const localBusinessSchema = getLocalBusinessSchema()

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, localBusinessSchema]),
        }}
      />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-lighter">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-brand-red mr-2" />
              <span className="text-brand-red text-sm font-medium">{locationInfo.distance}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Jobs in {locationInfo.name}
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {locationInfo.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-brand-red" />
                <span>Einwohner: {locationInfo.population}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-brand-red" />
                <span>{jobs?.length || 0} offene Stellen</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search Box */}
        <section className="py-8 px-4 border-b border-gray-800">
          <div className="max-w-4xl mx-auto">
            <form action="/jobs" method="GET" className="flex gap-4">
              <input type="hidden" name="location" value={locationInfo.name} />
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  placeholder={`Jobs in ${locationInfo.name} suchen...`}
                  className="input-field pl-12"
                />
              </div>
              <button type="submit" className="btn-primary">
                Suchen
              </button>
            </form>
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">
              Aktuelle Stellenangebote in {locationInfo.name}
            </h2>

            {jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const companyData = job.companies as unknown
                  const company = (Array.isArray(companyData) ? companyData[0] : companyData) as { name: string; logo_url?: string } | null
                  return (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="card block hover:border-brand-red/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          {company?.logo_url ? (
                            <img
                              src={company.logo_url}
                              alt={company.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-brand-red" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white group-hover:text-brand-red transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {company?.name || 'Unternehmen'} • {job.employment_type}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-brand-red group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="card text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Noch keine Jobs in {locationInfo.name}
                </h3>
                <p className="text-gray-400 mb-6">
                  Aktuell sind keine Stellen in {locationInfo.name} verfügbar.
                  Schau dir Jobs in anderen Orten an oder erstelle einen Job-Alert.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/jobs" className="btn-primary">
                    Alle Jobs anzeigen
                  </Link>
                  <Link href="/registrieren/bewerber" className="btn-secondary">
                    Job-Alert erstellen
                  </Link>
                </div>
              </div>
            )}

            {jobs && jobs.length > 0 && (
              <div className="text-center mt-8">
                <Link href="/jobs" className="btn-secondary inline-flex items-center">
                  Alle Jobs anzeigen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Other Locations */}
        <section className="py-12 px-4 bg-brand-dark-lighter">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">
              Jobs in anderen Orten
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(locations)
                .filter(([slug]) => slug !== location)
                .map(([slug, info]) => (
                  <Link
                    key={slug}
                    href={`/jobs/standort/${slug}`}
                    className="card text-center hover:border-brand-red/50 transition-colors"
                  >
                    <MapPin className="w-6 h-6 text-brand-red mx-auto mb-2" />
                    <h3 className="font-medium text-white">{info.name}</h3>
                    <p className="text-gray-500 text-sm">{info.distance}</p>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="card text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Als Arbeitgeber in {locationInfo.name}?
              </h2>
              <p className="text-gray-400 mb-6">
                Finden Sie qualifizierte Mitarbeiter aus der Region. Schalten Sie jetzt Ihre Stellenanzeige.
              </p>
              <Link href="/registrieren/arbeitgeber" className="btn-primary inline-flex items-center">
                Jetzt Stelle ausschreiben
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
