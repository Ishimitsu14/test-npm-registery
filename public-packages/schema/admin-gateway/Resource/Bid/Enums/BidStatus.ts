export const BidStatus = ['ON_MODERATION', 'ACTIVE', 'DEAL', 'REJECTED', 'ARCHIVED'] as const;
export type BidStatus = (typeof BidStatus)[number];
