import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query, QueryResult, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { CommonInternal, CoreResourceMapper } from '@shared/common-internal';
import { isArraySchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import { FavoriteLot, FavoriteLotByUserSpecfication, FavoriteLotPK, UserPK } from '../../../Domain';
import { FAVORITE_LOT_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { FavoriteLotResourceMapper } from '../../ResourceMappers';

export type FavoriteLotListProps = LotManagementSchema.RPC.DTO.FavoriteLotList.Payload;
export type FavoriteLotListResult = LotManagementSchema.RPC.DTO.FavoriteLotList.Result;

export class FavoriteLotList implements UseCase<FavoriteLotListProps, FavoriteLotListResult> {
  @InjectContext(FAVORITE_LOT_REPOSITORY_INJECT_TOKEN)
  private readonly favoriteLotRepository: InjectContext<FAVORITE_LOT_REPOSITORY_INJECT_TOKEN>;

  @Inject(FavoriteLotResourceMapper)
  private favoriteLotResourceMapper: FavoriteLotResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  async validate(payload: FavoriteLotListProps): Promise<void> {
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

        user: [isArraySchema(isStringWithValueSchema, minSchema(1))],
      },
      include: [],
      sort: [],
    });
  }

  async execute(payload: FavoriteLotListProps): Promise<FavoriteLotListResult> {
    let query = Query.create(FavoriteLot);

    if (NullableObject.hasValue(payload.filter)) {
      query = query.addSpecification(this.filter(payload.filter));
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

  filter(filter: FavoriteLotListProps['filter']): Specification<FavoriteLot> {
    return CommonInternal.compositeFilter(filter, (filter, specs) => {
      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter?.id.map((id) => FavoriteLotPK.raw(id))));
      }

      if (NullableObject.hasValue(filter.user)) {
        specs.push(new FavoriteLotByUserSpecfication(filter.user.map((id) => UserPK.raw(id))));
      }
    });
  }

  async find(
    query: Query<FavoriteLot>,
    include: boolean | FavoriteLotListProps['include'],
  ): Promise<
    { queryResult: QueryResult<FavoriteLot> } & CoreSchema.WithPaginationResult<LotManagementSchema.FavoriteLot> & CoreSchema.WithIncludeLinks<LotManagementSchema.RPC.DTO.FavoriteLotList.Include>
  > {
    const favoriteLotRepository = await this.favoriteLotRepository();

    const queryResult = await favoriteLotRepository.find(query);
    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) => this.favoriteLotResourceMapper.toFavoriteLot(m));

    const links: never[] = [];

    return {
      queryResult,
      items,
      total,
      links,
    };
  }
}
