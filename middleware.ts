import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  getRouteGroup,
  hasRoutePermission,
  getDefaultRedirectPath,
  isPublicRoute,
  requiresAuthentication,
  ROUTE_GROUPS,
  type UserRole,
} from '@/lib/middleware/permissions';
import {
  getCachedProfile,
  setCachedProfile,
  cleanupExpiredCache,
} from '@/lib/middleware/profileCache';

/**
 * ENHANCED MIDDLEWARE WITH ROUTE GROUPS & PERMISSIONS
 * 
 * Features:
 * 1. Route group detection (employee, hr, auth)
 * 2. Permission-based access control
 * 3. Optimized profile fetching with caching
 * 4. Enhanced logging for unauthorized access attempts
 * 5. Smart redirect logic based on user role and route groups
 * 
 * Performance optimizations:
 * - Early cookie check before Supabase auth call
 * - Profile caching (5-minute TTL) to reduce database queries
 * - Route group pattern matching for efficient permission checks
 * - Cleanup expired cache entries periodically
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const startTime = Date.now();

  // Cleanup expired cache entries periodically (every 100 requests)
  // This prevents memory leaks while maintaining performance
  if (Math.random() < 0.01) {
    cleanupExpiredCache();
  }

  // Detect route group for the current pathname
  const routeGroup = getRouteGroup(pathname);
  const isPublic = isPublicRoute(pathname);
  const requiresAuth = requiresAuthentication(pathname);

  // Log route group detection
  if (routeGroup) {
    console.log(`🟢 [Middleware] Route: ${pathname} → Group: ${routeGroup} (Public: ${isPublic})`);
  }

  // OPTIMIZATION: Check for auth cookies first before making Supabase call
  // This reduces unnecessary Supabase API calls for unauthenticated requests
  const hasAuthCookie = request.cookies.getAll().some(cookie =>
    cookie.name.startsWith('sb-')
  );

  // Early return for unauthenticated users accessing protected routes
  if (!hasAuthCookie && requiresAuth) {
    console.warn(`⚠️ [Middleware] Unauthorized access attempt: ${pathname} (no auth cookies)`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Create Supabase client only when needed
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

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Handle authentication errors
  if (authError) {
    console.error(`❌ [Middleware] Auth error for ${pathname}:`, authError.message);
    if (requiresAuth) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // If accessing protected route without authentication, redirect to login
  if (requiresAuth && !user) {
    console.warn(`⚠️ [Middleware] Unauthorized access attempt: ${pathname} (no user)`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Fetch user profile with caching
  let userRole: UserRole | null = null;
  let userProfile: { role: string; is_active: boolean } | null = null;

  if (user) {
    // Try to get cached profile first
    const cached = getCachedProfile(user.id);
    
    if (cached) {
      userRole = cached.role;
      userProfile = {
        role: cached.role,
        is_active: cached.is_active,
      };
      console.log(`✅ [Middleware] Using cached profile for user ${user.id} (role: ${userRole})`);
    } else {
      // Fetch from database if not cached
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, is_active')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error(`❌ [Middleware] Error fetching profile for ${user.id}:`, profileError.message);
        // If profile fetch fails and route requires auth, redirect to login
        if (requiresAuth) {
          const url = request.nextUrl.clone();
          url.pathname = '/login';
          url.searchParams.set('from', pathname);
          return NextResponse.redirect(url);
        }
      } else if (profile) {
        userRole = profile.role as UserRole;
        userProfile = profile;
        
        // Cache the profile for future requests
        setCachedProfile(user.id, userRole, profile.is_active);
        console.log(`💾 [Middleware] Cached profile for user ${user.id} (role: ${userRole})`);
      }
    }

    // Check if user is active
    if (userProfile && !userProfile.is_active && requiresAuth) {
      console.warn(`⚠️ [Middleware] Inactive user ${user.id} attempting to access ${pathname}`);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('error', 'account_inactive');
      return NextResponse.redirect(url);
    }
  }

  // Check route permissions using the permission system
  if (routeGroup && user) {
    const hasPermission = hasRoutePermission(userRole, routeGroup);
    
    if (!hasPermission) {
      console.warn(
        `🚫 [Middleware] Unauthorized access attempt: User ${user.id} (role: ${userRole}) ` +
        `attempted to access ${pathname} (requires: ${ROUTE_GROUPS[routeGroup].requiredRoles.join(', ')})`
      );
      
      // Redirect to default path for user role
      const redirectPath = getDefaultRedirectPath(userRole);
      const url = request.nextUrl.clone();
      url.pathname = redirectPath;
      return NextResponse.redirect(url);
    }
  }

  // Handle authenticated users accessing login page
  if (pathname === '/login' && user && userRole) {
    const redirectPath = getDefaultRedirectPath(userRole);
    console.log(`🔄 [Middleware] Authenticated user accessing /login, redirecting to ${redirectPath}`);
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  // Handle role-based redirects for home page
  if (pathname === '/' && user && userRole) {
    const defaultPath = getDefaultRedirectPath(userRole);
    if (defaultPath !== '/') {
      console.log(`🔄 [Middleware] Redirecting ${userRole} from / to ${defaultPath}`);
      const url = request.nextUrl.clone();
      url.pathname = defaultPath;
      return NextResponse.redirect(url);
    }
  }

  // Log successful access
  const duration = Date.now() - startTime;
  console.log(
    `✅ [Middleware] Allowed access: ${pathname} ` +
    `(User: ${user ? user.id : 'NONE'}, Role: ${userRole || 'NONE'}, ` +
    `Group: ${routeGroup || 'NONE'}, Duration: ${duration}ms)`
  );

  return supabaseResponse;
}

/**
 * OPTIMIZED MATCHER CONFIG
 * 
 * Excludes static assets, API routes, and Next.js internal files to prevent
 * unnecessary middleware execution and improve performance.
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
