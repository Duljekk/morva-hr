import type { UserRole } from '@/lib/types/roles';

interface CachedProfile {
  role: UserRole;
  is_active: boolean;
  cachedAt: number;
}

// In-memory cache for user profiles
const profileCache = new Map<string, CachedProfile>();

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

export function getCachedProfile(userId: string): CachedProfile | null {
  const cached = profileCache.get(userId);
  
  if (!cached) {
    return null;
  }
  
  // Check if cache is expired
  const now = Date.now();
  if (now - cached.cachedAt > CACHE_TTL) {
    profileCache.delete(userId);
    return null;
  }
  
  return cached;
}

export function setCachedProfile(userId: string, role: UserRole, isActive: boolean): void {
  profileCache.set(userId, {
    role,
    is_active: isActive,
    cachedAt: Date.now(),
  });
}

export function cleanupExpiredCache(): void {
  const now = Date.now();
  const toDelete: string[] = [];
  
  profileCache.forEach((cached, userId) => {
    if (now - cached.cachedAt > CACHE_TTL) {
      toDelete.push(userId);
    }
  });
  
  toDelete.forEach(userId => profileCache.delete(userId));
  
  if (toDelete.length > 0) {
    console.log(`🧹 [ProfileCache] Cleaned up ${toDelete.length} expired cache entries`);
  }
}


