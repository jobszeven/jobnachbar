import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combine Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to German locale
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Format relative date (e.g., "Heute", "Gestern", "Vor 3 Tagen")
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Heute'
  if (diffDays === 1) return 'Gestern'
  if (diffDays < 7) return `Vor ${diffDays} Tagen`
  if (diffDays < 30) return `Vor ${Math.floor(diffDays / 7)} Wochen`
  return formatDate(dateString)
}

// Format salary range
export function formatSalary(
  min?: number | null, 
  max?: number | null, 
  type?: string | null
): string | null {
  if (!min && !max) return null
  
  const typeLabel = type === 'hourly' ? '/Std.' : type === 'yearly' ? '/Jahr' : '/Monat'
  
  if (min && max) {
    return `${min.toLocaleString('de-DE')}€ - ${max.toLocaleString('de-DE')}€${typeLabel}`
  }
  if (min) {
    return `ab ${min.toLocaleString('de-DE')}€${typeLabel}`
  }
  if (max) {
    return `bis ${max.toLocaleString('de-DE')}€${typeLabel}`
  }
  return null
}

// Calculate distance between two zip codes (simplified - German zip code first 2 digits = region)
export function estimateDistance(zip1: string, zip2: string): 'nah' | 'mittel' | 'weit' {
  const region1 = zip1.substring(0, 2)
  const region2 = zip2.substring(0, 2)
  
  if (region1 === region2) return 'nah'
  if (zip1.charAt(0) === zip2.charAt(0)) return 'mittel'
  return 'weit'
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate German phone number
export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  // Check if it starts with + or 0 and has 10-15 digits
  const phoneRegex = /^(\+49|0049|0)[1-9]\d{8,13}$/
  return phoneRegex.test(cleaned)
}

// Validate German zip code
export function isValidZipCode(zip: string): boolean {
  return /^\d{5}$/.test(zip)
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Generate initials from name
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return first + last || '?'
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Parse query string
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

// Build query string from object
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  return searchParams.toString()
}
