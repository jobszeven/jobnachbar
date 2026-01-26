import { Resend } from 'resend'
import { render } from '@react-email/render'
import * as React from 'react'
import {
  WelcomeApplicantEmail,
  EmailVerificationEmail,
  PasswordResetEmail,
  NewJobMatchesEmail,
  ApplicationSentEmail,
  ApplicationStatusEmail,
  ProfileReminderEmail,
  WelcomeEmployerEmail,
  NewApplicationEmail,
  JobExpiringEmail,
  JobExpiredEmail,
  SubscriptionActivatedEmail,
  AdminSubscriptionRequestEmail,
  AdminFeedbackEmail,
} from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || 'info@jobnachbar.com'
const FROM_NAME = 'JobNachbar'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@jobnachbar.com'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  react: React.ReactElement
}

async function sendEmail({ to, subject, react }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
    })

    if (error) {
      console.error('Failed to send email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}

// ==========================================
// APPLICANT EMAIL FUNCTIONS
// ==========================================

export async function sendWelcomeApplicantEmail(
  to: string,
  name: string,
  verificationUrl?: string
) {
  return sendEmail({
    to,
    subject: 'Willkommen bei JobNachbar!',
    react: React.createElement(WelcomeApplicantEmail, { name, verificationUrl }),
  })
}

export async function sendEmailVerification(
  to: string,
  name: string,
  verificationUrl: string
) {
  return sendEmail({
    to,
    subject: 'Bestätige deine E-Mail-Adresse',
    react: React.createElement(EmailVerificationEmail, { name, verificationUrl }),
  })
}

export async function sendPasswordReset(
  to: string,
  name: string,
  resetUrl: string
) {
  return sendEmail({
    to,
    subject: 'Passwort zurücksetzen',
    react: React.createElement(PasswordResetEmail, { name, resetUrl }),
  })
}

export async function sendNewJobMatches(
  to: string,
  name: string,
  jobs: Array<{ id: string; title: string; company: string; city: string; matchScore: number }>
) {
  return sendEmail({
    to,
    subject: `${jobs.length} neue Jobs passen zu deinem Profil!`,
    react: React.createElement(NewJobMatchesEmail, { name, jobs }),
  })
}

export async function sendApplicationSent(
  to: string,
  name: string,
  jobTitle: string,
  companyName: string
) {
  return sendEmail({
    to,
    subject: 'Bewerbung erfolgreich gesendet',
    react: React.createElement(ApplicationSentEmail, { name, jobTitle, companyName }),
  })
}

export async function sendApplicationStatus(
  to: string,
  name: string,
  jobTitle: string,
  companyName: string,
  status: 'viewed' | 'invited' | 'rejected'
) {
  const subjects = {
    viewed: 'Deine Bewerbung wurde angesehen',
    invited: 'Du wurdest zum Gespräch eingeladen!',
    rejected: 'Update zu deiner Bewerbung',
  }

  return sendEmail({
    to,
    subject: subjects[status],
    react: React.createElement(ApplicationStatusEmail, { name, jobTitle, companyName, status }),
  })
}

export async function sendProfileReminder(
  to: string,
  name: string,
  completionPercentage: number,
  missingFields: string[]
) {
  return sendEmail({
    to,
    subject: 'Vervollständige dein Profil für bessere Job-Matches',
    react: React.createElement(ProfileReminderEmail, { name, completionPercentage, missingFields }),
  })
}

// ==========================================
// EMPLOYER EMAIL FUNCTIONS
// ==========================================

export async function sendWelcomeEmployerEmail(
  to: string,
  name: string,
  companyName: string,
  verificationUrl?: string
) {
  return sendEmail({
    to,
    subject: `Willkommen bei JobNachbar, ${companyName}!`,
    react: React.createElement(WelcomeEmployerEmail, { name, companyName, verificationUrl }),
  })
}

export async function sendNewApplicationNotification(
  to: string,
  employerName: string,
  applicantName: string,
  jobTitle: string,
  isPremium: boolean
) {
  return sendEmail({
    to,
    subject: `Neue Bewerbung für "${jobTitle}"`,
    react: React.createElement(NewApplicationEmail, { employerName, applicantName, jobTitle, isPremium }),
  })
}

export async function sendJobExpiringNotification(
  to: string,
  employerName: string,
  jobTitle: string,
  daysLeft: number,
  renewUrl: string
) {
  return sendEmail({
    to,
    subject: `Ihre Stellenanzeige läuft in ${daysLeft} Tagen ab`,
    react: React.createElement(JobExpiringEmail, { employerName, jobTitle, daysLeft, renewUrl }),
  })
}

export async function sendJobExpiredNotification(
  to: string,
  employerName: string,
  jobTitle: string
) {
  return sendEmail({
    to,
    subject: 'Ihre Stellenanzeige ist abgelaufen',
    react: React.createElement(JobExpiredEmail, { employerName, jobTitle }),
  })
}

export async function sendSubscriptionActivated(
  to: string,
  employerName: string,
  planName: string,
  validUntil: string
) {
  return sendEmail({
    to,
    subject: `Ihr ${planName}-Abo ist aktiv`,
    react: React.createElement(SubscriptionActivatedEmail, { employerName, planName, validUntil }),
  })
}

// ==========================================
// ADMIN EMAIL FUNCTIONS
// ==========================================

export async function sendAdminSubscriptionRequest(
  customerName: string,
  customerEmail: string,
  planName: string,
  userType: 'bewerber' | 'arbeitgeber',
  billingAddress: string
) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Neue Abo-Anfrage: ${planName}`,
    react: React.createElement(AdminSubscriptionRequestEmail, {
      customerName,
      customerEmail,
      planName,
      userType,
      billingAddress,
    }),
  })
}

export async function sendAdminFeedback(
  rating: number,
  category: string,
  message: string,
  pageUrl: string,
  email?: string
) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Neues Feedback: ${category} (${rating}/5 Sterne)`,
    react: React.createElement(AdminFeedbackEmail, { rating, category, message, email, pageUrl }),
  })
}

