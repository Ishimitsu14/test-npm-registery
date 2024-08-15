export const InvestRound = ['PRESALE', 'PRESEED', 'SEED', 'ROUND_A', 'ROUND_B', 'ROUND_C', 'PRIVATE', 'FUNDING_ROUND'] as const;
export type InvestRound = (typeof InvestRound)[number];
