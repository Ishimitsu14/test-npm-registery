import { FileManagementSchema } from '@schema/file-management';

import { AssetTier, AssetVertical } from '../Enums';
import { AssetLink } from './AssetLink';

export interface AssetInfo {
  title: string;
  description: string;
  tier: AssetTier;
  links: AssetLink[];
  verticals: AssetVertical[];

  logoFile?: FileManagementSchema.FileKey;
  analyticFile?: FileManagementSchema.FileKey;
}
