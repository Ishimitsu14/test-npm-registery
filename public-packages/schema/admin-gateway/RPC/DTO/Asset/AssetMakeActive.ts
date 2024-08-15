import { Asset, AssetKey } from '../../../Resource';

export type AssetMakeActivePayload = {
  id: AssetKey['id'];
};
export type AssetMakeActiveResult = Asset;
