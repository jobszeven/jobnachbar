import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)

  // Supabase sends different parameters depending on the flow:
  // - OAuth/PKCE: code parameter
  // - Email verification: token_hash + type parameters
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') ?? '/'

  // Create response object for cookie handling
  let redirectUrl = new URL('/login?error=verification_failed', request.url)
  const response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Handle email verification (token_hash + type)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error && data.user) {
      const userType = data.user.user_metadata?.user_type || 'applicant'
      return NextResponse.redirect(
        new URL(`/email-verifiziert?type=${userType}`, request.url)
      )
    }

    console.error('Email verification error:', error)
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', request.url)
    )
  }

  // Handle OAuth/PKCE flow (code parameter)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const userType = data.user.user_metadata?.user_type || 'applicant'
      return NextResponse.redirect(
        new URL(`/email-verifiziert?type=${userType}`, request.url)
      )
    }

    console.error('OAuth code exchange error:', error)
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', request.url)
    )
  }

  // No valid parameters - redirect to login with error
  return NextResponse.redirect(
    new URL('/login?error=missing_params', request.url)
  )
}
