/**
 * Profile Caching for Middleware
 * 
 * Caches user profile data in memory to avoid redundant database queries
 * Cache is scoped per request using Next.js request context
 * 
 * Best Practice: Use Map-based caching with TTL for middleware performance
 */

import type { UserRole } from '@/lib/types/roles';

interface CachedProfile {
  role: UserRole;
  is_active: boolean;
  cachedAt: number;
}

// In-memory cache with TTL (Time To Live)
// Key: userId, Value: CachedProfile
const profileCache = new Map<string, CachedProfile>();

// Cache TTL: 5 minutes (300,000 ms)
// This balances freshness with performance
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Get cached profile for a user
 * Returns null if not cached or cache expired
 */
export function getCachedProfile(userId: string): CachedProfile | null {
  const cached = profileCache.get(userId);
  
  if (!cached) {
    return null;
  }

  // Check if cache is expired
  const now = Date.now();
  if (now - cached.cachedAt > CACHE_TTL_MS) {
    // Cache expired, remove it
    profileCache.delete(userId);
    return null;
  }

  return cached;
}

/**
 * Set cached profile for a user
 */
export function setCachedProfile(
  userId: string,
  role: UserRole,
  is_active: boolean = true
): void {
  profileCache.set(userId, {
    role,
    is_active,
    cachedAt: Date.now(),
  });
}

/**
 * Clear cached profile for a user
 * Useful when user role changes
 */
export function clearCachedProfile(userId: string): void {
  profileCache.delete(userId);
}

/**
 * Clear all cached profiles
 * Useful for testing or when cache needs to be reset
 */
export function clearAllCachedProfiles(): void {
  profileCache.clear();
}

/**
 * Clean up expired cache entries
 * Should be called periodically to prevent memory leaks
 */
export function cleanupExpiredCache(): void {
  const now = Date.now();
  for (const [userId, cached] of profileCache.entries()) {
    if (now - cached.cachedAt > CACHE_TTL_MS) {
      profileCache.delete(userId);
    }
  }
}

