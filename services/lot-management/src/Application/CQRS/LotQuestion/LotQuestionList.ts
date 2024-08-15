import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query, QueryResult, Sortable, SortableValue, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { CommonInternal, CoreResourceMapper } from '@shared/common-internal';
import { isArraySchema, isEnumSchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import { LotPK, LotQuestion, LotQuestionByLotSpecfication, LotQuestionByStatusSpecification, LotQuestionCreatedAtSortable, LotQuestionPK, LotQuestionStatus } from '../../../Domain';
import { LOT_QUESTION_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { LotQuestionResourceMapper } from '../../ResourceMappers';

type ListProps = LotManagementSchema.RPC.DTO.LotQuestionList.Payload;
type ListResult = LotManagementSchema.RPC.DTO.LotQuestionList.Result;

export class LotQuestionList implements UseCase<ListProps, ListResult> {
  @InjectContext(LOT_QUESTION_REPOSITORY_INJECT_TOKEN)
  private readonly lotQuestionRepository: InjectContext<LOT_QUESTION_REPOSITORY_INJECT_TOKEN>;

  @Inject(LotQuestionResourceMapper)
  private lotQuestionResourceMapper: LotQuestionResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  async validate(payload: ListProps): Promise<void> {
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

        lot: [isArraySchema(isNumberSchema, minSchema(1))],
        status: [isArraySchema(isEnumSchema(LotQuestionStatus.getAllIds()), minSchema(1))],
      },
      include: [],
      sort: [],
    });
  }

  async execute(payload: ListProps): Promise<ListResult> {
    let query = Query.create(LotQuestion);

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

  filter(filter: ListProps['filter']): Specification<LotQuestion> {
    return CommonInternal.compositeFilter(filter, (filter, specs) => {
      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter.id.map((id) => LotQuestionPK.raw(id))));
      }

      if (NullableObject.hasValue(filter.lot)) {
        specs.push(new LotQuestionByLotSpecfication(filter.lot.map((id) => LotPK.fromSnapshot(id))));
      }

      if (NullableObject.hasValue(filter.status)) {
        specs.push(new LotQuestionByStatusSpecification(LotQuestionStatus.getByIds(filter.status)));
      }
    });
  }

  async find(
    query: Query<LotQuestion>,
    include: boolean | ListProps['include'],
  ): Promise<
    { queryResult: QueryResult<LotQuestion> } & CoreSchema.WithPaginationResult<LotManagementSchema.LotQuestion> & CoreSchema.WithIncludeLinks<LotManagementSchema.RPC.DTO.LotQuestionList.Include>
  > {
    const lotQuestionRepository = await this.lotQuestionRepository();

    const queryResult = await lotQuestionRepository.find(query);
    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) => this.lotQuestionResourceMapper.toLotQuestion(m));

    const links: never[] = [];

    return {
      queryResult,
      items,
      total,
      links,
    };
  }

  withSortable(payload: ListProps['sort']): Sortable<LotQuestion>[] {
    const sorts: Sortable<LotQuestion>[] = [];

    if (NullableObject.hasValue(payload.createdAt)) {
      sorts.push(new LotQuestionCreatedAtSortable(SortableValue.getById(payload.createdAt)));
    }

    return sorts;
  }
}
