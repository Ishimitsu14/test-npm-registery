export const MediatorType = ['DIRECT', 'OTC_AGENT', 'MARKETPLACE'] as const;
export type MediatorType = (typeof MediatorType)[number];
