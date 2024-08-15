import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class AssetVertical extends Enumeration<LotManagementSchema.AssetVertical> {
  static BLOCKCHAIN_SERVICE = new AssetVertical('BLOCKCHAIN_SERVICE');
  static LAYER_1 = new AssetVertical('LAYER_1');
  static SOCIAL = new AssetVertical('SOCIAL');
  static CEFI = new AssetVertical('CEFI');
  static NFT = new AssetVertical('NFT');
  static BRIDGE = new AssetVertical('BRIDGE');
  static METAVERSE = new AssetVertical('METAVERSE');
  static ZK_ROLLUP = new AssetVertical('ZK_ROLLUP');
  static LENDING = new AssetVertical('LENDING');
  static INFRA = new AssetVertical('INFRA');
  static GAMEFI = new AssetVertical('GAMEFI');
  static DEFI = new AssetVertical('DEFI');
}
