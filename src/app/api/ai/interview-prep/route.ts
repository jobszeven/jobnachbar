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

    if (!jobTitle || !industry) {
      return NextResponse.json({
        error: 'Fehlende Informationen',
        message: 'Bitte fülle Job-Titel und Branche aus.',
      }, { status: 400 })
    }

    // Generate interview prep - use industry as company context if no company specified
    const result = await generateInterviewPrep(jobTitle, companyName || `Unternehmen in der ${industry}-Branche`, industry)

    // Update usage count for non-premium users
    if (!userData?.is_premium) {
      await supabase
        .from('users')
        .update({
          ai_interview_preps_used: (userData?.ai_interview_preps_used || 0) + 1,
        })
        .eq('id', user.id)
    }

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
