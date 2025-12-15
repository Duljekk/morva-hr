export type UserRole = 'employee' | 'hr_admin';

export const USER_ROLES = {
  EMPLOYEE: 'employee' as UserRole,
  HR_ADMIN: 'hr_admin' as UserRole,
} as const;


