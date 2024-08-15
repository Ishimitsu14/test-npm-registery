import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { AssetFaqResourceMapper } from '../ResourceMapper';

export class AssetFaqService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(AssetFaqResourceMapper)
  private assetFaqResourceMapper: AssetFaqResourceMapper;

  async create(payload: AdminGatewaySchema.AssetFaqCreatePayload): Promise<AdminGatewaySchema.AssetFaqCreateResult> {
    return this.lotManagementRpc.send('assetFaq.create', {
      asset: payload.asset,
      question: payload.question,
      answer: payload.answer,
    });
  }

  async update(payload: AdminGatewaySchema.AssetFaqUpdatePayload): Promise<AdminGatewaySchema.AssetFaqUpdateResult> {
    return this.lotManagementRpc.send('assetFaq.update', {
      id: payload.id,
      asset: payload.asset,
      question: payload.question,
      answer: payload.answer,
    });
  }

  async delete(payload: AdminGatewaySchema.AssetFaqDeletePayload): Promise<AdminGatewaySchema.AssetFaqDeleteResult> {
    return this.lotManagementRpc.send('assetFaq.delete', {
      id: payload.id,
    });
  }

  async getById(payload: AdminGatewaySchema.AssetFaqGetByIdPayload): Promise<AdminGatewaySchema.AssetFaqGetByIdResult> {
    const assetFaq = await this.lotManagementRpc.send('assetFaq.getById', payload);

    return this.fetch(assetFaq);
  }

  async list(payload: AdminGatewaySchema.AssetFaqListPayload): Promise<AdminGatewaySchema.AssetFaqListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('assetFaq.list', {
      page: payload.page,
      filter,
      include,
      sort: payload.sort,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links);

    return {
      total,
      items: await this.fetchMany(items),
      links: internalLinks.concat(externalLinks),
    };
  }

  async fetch(item: LotManagementSchema.AssetFaq) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.AssetFaq[]) {
    return items.map((m) => this.assetFaqResourceMapper.toAssetFaq(m));
  }

  toFilter(filter: AdminGatewaySchema.AssetFaqListFilter): LotManagementSchema.RPC.DTO.AssetFaqList.Filter {
    return compositeFilterGateway(filter, (filter) => ({
      id: filter.id,
      asset: filter.asset,
    }));
  }

  toInclude(include: boolean | AdminGatewaySchema.AssetFaqListInclude): LotManagementSchema.RPC.DTO.AssetFaqList.Include {
    if (!include) return null;
    if (include === true) return {};
  }

  toInternalIncludeLinks(items: LotManagementSchema.AssetFaq[], include: boolean | AdminGatewaySchema.AssetFaqListInclude) {
    return includeLinks(include, async (include, links) => {});
  }

  async toExternalIncludeLinks(links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.AssetFaqList.Include>[]): Promise<CoreSchema.IncludeLink<AdminGatewaySchema.AssetFaqListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<AdminGatewaySchema.AssetFaqListInclude>[] = [];
    return externalLinks;
  }
}
