import { AssetTier, AssetVertical } from '../Enums';
import { AssetLink } from './AssetLink';
export interface AssetInfo {
    title: string;
    description: string;
    tier: AssetTier;
    links: AssetLink[];
    verticals: AssetVertical[];
    logoURL?: string;
    analyticURL?: string;
}
