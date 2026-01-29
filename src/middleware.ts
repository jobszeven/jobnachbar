import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to verification page if email is not confirmed
  if (isProtectedRoute && user && !user.email_confirmed_at) {
    const redirectUrl = new URL('/verifizierung-ausstehend', request.url)
    if (user.email) {
      redirectUrl.searchParams.set('email', user.email)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect logged-in users away from auth pages
  const authRoutes = ['/login', '/registrieren']
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAuthRoute && user) {
    // Check user type and redirect to appropriate dashboard
    const userType = user.user_metadata?.user_type
    if (userType === 'employer') {
      return NextResponse.redirect(new URL('/dashboard/arbeitgeber', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard/bewerber', request.url))
    }
  }

  // Prevent cross-role dashboard access
  if (user && user.email_confirmed_at) {
    const userType = user.user_metadata?.user_type

    // Employer trying to access applicant dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard/bewerber') && userType === 'employer') {
      return NextResponse.redirect(new URL('/dashboard/arbeitgeber', request.url))
    }

    // Applicant trying to access employer dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard/arbeitgeber') && userType === 'applicant') {
      return NextResponse.redirect(new URL('/dashboard/bewerber', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
