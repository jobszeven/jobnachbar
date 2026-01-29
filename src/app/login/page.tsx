'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

export default function Login() {
  const t = useTranslations('login')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      const userType = data.user?.user_metadata?.user_type

      if (userType === 'employer') {
        router.push('/dashboard/arbeitgeber')
      } else {
        router.push('/dashboard/bewerber')
      }

    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError(t('errors.invalidCredentials'))
      } else {
        setError(err.message || t('errors.generic'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError(t('errors.enterEmail'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/passwort-zuruecksetzen`,
      })

      if (error) throw error

      setError('')
      alert(t('resetEmailSent'))

    } catch (err: any) {
      setError(err.message || t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <nav className="border-b border-gray-800 bg-brand-dark sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-gray-400">{t('subtitle')}</p>
          </div>

          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="input-label">{t('email')}</label>
                <div className="relative">
                  {!email && (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  )}
                  <input
                    type="email"
                    className={`input-field ${!email ? 'pl-10' : ''}`}
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">{t('password')}</label>
                <div className="relative">
                  {!password && (
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  )}
                  <input
                    type="password"
                    className={`input-field ${!password ? 'pl-10' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 text-brand-red focus:ring-brand-red bg-brand-dark"
                  />
                  <span className="ml-2 text-sm text-gray-400">{t('rememberMe')}</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-brand-red hover:underline"
                >
                  {t('forgotPassword')}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('loggingIn')}
                  </>
                ) : (
                  t('submit')
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 mb-4">
                {t('noAccount')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/registrieren/bewerber"
                  className="btn-bewerber text-center text-sm"
                >
                  {t('asApplicant')}
                </Link>
                <Link
                  href="/registrieren/arbeitgeber"
                  className="btn-arbeitgeber text-center text-sm"
                >
                  {t('asEmployer')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
