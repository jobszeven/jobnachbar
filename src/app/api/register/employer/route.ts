import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use service role to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      authId,
      email,
      companyName,
      contactPerson,
      phone,
      street,
      zipCode,
      city,
      website,
      industry,
      companySize,
      aboutCompany,
      selectedPlan,
    } = body

    // Validate required fields
    if (!authId || !email || !companyName || !contactPerson) {
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen' },
        { status: 400 }
      )
    }

    // Insert company profile using admin client (bypasses RLS)
    // NOTE: subscription_tier is always 'free' at registration
    // It will be updated to the paid tier AFTER successful payment via Stripe webhook
    const { data, error } = await supabaseAdmin
      .from('companies')
      .insert({
        auth_id: authId,
        email: email,
        company_name: companyName,
        contact_person: contactPerson,
        phone: phone || null,
        street: street || null,
        zip_code: zipCode,
        city: city,
        website: website || null,
        industry: industry || null,
        company_size: companySize || null,
        about_company: aboutCompany || null,
        subscription_tier: 'free', // Always start as free, upgrade after payment
        subscription_expires: null,
      })
      .select()
      .single()

    if (error) {
      console.error('Company profile creation error:', error)
      return NextResponse.json(
        { error: 'Firmenprofil konnte nicht erstellt werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error('Registration API error:', err)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
