import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAdminFeedback } from '@/lib/email'
import { z } from 'zod'

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  category: z.enum(['bug', 'improvement', 'praise', 'other']),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben'),
  email: z.string().email().optional().or(z.literal('')),
  pageUrl: z.string(),
  recaptchaToken: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = feedbackSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Ungültige Eingabe', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { rating, category, message, email, pageUrl, recaptchaToken } = validationResult.data

    // Verify reCAPTCHA if token provided
    if (recaptchaToken) {
      const recaptchaResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        { method: 'POST' }
      )
      const recaptchaData = await recaptchaResponse.json()

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        )
      }
    }

    // Get current user if logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userId = null
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()
      userId = userData?.id
    }

    // Save feedback to database
    const { data: feedback, error: dbError } = await supabase
      .from('feedback')
      .insert({
        rating,
        category,
        message,
        email: email || null,
        page_url: pageUrl,
        user_id: userId,
        status: 'new',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Feedback konnte nicht gespeichert werden' },
        { status: 500 }
      )
    }

    // Send email notification to admin
    await sendAdminFeedback(rating, category, message, pageUrl, email || undefined)

    return NextResponse.json({
      success: true,
      message: 'Danke für dein Feedback!',
    })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
