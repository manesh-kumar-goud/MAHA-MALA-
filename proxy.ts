import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
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

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/services',
    '/subsidy',
    '/gallery',
    '/blog',
    '/contact',
    '/auth', // All auth routes are public
    '/leads-dashboard', // Public lead dashboard
    '/faq',
  ]

  // Check if current path is public or is a static asset
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  const isStaticAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/api') || 
                        pathname.startsWith('/static') ||
                        pathname.includes('.')

  // Allow public routes and static assets
  if (isPublicRoute || isStaticAsset) {
    return response
  }

  // Protect dashboard routes - USERS ONLY (not admins)
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log('❌ Dashboard access denied - No session')
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Check if user is admin - admins should use /admin dashboard
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    if (userData && (userData.role === 'admin' || userData.role === 'super_admin')) {
      console.log('⚠ Admin trying to access user dashboard - Redirecting to /admin')
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    
    console.log('✓ Dashboard access granted for user:', session.user.id)
  }

  // Protect admin routes - require admin role
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has admin role
    const { data: userData, error } = await supabase
      .from('users')
      .select('role, is_active')
      .eq('id', session.user.id)
      .single()

    // Deny access if:
    // - Error fetching user data
    // - User not found
    // - User is not active
    // - User is not admin or super_admin
    if (error || !userData || !userData.is_active || 
        (userData.role !== 'admin' && userData.role !== 'super_admin')) {
      console.log('Access denied to admin route:', {
        userId: session.user.id,
        pathname,
        error: error?.message,
        role: userData?.role,
        isActive: userData?.is_active
      })
      // Non-admins trying to access admin panel → redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    console.log('✓ Admin access granted for:', userData.role)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)',
  ],
}


