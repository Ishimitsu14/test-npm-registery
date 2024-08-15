import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { FileManagementSchema } from '@schema/file-management';
import { LotManagementSchema } from '@schema/lot-management';

import { FileManagementResourceMapper } from './FileManagementResourceMapper';

export class AssetResourceMapper {
  @Inject(FileManagementResourceMapper)
  private fileManagementResourceMapper: FileManagementResourceMapper;
  toAssetKey(item: LotManagementSchema.AssetKey): Required<DeskGatewaySchema.AssetKey> {
    return {
      resource: 'asset_key',
      id: item.id,
    };
  }

  toAsset(asset: LotManagementSchema.Asset, files: FileManagementSchema.File[]): Required<DeskGatewaySchema.Asset> {
    return {
      resource: 'asset',
      id: asset.id,
      info: this.toAssetInfo(asset.info, files),
      score: asset.score,
      status: asset.status,
    };
  }

  toAssetInfo(item: LotManagementSchema.AssetInfo, files: FileManagementSchema.File[]): Required<DeskGatewaySchema.AssetInfo> {
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

  toAssetLink(item: LotManagementSchema.AssetLink): Required<DeskGatewaySchema.AssetLink> {
    return {
      group: item.group,
      url: item.url,
      title: item.title,
      type: item.type,
    };
  }

  toAssetLotStatsAggregation(item: LotManagementSchema.AssetLotStatsAggregation): Required<DeskGatewaySchema.AssetLotStatsAggregation> {
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
