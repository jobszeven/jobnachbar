'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MessageSquare, X, Star, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = [
  { value: 'bug', label: 'Fehler melden' },
  { value: 'improvement', label: 'Verbesserungsvorschlag' },
  { value: 'praise', label: 'Lob' },
  { value: 'other', label: 'Sonstiges' },
]

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('feedback')

  const resetForm = () => {
    setRating(0)
    setHoverRating(0)
    setCategory('')
    setMessage('')
    setEmail('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Bitte gib eine Bewertung ab')
      return
    }

    if (!category) {
      toast.error('Bitte wähle eine Kategorie')
      return
    }

    if (message.length < 10) {
      toast.error('Die Nachricht muss mindestens 10 Zeichen haben')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category,
          message,
          email: email || undefined,
          pageUrl: pathname,
        }),
      })

      if (response.ok) {
        toast.success(t('success'))
        resetForm()
        setIsOpen(false)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Ein Fehler ist aufgetreten')
      }
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-brand-red text-white rounded-full shadow-lg hover:bg-brand-red-dark transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Feedback geben"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-brand-dark-card border border-gray-700 rounded-xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">{t('title')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Rating */}
              <div>
                <label className="input-label">{t('rating')} *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'fill-brand-red text-brand-red'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="input-label">{t('category')} *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Bitte wählen...</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="input-label">{t('message')} *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Beschreibe dein Anliegen..."
                  required
                  minLength={10}
                />
              </div>

              {/* Email */}
              <div>
                <label className="input-label">
                  {t('email')}
                  <span className="text-gray-500 font-normal ml-1">({t('emailHint')})</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="deine@email.de"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
