import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('terms')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function AGBPage() {
  const t = await getTranslations('terms')

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.scope.title')}</h2>
            <p className="text-gray-300">{t('sections.scope.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.services.title')}</h2>
            <p className="text-gray-300">{t('sections.services.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.registration.title')}</h2>
            <p className="text-gray-300">{t('sections.registration.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.pricing.title')}</h2>
            <p className="text-gray-300">{t('sections.pricing.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.contract.title')}</h2>
            <p className="text-gray-300">{t('sections.contract.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.liability.title')}</h2>
            <p className="text-gray-300">{t('sections.liability.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.dataProtection.title')}</h2>
            <p className="text-gray-300">{t('sections.dataProtection.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">{t('sections.final.title')}</h2>
            <p className="text-gray-300">{t('sections.final.content')}</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
