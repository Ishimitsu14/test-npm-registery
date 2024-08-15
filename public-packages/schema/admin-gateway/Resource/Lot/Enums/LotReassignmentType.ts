export const LotReassignmentType = ['DIRECT', 'SPV', 'FORWARD_CONTRACT'] as const;
export type LotReassignmentType = (typeof LotReassignmentType)[number];
