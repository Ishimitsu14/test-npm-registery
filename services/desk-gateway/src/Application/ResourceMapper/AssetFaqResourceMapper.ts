import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';

import { AssetResourceMapper } from './AssetResourceMapper';

export class AssetFaqResourceMapper {
  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  toAssetFaqKey(item: LotManagementSchema.AssetFaqKey): Required<DeskGatewaySchema.AssetFaqKey> {
    return {
      resource: 'asset_faq_key',
      id: item.id,
    };
  }

  toAssetFaq(item: LotManagementSchema.AssetFaq): Required<DeskGatewaySchema.AssetFaq> {
    return {
      resource: 'asset_faq',
      id: item.id,
      assetKey: this.assetResourceMapper.toAssetKey(item.assetKey),
      question: item.question,
      answer: item.answer,
      createdAt: item.createdAt,
    };
  }
}
