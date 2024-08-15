import { Asset, AssetLink, AssetTier, AssetVertical, FileKey } from '../../../Resource';
export type AssetCreatePayload = {
    id: string;
    title: string;
    description: string;
    verticals: AssetVertical[];
    tier: AssetTier;
    links: AssetLink[];
    logoFile?: FileKey['id'];
    analyticFile?: FileKey['id'];
};
export type AssetCreateResult = Asset;
