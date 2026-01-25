// Database Types for JobNachbar

export type EmploymentType = 
  | 'vollzeit'
  | 'teilzeit'
  | 'minijob'
  | 'ausbildung'
  | 'praktikum'
  | 'werkstudent'
  | 'freelance'

export type IndustryType =
  | 'handwerk'
  | 'pflege_gesundheit'
  | 'gastro_hotel'
  | 'einzelhandel'
  | 'logistik_transport'
  | 'industrie_produktion'
  | 'buero_verwaltung'
  | 'it_technik'
  | 'bau_architektur'
  | 'landwirtschaft'
  | 'bildung_soziales'
  | 'sonstiges'

export type SubscriptionTier = 'free' | 'basic' | 'premium'

export type ApplicationStatus = 'new' | 'viewed' | 'accepted' | 'rejected'

export type JobStatus = 'active' | 'paused' | 'filled' | 'expired'

export type UserStatus = 'active' | 'inactive' | 'hired'

// Display labels for German UI
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  vollzeit: 'Vollzeit',
  teilzeit: 'Teilzeit',
  minijob: 'Minijob',
  ausbildung: 'Ausbildung',
  praktikum: 'Praktikum',
  werkstudent: 'Werkstudent',
  freelance: 'Freelance',
}

export const INDUSTRY_LABELS: Record<IndustryType, string> = {
  handwerk: 'Handwerk',
  pflege_gesundheit: 'Pflege & Gesundheit',
  gastro_hotel: 'Gastro & Hotel',
  einzelhandel: 'Einzelhandel',
  logistik_transport: 'Logistik & Transport',
  industrie_produktion: 'Industrie & Produktion',
  buero_verwaltung: 'Büro & Verwaltung',
  it_technik: 'IT & Technik',
  bau_architektur: 'Bau & Architektur',
  landwirtschaft: 'Landwirtschaft',
  bildung_soziales: 'Bildung & Soziales',
  sonstiges: 'Sonstiges',
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'Neu',
  viewed: 'Angesehen',
  accepted: 'Angenommen',
  rejected: 'Abgelehnt',
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  active: 'Aktiv',
  paused: 'Pausiert',
  filled: 'Besetzt',
  expired: 'Abgelaufen',
}

// Database models
export interface User {
  id: string
  created_at: string
  updated_at: string
  auth_id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  birthdate?: string
  zip_code: string
  city: string
  radius_km: number
  job_title_wanted?: string
  experience_years: number
  qualifications: string[]
  industries: IndustryType[]
  employment_types: EmploymentType[]
  available_from?: string
  salary_expectation?: string
  about_me?: string
  cv_url?: string
  profile_image_url?: string
  status: UserStatus
  email_notifications: boolean
  whatsapp_notifications: boolean
  whatsapp_number?: string
}

export interface Company {
  id: string
  created_at: string
  updated_at: string
  auth_id: string
  email: string
  company_name: string
  contact_person: string
  phone?: string
  street?: string
  zip_code: string
  city: string
  website?: string
  industry?: IndustryType
  company_size?: string
  logo_url?: string
  about_company?: string
  verified: boolean
  subscription_tier: SubscriptionTier
  subscription_expires?: string
  jobs_posted_this_month: number
  applications_received_this_month: number
}

export interface Job {
  id: string
  created_at: string
  updated_at: string
  company_id: string
  title: string
  description: string
  requirements?: string
  benefits?: string
  industry: IndustryType
  employment_type: EmploymentType
  zip_code: string
  city: string
  salary_min?: number
  salary_max?: number
  salary_type?: 'hourly' | 'monthly' | 'yearly'
  start_date?: string
  application_deadline?: string
  status: JobStatus
  views: number
  is_boosted: boolean
  boosted_until?: string
  // Joined data
  company?: Company
}

export interface Application {
  id: string
  created_at: string
  user_id: string
  job_id: string
  company_id: string
  cover_letter?: string
  status: ApplicationStatus
  is_paid: boolean
  paid_at?: string
  price_paid?: number
  // Joined data
  user?: User
  job?: Job
  company?: Company
}

export interface Match {
  id: string
  created_at: string
  user_id: string
  job_id: string
  match_score: number
  notified: boolean
  notified_at?: string
  notification_type?: 'email' | 'whatsapp'
  // Joined data
  job?: Job
}

// Form types
export interface UserRegistrationForm {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  zip_code: string
  city: string
  birthdate?: string
  job_title_wanted: string
  experience_years: number
  industries: IndustryType[]
  employment_types: EmploymentType[]
  available_from?: string
  salary_expectation?: string
  about_me?: string
  email_notifications: boolean
  whatsapp_notifications: boolean
  whatsapp_number?: string
}

export interface CompanyRegistrationForm {
  email: string
  password: string
  company_name: string
  contact_person: string
  phone: string
  street?: string
  zip_code: string
  city: string
  website?: string
  industry?: IndustryType
  company_size?: string
  about_company?: string
}

export interface JobForm {
  title: string
  description: string
  requirements?: string
  benefits?: string
  industry: IndustryType
  employment_type: EmploymentType
  zip_code: string
  city: string
  salary_min?: number
  salary_max?: number
  salary_type?: 'hourly' | 'monthly' | 'yearly'
  start_date?: string
  application_deadline?: string
}
