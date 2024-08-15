export const LotType = ['SAFE', 'SAFT', 'TOKEN_WARRANT', 'EQUITY', 'UNLOCKED_TOKENS'] as const;
export type LotType = (typeof LotType)[number];
