import { FileManagementSchema } from '@schema/file-management';

import { AssetKey, AssetLinkUpsert, AssetTier, AssetVertical } from '../../../Resource';

export namespace AssetUpdate {
  export type Payload = {
    id: AssetKey['id'];

    title?: string;
    description?: string;
    verticals?: AssetVertical[];
    tier?: AssetTier;
    links?: AssetLinkUpsert[];

    logoFile?: FileManagementSchema.FileKey['id'];
    analyticFile?: FileManagementSchema.FileKey['id'];
  };
  export type Result = void;
}
