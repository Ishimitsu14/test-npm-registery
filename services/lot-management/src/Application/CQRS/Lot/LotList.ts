import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { AndSpecification, Query, QueryResult, Sortable, SortableValue, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef, Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilter, CoreResourceMapper, includeLinks } from '@shared/common-internal';
import { isArraySchema, isBooleanSchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import {
  Asset,
  AssetBySearchSpecification,
  AssetByTierSpecification,
  AssetByVerticalsSpecification,
  AssetTier,
  AssetVertical,
  Bid,
  BidMatchesDealSpecification,
  Deal,
  Lot,
  LotByAssetSpecification,
  LotByCreatedAtSpecification,
  LotByDirectionSpecification,
  LotByInvestDocFdvSpecification,
  LotByIsHotSpecification,
  LotByMinSummarySpecification,
  LotByOfferMakerSpecification,
  LotByReassignmentTypeSpecification,
  LotByStatusSpecification,
  LotBySummarySpecification,
  LotByTypeSpecification,
  LotCommonBadgeSortable,
  LotIdSortable,
  LotInputs,
  LotMatchesBidSpecification,
  LotPK,
  LotQuestion,
  LotQuestionByLotSpecfication,
  LotReassignmentType,
  LotStatus,
  LotTotalBidsCountAggregator,
  LotTransactionStatsAggregator,
  LotType,
  LotViewCountAggregator,
  OfferMakerPK,
  TradeDirection,
} from '../../../Domain';
import { AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { LotResourceMapper } from '../../ResourceMappers';
import { AssetList } from '../Asset';
import { BidList } from '../Bid';
import { DealList } from '../Deal';
import { LotQuestionList } from '../LotQuestion';

export type LotListProps = LotManagementSchema.RPC.DTO.LotList.Payload;
export type LotListResult = LotManagementSchema.RPC.DTO.LotList.Result;

export class LotList implements UseCase<LotListProps, LotListResult> {
  @Inject(AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN)
  private aggregationQueryResolver: AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  @Inject(forwardRef(() => AssetList))
  private assetList: AssetList;

  @Inject(forwardRef(() => BidList))
  private bidList: BidList;

  @Inject(forwardRef(() => DealList))
  private dealList: DealList;

  @Inject(forwardRef(() => LotQuestionList))
  private lotQuestionList: LotQuestionList;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: LotListProps): Promise<void> {
    validateRoot(payload, {
      page: { skip: [isNumberSchema, minSchema(0)], limit: [isNumberSchema, minSchema(1), maxSchema(5000)] },
      filter: {
        // TODO
        AND: [],
        OR: [],
        NOT: [],

        id: [isArraySchema(isNumberSchema, minSchema(1))],

        search: [isStringWithValueSchema],
        type: [isArraySchema(LotType.validator(), minSchema(1))],
        status: [isArraySchema(LotStatus.validator(), minSchema(1))],
        verticals: [isArraySchema(AssetVertical.validator(), minSchema(1))],
        tier: [isArraySchema(AssetTier.validator(), minSchema(1))],
        direction: [TradeDirection.validator()],
        minContractValue: [isNumberSchema, minSchema(0)],
        maxContractValue: [isNumberSchema],
        minBidSize: [isNumberSchema, minSchema(0)],
        maxBidSize: [isNumberSchema],
        minTargetValuation: [isNumberSchema, minSchema(0)],
        maxTargetValuation: [isNumberSchema],
        reassignmentType: [isArraySchema(LotReassignmentType.validator(), minSchema(1))],
        isHot: [isBooleanSchema],
        minCreatedAt: [isNumberSchema],
        maxCreatedAt: [isNumberSchema],

        offerMaker: [isArraySchema(isStringWithValueSchema, minSchema(1))],

        asset: {} as any,
        deal: {} as any,
        bid: {} as any,
      },
      include: [],
      sort: [],
    });
  }

  async execute(payload: LotListProps): Promise<LotListResult> {
    let query = Query.create(Lot);

    if (NullableObject.hasValue(payload.filter)) {
      query = query.addSpecification(this.filter(payload.filter));
    }

    if (NullableObject.hasValue(payload.page)) {
      query = query.addPageable(payload.page.skip, payload.page.limit);
    }

    if (NullableObject.hasValue(payload.sort)) {
      query = query.addSortable(this.withSortable(payload.sort));
    }

    const { items, total, links } = await this.find(query, payload.include);

    return {
      items,
      links,
      total,
    };
  }

  async find(
    query: Query<Lot>,
    include: boolean | LotListProps['include'] = {},
  ): Promise<
    {
      queryResult: QueryResult<Lot>;
    } & CoreSchema.WithPaginationResult<LotManagementSchema.Lot> &
      CoreSchema.WithIncludeLinks<LotManagementSchema.RPC.DTO.LotList.Include>
  > {
    const lotRepository = await this.lotRepository();

    const queryResult = await lotRepository.find(query);
    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) => this.lotResourceMapper.toLot(m));

    const links = await this.includeLinks(queryResult.items, include);

    return {
      queryResult,
      items,
      total,
      links,
    };
  }

  async includeLinks(items: Lot[], include: boolean | LotListProps['include']) {
    return includeLinks(include, async (include, links) => {
      if (include.asset) {
        const assetQuery = Query.create(Asset).addSpecification(
          WhereInPKSpecification.create(items.map((m) => m.attributes.findValue(LotInputs.INVEST_DOC_ASSET_PK_INPUT)).filter(NullableObject.hasValue)),
        );
        const assetResult = await this.assetList.find(assetQuery, include.asset);
        links.push(...assetResult.items, ...assetResult.links);
      }

      if (include.lotTotalBidsCountAggregation) {
        const totalBids = await this.aggregationQueryResolver.resolveAggregation(new LotTotalBidsCountAggregator(items));
        links.push(...totalBids.map((item) => this.lotResourceMapper.toLotTotalBidsCountAggregation(item)));
      }

      if (include.lotTransactionStatsAggregation) {
        const totalBids = await this.aggregationQueryResolver.resolveAggregation(new LotTransactionStatsAggregator(items));
        links.push(...totalBids.map((item) => this.lotResourceMapper.toLotTransactionStatsAggregation(item)));
      }

      if (include.lotViewCountAggregation) {
        const totalViews = await this.aggregationQueryResolver.resolveAggregation(new LotViewCountAggregator(items));
        links.push(...totalViews.map((item) => this.lotResourceMapper.toLotViewCountAggregation(item)));
      }

      if (include.lotQuestion) {
        const lotQuestionQuery = Query.create(LotQuestion).addSpecification(new LotQuestionByLotSpecfication(items.map((item) => item.primaryKey)));
        const lotQuestionResult = await this.lotQuestionList.find(lotQuestionQuery, include.lotQuestion);
        links.push(...lotQuestionResult.items, ...lotQuestionResult.links);
      }
    });
  }

  filter(filter: LotListProps['filter']): Specification<Lot> {
    return compositeFilter(filter, (filter, specs) => {
      const assetSpecs: Specification<Asset>[] = [];
      const bidSpecs: Specification<Bid>[] = [];
      const dealSpecs: Specification<Deal>[] = [];

      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter.id.map((id) => new LotPK(id))));
      }

      if (NullableObject.hasValue(filter.reassignmentType)) {
        specs.push(new LotByReassignmentTypeSpecification(LotReassignmentType.getByIds(filter.reassignmentType)));
      }

      if (NullableObject.hasValue(filter.type)) {
        specs.push(new LotByTypeSpecification(LotType.getByIds(filter.type)));
      }

      if (NullableObject.hasValue(filter.status)) {
        specs.push(new LotByStatusSpecification(LotStatus.getByIds(filter.status)));
      }

      if (NullableObject.hasValue(filter.offerMaker)) {
        specs.push(new LotByOfferMakerSpecification(filter.offerMaker.map((id) => OfferMakerPK.create(id))));
      }

      if (NullableObject.hasValue(filter.direction)) {
        specs.push(new LotByDirectionSpecification(TradeDirection.getById(filter.direction)));
      }

      if (NullableObject.hasValue(filter.minContractValue) || NullableObject.hasValue(filter.maxContractValue)) {
        specs.push(new LotBySummarySpecification(NullableObject(filter.minContractValue), NullableObject(filter.maxContractValue)));
      }

      if (NullableObject.hasValue(filter.minBidSize) || NullableObject.hasValue(filter.maxBidSize)) {
        specs.push(new LotByMinSummarySpecification(NullableObject(filter.minBidSize), NullableObject(filter.maxBidSize)));
      }

      if (NullableObject.hasValue(filter.minTargetValuation) || NullableObject.hasValue(filter.maxTargetValuation)) {
        specs.push(new LotByInvestDocFdvSpecification(NullableObject(filter.minTargetValuation), NullableObject(filter.maxTargetValuation)));
      }

      if (NullableObject.hasValue(filter.isHot)) {
        specs.push(new LotByIsHotSpecification(true));
      }

      if (NullableObject.hasValue(filter.minCreatedAt) || NullableObject.hasValue(filter.maxCreatedAt)) {
        specs.push(new LotByCreatedAtSpecification(NullableObject(filter.minCreatedAt), NullableObject(filter.maxCreatedAt)));
      }

      // By Assets

      if (NullableObject.hasValue(filter.search)) {
        assetSpecs.push(new AssetBySearchSpecification(filter.search));
      }

      if (NullableObject.hasValue(filter.verticals)) {
        assetSpecs.push(new AssetByVerticalsSpecification(AssetVertical.getByIds(filter.verticals)));
      }

      if (NullableObject.hasValue(filter.tier)) {
        assetSpecs.push(new AssetByTierSpecification(AssetTier.getByIds(filter.tier)));
      }

      if (NullableObject.hasValue(filter.asset)) {
        assetSpecs.push(this.assetList.filter(filter.asset));
      }

      // By bids

      if (NullableObject.hasValue(filter.bid)) {
        bidSpecs.push(this.bidList.filter(filter.bid));
      }

      // By deals

      if (NullableObject.hasValue(filter.deal)) {
        dealSpecs.push(this.dealList.filter(filter.deal));
      }

      // Combine to Main Query

      if (dealSpecs.length > 0) bidSpecs.push(new BidMatchesDealSpecification(dealSpecs.length === 1 ? dealSpecs[0] : AndSpecification.create(dealSpecs)));
      if (bidSpecs.length > 0) specs.push(new LotMatchesBidSpecification(bidSpecs.length === 1 ? bidSpecs[0] : AndSpecification.create(bidSpecs)));
      if (assetSpecs.length > 0) specs.push(new LotByAssetSpecification(assetSpecs.length === 1 ? assetSpecs[0] : AndSpecification.create(assetSpecs)));
    });
  }

  withSortable(payload: LotListProps['sort']): Sortable<Lot>[] {
    const sorts: Sortable<Lot>[] = [];

    if (NullableObject.hasValue(payload.id)) {
      sorts.push(new LotIdSortable(SortableValue.getById(payload.id)));
    }

    if (NullableObject.hasValue(payload.badge)) [sorts.push(new LotCommonBadgeSortable(SortableValue.getById(payload.badge)))];

    return sorts;
  }
}
