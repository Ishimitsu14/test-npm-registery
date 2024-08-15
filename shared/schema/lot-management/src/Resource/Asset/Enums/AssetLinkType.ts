export const AssetLinkType = ['SITE', 'WHITE_PAPER', 'GITHUB', 'TWITTER', 'REDDIT', 'DISCORD', 'OTHER'] as const;
export type AssetLinkType = (typeof AssetLinkType)[number];
