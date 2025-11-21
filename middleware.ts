import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * OPTIMIZED MIDDLEWARE
 * 
 * Performance optimizations:
 * 1. Matcher config excludes static assets, API routes, and _next files
 * 2. Early cookie check before Supabase auth call (reduces unnecessary API calls)
 * 3. Only creates Supabase client when needed
 * 4. Optimized path checking with early returns
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // OPTIMIZATION: Check for auth cookies first before making Supabase call
  // This reduces unnecessary Supabase API calls for unauthenticated requests
  // Supabase SSR stores auth tokens in cookies with pattern: sb-<project-ref>-auth-token
  // We check for any cookie starting with 'sb-' which indicates Supabase auth
  const hasAuthCookie = request.cookies.getAll().some(cookie => 
    cookie.name.startsWith('sb-')
  );

  // If no auth cookies and accessing protected route, redirect immediately
  // This avoids creating Supabase client and making API calls
  if (!hasAuthCookie && !isPublicRoute) {
    console.log(`🟢 Middleware: No auth cookies, redirecting ${pathname} -> /login`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Create Supabase client only when needed (has auth cookies or is public route)
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  // Only called when auth cookies exist or on public routes
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(`🟢 Middleware: ${pathname} - User: ${user ? user.id : 'NONE'}`);

  // If trying to access a protected route without authentication, redirect to login
  if (!isPublicRoute && !user) {
    console.log(`🟢 Middleware: No user, redirecting ${pathname} -> /login`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Fetch user profile once if authenticated (for role-based redirects)
  let userProfile: { role: string } | null = null;
  if (user && (pathname === '/login' || pathname === '/' || pathname.startsWith('/hr'))) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    userProfile = profile;
  }

  // If authenticated and trying to access login page, redirect based on role
  if (pathname === '/login' && user && userProfile) {
    const redirectPath = userProfile.role === 'hr_admin' ? '/hr' : '/';
    console.log(`🟢 Middleware: User authenticated, redirecting /login -> ${redirectPath}`);
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  // Redirect HR admins from home page to /hr
  if (pathname === '/' && user && userProfile?.role === 'hr_admin') {
    console.log(`🟢 Middleware: HR admin accessing home, redirecting / -> /hr`);
    const url = request.nextUrl.clone();
    url.pathname = '/hr';
    return NextResponse.redirect(url);
  }

  // Check HR role for /hr routes
  if (pathname.startsWith('/hr') && user) {
    if (!userProfile) {
      const { data: profile, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      userProfile = profile;
      
      if (error || !userProfile || userProfile.role !== 'hr_admin') {
        console.log(`🟢 Middleware: User ${user.id} does not have HR role, redirecting ${pathname} -> /`);
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } else if (userProfile.role !== 'hr_admin') {
      console.log(`🟢 Middleware: User ${user.id} does not have HR role, redirecting ${pathname} -> /`);
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  console.log(`🟢 Middleware: Allowing access to ${pathname}`);
  return supabaseResponse;
}

/**
 * OPTIMIZED MATCHER CONFIG
 * 
 * Excludes static assets, API routes, and Next.js internal files to prevent
 * unnecessary middleware execution and improve performance.
 * 
 * Matcher patterns:
 * - Excludes: _next/static, _next/image, _next/webpack, API routes, static files
 * - Includes: All page routes that need authentication checks
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack (webpack chunks)
     * - favicon.ico (favicon file)
     * - Static file extensions (images, fonts, etc.)
     * - Prefetch requests (next-router-prefetch header)
     */
    {
      source: '/((?!api|_next/static|_next/image|_next/webpack|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css|js)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};


