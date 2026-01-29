import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('privacy')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function DatenschutzPage() {
  const t = await getTranslations('privacy')

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.overview.title')}</h2>
            <p className="text-gray-300">{t('sections.overview.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.responsible.title')}</h2>
            <p className="text-gray-300">Idris Akkurt<br />Feldstraße 22<br />27404 Zeven</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.dataCollection.title')}</h2>
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">{t('sections.dataCollection.cookies.title')}</h3>
            <p className="text-gray-300">{t('sections.dataCollection.cookies.content')}</p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">{t('sections.dataCollection.serverLogs.title')}</h3>
            <p className="text-gray-300">{t('sections.dataCollection.serverLogs.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.registration.title')}</h2>
            <p className="text-gray-300">{t('sections.registration.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.rights.title')}</h2>
            <p className="text-gray-300">{t('sections.rights.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.hosting.title')}</h2>
            <p className="text-gray-300">{t('sections.hosting.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.supabase.title')}</h2>
            <p className="text-gray-300">{t('sections.supabase.content')}</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
