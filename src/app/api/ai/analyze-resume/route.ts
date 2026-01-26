import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeResume } from '@/lib/ai/gemini'

const FREE_USES_LIMIT = 3

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
      .select('is_premium, ai_resume_checks_used')
      .eq('id', user.id)
      .single()

    if (!userData?.is_premium && (userData?.ai_resume_checks_used || 0) >= FREE_USES_LIMIT) {
      return NextResponse.json({
        error: 'Limit erreicht',
        message: 'Du hast deine kostenlosen Lebenslauf-Checks aufgebraucht. Upgrade auf Premium für unbegrenzten Zugang.',
        limitReached: true,
      }, { status: 403 })
    }

    const { resumeText } = await request.json()

    if (!resumeText || resumeText.length < 100) {
      return NextResponse.json({
        error: 'Lebenslauf zu kurz',
        message: 'Bitte gib einen vollständigen Lebenslauf ein (mindestens 100 Zeichen).',
      }, { status: 400 })
    }

    // Analyze the resume
    const result = await analyzeResume(resumeText)

    // Update usage count for non-premium users
    if (!userData?.is_premium) {
      await supabase
        .from('users')
        .update({
          ai_resume_checks_used: (userData?.ai_resume_checks_used || 0) + 1,
        })
        .eq('id', user.id)
    }

    return NextResponse.json({
      success: true,
      result,
      remainingUses: userData?.is_premium ? 'unlimited' : FREE_USES_LIMIT - (userData?.ai_resume_checks_used || 0) - 1,
    })
  } catch (error) {
    console.error('Resume analysis error:', error)
    return NextResponse.json({
      error: 'Analysefehler',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    }, { status: 500 })
  }
}
