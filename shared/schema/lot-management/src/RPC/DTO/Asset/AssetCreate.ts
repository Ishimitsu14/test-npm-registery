import { FileManagementSchema } from '@schema/file-management';

import { Asset, AssetKey, AssetLinkUpsert, AssetTier, AssetVertical } from '../../../Resource';

export namespace AssetCreate {
  export type Payload = {
    id: Asset['id'];
    title: string;
    description: string;
    verticals: AssetVertical[];
    tier: AssetTier;
    links: AssetLinkUpsert[];

    logoFile?: FileManagementSchema.FileKey['id'];
    analyticFile?: FileManagementSchema.FileKey['id'];
  };
  export type Result = AssetKey;
}
