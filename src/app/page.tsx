import Link from 'next/link'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Users, Zap, MapPin, CheckCircle, ArrowRight, Clock, Shield, Euro } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestimonialsSlider from '@/components/TestimonialsSlider'
import StatsSection from '@/components/StatsSection'
import { Skeleton } from '@/components/ui/Skeleton'

export default async function Home() {
  const t = await getTranslations('home')
  const common = await getTranslations('common')

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-red rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-8">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-brand-red text-sm font-medium">{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('hero.title')}
              <br />
              <span className="text-brand-red">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registrieren/bewerber" className="btn-bewerber inline-flex items-center justify-center text-lg px-8 py-4">
                {t('hero.findJob')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/registrieren/arbeitgeber" className="btn-arbeitgeber inline-flex items-center justify-center text-lg px-8 py-4">
                {t('hero.findEmployee')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-brand-red" />
                <span>{t('hero.radius')}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-brand-red" />
                <span>{t('hero.regional')}</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-brand-red" />
                <span>{t('hero.matching')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <TestimonialsSlider />

      {/* Stats Section */}
      <Suspense
        fallback={
          <section className="py-16 bg-brand-dark-lighter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card text-center">
                    <Skeleton className="w-14 h-14 rounded-xl mx-auto mb-4" />
                    <Skeleton className="h-12 w-24 mx-auto mb-2" />
                    <Skeleton className="h-5 w-32 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      >
        <StatsSection />
      </Suspense>

      {/* How it Works - Job Seekers */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('howItWorks.jobseeker.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('howItWorks.jobseeker.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: t('howItWorks.jobseeker.step1.title'), desc: t('howItWorks.jobseeker.step1.desc') },
              { num: '2', title: t('howItWorks.jobseeker.step2.title'), desc: t('howItWorks.jobseeker.step2.desc') },
              { num: '3', title: t('howItWorks.jobseeker.step3.title'), desc: t('howItWorks.jobseeker.step3.desc') },
            ].map((step) => (
              <div key={step.num} className="card text-center hover:border-brand-red/50 transition-colors">
                <div className="w-12 h-12 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-red font-bold text-xl">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/registrieren/bewerber" className="btn-primary inline-flex items-center">
              {t('howItWorks.jobseeker.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works - Employers */}
      <section className="py-20 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('howItWorks.employer.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('howItWorks.employer.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: t('howItWorks.employer.step1.title'), desc: t('howItWorks.employer.step1.desc') },
              { num: '2', title: t('howItWorks.employer.step2.title'), desc: t('howItWorks.employer.step2.desc') },
              { num: '3', title: t('howItWorks.employer.step3.title'), desc: t('howItWorks.employer.step3.desc') },
            ].map((step) => (
              <div key={step.num} className="card text-center hover:border-brand-red/50 transition-colors">
                <div className="w-12 h-12 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-red font-bold text-xl">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/registrieren/arbeitgeber" className="btn-arbeitgeber inline-flex items-center">
              {t('howItWorks.employer.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-red/20 text-brand-red text-sm font-semibold px-4 py-1 rounded-full mb-4">
              {t('pricing.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <h3 className="text-xl font-semibold text-white mb-2">{t('pricing.starter.name')}</h3>
              <p className="text-4xl font-bold text-white mb-2">{t('pricing.starter.price')}</p>
              <p className="text-gray-400 text-sm mb-4">{t('pricing.starter.desc')}</p>
              <Link href="/preise" className="text-brand-red hover:underline text-sm">{common('learnMore')} →</Link>
            </div>
            <div className="card text-center border-brand-red relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">{t('pricing.popular')}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('pricing.basic.name')}</h3>
              <div className="mb-2">
                <span className="text-gray-500 line-through text-lg">{t('pricing.basic.oldPrice')}</span>
                <p className="text-4xl font-bold text-white">{t('pricing.basic.price')}<span className="text-lg text-gray-400">/Mo</span></p>
              </div>
              <p className="text-gray-400 text-sm mb-4">{t('pricing.basic.desc')}</p>
              <Link href="/preise" className="text-brand-red hover:underline text-sm">{common('learnMore')} →</Link>
            </div>
            <div className="card text-center">
              <h3 className="text-xl font-semibold text-white mb-2">{t('pricing.premium.name')}</h3>
              <div className="mb-2">
                <span className="text-gray-500 line-through text-lg">{t('pricing.premium.oldPrice')}</span>
                <p className="text-4xl font-bold text-white">{t('pricing.premium.price')}<span className="text-lg text-gray-400">/Mo</span></p>
              </div>
              <p className="text-gray-400 text-sm mb-4">{t('pricing.premium.desc')}</p>
              <Link href="/preise" className="text-brand-red hover:underline text-sm">{common('learnMore')} →</Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/preise" className="btn-secondary inline-flex items-center">
              {t('pricing.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-white font-semibold">{t('trust.fast.title')}</p>
              <p className="text-gray-400 text-sm">{t('trust.fast.desc')}</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-white font-semibold">{t('trust.gdpr.title')}</p>
              <p className="text-gray-400 text-sm">{t('trust.gdpr.desc')}</p>
            </div>
            <div className="text-center">
              <Euro className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-white font-semibold">{t('trust.fair.title')}</p>
              <p className="text-gray-400 text-sm">{t('trust.fair.desc')}</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-white font-semibold">{t('trust.local.title')}</p>
              <p className="text-gray-400 text-sm">{t('trust.local.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-red/20 to-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrieren/arbeitgeber" className="btn-primary inline-flex items-center justify-center text-lg px-8 py-4">
              {t('cta.primary')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/kontakt" className="btn-secondary inline-flex items-center justify-center">
              {t('cta.secondary')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
