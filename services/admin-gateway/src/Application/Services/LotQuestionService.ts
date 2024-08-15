import { forwardRef, Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { LotQuestionResourceMapper } from '../ResourceMapper';

export class LotQuestionService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => LotQuestionResourceMapper))
  private lotQuestionResourceMapper: LotQuestionResourceMapper;

  async list(payload: AdminGatewaySchema.LotQuestionListPayload): Promise<AdminGatewaySchema.LotQuestionListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('lotQuestion.list', {
      filter,
      include,
      page: payload.page,
      sort: payload.sort,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links);

    return {
      total,
      links: internalLinks.concat(externalLinks),
      items: await this.fetchMany(items),
    };
  }

  async approve(payload: AdminGatewaySchema.LotQuestionApprovePayload): Promise<AdminGatewaySchema.LotQuestionApproveResult> {
    await this.lotManagementRpc.send('lotQuestion.approve', {
      id: payload.id,
    });
  }

  async reject(payload: AdminGatewaySchema.LotQuestionRejectPayload): Promise<AdminGatewaySchema.LotQuestionRejectResult> {
    await this.lotManagementRpc.send('lotQuestion.reject', {
      id: payload.id,
    });
  }

  async fetch(item: LotManagementSchema.LotQuestion) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.LotQuestion[]) {
    return items.map((m) => this.lotQuestionResourceMapper.toLotQuestion(m));
  }

  toFilter(filter: AdminGatewaySchema.LotQuestionListFilter): LotManagementSchema.RPC.DTO.LotQuestionList.Filter {
    return compositeFilterGateway(filter, (filter) => {
      return {
        id: filter.id,
        lot: filter.lot,
        status: filter.status,
      };
    });
  }

  toInclude(include: boolean | AdminGatewaySchema.LotQuestionListInclude): LotManagementSchema.RPC.DTO.LotQuestionList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {};
  }

  toInternalIncludeLinks(items: LotManagementSchema.LotQuestion[], include: boolean | AdminGatewaySchema.LotQuestionListInclude) {
    return includeLinks(include, async (include, links) => {});
  }

  async toExternalIncludeLinks(
    links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotQuestionList.Include>[],
  ): Promise<CoreSchema.IncludeLink<AdminGatewaySchema.LotQuestionListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<AdminGatewaySchema.LotQuestionListInclude>[] = [];

    return externalLinks;
  }
}
