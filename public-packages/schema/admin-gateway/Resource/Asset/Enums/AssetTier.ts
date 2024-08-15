export const AssetTier = ['TIER_1', 'TIER_2', 'TIER_3', 'TIER_4'] as const;
export type AssetTier = (typeof AssetTier)[number];
