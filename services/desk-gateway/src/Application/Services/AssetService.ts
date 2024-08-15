import { NullableObject } from '@ddd/core';
import { forwardRef, Inject } from '@nestjs/common';
import { CoreSchema } from '@schema/core';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { AssetResourceMapper } from '../ResourceMapper';
import { AssetFaqService } from './AssetFaqService';
import { BidService } from './BidService';
import { DealService } from './DealService';
import { LotService } from './LotService';

export class AssetService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private fileManagementClient: FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => AssetResourceMapper))
  private assetResourceMapper: AssetResourceMapper;

  @Inject(forwardRef(() => LotService))
  private lotService: LotService;

  @Inject(forwardRef(() => BidService))
  private bidService: BidService;

  @Inject(forwardRef(() => DealService))
  private dealService: DealService;

  @Inject(forwardRef(() => AssetFaqService))
  private assetFaqService: AssetFaqService;

  async getById(payload: DeskGatewaySchema.AssetGetByIdPayload): Promise<DeskGatewaySchema.AssetGetByIdResult> {
    const item = await this.lotManagementRpc.send('asset.getById', { id: payload.id });

    return this.fetch(item);
  }

  async list(payload: DeskGatewaySchema.AssetListPayload): Promise<DeskGatewaySchema.AssetListResult> {
    const filter = this.filterList(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('asset.list', { filter, page: payload.page, include });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links);

    return {
      total,
      links: internalLinks.concat(externalLinks),
      items: await this.fetchMany(items),
    };
  }

  async fetch(item: LotManagementSchema.Asset) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.Asset[]) {
    const images = items.map((m) => m.info.logoFile).filter(NullableObject.hasValue);
    const docs = items.map((m) => m.info.analyticFile).filter(NullableObject.hasValue);

    const imagesFileResult = images.length > 0 ? await this.fileManagementClient.send('file.list', { filter: { id: images.map((m) => m.id) } }).then((m) => m.items) : [];
    const docsFileResult = docs.length > 0 ? await this.fileManagementClient.send('file.list', { filter: { id: docs.map((m) => m.id) }, asAttachment: true }).then((m) => m.items) : [];

    return items.map((m) => this.assetResourceMapper.toAsset(m, imagesFileResult.concat(docsFileResult)));
  }

  filterList(filter: DeskGatewaySchema.AssetListFilter): LotManagementSchema.RPC.DTO.AssetList.Filter {
    return compositeFilterGateway(filter, (filter) => ({
      id: filter.id,

      search: filter.search,
      withLots: filter.withLots,
      tier: filter.tier,
      verticals: filter.verticals,
      status: filter.status,

      lot: this.lotService.toFilter(filter.lot),
      bid: this.bidService.toFilter(filter.bid),
      deal: this.dealService.toFilter(filter.deal),
    }));
  }

  toInclude(include: boolean | DeskGatewaySchema.AssetListInclude): LotManagementSchema.RPC.DTO.AssetList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {
      assetLotStatsAggregation: include?.assetLotStatsAggregation,
      assetFaq: include?.assetFaq,
    };
  }

  toInternalIncludeLinks(items: LotManagementSchema.Asset[], include: boolean | DeskGatewaySchema.AssetListInclude) {
    return includeLinks(include, async (include, links) => {});
  }

  async toExternalIncludeLinks(links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.AssetList.Include>[]): Promise<CoreSchema.IncludeLink<DeskGatewaySchema.AssetListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<DeskGatewaySchema.AssetListInclude>[] = [];

    const assetFaq = await this.assetFaqService.fetchMany(links.filter((item) => item.resource === 'asset_faq') as LotManagementSchema.AssetFaq[]);
    externalLinks.push(...assetFaq);

    for (const link of links) {
      if (link.resource === 'asset_lot_stats_aggregation') externalLinks.push(this.assetResourceMapper.toAssetLotStatsAggregation(link));
    }

    return externalLinks;
  }

  // async includeLinks(items: LotManagementSchema.Asset[], include: boolean | DeskGatewaySchema.RPC.DTO.AssetList.Payload['include']) {
  //   return includeLinks(include, async (include, links) => {
  //     if (include.assetLotStatsAggregation) {
  //       const stats = await this.aggregatorBus.resolve(new AssetLotStatsAggregator(items));
  //       links.push(...stats.map((item) => this.assetResourceMapper.toAssetLotStatsAggregation(item)));
  //     }
  //   });
  // }
}
