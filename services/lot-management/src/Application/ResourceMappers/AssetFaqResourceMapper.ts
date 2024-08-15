import { LotManagementSchema } from '@schema/lot-management';

import { AssetFaq, AssetPK } from '../../Domain';

export class AssetFaqResourceMapper {
  toAssetFaq(assetFaq: AssetFaq): LotManagementSchema.AssetFaq {
    return {
      resource: 'asset_faq',
      id: assetFaq.primaryKey.id,
      assetKey: this.toAssetKey(assetFaq.assetPK),
      question: assetFaq.question,
      answer: assetFaq.answer,
      createdAt: +assetFaq.createdAt,
    };
  }

  toAssetKey(assetPK: AssetPK): LotManagementSchema.AssetKey {
    return {
      resource: 'asset_key',
      id: assetPK.id,
    };
  }
}