// ==========================================
// PREMIUM SUBSCRIPTION EMAIL FUNCTIONS
// ==========================================

interface BankDetails {
  accountHolder: string
  iban: string
  bic: string
  bank: string
}

export async function sendPremiumSubscriptionConfirmation(options: {
  email: string
  name: string
  invoiceNumber: string
  amount: string
  durationMonths: number
  bankDetails: BankDetails
}) {
  const { email, name, invoiceNumber, amount, durationMonths, bankDetails } = options

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1A1A2E; color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #E63946; margin: 0;">JobNachbar</h1>
        <p style="color: #9CA3AF;">Premium-Bestellung</p>
      </div>

      <h2 style="color: #ffffff;">Hallo ${name},</h2>

      <p style="color: #D1D5DB;">vielen Dank für deine Premium-Bestellung! Hier sind deine Rechnungsdaten:</p>

      <div style="background-color: #2D2D44; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #E63946; margin-top: 0;">Rechnungsdetails</h3>
        <table style="width: 100%; color: #D1D5DB;">
          <tr>
            <td style="padding: 5px 0;"><strong>Rechnungsnummer:</strong></td>
            <td style="text-align: right;">${invoiceNumber}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Produkt:</strong></td>
            <td style="text-align: right;">JobNachbar Premium (${durationMonths} ${durationMonths === 1 ? 'Monat' : 'Monate'})</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Betrag:</strong></td>
            <td style="text-align: right; font-size: 1.2em; color: #ffffff;"><strong>${amount}€</strong></td>
          </tr>
        </table>
      </div>

      <div style="background-color: #2D2D44; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #E63946; margin-top: 0;">Bankverbindung</h3>
        <table style="width: 100%; color: #D1D5DB;">
          <tr>
            <td style="padding: 5px 0;"><strong>Empfänger:</strong></td>
            <td style="text-align: right;">${bankDetails.accountHolder}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>IBAN:</strong></td>
            <td style="text-align: right;">${bankDetails.iban}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>BIC:</strong></td>
            <td style="text-align: right;">${bankDetails.bic}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Bank:</strong></td>
            <td style="text-align: right;">${bankDetails.bank}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Verwendungszweck:</strong></td>
            <td style="text-align: right; color: #E63946;"><strong>${invoiceNumber}</strong></td>
          </tr>
        </table>
      </div>

      <p style="color: #9CA3AF; font-size: 14px;">
        Bitte überweise den Betrag innerhalb von 7 Tagen. Nach Zahlungseingang wird dein Premium-Status
        automatisch aktiviert und du erhältst eine Bestätigung per E-Mail.
      </p>

      <p style="color: #D1D5DB;">Bei Fragen erreichst du uns unter <a href="mailto:premium@jobnachbar.com" style="color: #E63946;">premium@jobnachbar.com</a>.</p>

      <p style="color: #D1D5DB;">Viele Grüße,<br>Dein JobNachbar-Team</p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151; text-align: center; color: #6B7280; font-size: 12px;">
        <p>JobNachbar GmbH | Zeven | www.jobnachbar.com</p>
      </div>
    </div>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `Deine Premium-Rechnung ${invoiceNumber}`,
      html,
    })

    if (error) {
      console.error('Failed to send premium confirmation:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Premium confirmation email error:', error)
    return { success: false, error }
  }
}

export async function sendAdminNewSubscriptionRequest(options: {
  userName: string
  userEmail: string
  invoiceNumber: string
  amount: string
  durationMonths: number
}) {
  const { userName, userEmail, invoiceNumber, amount, durationMonths } = options

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Neue Premium-Bestellung</h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Rechnungsnummer:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${invoiceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Kunde:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${userName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>E-Mail:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${userEmail}">${userEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Laufzeit:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${durationMonths} ${durationMonths === 1 ? 'Monat' : 'Monate'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Betrag:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>${amount}€</strong></td>
        </tr>
      </table>

      <p style="margin-top: 20px;">
        Nach Zahlungseingang bitte im Admin-Dashboard den Premium-Status aktivieren.
      </p>
    </div>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Neue Premium-Bestellung: ${invoiceNumber}`,
      html,
    })

    if (error) {
      console.error('Failed to send admin notification:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Admin notification email error:', error)
    return { success: false, error }
  }
}
