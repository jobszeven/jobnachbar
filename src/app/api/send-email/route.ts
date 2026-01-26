import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as emailService from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Validate required fields based on email type
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      // Applicant emails
      case 'welcome_applicant':
        result = await emailService.sendWelcomeApplicantEmail(
          data.to,
          data.name,
          data.verificationUrl
        )
        break

      case 'email_verification':
        result = await emailService.sendEmailVerification(
          data.to,
          data.name,
          data.verificationUrl
        )
        break

      case 'password_reset':
        result = await emailService.sendPasswordReset(
          data.to,
          data.name,
          data.resetUrl
        )
        break

      case 'new_job_matches':
        result = await emailService.sendNewJobMatches(
          data.to,
          data.name,
          data.jobs
        )
        break

      case 'application_sent':
        result = await emailService.sendApplicationSent(
          data.to,
          data.name,
          data.jobTitle,
          data.companyName
        )
        break

      case 'application_status':
        result = await emailService.sendApplicationStatus(
          data.to,
          data.name,
          data.jobTitle,
          data.companyName,
          data.status
        )
        break

      case 'profile_reminder':
        result = await emailService.sendProfileReminder(
          data.to,
          data.name,
          data.completionPercentage,
          data.missingFields
        )
        break

      // Employer emails
      case 'welcome_employer':
        result = await emailService.sendWelcomeEmployerEmail(
          data.to,
          data.name,
          data.companyName,
          data.verificationUrl
        )
        break

      case 'new_application':
        result = await emailService.sendNewApplicationNotification(
          data.to,
          data.employerName,
          data.applicantName,
          data.jobTitle,
          data.isPremium
        )
        break

      case 'job_expiring':
        result = await emailService.sendJobExpiringNotification(
          data.to,
          data.employerName,
          data.jobTitle,
          data.daysLeft,
          data.renewUrl
        )
        break

      case 'job_expired':
        result = await emailService.sendJobExpiredNotification(
          data.to,
          data.employerName,
          data.jobTitle
        )
        break

      case 'subscription_activated':
        result = await emailService.sendSubscriptionActivated(
          data.to,
          data.employerName,
          data.planName,
          data.validUntil
        )
        break

      // Admin emails
      case 'admin_subscription_request':
        result = await emailService.sendAdminSubscriptionRequest(
          data.customerName,
          data.customerEmail,
          data.planName,
          data.userType,
          data.billingAddress
        )
        break

      case 'admin_feedback':
        result = await emailService.sendAdminFeedback(
          data.rating,
          data.category,
          data.message,
          data.pageUrl,
          data.email
        )
        break

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data })
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in send-email API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
