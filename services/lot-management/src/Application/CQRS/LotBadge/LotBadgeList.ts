import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query, QueryResult, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { CommonInternal, CoreResourceMapper } from '@shared/common-internal';
import { isArraySchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import { LotBadge, LotBadgePK } from '../../../Domain';
import { LOT_BADGE_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { LotBadgeResourceMapper } from '../../ResourceMappers';

export type LotBadgeListProps = LotManagementSchema.RPC.DTO.LotBadgeList.Payload;
export type LotBadgeListResult = LotManagementSchema.RPC.DTO.LotBadgeList.Result;

export class LotBadgeList implements UseCase<LotBadgeListProps, LotBadgeListResult> {
  @InjectContext(LOT_BADGE_REPOSITORY_INJECT_TOKEN)
  private readonly lotBadgeRepository: InjectContext<LOT_BADGE_REPOSITORY_INJECT_TOKEN>;

  @Inject(LotBadgeResourceMapper)
  private lotBadgeResourceMapper: LotBadgeResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  async validate(payload: LotBadgeListProps): Promise<void> {
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
      },
      include: [],
      sort: [],
    });
  }

  async execute(payload: LotBadgeListProps): Promise<LotBadgeListResult> {
    let query = Query.create(LotBadge);

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

  private async find(
    query: Query<LotBadge>,
    include: boolean | LotBadgeListProps['include'],
  ): Promise<{ queryResult: QueryResult<LotBadge> } & CoreSchema.WithPaginationResult<LotManagementSchema.LotBadge> & CoreSchema.WithIncludeLinks<LotManagementSchema.RPC.DTO.LotBadgeList.Include>> {
    const lotBadgeRepository = await this.lotBadgeRepository();

    const queryResult = await lotBadgeRepository.find(query);
    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) => this.lotBadgeResourceMapper.toLotBadge(m));

    const links: never[] = [];

    return {
      queryResult,
      items,
      total,
      links,
    };
  }

  private filter(filter: LotBadgeListProps['filter']): Specification<LotBadge> {
    return CommonInternal.compositeFilter(filter, (filter, specs) => {
      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter?.id.map((id) => LotBadgePK.raw(id))));
      }
    });
  }
}
