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
      firstName,
      lastName,
      phone,
      birthdate,
      zipCode,
      city,
      radiusKm,
      jobTitleWanted,
      industries,
      employmentTypes,
      experienceYears,
      availableFrom,
      salaryExpectation,
      aboutMe,
      emailNotifications,
      whatsappNotifications,
      whatsappNumber,
    } = body

    // Validate required fields
    if (!authId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen' },
        { status: 400 }
      )
    }

    // Insert user profile using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        auth_id: authId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        birthdate: birthdate || null,
        zip_code: zipCode,
        city: city,
        radius_km: radiusKm || 30,
        job_title_wanted: jobTitleWanted || null,
        industries: industries || [],
        employment_types: employmentTypes || [],
        experience_years: experienceYears || 0,
        available_from: availableFrom || null,
        salary_expectation: salaryExpectation || null,
        about_me: aboutMe || null,
        email_notifications: emailNotifications ?? true,
        whatsapp_notifications: whatsappNotifications ?? false,
        whatsapp_number: whatsappNumber || null,
      })
      .select()
      .single()

    if (error) {
      console.error('User profile creation error:', error)
      return NextResponse.json(
        { error: 'Benutzerprofil konnte nicht erstellt werden' },
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
