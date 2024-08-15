import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { AndSpecification, Query, QueryResult, Sortable, SortableValue, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef, Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilter, CoreResourceMapper, includeLinks } from '@shared/common-internal';
import { isArraySchema, isEnumSchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import { Bid, BidByBidMakerSpecification, BidByLotSpecification, BidByStatusSpecification, BidIdSortable, BidMakerPK, BidPK, BidStatus, Lot, LotMatchesBidSpecification } from '../../../Domain';
import { BID_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { BidResourceMapper } from '../../ResourceMappers';
import { LotList } from '../Lot';

export type BidListProps = LotManagementSchema.RPC.DTO.BidList.Payload;
export type BidListResult = LotManagementSchema.RPC.DTO.BidList.Result;

export class BidList implements UseCase<BidListProps, BidListResult> {
  @Inject(BidResourceMapper)
  private bidResourceMapper: BidResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @Inject(forwardRef(() => LotList))
  private lotList: LotList;

  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: BidListProps): Promise<void> {
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

        id: [isArraySchema(isNumberSchema, minSchema(1))],

        status: [isArraySchema(isEnumSchema(BidStatus.getAllIds()), minSchema(1))],
        bidMaker: [isArraySchema(isStringWithValueSchema, minSchema(1))],

        lot: {} as any,
      },
      include: [],
      sort: [],
    });
  }

  async execute(payload: BidListProps): Promise<BidListResult> {
    let query = Query.create(Bid);

    if (NullableObject.hasValue(payload.filter)) {
      query = query.addSpecification(this.filter(payload.filter));
    }

    if (NullableObject.hasValue(payload.sort)) {
      query = query.addSortable(this.withSortable(payload.sort));
    }

    if (NullableObject.hasValue(payload.page)) {
      query = query.addPageable(payload.page.skip, payload.page.limit);
    }

    const { items, links, total } = await this.find(query, payload.include);

    return {
      items,
      links,
      total,
    };
  }

  filter(filter: BidListProps['filter']): Specification<Bid> {
    return compositeFilter(filter, (filter, specs) => {
      const lotsSpecs: Specification<Lot>[] = [];

      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter.id.map((id) => new BidPK(id))));
      }

      if (NullableObject.hasValue(filter.bidMaker)) {
        specs.push(new BidByBidMakerSpecification(filter.bidMaker.map((id) => BidMakerPK.create(id))));
      }

      if (NullableObject.hasValue(filter.status)) {
        specs.push(new BidByStatusSpecification(BidStatus.getByIds(filter.status)));
      }

      if (NullableObject.hasValue(filter.lot)) {
        lotsSpecs.push(this.lotList.filter(filter.lot));
      }

      if (lotsSpecs.length > 0) specs.push(new BidByLotSpecification(lotsSpecs.length === 1 ? lotsSpecs[0] : AndSpecification.create(lotsSpecs)));
    });
  }

  async find(
    query: Query<Bid>,
    include: boolean | BidListProps['include'],
  ): Promise<{ queryResult: QueryResult<Bid> } & CoreSchema.WithPaginationResult<LotManagementSchema.Bid> & CoreSchema.WithIncludeLinks<LotManagementSchema.RPC.DTO.BidList.Include>> {
    const bidRepository = await this.bidRepository();

    const queryResult = await bidRepository.find(query);
    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) => this.bidResourceMapper.toBid(m));

    const links = await this.includeLinks(queryResult.items, include);

    return {
      queryResult,
      items,
      total,
      links,
    };
  }

  async includeLinks(items: Bid[], include: boolean | BidListProps['include']) {
    return includeLinks(include, async (include, links) => {
      if (include.lot) {
        const lotQuery = Query.create(Lot).addSpecification(new LotMatchesBidSpecification(WhereInPKSpecification.create(items.map((bid) => bid.primaryKey))));
        const lotResult = await this.lotList.find(lotQuery, include.lot);

        links.push(...lotResult.items, ...lotResult.links);
      }
    });
  }

  withSortable(payload: BidListProps['sort']): Sortable<Bid>[] {
    const sorts: Sortable<Bid>[] = [];

    if (NullableObject.hasValue(payload.id)) {
      sorts.push(new BidIdSortable(SortableValue.getById(payload.id)));
    }

    return sorts;
  }
}
