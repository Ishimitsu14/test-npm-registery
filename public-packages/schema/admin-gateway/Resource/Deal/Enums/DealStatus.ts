export const DealStatus = ['NEGOTIATION', 'COMPLETED', 'REJECTED'] as const;
export type DealStatus = (typeof DealStatus)[number];
