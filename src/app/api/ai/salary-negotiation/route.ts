import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSalaryNegotiation } from '@/lib/ai/gemini'

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
      .select('is_premium, ai_salary_tips_used')
      .eq('id', user.id)
      .single()

    if (!userData?.is_premium && (userData?.ai_salary_tips_used || 0) >= FREE_USES_LIMIT) {
      return NextResponse.json({
        error: 'Limit erreicht',
        message: 'Du hast deine kostenlosen Gehaltstipps aufgebraucht. Upgrade auf Premium für unbegrenzten Zugang.',
        limitReached: true,
      }, { status: 403 })
    }

    const { jobTitle, experience, location, currentSalary } = await request.json()

    if (!jobTitle || !experience || !location) {
      return NextResponse.json({
        error: 'Fehlende Informationen',
        message: 'Bitte fülle alle Pflichtfelder aus.',
      }, { status: 400 })
    }

    // Generate salary negotiation tips
    const result = await generateSalaryNegotiation(jobTitle, experience, location, currentSalary)

    // Update usage count for non-premium users
    if (!userData?.is_premium) {
      await supabase
        .from('users')
        .update({
          ai_salary_tips_used: (userData?.ai_salary_tips_used || 0) + 1,
        })
        .eq('id', user.id)
    }

    return NextResponse.json({
      success: true,
      result,
      remainingUses: userData?.is_premium ? 'unlimited' : FREE_USES_LIMIT - (userData?.ai_salary_tips_used || 0) - 1,
    })
  } catch (error) {
    console.error('Salary negotiation error:', error)
    return NextResponse.json({
      error: 'Generierungsfehler',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    }, { status: 500 })
  }
}
