import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query, QueryResult, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { CommonInternal, CoreResourceMapper } from '@shared/common-internal';
import { isArraySchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import { AssetFaq, AssetFaqByAssetSpecfication, AssetFaqPK, AssetPK } from '../../../Domain';
import { ASSET_FAQ_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { AssetFaqResourceMapper } from '../../ResourceMappers';

type ListProps = LotManagementSchema.RPC.DTO.AssetFaqList.Payload;
type FListResult = LotManagementSchema.RPC.DTO.AssetFaqList.Result;

export class AssetFaqList implements UseCase<ListProps, FListResult> {
  @InjectContext(ASSET_FAQ_REPOSITORY_INJECT_TOKEN)
  private readonly assetFaqRepository: InjectContext<ASSET_FAQ_REPOSITORY_INJECT_TOKEN>;

  @Inject(AssetFaqResourceMapper)
  private assetFaqResourceMapper: AssetFaqResourceMapper;

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

        asset: [isArraySchema(isStringWithValueSchema, minSchema(1))],
      },
      include: [],
      sort: [],
    });
  }

  async execute(payload: ListProps): Promise<FListResult> {
    let query = Query.create(AssetFaq);

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

  filter(filter: ListProps['filter']): Specification<AssetFaq> {
    return CommonInternal.compositeFilter(filter, (filter, specs) => {
      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter?.id.map((id) => AssetFaqPK.raw(id))));
      }

      if (NullableObject.hasValue(filter.asset)) {
        specs.push(new AssetFaqByAssetSpecfication(filter.asset.map((id) => AssetPK.fromSnapshot(id))));
      }
    });
  }

  async find(
    query: Query<AssetFaq>,
    include: boolean | ListProps['include'],
  ): Promise<{ queryResult: QueryResult<AssetFaq> } & CoreSchema.WithPaginationResult<LotManagementSchema.AssetFaq> & CoreSchema.WithIncludeLinks<LotManagementSchema.RPC.DTO.AssetFaqList.Include>> {
    const assetFaqRepository = await this.assetFaqRepository();

    const queryResult = await assetFaqRepository.find(query);
    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) => this.assetFaqResourceMapper.toAssetFaq(m));

    const links: never[] = [];

    return {
      queryResult,
      items,
      total,
      links,
    };
  }
}
