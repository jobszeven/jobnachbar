import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateInterviewPrep } from '@/lib/ai/gemini'

const FREE_USES_LIMIT = 2
const ANONYMOUS_FREE_USES = 1
const FEATURE_TYPE = 'interview'

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
      const { jobTitle, companyName, industry } = await request.json()

      if (!jobTitle || !industry) {
        return NextResponse.json({
          error: 'Fehlende Informationen',
          message: 'Bitte fülle Job-Titel und Branche aus.',
        }, { status: 400 })
      }

      // Generate interview prep - use industry as company context if no company specified
      const result = await generateInterviewPrep(jobTitle, companyName || `Unternehmen in der ${industry}-Branche`, industry)

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

      // Transform result to match frontend expectations
      const questions = result.commonQuestions.map((q) => ({
        question: q.question,
        tips: result.tips.slice(0, 3),
        exampleAnswer: q.suggestedAnswer,
      }))

      return NextResponse.json({
        success: true,
        questions,
        companyResearch: result.companyResearch,
        remainingUses: ANONYMOUS_FREE_USES - usageCount - 1,
        isAnonymous: true,
      })
    }

    // Handle logged-in users
    const { data: userData } = await supabase
      .from('users')
      .select('is_premium, ai_interview_preps_used')
      .eq('id', user.id)
      .single()

    // Premium users have unlimited access
    if (userData?.is_premium) {
      const { jobTitle, companyName, industry } = await request.json()

      if (!jobTitle || !industry) {
        return NextResponse.json({
          error: 'Fehlende Informationen',
          message: 'Bitte fülle Job-Titel und Branche aus.',
        }, { status: 400 })
      }

      const result = await generateInterviewPrep(jobTitle, companyName || `Unternehmen in der ${industry}-Branche`, industry)

      const questions = result.commonQuestions.map((q) => ({
        question: q.question,
        tips: result.tips.slice(0, 3),
        exampleAnswer: q.suggestedAnswer,
      }))

      return NextResponse.json({
        success: true,
        questions,
        companyResearch: result.companyResearch,
        remainingUses: 'unlimited',
      })
    }

    // Free logged-in users have limited access
    if ((userData?.ai_interview_preps_used || 0) >= FREE_USES_LIMIT) {
      return NextResponse.json({
        error: 'Limit erreicht',
        message: 'Du hast deine kostenlosen Interview-Vorbereitungen aufgebraucht. Upgrade auf Premium für unbegrenzten Zugang.',
        limitReached: true,
      }, { status: 403 })
    }

    const { jobTitle, companyName, industry } = await request.json()

    if (!jobTitle || !industry) {
      return NextResponse.json({
        error: 'Fehlende Informationen',
        message: 'Bitte fülle Job-Titel und Branche aus.',
      }, { status: 400 })
    }

    // Generate interview prep - use industry as company context if no company specified
    const result = await generateInterviewPrep(jobTitle, companyName || `Unternehmen in der ${industry}-Branche`, industry)

    // Update usage count for non-premium users
    await supabase
      .from('users')
      .update({
        ai_interview_preps_used: (userData?.ai_interview_preps_used || 0) + 1,
      })
      .eq('id', user.id)

    // Transform result to match frontend expectations
    const questions = result.commonQuestions.map((q) => ({
      question: q.question,
      tips: result.tips.slice(0, 3), // Use general tips for each question
      exampleAnswer: q.suggestedAnswer,
    }))

    return NextResponse.json({
      success: true,
      questions,
      companyResearch: result.companyResearch,
      remainingUses: FREE_USES_LIMIT - (userData?.ai_interview_preps_used || 0) - 1,
    })
  } catch (error) {
    console.error('Interview prep error:', error)
    return NextResponse.json({
      error: 'Generierungsfehler',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    }, { status: 500 })
  }
}
