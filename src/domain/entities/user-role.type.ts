export const USER_ROLES = ['Admin', 'Manager', 'Member'] as const;

export type UserRole = (typeof USER_ROLES)[number];
