'use client'

import { useState, useEffect, useRef } from 'react'
import { Briefcase, Building2, MapPin, Users } from 'lucide-react'

interface StatItem {
  icon: React.ElementType
  value: number
  suffix?: string
  label: string
  dynamic?: boolean
}

interface AnimatedCounterProps {
  end: number
  suffix?: string
  duration?: number
  isVisible: boolean
}

function AnimatedCounter({ end, suffix = '', duration = 2000, isVisible }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isVisible) return

    countRef.current = 0
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const progress = timestamp - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4)
      const currentCount = Math.floor(easeOutQuart * end)

      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }

      if (percentage < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, isVisible])

  return (
    <span>
      {count.toLocaleString('de-DE')}{suffix}
    </span>
  )
}

interface AnimatedStatsProps {
  jobsCount?: number
  companiesCount?: number
  applicantsCount?: number
}

export default function AnimatedStats({
  jobsCount = 47,
  companiesCount = 23,
  applicantsCount = 156,
}: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.3,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats: StatItem[] = [
    {
      icon: Briefcase,
      value: jobsCount,
      label: 'Offene Stellen',
      dynamic: true,
    },
    {
      icon: Building2,
      value: companiesCount,
      label: 'Unternehmen vertrauen uns',
      dynamic: true,
    },
    {
      icon: Users,
      value: applicantsCount,
      label: 'Registrierte Bewerber',
      dynamic: true,
    },
    {
      icon: MapPin,
      value: 7,
      label: 'Orte im Umkreis',
      dynamic: false,
    },
  ]

  return (
    <section ref={sectionRef} className="py-16 bg-brand-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            JobNachbar in Zahlen
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Werde Teil unserer wachsenden Community in Zeven und Umgebung
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card text-center hover:border-brand-red/30 transition-colors"
            >
              <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-brand-red" />
              </div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                  duration={stat.dynamic ? 2000 : 1000}
                />
              </p>
              <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
