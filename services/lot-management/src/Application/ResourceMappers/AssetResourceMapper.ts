import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';

import { Asset, AssetInfo, AssetLink, AssetLotStatsAggregatorResult, AssetPK } from '../../Domain';
import { FileResourceMapper } from './FileResourceMapper';

export class AssetResourceMapper {
  @Inject(FileResourceMapper)
  private fileResourceMapper: FileResourceMapper;

  toAssetKey(value: AssetPK): Required<LotManagementSchema.AssetKey> {
    return { resource: 'asset_key', id: value.id };
  }

  toAsset(value: Asset): Required<LotManagementSchema.Asset> {
    return {
      resource: 'asset',
      id: value.primaryKey.id,
      info: this.toAssetInfo(value.info),
      score: value.score,
      status: value.status.id,
    };
  }

  toAssetLink(value: AssetLink): Required<LotManagementSchema.AssetLink> {
    return {
      type: value.type.id,
      group: value.type.group.id,
      url: value.url,
      title: value.title,
    };
  }

  toAssetInfo(value: AssetInfo): Required<LotManagementSchema.AssetInfo> {
    return {
      title: value.title,
      description: value.description,
      logoFile: NullableObject.mapUndefined(value.logoFile, (m) => this.fileResourceMapper.toFileKey(m)),
      analyticFile: NullableObject.mapUndefined(value.analyticFile, (m) => this.fileResourceMapper.toFileKey(m)),
      tier: value.tier.id,
      links: value.links.items.map((item) => this.toAssetLink(item)),
      verticals: value.verticals.items.map((item) => item.id),
    };
  }

  toAssetLotStatsAggregation(value: AssetLotStatsAggregatorResult): Required<LotManagementSchema.AssetLotStatsAggregation> {
    return {
      resource: 'asset_lot_stats_aggregation',

      primaryKey: this.toAssetKey(value.primaryKey),
      averageFdv: value.averageFdv.toString(),
      lotBuyCount: value.lotBuyCount,
      lotSellCount: value.lotSellCount,
      lotBuyCvSum: value.lotBuyCvSum.toString(),
      lotSellCvSum: value.lotSellCvSum.toString(),
    };
  }
}
