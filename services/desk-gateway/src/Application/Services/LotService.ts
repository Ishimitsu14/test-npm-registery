import { forwardRef, Inject } from '@nestjs/common';
import { CoreSchema } from '@schema/core';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { useAuthApi } from '../Contexts';
import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { CoreResourceMapper, LotResourceMapper } from '../ResourceMapper';
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

  @Inject(forwardRef(() => LotResourceMapper))
  private lotResourceMapper: LotResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @Inject(forwardRef(() => AssetService))
  private assetService: AssetService;

  @Inject(forwardRef(() => BidService))
  private bidService: BidService;

  @Inject(forwardRef(() => DealService))
  private dealService: DealService;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  @Inject(forwardRef(() => LotQuestionService))
  private lotQuestionService: LotQuestionService;

  get onlyMyLotsFilter(): LotManagementSchema.RPC.DTO.LotList.Filter {
    const { userId, isAuthorized } = useAuthApi();

    return (
      isAuthorized && {
        offerMaker: [userId],
      }
    );
  }

  get onlyActiveFilter(): LotManagementSchema.RPC.DTO.LotList.Filter {
    return {
      status: ['ACTIVE'],
    };
  }

  async archive(payload: DeskGatewaySchema.LotArchivePayload): Promise<DeskGatewaySchema.LotArchiveResult> {
    await this.lotManagementRPC.send('lot.archive', {
      id: payload.id,
    });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async cancelModeration(payload: DeskGatewaySchema.LotCancelModerationPayload): Promise<DeskGatewaySchema.LotCancelModerationResult> {
    await this.lotManagementRPC.send('lot.cancelModeration', { id: payload.id });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async complete(payload: DeskGatewaySchema.LotCompletePayload): Promise<DeskGatewaySchema.LotCompleteResult> {
    await this.lotManagementRPC.send('lot.complete', { id: payload.id, reason: 'MANUALLY' });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async create(payload: DeskGatewaySchema.LotCreatePayload): Promise<DeskGatewaySchema.LotCreateResult> {
    const { userId } = useAuthApi();

    const lotKey = await this.lotManagementRPC.send('lot.create', {
      type: payload.type,
      offerMaker: userId,
      inputs: this.lotResourceMapper.fromLotInputObject(payload?.inputs || {}),
    });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: lotKey.id });
    return this.fetch(lot);
  }

  async duplicate(payload: DeskGatewaySchema.LotDuplicatePayload): Promise<DeskGatewaySchema.LotDuplicateResult> {
    const lotKey = await this.lotManagementRPC.send('lot.duplicate', { id: payload.id });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: lotKey.id });
    return this.fetch(lot);
  }

  async getById(payload: DeskGatewaySchema.LotGetByIdPayload): Promise<DeskGatewaySchema.LotGetByIdResult> {
    const lot = await this.lotManagementRPC.send('lot.getById', payload);

    return this.fetch(lot);
  }

  async list(payload: DeskGatewaySchema.LotListPayload): Promise<DeskGatewaySchema.LotListResult> {
    const filter = {
      AND: [{ OR: [this.onlyActiveFilter, this.onlyMyLotsFilter] }, this.toFilter(payload.filter)],
    };
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRPC.send('lot.list', {
      filter,
      include,
      page: payload.page,
      sort: payload.sort,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links, payload.include);

    return {
      total,
      links: internalLinks.concat(externalLinks),
      items: await this.fetchMany(items),
    };
  }

  async sendOnModeration(payload: DeskGatewaySchema.RPC.DTO.LotSendOnModeration.Payload): Promise<DeskGatewaySchema.RPC.DTO.LotSendOnModeration.Result> {
    await this.lotManagementRPC.send('lot.sendOnModeration', { id: payload.id });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async update(payload: DeskGatewaySchema.RPC.DTO.LotUpdate.Payload): Promise<DeskGatewaySchema.RPC.DTO.LotUpdate.Result> {
    await this.lotManagementRPC.send('lot.update', {
      id: payload.id,
      type: payload.type,

      inputs: this.lotResourceMapper.fromLotInputObject(payload?.inputs || {}),
    });

    const lot = await this.lotManagementRPC.send('lot.getById', { id: payload.id });
    return this.fetch(lot);
  }

  async getUploadPitchDeckURL(payload: DeskGatewaySchema.LotGetUploadPitchDeckURLPayload): Promise<DeskGatewaySchema.LotGetUploadPitchDeckURLResult> {
    const uploader = await this.lotManagementRPC.send('lot.getUploadPitchDeckURL', payload);

    return uploader;
  }

  async getUploadTokenomicsURL(payload: DeskGatewaySchema.LotGetUploadTokenomicsURLPayload): Promise<DeskGatewaySchema.LotGetUploadTokenomicsURLResult> {
    const uploader = await this.lotManagementRPC.send('lot.getUploadTokenomicsURL', payload);

    return uploader;
  }

  async fetch(item: LotManagementSchema.Lot): Promise<DeskGatewaySchema.Lot> {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.Lot[]): Promise<DeskGatewaySchema.Lot[]> {
    return items.map((item) => this.lotResourceMapper.toLot(item));
  }

  toFilter(filter: DeskGatewaySchema.LotListFilter): LotManagementSchema.RPC.DTO.LotList.Filter {
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

        offerMaker: filter.onlyMy ? [userId] : undefined,

        asset: this.assetService.filterList(filter.asset),
        bid: this.bidService.toFilter(filter.bid),
        deal: this.dealService.toFilter(filter.deal),
      };
    });
  }

  toInclude(include: boolean | DeskGatewaySchema.LotListInclude): LotManagementSchema.RPC.DTO.LotList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {
      asset: this.assetService.toInclude(include?.asset),
      lotTotalBidsCountAggregation: include?.lotTotalBidsCountAggregation,
      lotTransactionStatsAggregation: include?.lotTransactionStatsAggregation,
      lotQuestion: this.lotQuestionService.toInclude(include?.lotQuestion),
      lotViewCountAggregation: include?.lotViewCountAggregation,
    };
  }

  toInternalIncludeLinks(items: LotManagementSchema.Lot[], include: boolean | DeskGatewaySchema.LotListInclude) {
    return includeLinks(include, async (include, links) => {
      if (include.offerMaker) {
        const offerMakerIds = items.map((m) => m.offerMaker.userId);
        const users = offerMakerIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: offerMakerIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);

        links.push(...userResult);
      }
    });
  }

  async toExternalIncludeLinks(
    links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotList.Include>[],
    include: boolean | DeskGatewaySchema.LotListInclude,
  ): Promise<CoreSchema.IncludeLink<DeskGatewaySchema.LotListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<DeskGatewaySchema.LotListInclude>[] = [];

    const assets = await this.assetService.fetchMany(<LotManagementSchema.Asset[]>links.filter((m) => m.resource === 'asset'));
    externalLinks.push(...assets);

    const assetLinks = await this.assetService.toExternalIncludeLinks(<CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.AssetList.Include>[]>links);
    externalLinks.push(...assetLinks);

    const lotQuestionLinks = links.filter((m) => m.resource === 'lot_question') as LotManagementSchema.LotQuestion[];

    const lotQuestions = await this.lotQuestionService.fetchMany(links.filter((item) => item.resource === 'lot_question') as LotManagementSchema.LotQuestion[]);
    externalLinks.push(...lotQuestions);

    const lotQuestionExternalLinks = await this.lotQuestionService.toExternalIncludeLinks(<CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotQuestionList.Include>[]>links);
    externalLinks.push(...lotQuestionExternalLinks);

    if (typeof include !== 'boolean' && include) {
      const lotQuestionInternalLinks = await this.lotQuestionService.toInternalIncludeLinks(lotQuestionLinks, include.lotQuestion);
      externalLinks.push(...lotQuestionInternalLinks);
    }

    for (const link of links) {
      if (link.resource === 'lot_total_bids_count_aggregation') externalLinks.push(this.lotResourceMapper.toLotTotalBidsCountAggregation(link));
      if (link.resource === 'lot_transaction_stats_aggregation') externalLinks.push(this.lotResourceMapper.toLotTransactionStatsAggregation(link));
      if (link.resource === 'lot_view_count_aggregation') externalLinks.push(this.lotResourceMapper.toLotViewCountAggregation(link));
    }

    return externalLinks;
  }
}
