import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { AndSpecification, Query, QueryResult, Sortable, SortableValue, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef, Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilter, CoreResourceMapper, includeLinks } from '@shared/common-internal';
import { isArraySchema, isEnumSchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import {
  Bid,
  BidMakerPK,
  Deal,
  DealByBidMakerSpecfication,
  DealByBidSpecification,
  DealByOfferMakerSpecfication,
  DealByStatusSpecification,
  DealIdSortable,
  DealPK,
  DealStatus,
  OfferMakerPK,
} from '../../../Domain';
import { DEAL_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { DealResourceMapper } from '../../ResourceMappers';
import { BidList } from '../Bid';
import { LotList } from '../Lot';

export type DealListProps = LotManagementSchema.RPC.DTO.DealList.Payload;
export type DealListResult = LotManagementSchema.RPC.DTO.DealList.Result;

export class DealList implements UseCase<DealListProps, DealListResult> {
  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @Inject(DealResourceMapper)
  private dealResourceMapper: DealResourceMapper;

  @Inject(forwardRef(() => LotList))
  private lotList: LotList;

  @Inject(forwardRef(() => BidList))
  private bidList: BidList;

  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: DealListProps): Promise<void> {
    validateRoot(payload, {
      page: { skip: [isNumberSchema, minSchema(0)], limit: [isNumberSchema, minSchema(1), maxSchema(5000)] },
      filter: {
        // TODO
        AND: [],
        OR: [],
        NOT: [],

        id: [isArraySchema(isNumberSchema, minSchema(1))],

        status: [isArraySchema(isEnumSchema(DealStatus.getAllIds()), minSchema(1))],
        offerMaker: [isArraySchema(isStringWithValueSchema, minSchema(1))],
        bidMaker: [isArraySchema(isStringWithValueSchema, minSchema(1))],

        bid: {} as any,
      },
      include: [],
      sort: [],
    });
  }

  async execute(payload: DealListProps): Promise<DealListResult> {
    let query = Query.create(Deal);

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

  filter(filter: DealListProps['filter']): Specification<Deal> {
    return compositeFilter(filter, (filter, specs) => {
      const bidSpecs: Specification<Bid>[] = [];

      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter.id.map((id) => DealPK.raw(id))));
      }

      if (NullableObject.hasValue(filter.offerMaker)) {
        specs.push(new DealByOfferMakerSpecfication(filter.offerMaker.map((id) => OfferMakerPK.create(id))));
      }

      if (NullableObject.hasValue(filter.bidMaker)) {
        specs.push(new DealByBidMakerSpecfication(filter.bidMaker.map((id) => BidMakerPK.create(id))));
      }

      if (NullableObject.hasValue(filter.status)) {
        specs.push(new DealByStatusSpecification(DealStatus.getByIds(filter.status)));
      }

      // By bids

      if (NullableObject.hasValue(filter.bid)) {
        bidSpecs.push(this.bidList.filter(filter.bid));
      }

      // By lots

      if (bidSpecs.length > 0) specs.push(new DealByBidSpecification(bidSpecs.length === 1 ? bidSpecs[0] : AndSpecification.create(bidSpecs)));
    });
  }

  async find(
    query: Query<Deal>,
    include: boolean | DealListProps['include'],
  ): Promise<{ queryResult: QueryResult<Deal> } & CoreSchema.WithPaginationResult<LotManagementSchema.Deal> & CoreSchema.WithIncludeLinks<LotManagementSchema.RPC.DTO.DealList.Include>> {
    const dealRepository = await this.dealRepository();

    const queryResult = await dealRepository.find(query);
    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) => this.dealResourceMapper.toDeal(m));

    const links = await this.includeLinks(queryResult.items, include);

    return {
      queryResult,
      items,
      total,
      links,
    };
  }

  async includeLinks(items: Deal[], include: boolean | DealListProps['include']) {
    return includeLinks(include, async (include, links) => {
      if (include.bid) {
        const bidQuery = Query.create(Bid).addSpecification(WhereInPKSpecification.create(items.map((m) => m.bidPK)));
        const bidResult = await this.bidList.find(bidQuery, include.bid);

        links.push(...bidResult.items, ...bidResult.links);
      }
    });
  }

  withSortable(payload: DealListProps['sort']): Sortable<Deal>[] {
    const sorts: Sortable<Deal>[] = [];

    if (NullableObject.hasValue(payload.id)) {
      sorts.push(new DealIdSortable(SortableValue.getById(payload.id)));
    }

    return sorts;
  }
}
