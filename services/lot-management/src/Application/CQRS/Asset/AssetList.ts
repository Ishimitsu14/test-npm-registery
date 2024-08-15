import '@ddd/validation';

import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { AndSpecification, NotSpecification, Query, QueryResult, Sortable, SortableValue, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef, Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilter, CoreResourceMapper, includeLinks } from '@shared/common-internal';
import { isArraySchema, isBooleanSchema, isEnumSchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import {
  Asset,
  AssetBySearchSpecification,
  AssetByStatusSpecification,
  AssetByTierSpecification,
  AssetByVerticalsSpecification,
  AssetFaq,
  AssetFaqByAssetSpecfication,
  AssetIdSortable,
  AssetLotStatsAggregator,
  AssetMatchesLotSpecification,
  AssetPK,
  AssetStatus,
  AssetTier,
  AssetVertical,
  Bid,
  BidMatchesDealSpecification,
  Deal,
  Lot,
  LotByStatusSpecification,
  LotMatchesBidSpecification,
  LotStatus,
} from '../../../Domain';
import { AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN, ASSET_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { AssetResourceMapper } from '../../ResourceMappers';
import { AssetFaqList } from '../AssetFaq';
import { BidList } from '../Bid';
import { DealList } from '../Deal';
import { LotList } from '../Lot';

export type AssetListProps = LotManagementSchema.RPC.DTO.AssetList.Payload;
export type AssetListResult = LotManagementSchema.RPC.DTO.AssetList.Result;

export class AssetList implements UseCase<AssetListProps, AssetListResult> {
  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private assetRespository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @Inject(AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN)
  private aggregationQueryResolver: AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN;

  @Inject(forwardRef(() => LotList))
  private lotList: LotList;

  @Inject(forwardRef(() => BidList))
  private bidList: BidList;

  @Inject(forwardRef(() => DealList))
  private dealList: DealList;

  @Inject(forwardRef(() => AssetFaqList))
  private assetFaqList: AssetFaqList;

  async validate(payload: AssetListProps) {
    validateRoot(payload, {
      page: {
        skip: [isNumberSchema, minSchema(0)],
        limit: [isNumberSchema, minSchema(1), maxSchema(5000)],
      },
      filter: {
        // TODO
        AND: [],
        OR: [],
        NOT: [],

        id: [isArraySchema(isStringWithValueSchema, minSchema(1))],

        search: [isStringWithValueSchema],
        withLots: [isBooleanSchema],
        tier: [isArraySchema(isEnumSchema(AssetTier.getAll().map((m) => m.id)), minSchema(1))],
        verticals: [isArraySchema(isEnumSchema(AssetVertical.getAll().map((m) => m.id)), minSchema(1))],
        status: [isArraySchema(isEnumSchema(AssetStatus.getAll().map((m) => m.id)), minSchema(1))],

        lot: {} as any,
        bid: {} as any,
        deal: {} as any,
      },
      include: [],
      sort: [],
    });
  }

  async execute(payload: AssetListProps): Promise<AssetListResult> {
    let query = Query.create(Asset);

    if (NullableObject.hasValue(payload.filter)) {
      query = query.addSpecification(this.filter(payload.filter));
    }

    if (NullableObject.hasValue(payload.sort)) {
      query = query.addSortable(this.withSortable(payload.sort));
    }

    if (NullableObject.hasValue(payload.page)) {
      query = query.addPageable(payload.page.skip, payload.page.limit);
    }

    const { items, total, links } = await this.find(query, payload.include);

    return {
      links,
      items,
      total,
    };
  }

  filter(filter: AssetListProps['filter']): Specification<Asset> {
    return compositeFilter(filter, (filter, specs) => {
      const dealsSpecs: Specification<Deal>[] = [];
      const bidsSpecs: Specification<Bid>[] = [];
      const lotsSpecs: Specification<Lot>[] = [];

      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter.id.map((id) => new AssetPK(id))));
      }

      if (NullableObject.hasValue(filter.search)) {
        specs.push(new AssetBySearchSpecification(filter.search));
      }

      if (NullableObject.hasValue(filter.withLots)) {
        const lotSpec = new LotByStatusSpecification(LotStatus.ACTIVE);
        const assetSpec = new AssetMatchesLotSpecification(lotSpec);

        specs.push(filter.withLots ? assetSpec : NotSpecification.create(assetSpec));
      }

      if (NullableObject.hasValue(filter.tier)) {
        specs.push(new AssetByTierSpecification(AssetTier.getByIds(filter.tier)));
      }

      if (NullableObject.hasValue(filter.verticals)) {
        specs.push(new AssetByVerticalsSpecification(AssetVertical.getByIds(filter.verticals)));
      }

      if (NullableObject.hasValue(filter.status)) {
        specs.push(new AssetByStatusSpecification(AssetStatus.getByIds(filter.status)));
      }

      if (NullableObject.hasValue(filter.deal)) {
        dealsSpecs.push(this.dealList.filter(filter.deal));
      }

      if (NullableObject.hasValue(filter.bid)) {
        bidsSpecs.push(this.bidList.filter(filter.bid));
      }

      if (NullableObject.hasValue(filter.lot)) {
        lotsSpecs.push(this.lotList.filter(filter.lot));
      }

      if (dealsSpecs.length > 0) bidsSpecs.push(new BidMatchesDealSpecification(dealsSpecs.length === 1 ? dealsSpecs[0] : AndSpecification.create(dealsSpecs)));
      if (bidsSpecs.length > 0) lotsSpecs.push(new LotMatchesBidSpecification(bidsSpecs.length === 1 ? bidsSpecs[0] : AndSpecification.create(bidsSpecs)));
      if (lotsSpecs.length > 0) specs.push(new AssetMatchesLotSpecification(lotsSpecs.length === 1 ? lotsSpecs[0] : AndSpecification.create(lotsSpecs)));
    });
  }

  async find(
    query: Query<Asset>,
    include: boolean | AssetListProps['include'],
  ): Promise<{ queryResult: QueryResult<Asset> } & CoreSchema.WithPaginationResult<LotManagementSchema.Asset> & CoreSchema.WithIncludeLinks<LotManagementSchema.RPC.DTO.AssetList.Include>> {
    const assetRespository = await this.assetRespository();

    const queryResult = await assetRespository.find(query);
    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) => this.assetResourceMapper.toAsset(m));

    const links = await this.includeLinks(queryResult.items, include);

    return {
      queryResult,
      items,
      total,
      links,
    };
  }

  async includeLinks(items: Asset[], include: boolean | AssetListProps['include']) {
    return includeLinks(include, async (include, links) => {
      if (include.assetLotStatsAggregation) {
        const stats = await this.aggregationQueryResolver.resolveAggregation(new AssetLotStatsAggregator(items));
        links.push(...stats.map((item) => this.assetResourceMapper.toAssetLotStatsAggregation(item)));
      }

      if (include.assetFaq) {
        const assetFaqQuery = Query.create(AssetFaq).addSpecification(new AssetFaqByAssetSpecfication(items.map((asset) => asset.primaryKey)));
        const assetFaqResult = await this.assetFaqList.find(assetFaqQuery, include.assetFaq);

        links.push(...assetFaqResult.items);
      }
    });
  }

  withSortable(payload: AssetListProps['sort']): Sortable<Asset>[] {
    const sorts: Sortable<Asset>[] = [];

    if (NullableObject.hasValue(payload.id)) {
      sorts.push(new AssetIdSortable(SortableValue.getById(payload.id)));
    }

    return sorts;
  }
}
