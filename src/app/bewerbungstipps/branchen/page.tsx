'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Wrench, Heart, UtensilsCrossed, ShoppingBag,
  Truck, Factory, Briefcase, Monitor, HardHat, Tractor, GraduationCap,
  ChevronDown, ChevronUp, MapPin, Users, TrendingUp, Euro
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface IndustryInfo {
  id: string
  name: string
  icon: React.ElementType
  color: string
  description: string
  avgSalary: string
  demandLevel: 'high' | 'medium' | 'low'
  typicalJobs: string[]
  requirements: string[]
  outlook: string
  localInfo: string
}

const industries: IndustryInfo[] = [
  {
    id: 'handwerk',
    name: 'Handwerk',
    icon: Wrench,
    color: 'text-orange-400',
    description: 'Das Handwerk ist das Rückgrat der Region. Von Tischlereien über Kfz-Werkstätten bis zu Elektrikern - die Nachfrage nach qualifizierten Fachkräften ist hoch.',
    avgSalary: '2.400 - 3.500€',
    demandLevel: 'high',
    typicalJobs: ['Kfz-Mechatroniker/in', 'Tischler/in', 'Elektriker/in', 'Dachdecker/in', 'Maler/in', 'Installateur/in'],
    requirements: ['Abgeschlossene Ausbildung', 'Handwerkliches Geschick', 'Führerschein oft erforderlich'],
    outlook: 'Sehr gute Perspektiven aufgrund des Fachkräftemangels. Viele Betriebe suchen dringend Nachwuchs.',
    localInfo: 'Im Landkreis Rotenburg gibt es über 2.000 Handwerksbetriebe mit mehr als 15.000 Beschäftigten.'
  },
  {
    id: 'pflege_gesundheit',
    name: 'Pflege & Gesundheit',
    icon: Heart,
    color: 'text-pink-400',
    description: 'Der Gesundheitssektor wächst stetig. Krankenhäuser, Pflegeheime und ambulante Dienste suchen permanent qualifiziertes Personal.',
    avgSalary: '2.500 - 3.800€',
    demandLevel: 'high',
    typicalJobs: ['Pflegefachkraft', 'Krankenpfleger/in', 'Altenpfleger/in', 'Medizinische Fachangestellte', 'Physiotherapeut/in'],
    requirements: ['Staatlich anerkannte Ausbildung', 'Empathie und Belastbarkeit', 'Schichtbereitschaft'],
    outlook: 'Langfristig sichere Branche mit wachsendem Bedarf durch den demografischen Wandel.',
    localInfo: 'Das AGAPLESION Diakonieklinikum Rotenburg und zahlreiche Pflegeeinrichtungen bieten viele Arbeitsplätze.'
  },
  {
    id: 'gastro_hotel',
    name: 'Gastronomie & Hotel',
    icon: UtensilsCrossed,
    color: 'text-yellow-400',
    description: 'Restaurants, Hotels und Catering-Unternehmen bieten vielfältige Einstiegsmöglichkeiten - auch ohne formale Ausbildung.',
    avgSalary: '2.000 - 2.800€',
    demandLevel: 'high',
    typicalJobs: ['Koch/Köchin', 'Servicekraft', 'Hotelfachmann/-frau', 'Küchenhilfe', 'Restaurantleitung'],
    requirements: ['Je nach Position Ausbildung oder Erfahrung', 'Flexibilität bei Arbeitszeiten', 'Teamfähigkeit'],
    outlook: 'Hohe Nachfrage, besonders in der Sommersaison. Viele Betriebe bieten Quereinsteigern Chancen.',
    localInfo: 'Die Gastronomie in Zeven und Umgebung profitiert von Touristen und lokaler Kundschaft.'
  },
  {
    id: 'einzelhandel',
    name: 'Einzelhandel',
    icon: ShoppingBag,
    color: 'text-purple-400',
    description: 'Der lokale Einzelhandel bleibt ein wichtiger Arbeitgeber. Supermärkte, Fachgeschäfte und Baumärkte suchen regelmäßig Mitarbeiter.',
    avgSalary: '2.000 - 2.600€',
    demandLevel: 'medium',
    typicalJobs: ['Verkäufer/in', 'Kassierer/in', 'Filialleitung', 'Lagerist/in', 'Einzelhandelskaufmann/-frau'],
    requirements: ['Kundenorientierung', 'Flexibilität', 'Oft Samstagsarbeit'],
    outlook: 'Stabile Nachfrage, besonders für Teilzeitkräfte und Minijobber.',
    localInfo: 'Das Gewerbegebiet in Zeven bietet zahlreiche Einkaufsmöglichkeiten und damit Arbeitsplätze.'
  },
  {
    id: 'logistik_transport',
    name: 'Logistik & Transport',
    icon: Truck,
    color: 'text-blue-400',
    description: 'Die zentrale Lage zwischen Hamburg und Bremen macht die Region zu einem Logistik-Standort mit wachsender Bedeutung.',
    avgSalary: '2.400 - 3.200€',
    demandLevel: 'high',
    typicalJobs: ['Lkw-Fahrer/in', 'Lagerlogistiker/in', 'Speditionskaufmann/-frau', 'Staplerfahrer/in', 'Kommissionierer/in'],
    requirements: ['Führerschein (CE für Lkw)', 'Körperliche Fitness', 'Zuverlässigkeit'],
    outlook: 'Wachsende Branche mit gutem Bedarf an Fahrern und Lagerpersonal.',
    localInfo: 'Mehrere Speditionen und Logistikunternehmen sind in der Region ansässig.'
  },
  {
    id: 'industrie_produktion',
    name: 'Industrie & Produktion',
    icon: Factory,
    color: 'text-gray-400',
    description: 'Produzierende Unternehmen in der Region bieten sichere Arbeitsplätze mit guter Bezahlung.',
    avgSalary: '2.600 - 3.600€',
    demandLevel: 'medium',
    typicalJobs: ['Produktionsmitarbeiter/in', 'Maschinen- und Anlagenführer/in', 'Industriemechaniker/in', 'Qualitätsprüfer/in'],
    requirements: ['Technisches Verständnis', 'Schichtbereitschaft', 'Genauigkeit'],
    outlook: 'Solide Perspektiven mit Automatisierungstrend, der neue Qualifikationen erfordert.',
    localInfo: 'Mehrere mittelständische Produktionsunternehmen bieten Arbeitsplätze in der Region.'
  },
  {
    id: 'buero_verwaltung',
    name: 'Büro & Verwaltung',
    icon: Briefcase,
    color: 'text-emerald-400',
    description: 'Kaufmännische Berufe in Verwaltung, Buchhaltung und Organisation sind gefragt.',
    avgSalary: '2.400 - 3.400€',
    demandLevel: 'medium',
    typicalJobs: ['Bürokaufmann/-frau', 'Buchhalter/in', 'Sachbearbeiter/in', 'Sekretär/in', 'Personalreferent/in'],
    requirements: ['Kaufmännische Ausbildung', 'EDV-Kenntnisse', 'Organisationstalent'],
    outlook: 'Stabile Nachfrage mit zunehmender Digitalisierung der Arbeitsprozesse.',
    localInfo: 'Die Kreisverwaltung in Rotenburg und lokale Unternehmen bieten vielfältige Bürojobs.'
  },
  {
    id: 'it_technik',
    name: 'IT & Technik',
    icon: Monitor,
    color: 'text-cyan-400',
    description: 'Auch in ländlichen Regionen wächst die Nachfrage nach IT-Fachkräften kontinuierlich.',
    avgSalary: '3.200 - 5.000€',
    demandLevel: 'high',
    typicalJobs: ['IT-Systemadministrator/in', 'Softwareentwickler/in', 'IT-Support', 'Webentwickler/in'],
    requirements: ['IT-Ausbildung oder Studium', 'Aktuelle Technologie-Kenntnisse', 'Problemlösungskompetenz'],
    outlook: 'Sehr gute Zukunftsperspektiven mit steigendem Bedarf in allen Branchen.',
    localInfo: 'Remote-Arbeit ermöglicht auch Jobs bei Arbeitgebern außerhalb der Region.'
  },
  {
    id: 'bau_architektur',
    name: 'Bau & Architektur',
    icon: HardHat,
    color: 'text-amber-400',
    description: 'Die Baubranche boomt - sowohl im Neubau als auch bei Sanierungen ist viel zu tun.',
    avgSalary: '2.600 - 4.000€',
    demandLevel: 'high',
    typicalJobs: ['Maurer/in', 'Zimmermann/-frau', 'Bauingenieur/in', 'Bauleiter/in', 'Fliesenleger/in'],
    requirements: ['Handwerkliche Ausbildung', 'Körperliche Belastbarkeit', 'Witterungsunabhängigkeit'],
    outlook: 'Anhaltend hohe Nachfrage durch Neubau und energetische Sanierungen.',
    localInfo: 'Viele lokale Bauunternehmen suchen permanent Fachkräfte.'
  },
  {
    id: 'landwirtschaft',
    name: 'Landwirtschaft',
    icon: Tractor,
    color: 'text-green-400',
    description: 'Die Landwirtschaft prägt die Region und bietet vielfältige Arbeitsplätze.',
    avgSalary: '2.200 - 2.800€',
    demandLevel: 'medium',
    typicalJobs: ['Landwirt/in', 'Tierwirt/in', 'Landmaschinenmechaniker/in', 'Erntehelfer/in'],
    requirements: ['Landwirtschaftliche Ausbildung von Vorteil', 'Führerschein', 'Flexibilität'],
    outlook: 'Stabile Branche mit Modernisierung und Spezialisierung.',
    localInfo: 'Der Landkreis Rotenburg ist stark landwirtschaftlich geprägt.'
  },
  {
    id: 'bildung_soziales',
    name: 'Bildung & Soziales',
    icon: GraduationCap,
    color: 'text-indigo-400',
    description: 'Schulen, Kindergärten und soziale Einrichtungen suchen engagierte Mitarbeiter.',
    avgSalary: '2.800 - 4.200€',
    demandLevel: 'high',
    typicalJobs: ['Erzieher/in', 'Sozialarbeiter/in', 'Lehrer/in', 'Sozialpädagoge/in', 'Heilerziehungspfleger/in'],
    requirements: ['Pädagogische Ausbildung', 'Geduld und Empathie', 'Erweitertes Führungszeugnis'],
    outlook: 'Sehr gute Perspektiven durch Ausbau der Kinderbetreuung und Ganztagsschulen.',
    localInfo: 'Mehrere Schulen und Kindertagesstätten in der Region suchen Personal.'
  }
]

