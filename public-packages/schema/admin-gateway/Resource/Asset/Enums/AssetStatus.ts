export const AssetStatus = ['ACTIVE', 'ARCHIVED'] as const;
export type AssetStatus = (typeof AssetStatus)[number];
