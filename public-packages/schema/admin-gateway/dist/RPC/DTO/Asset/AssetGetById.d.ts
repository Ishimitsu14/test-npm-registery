import { Asset, AssetKey } from '../../../Resource';
export type AssetGetByIdPayload = {
    id: AssetKey['id'];
};
export type AssetGetByIdResult = Asset;
