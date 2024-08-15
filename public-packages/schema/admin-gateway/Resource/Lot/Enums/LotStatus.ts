export const LotStatus = ['DRAFT', 'ON_MODERATION', 'ACTIVE', 'REJECTED', 'COMPLETED', 'ARCHIVED'] as const;
export type LotStatus = (typeof LotStatus)[number];