const demandLabels = {
  high: { text: 'Sehr gefragt', color: 'text-green-400 bg-green-400/10' },
  medium: { text: 'Gefragt', color: 'text-yellow-400 bg-yellow-400/10' },
  low: { text: 'Moderat', color: 'text-gray-400 bg-gray-400/10' }
}

export default function BranchenPage() {
  const [expandedIndustry, setExpandedIndustry] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-lighter">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/bewerbungstipps" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu Bewerbungstipps
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Branchen im Landkreis Rotenburg
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Entdecke die wichtigsten Branchen in unserer Region, typische Berufe,
              Gehaltsaussichten und lokale Besonderheiten.
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-8 px-4 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <MapPin className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">30 km</p>
                <p className="text-sm text-gray-400">Suchradius</p>
              </div>
              <div className="card text-center">
                <Users className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">~165.000</p>
                <p className="text-sm text-gray-400">Einwohner</p>
              </div>
              <div className="card text-center">
                <TrendingUp className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">11</p>
                <p className="text-sm text-gray-400">Branchen</p>
              </div>
              <div className="card text-center">
                <Euro className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">~2.800€</p>
                <p className="text-sm text-gray-400">Durchschnitt</p>
              </div>
            </div>
          </div>
        </section>

        {/* Industries List */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {industries.map((industry) => {
              const Icon = industry.icon
              const isExpanded = expandedIndustry === industry.id
              const demand = demandLabels[industry.demandLevel]

              return (
                <div key={industry.id} className="card overflow-hidden">
                  {/* Header - Always visible */}
                  <button
                    onClick={() => setExpandedIndustry(isExpanded ? null : industry.id)}
                    className="w-full flex items-center gap-4 p-2 text-left"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gray-800`}>
                      <Icon className={`w-6 h-6 ${industry.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-white">{industry.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${demand.color}`}>
                          {demand.text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Gehalt: {industry.avgSalary} brutto/Monat
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-2 pb-2 pt-4 border-t border-gray-700 mt-4">
                      <p className="text-gray-300 mb-6">{industry.description}</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Typical Jobs */}
                        <div>
                          <h4 className="text-white font-medium mb-3">Typische Berufe</h4>
                          <ul className="space-y-2">
                            {industry.typicalJobs.map((job) => (
                              <li key={job} className="flex items-center text-gray-400">
                                <ArrowRight className="w-4 h-4 text-brand-red mr-2 flex-shrink-0" />
                                {job}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="text-white font-medium mb-3">Anforderungen</h4>
                          <ul className="space-y-2">
                            {industry.requirements.map((req) => (
                              <li key={req} className="flex items-center text-gray-400">
                                <ArrowRight className="w-4 h-4 text-brand-red mr-2 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Outlook & Local Info */}
                      <div className="mt-6 space-y-4">
                        <div className="bg-brand-dark rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">Zukunftsaussichten</h4>
                          <p className="text-gray-400 text-sm">{industry.outlook}</p>
                        </div>
                        <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-4">
                          <h4 className="text-brand-red font-medium mb-2">Lokale Info</h4>
                          <p className="text-gray-300 text-sm">{industry.localInfo}</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <Link
                          href={`/jobs?industry=${industry.id}`}
                          className="btn-primary inline-flex items-center"
                        >
                          Jobs in {industry.name} finden
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-brand-dark-lighter">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Bereit für deine Bewerbung?
            </h2>
            <p className="text-gray-400 mb-8">
              Nutze unsere kostenlosen KI-Tools, um deine Bewerbung zu verbessern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="btn-primary inline-flex items-center justify-center">
                Jobs durchsuchen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/bewerbungstipps/lebenslauf" className="btn-secondary inline-flex items-center justify-center">
                Lebenslauf-Check starten
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
