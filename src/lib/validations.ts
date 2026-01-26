import { z } from 'zod'

// Common validations
export const emailSchema = z.string().email('Bitte gib eine gültige E-Mail-Adresse ein')

export const passwordSchema = z
  .string()
  .min(8, 'Passwort muss mindestens 8 Zeichen haben')
  .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
  .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
  .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten')

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Bitte gib eine gültige Telefonnummer ein')
  .optional()
  .or(z.literal(''))

export const zipCodeSchema = z
  .string()
  .regex(/^[0-9]{5}$/, 'Bitte gib eine gültige Postleitzahl ein')

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Passwort ist erforderlich'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Applicant Registration Schema
export const applicantRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen haben'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  phone: phoneSchema,
  birthdate: z.string().optional(),
  zipCode: zipCodeSchema,
  city: z.string().min(2, 'Ort ist erforderlich'),
  radius: z.number().min(5).max(100).default(30),
  industries: z.array(z.string()).min(1, 'Wähle mindestens eine Branche'),
  employmentTypes: z.array(z.string()).min(1, 'Wähle mindestens eine Anstellungsart'),
  experienceYears: z.number().min(0).max(50).default(0),
  availableFrom: z.string().optional(),
  salaryExpectation: z.string().optional(),
  aboutMe: z.string().optional(),
  emailNotifications: z.boolean().default(true),
  whatsappNotifications: z.boolean().default(false),
  whatsappNumber: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'Du musst die AGB akzeptieren'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
})

export type ApplicantRegistrationInput = z.infer<typeof applicantRegistrationSchema>

// Employer Registration Schema
export const employerRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  companyName: z.string().min(2, 'Firmenname muss mindestens 2 Zeichen haben'),
  contactPerson: z.string().min(2, 'Ansprechpartner ist erforderlich'),
  phone: phoneSchema,
  street: z.string().optional(),
  zipCode: zipCodeSchema,
  city: z.string().min(2, 'Ort ist erforderlich'),
  website: z.string().url('Bitte gib eine gültige URL ein').optional().or(z.literal('')),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  aboutCompany: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'Du musst die AGB akzeptieren'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
})

export type EmployerRegistrationInput = z.infer<typeof employerRegistrationSchema>

// Job Form Schema
export const jobFormSchema = z.object({
  title: z.string().min(5, 'Titel muss mindestens 5 Zeichen haben'),
  description: z.string().min(50, 'Beschreibung muss mindestens 50 Zeichen haben'),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  industry: z.string().min(1, 'Branche ist erforderlich'),
  employmentType: z.string().min(1, 'Anstellungsart ist erforderlich'),
  zipCode: zipCodeSchema,
  city: z.string().min(2, 'Ort ist erforderlich'),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  salaryType: z.enum(['hourly', 'monthly', 'yearly']).optional(),
  startDate: z.string().optional(),
  applicationDeadline: z.string().optional(),
})

export type JobFormInput = z.infer<typeof jobFormSchema>

// Application Schema
export const applicationSchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().min(100, 'Anschreiben muss mindestens 100 Zeichen haben').optional(),
})

export type ApplicationInput = z.infer<typeof applicationSchema>

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: emailSchema,
  subject: z.string().min(5, 'Betreff muss mindestens 5 Zeichen haben'),
  message: z.string().min(20, 'Nachricht muss mindestens 20 Zeichen haben'),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

// Feedback Schema
export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  category: z.enum(['bug', 'improvement', 'praise', 'other']),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben'),
  email: z.string().email().optional().or(z.literal('')),
})

export type FeedbackInput = z.infer<typeof feedbackSchema>

// Password Reset Schema
export const passwordResetSchema = z.object({
  email: emailSchema,
})

export type PasswordResetInput = z.infer<typeof passwordResetSchema>

// New Password Schema
export const newPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
})

export type NewPasswordInput = z.infer<typeof newPasswordSchema>

// Subscription Request Schema
export const subscriptionRequestSchema = z.object({
  plan: z.string().min(1, 'Paket ist erforderlich'),
  billingName: z.string().min(2, 'Name ist erforderlich'),
  billingAddress: z.string().min(10, 'Adresse ist erforderlich'),
  billingEmail: emailSchema,
  vatId: z.string().optional(),
})

export type SubscriptionRequestInput = z.infer<typeof subscriptionRequestSchema>

// Profile Update Schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: phoneSchema,
  aboutMe: z.string().optional(),
  zipCode: zipCodeSchema.optional(),
  city: z.string().min(2).optional(),
  radius: z.number().min(5).max(100).optional(),
  industries: z.array(z.string()).optional(),
  employmentTypes: z.array(z.string()).optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  availableFrom: z.string().optional(),
  salaryExpectation: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  whatsappNotifications: z.boolean().optional(),
  whatsappNumber: z.string().optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
