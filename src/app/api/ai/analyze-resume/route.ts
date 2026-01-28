import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeResume } from '@/lib/ai/gemini'

const FREE_USES_LIMIT = 3
const ANONYMOUS_FREE_USES = 1
const FEATURE_TYPE = 'resume'

function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }
  return 'unknown'
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()

    // Handle anonymous users
    if (!user) {
      const clientIP = getClientIP(request)

      if (clientIP === 'unknown') {
        return NextResponse.json({
          error: 'Zugriff verweigert',
          message: 'IP-Adresse konnte nicht ermittelt werden. Bitte melde dich an.',
        }, { status: 403 })
      }

      // Check anonymous usage in last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

      const { data: anonymousUsage, error: usageError } = await supabase
        .from('anonymous_usage')
        .select('id')
        .eq('ip_address', clientIP)
        .eq('feature_type', FEATURE_TYPE)
        .gte('used_at', twentyFourHoursAgo)

      if (usageError) {
        console.error('Anonymous usage check error:', usageError)
      }

      const usageCount = anonymousUsage?.length || 0

      if (usageCount >= ANONYMOUS_FREE_USES) {
        return NextResponse.json({
          error: 'Limit erreicht',
          message: 'Du hast dein kostenloses Kontingent aufgebraucht. Melde dich an für mehr Zugang oder upgrade auf Premium für unbegrenzten Zugang.',
          limitReached: true,
          isAnonymous: true,
        }, { status: 403 })
      }

      // Parse request body
      const { resumeText } = await request.json()

      if (!resumeText || resumeText.length < 100) {
        return NextResponse.json({
          error: 'Lebenslauf zu kurz',
          message: 'Bitte gib einen vollständigen Lebenslauf ein (mindestens 100 Zeichen).',
        }, { status: 400 })
      }

      // Analyze the resume
      const result = await analyzeResume(resumeText)

      // Track anonymous usage
      const { error: insertError } = await supabase
        .from('anonymous_usage')
        .insert({
          ip_address: clientIP,
          feature_type: FEATURE_TYPE,
          used_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('Failed to track anonymous usage:', insertError)
      }

      return NextResponse.json({
        success: true,
        result,
        remainingUses: ANONYMOUS_FREE_USES - usageCount - 1,
        isAnonymous: true,
      })
    }

    // Handle logged-in users
    const { data: userData } = await supabase
      .from('users')
      .select('is_premium, ai_resume_checks_used')
      .eq('id', user.id)
      .single()

    // Premium users have unlimited access
    if (userData?.is_premium) {
      const { resumeText } = await request.json()

      if (!resumeText || resumeText.length < 100) {
        return NextResponse.json({
          error: 'Lebenslauf zu kurz',
          message: 'Bitte gib einen vollständigen Lebenslauf ein (mindestens 100 Zeichen).',
        }, { status: 400 })
      }

      const result = await analyzeResume(resumeText)

      return NextResponse.json({
        success: true,
        result,
        remainingUses: 'unlimited',
      })
    }

    // Free logged-in users have limited access
    if ((userData?.ai_resume_checks_used || 0) >= FREE_USES_LIMIT) {
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
    await supabase
      .from('users')
      .update({
        ai_resume_checks_used: (userData?.ai_resume_checks_used || 0) + 1,
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      result,
      remainingUses: FREE_USES_LIMIT - (userData?.ai_resume_checks_used || 0) - 1,
    })
  } catch (error) {
    console.error('Resume analysis error:', error)
    return NextResponse.json({
      error: 'Analysefehler',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    }, { status: 500 })
  }
}
