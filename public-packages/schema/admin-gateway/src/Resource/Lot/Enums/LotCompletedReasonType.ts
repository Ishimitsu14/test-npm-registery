export const LotCompletedReasonType = ['DEADLINE', 'FULFILLED', 'MANUALLY'] as const;
export type LotCompletedReasonType = (typeof LotCompletedReasonType)[number];
