export const UserRoleType = ['MODERATOR', 'ADMIN'] as const;
export type UserRoleType = (typeof UserRoleType)[number];
