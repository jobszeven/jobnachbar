'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { MapPin, Heart, Users, Phone, ArrowRight } from 'lucide-react'

export default function AboutContent() {
  const t = useTranslations('aboutPage')

  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')}
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-brand-red mb-4">
                {t('story.frustration.title')}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('story.frustration.p1')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('story.frustration.p2')}
              </p>
            </div>

            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('story.change.title')}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {t('story.change.text')}
                <span className="text-white font-semibold"> {t('story.change.mission')}</span>
              </p>
            </div>

            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('story.whyName.title')}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('story.whyName.p1')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('story.whyName.p2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 px-4 bg-brand-dark-lighter">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t('promise.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-brand-red" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t('promise.regional.title')}</h3>
              <p className="text-gray-400 text-sm">{t('promise.regional.desc')}</p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-brand-red" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t('promise.fair.title')}</h3>
              <p className="text-gray-400 text-sm">{t('promise.fair.desc')}</p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-brand-red" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t('promise.support.title')}</h3>
              <p className="text-gray-400 text-sm">{t('promise.support.desc')}</p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-brand-red" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t('promise.local.title')}</h3>
              <p className="text-gray-400 text-sm">{t('promise.local.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-gray-300 italic mb-8">
            {t('team')}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-red to-brand-red-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrieren/bewerber" className="btn-white inline-flex items-center justify-center">
              {t('cta.applicant')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/registrieren/arbeitgeber" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-red inline-flex items-center justify-center">
              {t('cta.employer')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
