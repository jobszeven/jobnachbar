'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronRight, User, LogOut, Settings, Heart, Bell, Briefcase, CheckCircle, Download } from 'lucide-react'
import Logo from './Logo'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  variant?: 'default' | 'bewerber' | 'arbeitgeber'
}

interface Notification {
  id: string
  type: 'match' | 'application' | 'message' | 'system'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    checkUser()
    
    // PWA Install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show install button after a delay
      setTimeout(() => setShowInstallPrompt(true), 3000)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function checkUser() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)
        const { data: userData } = await supabase
          .from('users')
          .select('role, first_name')
          .eq('auth_id', user.id)
          .single()
        
        if (userData) {
          setUserRole(userData.role)
          loadNotifications(userData.role)
        }
      }
    } catch (error) {
      console.error('Error checking user:', error)
    }
    setLoading(false)
  }

  function loadNotifications(role: string) {
    // Mock notifications - in real app, fetch from Supabase
    const mockNotifications: Notification[] = role === 'jobseeker' 
      ? [
          {
            id: '1',
            type: 'match',
            title: 'Neuer Job-Match!',
            message: 'Ein neuer Job passt zu deinem Profil',
            link: '/jobs',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'application',
            title: 'Bewerbung angesehen',
            message: 'Ein Arbeitgeber hat deine Bewerbung angesehen',
            read: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ]
      : [
          {
            id: '1',
            type: 'application',
            title: 'Neue Bewerbung!',
            message: 'Du hast eine neue Bewerbung erhalten',
            link: '/dashboard/arbeitgeber',
            read: false,
            createdAt: new Date().toISOString(),
          },
        ]
    setNotifications(mockNotifications)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
    router.push('/')
  }

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallPrompt(false)
      }
      setDeferredPrompt(null)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `vor ${diffMins} Min.`
    if (diffHours < 24) return `vor ${diffHours} Std.`
    return `vor ${diffDays} Tag(en)`
  }

  const isActive = (path: string) => pathname === path

  const menuLinks = {
    main: [
      { href: '/jobs', label: 'Jobs finden' },
      { href: '/fuer-arbeitgeber', label: 'Für Arbeitgeber' },
      { href: '/preise', label: 'Preise' },
      { href: '/bewerbungstipps', label: 'Bewerbungstipps' },
    ],
    footer: [
      { href: '/kontakt', label: 'Kontakt' },
      { href: '/impressum', label: 'Impressum' },
      { href: '/datenschutz', label: 'Datenschutz' },
      { href: '/agb', label: 'AGB' },
    ],
  }

  const getDashboardLink = () => {
    if (userRole === 'employer') return '/dashboard/arbeitgeber'
    return '/dashboard/bewerber'
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return <Briefcase className="w-5 h-5 text-brand-red" />
      case 'application': return <CheckCircle className="w-5 h-5 text-green-400" />
      default: return <Bell className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <>
      <nav className="border-b border-gray-800 bg-brand-dark sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {menuLinks.main.slice(0, 3).map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`transition-colors ${
                    isActive(link.href) 
                      ? 'text-brand-red' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      {/* Favorites for jobseekers */}
                      {userRole === 'jobseeker' && (
                        <Link href="/dashboard/bewerber/favoriten" className="text-gray-300 hover:text-white transition-colors" title="Favoriten">
                          <Heart className="w-5 h-5" />
                        </Link>
                      )}
                      
                      {/* Notifications Bell */}
                      <div className="relative" ref={notificationRef}>
                        <button
                          onClick={() => setShowNotifications(!showNotifications)}
                          className="relative p-2 text-gray-300 hover:text-white transition-colors"
                        >
                          <Bell className="w-5 h-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                        
                        {showNotifications && (
                          <div className="absolute right-0 mt-2 w-80 bg-brand-dark-card border border-gray-700 rounded-lg shadow-xl z-50">
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                              <h3 className="font-semibold text-white">Benachrichtigungen</h3>
                              {unreadCount > 0 && (
                                <button
                                  onClick={markAllAsRead}
                                  className="text-xs text-brand-red hover:underline"
                                >
                                  Alle gelesen
                                </button>
                              )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                              {notifications.length === 0 ? (
                                <div className="p-6 text-center">
                                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                                  <p className="text-gray-400">Keine Benachrichtigungen</p>
                                </div>
                              ) : (
                                notifications.map((notification) => (
                                  <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-700 last:border-0 hover:bg-gray-800/50 transition-colors ${
                                      !notification.read ? 'bg-brand-red/5' : ''
                                    }`}
                                  >
                                    <div className="flex gap-3">
                                      <div className="flex-shrink-0 mt-1">
                                        {getIcon(notification.type)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                          {notification.title}
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                                        {notification.link && (
                                          <Link
                                            href={notification.link}
                                            onClick={() => { markAsRead(notification.id); setShowNotifications(false) }}
                                            className="text-xs text-brand-red hover:underline mt-2 inline-block"
                                          >
                                            Ansehen →
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* User Menu */}
                      <div className="relative group">
                        <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                          <div className="w-8 h-8 bg-brand-red/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-brand-red" />
                          </div>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-brand-dark-card rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          <Link 
                            href={getDashboardLink()} 
                            className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-t-lg"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                          {userRole === 'jobseeker' && (
                            <Link 
                              href="/dashboard/bewerber/favoriten" 
                              className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50"
                            >
                              <Heart className="w-4 h-4 mr-2" />
                              Favoriten
                            </Link>
                          )}
                          <Link 
                            href={userRole === 'employer' ? '/dashboard/arbeitgeber/einstellungen' : '/dashboard/bewerber/profil'} 
                            className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Einstellungen
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-b-lg"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Abmelden
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                        Anmelden
                      </Link>
                      <Link href="/registrieren" className="btn-primary text-sm">
                        Kostenlos registrieren
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
              aria-label="Menü öffnen"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* PWA Install Banner */}
      {showInstallPrompt && (
        <div className="bg-brand-red/10 border-b border-brand-red/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-brand-red" />
              <span className="text-white text-sm">JobNachbar als App installieren?</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstall}
                className="px-3 py-1.5 bg-brand-red text-white text-sm rounded-lg hover:bg-brand-red-dark transition-colors"
              >
                Installieren
              </button>
              <button 
                onClick={() => setShowInstallPrompt(false)}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-brand-dark border-l border-gray-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <Logo size="sm" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-300 hover:text-white"
                aria-label="Menü schließen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col h-[calc(100%-64px)]">
              <div className="p-4 space-y-1">
                {menuLinks.main.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-brand-red/10 text-brand-red'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-800 mx-4" />

              <div className="p-4 space-y-3">
                {user ? (
                  <>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center w-full py-3 px-4 bg-brand-red text-white rounded-lg font-semibold"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Mein Dashboard
                    </Link>
                    {userRole === 'jobseeker' && (
                      <Link
                        href="/dashboard/bewerber/favoriten"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center w-full py-3 px-4 border-2 border-gray-600 text-white rounded-lg"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Meine Favoriten
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full py-3 px-4 border-2 border-gray-600 text-gray-300 rounded-lg hover:border-red-500 hover:text-red-400"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Abmelden
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center py-3 px-4 border-2 border-gray-600 text-white rounded-lg hover:border-brand-red hover:text-brand-red transition-colors"
                    >
                      Anmelden
                    </Link>
                    <Link
                      href="/registrieren"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center py-3 px-4 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors font-semibold"
                    >
                      Kostenlos registrieren
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-auto p-4 border-t border-gray-800">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                  {menuLinks.footer.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
