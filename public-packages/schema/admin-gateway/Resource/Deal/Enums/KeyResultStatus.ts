export const KeyResultStatus = ['NEW', 'PROCESS', 'COMPLETED', 'FAILED'] as const;
export type KeyResultStatus = (typeof KeyResultStatus)[number];
