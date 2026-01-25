'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

export default function Login() {
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
        setError('E-Mail oder Passwort ist falsch')
      } else {
        setError(err.message || 'Ein Fehler ist aufgetreten')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Bitte gib deine E-Mail Adresse ein')
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
      alert('Falls ein Account mit dieser E-Mail existiert, haben wir dir einen Link zum Zurücksetzen gesendet.')
      
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Logo size="md" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück</h1>
            <p className="text-gray-400">Melde dich an, um fortzufahren</p>
          </div>

          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="input-label">E-Mail Adresse</label>
                <div className="relative">
                  {!email && (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  )}
                  <input
                    type="email"
                    className={`input-field ${!email ? 'pl-10' : ''}`}
                    placeholder="deine@email.de"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Passwort</label>
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
                  <span className="ml-2 text-sm text-gray-400">Angemeldet bleiben</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-brand-red hover:underline"
                >
                  Passwort vergessen?
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
                    Wird angemeldet...
                  </>
                ) : (
                  'Anmelden'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 mb-4">
                Noch kein Account?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/registrieren/bewerber"
                  className="btn-bewerber text-center text-sm"
                >
                  Als Bewerber
                </Link>
                <Link
                  href="/registrieren/arbeitgeber"
                  className="btn-arbeitgeber text-center text-sm"
                >
                  Als Arbeitgeber
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
