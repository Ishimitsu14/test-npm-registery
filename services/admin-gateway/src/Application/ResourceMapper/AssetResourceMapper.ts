import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { FileManagementSchema } from '@schema/file-management';
import { LotManagementSchema } from '@schema/lot-management';

import { FileManagementResourceMapper } from './FileManagementResourceMapper';

export class AssetResourceMapper {
  @Inject(FileManagementResourceMapper)
  private fileManagementResourceMapper: FileManagementResourceMapper;
  toAssetKey(item: LotManagementSchema.AssetKey): Required<AdminGatewaySchema.AssetKey> {
    return {
      resource: 'asset_key',
      id: item.id,
    };
  }

  toAsset(asset: LotManagementSchema.Asset, files: FileManagementSchema.File[]): Required<AdminGatewaySchema.Asset> {
    return {
      resource: 'asset',
      id: asset.id,
      info: this.toAssetInfo(asset.info, files),
      score: asset.score,
      status: asset.status,
    };
  }

  toAssetInfo(item: LotManagementSchema.AssetInfo, files: FileManagementSchema.File[]): Required<AdminGatewaySchema.AssetInfo> {
    return {
      title: item.title,
      description: item.description,
      tier: item.tier,
      links: item.links.map((m) => this.toAssetLink(m)),
      verticals: item.verticals,
      logoURL: NullableObject.mapUndefined(
        files.find((m) => m.id === item.logoFile?.id),
        (m) => this.fileManagementResourceMapper.toFileURL(m),
      ),
      analyticURL: NullableObject.mapUndefined(
        files.find((m) => m.id === item.analyticFile?.id),
        (m) => this.fileManagementResourceMapper.toFileURL(m),
      ),
    };
  }

  toAssetLink(item: LotManagementSchema.AssetLink): Required<AdminGatewaySchema.AssetLink> {
    return {
      group: item.group,
      url: item.url,
      title: item.title,
      type: item.type,
    };
  }

  toAssetLotStatsAggregation(item: LotManagementSchema.AssetLotStatsAggregation): Required<AdminGatewaySchema.AssetLotStatsAggregation> {
    return {
      resource: 'asset_lot_stats_aggregation',
      id: item.primaryKey.id,
      lotBuyCount: item.lotBuyCount,
      lotBuyCvSum: item.lotBuyCvSum,
      lotSellCount: item.lotSellCount,
      lotSellCvSum: item.lotSellCvSum,
      averageFdv: item.averageFdv,
    };
  }
}
