export const InvestorType = ['PRIVATE_INVESTOR', 'VENTURE_FUND', 'COMMUNITY_FUND', 'PROJECT_TEAM'] as const;
export type InvestorType = (typeof InvestorType)[number];
