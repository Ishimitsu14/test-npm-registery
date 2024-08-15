import { Asset, AssetKey } from '../../../Resource';

export type AssetArchivePayload = {
  id: AssetKey['id'];
}

export type AssetArchiveResult = Asset
