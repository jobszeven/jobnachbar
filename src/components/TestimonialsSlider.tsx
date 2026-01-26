'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote, Building2, User } from 'lucide-react'

interface Testimonial {
  id: string
  type: 'employer' | 'applicant'
  name: string
  location: string
  company?: string
  quote: string
  rating: number
}

const testimonials: Testimonial[] = [
  // Arbeitgeber
  {
    id: '1',
    type: 'employer',
    name: 'Saray Imbiss',
    location: 'Zeven',
    company: 'Saray Imbiss',
    quote: 'Wir haben über JobNachbar 3 zuverlässige Fahrer und eine Küchenkraft gefunden. Endlich eine Plattform, die unsere Region versteht!',
    rating: 5,
  },
  {
    id: '2',
    type: 'employer',
    name: 'Autofix',
    location: 'Zeven',
    company: 'Autofix',
    quote: 'Einen guten Kfz-Mechatroniker zu finden ist nicht leicht. Über JobNachbar hat es geklappt - schnell und unkompliziert.',
    rating: 5,
  },
  // Bewerber
  {
    id: '3',
    type: 'applicant',
    name: 'Markus K.',
    location: 'Rotenburg',
    quote: 'Endlich eine Plattform nur für unsere Region. Keine Jobs aus Hamburg, sondern genau das was ich gesucht habe.',
    rating: 5,
  },
  {
    id: '4',
    type: 'applicant',
    name: 'Lisa T.',
    location: 'Sittensen',
    quote: 'Der Bewerbungs-Assistent hat mir geholfen mein Anschreiben zu verbessern. Nach der ersten Bewerbung wurde ich direkt eingeladen.',
    rating: 5,
  },
  {
    id: '5',
    type: 'applicant',
    name: 'Sarah M.',
    location: 'Zeven',
    quote: 'Nach 2 Monaten Suche auf anderen Portalen - hier hatte ich nach einer Woche meinen neuen Job. Direkt in Zeven!',
    rating: 5,
  },
  {
    id: '6',
    type: 'applicant',
    name: 'Thomas B.',
    location: 'Bremervörde',
    quote: 'Einfach zu bedienen, übersichtlich und nur lokale Jobs. Genau das hat gefehlt in unserer Region.',
    rating: 5,
  },
  {
    id: '7',
    type: 'applicant',
    name: 'Anna W.',
    location: 'Tarmstedt',
    quote: 'Ich wollte nicht mehr pendeln. Über JobNachbar habe ich einen Arbeitsplatz 10 Minuten von zuhause gefunden.',
    rating: 5,
  },
]

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    prevSlide()
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    nextSlide()
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonials[currentIndex]
  const isEmployer = currentTestimonial.type === 'employer'

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Das sagen unsere Nutzer
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Echte Erfolgsgeschichten von Arbeitgebern und Bewerbern aus der Region
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Slider Container */}
          <div
            className={`card relative overflow-hidden transition-all duration-300 ${
              isEmployer
                ? 'bg-gradient-to-br from-brand-dark-card to-brand-red/10 border-brand-red/30'
                : 'bg-gradient-to-br from-brand-dark-card to-blue-500/10 border-blue-500/30'
            }`}
          >
            {/* Type Badge */}
            <div
              className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isEmployer
                  ? 'bg-brand-red/20 text-brand-red'
                  : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {isEmployer ? (
                <>
                  <Building2 className="w-4 h-4" />
                  Arbeitgeber
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Bewerber
                </>
              )}
            </div>

            {/* Quote Icon */}
            <Quote
              className={`w-12 h-12 mb-4 ${
                isEmployer ? 'text-brand-red/30' : 'text-blue-500/30'
              }`}
            />

            {/* Quote Text */}
            <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-6">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </blockquote>

            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    isEmployer
                      ? 'fill-brand-red text-brand-red'
                      : 'fill-yellow-400 text-yellow-400'
                  }`}
                />
              ))}
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isEmployer ? 'bg-brand-red/20' : 'bg-blue-500/20'
                }`}
              >
                {isEmployer ? (
                  <Building2 className={`w-6 h-6 ${isEmployer ? 'text-brand-red' : 'text-blue-400'}`} />
                ) : (
                  <User className="w-6 h-6 text-blue-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {currentTestimonial.company || currentTestimonial.name}
                </p>
                <p className="text-gray-400 text-sm">{currentTestimonial.location}</p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-brand-dark-card border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-red transition-colors"
            aria-label="Vorheriges Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-brand-dark-card border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-red transition-colors"
            aria-label="Nächstes Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-brand-red'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Gehe zu Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
