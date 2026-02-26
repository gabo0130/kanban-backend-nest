import { USER_ROLES } from './user-role.type';

const ROLE_NAMES: Record<(typeof USER_ROLES)[number], string> = {
  Admin: 'Admin',
  Manager: 'Manager',
  Member: 'Member',
};

export const ROLES_CATALOG = USER_ROLES.map((roleKey) => ({
  id: `role_${roleKey}`,
  key: roleKey,
  name: ROLE_NAMES[roleKey],
}));
