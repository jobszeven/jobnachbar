'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, Briefcase, CheckCircle, Clock, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'match' | 'application' | 'message' | 'system'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

interface Props {
  userType: 'bewerber' | 'arbeitgeber'
}

export default function NotificationsDropdown({ userType }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mock notifications - in real app, fetch from Supabase
  useEffect(() => {
    const mockNotifications: Notification[] = userType === 'bewerber' 
      ? [
          {
            id: '1',
            type: 'match',
            title: 'Neuer Job-Match!',
            message: 'Kfz-Mechatroniker bei Autohaus Müller passt zu deinem Profil',
            link: '/jobs/1',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'application',
            title: 'Bewerbung angesehen',
            message: 'Autohaus Müller hat deine Bewerbung angesehen',
            read: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ]
      : [
          {
            id: '1',
            type: 'application',
            title: 'Neue Bewerbung!',
            message: 'Max Mustermann hat sich auf Kfz-Mechatroniker beworben',
            link: '/dashboard/arbeitgeber?tab=bewerbungen',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'system',
            title: 'Stelle 50x angesehen',
            message: 'Ihre Stelle "Kfz-Mechatroniker" wurde 50 mal aufgerufen',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ]
    setNotifications(mockNotifications)
  }, [userType])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return <Briefcase className="w-5 h-5 text-brand-red" />
      case 'application': return <CheckCircle className="w-5 h-5 text-green-400" />
      default: return <Bell className="w-5 h-5 text-gray-400" />
    }
  }

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-brand-dark-card border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="font-semibold text-white">Benachrichtigungen</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand-red hover:underline"
              >
                Alle als gelesen markieren
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
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-500 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          onClick={() => { markAsRead(notification.id); setIsOpen(false) }}
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
  )
}
