/**
 * Re-export requireHRAdmin from server.ts for backward compatibility
 * 
 * Some files import from '@/lib/auth/requireHRAdmin' instead of '@/lib/auth/server'
 * This file maintains compatibility with those imports.
 */
export { requireHRAdmin, type RequireHRAdminResult } from './server';

