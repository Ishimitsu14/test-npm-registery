import { forwardRef, Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { useAuthApi } from '../Contexts';
import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { LotResourceMapper } from '../ResourceMapper';
import { AssetService } from './AssetService';
import { BidService } from './BidService';
import { DealService } from './DealService';
import { LotQuestionService } from './LotQuestionService';
import { UserService } from './UserService';

export class LotService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private readonly lotManagementRPC: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  @Inject(forwardRef(() => AssetService))
  private assetService: AssetService;

  @Inject(forwardRef(() => BidService))
  private bidService: BidService;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  @Inject(forwardRef(() => DealService))
  private dealService: DealService;

  @Inject(forwardRef(() => LotQuestionService))
  private lotQuestionService: LotQuestionService;

  async create(payload: AdminGatewaySchema.LotCreatePayload): Promise<AdminGatewaySchema.LotCreateResult> {
    const lotKey = await this.lotManagementRPC.send('lot.create', {
      type: payload.type,
      offerMaker: payload.offerMaker,
      inputs: this.lotResourceMapper.fromLotInputObject(payload.inputs || {}),
    });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: lotKey.id });

    return this.fetch(lot);
  }

  async update(payload: AdminGatewaySchema.LotUpdatePayload): Promise<AdminGatewaySchema.LotUpdateResult> {
    console.log(payload.inputs.COMMON_BADGE);
    await this.lotManagementRPC.send('lot.update', {
      id: payload.id,
      type: payload.type,

      offerMaker: payload.offerMaker,
      inputs: this.lotResourceMapper.fromLotInputObject(payload.inputs || {}),
    });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async archive(payload: AdminGatewaySchema.LotArchivePayload): Promise<AdminGatewaySchema.LotArchiveResult> {
    await this.lotManagementRPC.send('lot.archive', payload);

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async reject(payload: AdminGatewaySchema.LotRejectPayload): Promise<AdminGatewaySchema.LotRejectResult> {
    await this.lotManagementRPC.send('lot.reject', payload);

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async getById(payload: AdminGatewaySchema.LotGetByIdPayload): Promise<AdminGatewaySchema.LotGetByIdResult> {
    const lot = await this.lotManagementRPC.send('lot.getById', payload);

    return this.fetch(lot);
  }

  async list(payload: AdminGatewaySchema.LotListPayload): Promise<AdminGatewaySchema.LotListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRPC.send('lot.list', {
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

  async makeActive(payload: AdminGatewaySchema.LotMakeActivePayload): Promise<AdminGatewaySchema.LotMakeActiveResult> {
    await this.lotManagementRPC.send('lot.makeActive', {
      id: payload.id,
    });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async fetch(item: LotManagementSchema.Lot): Promise<AdminGatewaySchema.Lot> {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.Lot[]): Promise<AdminGatewaySchema.Lot[]> {
    return items.map((item) => this.lotResourceMapper.toLot(item));
  }

  toFilter(filter: AdminGatewaySchema.LotListFilter): LotManagementSchema.RPC.DTO.LotList.Filter {
    const { userId, ensureIsAuthorized } = useAuthApi();

    return compositeFilterGateway(filter, (filter) => {
      if (filter.onlyMy) ensureIsAuthorized();

      return {
        id: filter.id,

        search: filter.search,
        type: filter.type,
        status: filter.status,
        verticals: filter.verticals,
        tier: filter.tier,
        direction: filter.direction,
        minContractValue: filter.minContractValue,
        maxContractValue: filter.maxContractValue,
        minBidSize: filter.minBidSize,
        maxBidSize: filter.maxBidSize,
        minTargetValuation: filter.minTargetValuation,
        maxTargetValuation: filter.maxTargetValuation,
        minCreatedAt: filter.minCreatedAt,
        maxCreatedAt: filter.maxCreatedAt,
        reassignmentType: filter.reassignmentType,
        isHot: filter.isHot ? true : undefined,

        offerMaker: filter.onlyMy ? [userId] : filter.offerMaker,

        asset: this.assetService.toFilter(filter.asset),
        bid: this.bidService.toFilter(filter.bid),
        deal: this.dealService.toFilter(filter.deal),
      };
    });
  }

  toInclude(include: boolean | AdminGatewaySchema.LotListInclude): LotManagementSchema.RPC.DTO.LotList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {
      asset: this.assetService.toInclude(include?.asset),
      lotTotalBidsCountAggregation: include?.lotTotalBidsCountAggregation,
      lotTransactionStatsAggregation: include?.lotTransactionStatsAggregation,
    };
  }

  toInternalIncludeLinks(items: LotManagementSchema.Lot[], include: boolean | AdminGatewaySchema.LotListInclude) {
    return includeLinks(include, async (include, links) => {
      if (include.offerMaker) {
        const offerMakerIds = items.map((m) => m.offerMaker.userId);
        const users = offerMakerIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: offerMakerIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);

        links.push(...userResult);
      }
    });
  }

  async toExternalIncludeLinks(links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotList.Include>[]): Promise<CoreSchema.IncludeLink<AdminGatewaySchema.LotListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<AdminGatewaySchema.LotListInclude>[] = [];

    const assets = await this.assetService.fetchMany(<LotManagementSchema.Asset[]>links.filter((m) => m.resource === 'asset'));
    externalLinks.push(...assets);

    const assetLinks = await this.assetService.toExternalIncludeLinks(<CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.AssetList.Include>[]>links);
    externalLinks.push(...assetLinks);

    const lotQuestions = await this.lotQuestionService.fetchMany(links.filter((item) => item.resource === 'lot_question') as LotManagementSchema.LotQuestion[]);
    externalLinks.push(...lotQuestions);

    for (const link of links) {
      if (link.resource === 'lot_total_bids_count_aggregation') externalLinks.push(this.lotResourceMapper.toLotTotalBidsCountAggregation(link));
      if (link.resource === 'lot_transaction_stats_aggregation') externalLinks.push(this.lotResourceMapper.toLotTransactionStatsAggregation(link));
    }

    return externalLinks;
  }
}
