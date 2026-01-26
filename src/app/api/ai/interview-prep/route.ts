import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateInterviewPrep } from '@/lib/ai/gemini'

const FREE_USES_LIMIT = 2

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Check usage limits
    const { data: userData } = await supabase
      .from('users')
      .select('is_premium, ai_interview_preps_used')
      .eq('id', user.id)
      .single()

    if (!userData?.is_premium && (userData?.ai_interview_preps_used || 0) >= FREE_USES_LIMIT) {
      return NextResponse.json({
        error: 'Limit erreicht',
        message: 'Du hast deine kostenlosen Interview-Vorbereitungen aufgebraucht. Upgrade auf Premium für unbegrenzten Zugang.',
        limitReached: true,
      }, { status: 403 })
    }

    const { jobTitle, companyName, industry } = await request.json()

    if (!jobTitle || !companyName || !industry) {
      return NextResponse.json({
        error: 'Fehlende Informationen',
        message: 'Bitte fülle alle Felder aus.',
      }, { status: 400 })
    }

    // Generate interview prep
    const result = await generateInterviewPrep(jobTitle, companyName, industry)

    // Update usage count for non-premium users
    if (!userData?.is_premium) {
      await supabase
        .from('users')
        .update({
          ai_interview_preps_used: (userData?.ai_interview_preps_used || 0) + 1,
        })
        .eq('id', user.id)
    }

    return NextResponse.json({
      success: true,
      result,
      remainingUses: userData?.is_premium ? 'unlimited' : FREE_USES_LIMIT - (userData?.ai_interview_preps_used || 0) - 1,
    })
  } catch (error) {
    console.error('Interview prep error:', error)
    return NextResponse.json({
      error: 'Generierungsfehler',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    }, { status: 500 })
  }
}
