import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)

  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null

  // We need to track cookies that need to be set
  const cookiesToSet: { name: string; value: string; options: CookieOptions }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Store cookies to set them on the final response
          cookiesToSet.push({ name, value, options })
        },
        remove(name: string, options: CookieOptions) {
          cookiesToSet.push({ name, value: '', options })
        },
      },
    }
  )

  // Helper function to create redirect with cookies
  function createRedirectWithCookies(url: string) {
    const response = NextResponse.redirect(new URL(url, request.url))

    // Apply all stored cookies to the response
    for (const cookie of cookiesToSet) {
      response.cookies.set({
        name: cookie.name,
        value: cookie.value,
        ...cookie.options,
      })
    }

    return response
  }

  // Handle email verification (token_hash + type)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error && data.user) {
      const userType = data.user.user_metadata?.user_type || 'applicant'
      const selectedPlan = data.user.user_metadata?.selected_plan || 'free'

      // Build redirect URL with plan info
      const redirectParams = new URLSearchParams({
        type: userType,
        plan: selectedPlan,
      })

      return createRedirectWithCookies(`/email-verifiziert?${redirectParams.toString()}`)
    }

    console.error('Email verification error:', error)
    return createRedirectWithCookies('/login?error=verification_failed')
  }

  // Handle OAuth/PKCE flow (code parameter)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const userType = data.user.user_metadata?.user_type || 'applicant'
      const selectedPlan = data.user.user_metadata?.selected_plan || 'free'

      const redirectParams = new URLSearchParams({
        type: userType,
        plan: selectedPlan,
      })

      return createRedirectWithCookies(`/email-verifiziert?${redirectParams.toString()}`)
    }

    console.error('OAuth code exchange error:', error)
    return createRedirectWithCookies('/login?error=verification_failed')
  }

  // No valid parameters - redirect to login with error
  return createRedirectWithCookies('/login?error=missing_params')
}
