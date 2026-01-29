import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('imprint')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function Impressum() {
  const t = await getTranslations('imprint')

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToHome')}
        </Link>

        <div className="card prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-8">{t('title')}</h1>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.legalInfo.title')}</h2>
          <p className="text-gray-300">
            Idris Akkurt<br />
            Feldstraße 22<br />
            27404 Zeven<br />
            {t('sections.legalInfo.country')}
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.contact.title')}</h2>
          <p className="text-gray-300">
            {t('sections.contact.email')}: <a href="mailto:info@jobnachbar.com" className="text-brand-red hover:underline">info@jobnachbar.com</a>
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.profession.title')}</h2>
          <p className="text-gray-300">
            {t('sections.profession.description')}
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.authority.title')}</h2>
          <p className="text-gray-300">
            {t('sections.authority.description')}
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.vatId.title')}</h2>
          <p className="text-gray-300">
            {t('sections.vatId.description')}<br />
            {t('sections.vatId.pending')}
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.responsible.title')}</h2>
          <p className="text-gray-300">
            Idris Akkurt<br />
            Feldstraße 22<br />
            27404 Zeven
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.dispute.title')}</h2>
          <p className="text-gray-300">
            {t('sections.dispute.description')}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline ml-1">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-gray-300 mt-4">
            {t('sections.dispute.noParticipation')}
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.liability.title')}</h2>
          <p className="text-gray-300">
            {t('sections.liability.content1')}
          </p>
          <p className="text-gray-300 mt-4">
            {t('sections.liability.content2')}
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.links.title')}</h2>
          <p className="text-gray-300">
            {t('sections.links.description')}
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">{t('sections.copyright.title')}</h2>
          <p className="text-gray-300">
            {t('sections.copyright.description')}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
