export const LotQuestionStatus = ['ON_MODERATION', 'ACTIVE', 'REJECTED'] as const;
export type LotQuestionStatus = (typeof LotQuestionStatus)[number];
