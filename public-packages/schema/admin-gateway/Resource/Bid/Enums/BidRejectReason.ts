export const BidRejectReasonType = ['OFFER_MAKER_REJECT', 'MODERATOR_REJECT'] as const;
export type BidRejectReasonType = (typeof BidRejectReasonType)[number];
