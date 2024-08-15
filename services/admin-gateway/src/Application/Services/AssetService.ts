import { NullableObject } from '@ddd/core';
import { forwardRef, Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { CoreSchema } from '@schema/core';
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

  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  @Inject(forwardRef(() => LotService))
  private lotService: LotService;

  @Inject(forwardRef(() => BidService))
  private bidService: BidService;

  @Inject(forwardRef(() => DealService))
  private dealService: DealService;

  @Inject(forwardRef(() => AssetFaqService))
  private assetFaqService: AssetFaqService;

  async create(payload: AdminGatewaySchema.AssetCreatePayload): Promise<AdminGatewaySchema.AssetGetByIdResult> {
    const assetKey = await this.lotManagementRpc.send('asset.create', {
      id: payload.id,

      title: payload.title,
      description: payload.description,
      verticals: payload.verticals,
      tier: payload.tier,
      links: payload.links,

      logoFile: payload.logoFile,
      analyticFile: payload.analyticFile,
    });
    const asset = await this.lotManagementRpc.send('asset.getById', { id: assetKey.id });

    return this.fetch(asset);
  }

  async getById(payload: AdminGatewaySchema.AssetGetByIdPayload): Promise<AdminGatewaySchema.AssetGetByIdResult> {
    const asset = await this.lotManagementRpc.send('asset.getById', payload);

    return this.fetch(asset);
  }

  async getUploadAnalyticURL(payload: AdminGatewaySchema.AssetGetUploadAnalyticURLPayload): Promise<AdminGatewaySchema.AssetGetUploadAnalyticURLResult> {
    const uploader = await this.lotManagementRpc.send('asset.getUploadAnalyticURL', payload);

    return uploader;
  }

  async getUploadLogoURL(payload: AdminGatewaySchema.AssetGetUploadLogoURLPayload): Promise<AdminGatewaySchema.AssetGetUploadLogoURLResult> {
    const uploader = await this.lotManagementRpc.send('asset.getUploadLogoURL', payload);

    return uploader;
  }

  async list(payload: AdminGatewaySchema.AssetListPayload): Promise<AdminGatewaySchema.AssetListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('asset.list', {
      page: payload.page,
      filter,
      include,
      sort: payload.sort,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links);

    return {
      total,
      items: await this.fetchMany(items),
      links: internalLinks.concat(externalLinks),
    };
  }

  async update(payload: AdminGatewaySchema.AssetUpdatePayload): Promise<AdminGatewaySchema.AssetUpdateResult> {
    await this.lotManagementRpc.send('asset.update', {
      id: payload.id,

      title: payload.title,
      description: payload.description,
      verticals: payload.verticals,
      tier: payload.tier,
      links: payload.links,

      logoFile: payload.logoFile,
      analyticFile: payload.analyticFile,
    });

    const asset = await this.lotManagementRpc.send('asset.getById', { id: payload.id });
    return this.fetch(asset);
  }

  async resolve(payload: AdminGatewaySchema.AssetResolvePayload): Promise<AdminGatewaySchema.AssetResolveResult> {
    await this.lotManagementRpc.send('asset.resolve', {
      id: payload.id,
    });
  }

  async makeActive(payload: AdminGatewaySchema.AssetMakeActivePayload): Promise<AdminGatewaySchema.AssetMakeActiveResult> {
    await this.lotManagementRpc.send('asset.makeActive', {
      id: payload.id,
    });

    const asset = await this.lotManagementRpc.send('asset.getById', { id: payload.id });
    return this.fetch(asset);
  }

  async archive(payload: AdminGatewaySchema.AssetArchivePayload): Promise<AdminGatewaySchema.AssetArchiveResult> {
    await this.lotManagementRpc.send('asset.archive', {
      id: payload.id,
    });

    const asset = await this.lotManagementRpc.send('asset.getById', { id: payload.id });
    return this.fetch(asset);
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

  toFilter(filter: AdminGatewaySchema.AssetListFilter): LotManagementSchema.RPC.DTO.AssetList.Filter {
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

  toInclude(include: boolean | AdminGatewaySchema.AssetListInclude): LotManagementSchema.RPC.DTO.AssetList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {
      assetLotStatsAggregation: include?.assetLotStatsAggregation,
      assetFaq: include?.assetFaq,
    };
  }

  toInternalIncludeLinks(items: LotManagementSchema.Asset[], include: boolean | AdminGatewaySchema.AssetListInclude) {
    return includeLinks(include, async (include, links) => {});
  }

  async toExternalIncludeLinks(links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.AssetList.Include>[]): Promise<CoreSchema.IncludeLink<AdminGatewaySchema.AssetListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<AdminGatewaySchema.AssetListInclude>[] = [];

    const assetFaq = await this.assetFaqService.fetchMany(links.filter((item) => item.resource === 'asset_faq') as LotManagementSchema.AssetFaq[]);
    externalLinks.push(...assetFaq);

    for (const link of links) {
      if (link.resource === 'asset_lot_stats_aggregation') externalLinks.push(this.assetResourceMapper.toAssetLotStatsAggregation(link));
    }

    return externalLinks;
  }
}
