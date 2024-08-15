import LINQ from '@berish/linq';
import { forwardRef, Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { DealResourceMapper } from '../ResourceMapper';
import { BidService } from './BidService';
import { LotService } from './LotService';
import { UserService } from './UserService';

export class DealService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(DealResourceMapper)
  private dealResourceMapper: DealResourceMapper;

  @Inject(forwardRef(() => LotService))
  private lotService: LotService;

  @Inject(forwardRef(() => BidService))
  private bidService: BidService;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  async complete(payload: AdminGatewaySchema.DealCompletePayload): Promise<AdminGatewaySchema.DealCompleteResult> {
    await this.lotManagementRpc.send('deal.complete', { id: payload.id });

    const deal = await this.lotManagementRpc.send('deal.getById', { id: payload.id });
    return this.fetch(deal);
  }

  async getById(payload: AdminGatewaySchema.DealGetByIdPayload): Promise<AdminGatewaySchema.DealGetByIdResult> {
    const deal = await this.lotManagementRpc.send('deal.getById', { id: payload.id });

    return this.fetch(deal);
  }

  async list(payload: AdminGatewaySchema.DealListPayload): Promise<AdminGatewaySchema.DealListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('deal.list', {
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

  async reject(payload: AdminGatewaySchema.DealRejectPayload): Promise<AdminGatewaySchema.DealRejectResult> {
    await this.lotManagementRpc.send('deal.reject', { id: payload.id });

    const deal = await this.lotManagementRpc.send('deal.getById', { id: payload.id });
    return this.fetch(deal);
  }

  async updateKeyResult(payload: AdminGatewaySchema.DealUpdateKeyResultPayload): Promise<AdminGatewaySchema.DealUpdateKeyResultResult> {
    await this.lotManagementRpc.send('deal.updateKeyResult', {
      id: payload.id,
      agentCommissionKR: payload.agentCommissionKR && { status: payload.agentCommissionKR.status },
      agentValidationKR: payload.agentValidationKR && { status: payload.agentValidationKR.status },
      amlValidationKR: payload.amlValidationKR && { status: payload.amlValidationKR.status },
      bidMakerValidationKR: payload.bidMakerValidationKR && { status: payload.bidMakerValidationKR.status },
      documentOwnershipKR: payload.documentOwnershipKR && { status: payload.documentOwnershipKR.status },
      documentResignedKR: payload.documentResignedKR && { status: payload.documentResignedKR.status },
      kybValidationKR: payload.kybValidationKR && { status: payload.kybValidationKR.status },
      kycValidationKR: payload.kycValidationKR && { status: payload.kycValidationKR.status },
      marsbaseCommissionKR: payload.marsbaseCommissionKR && { status: payload.marsbaseCommissionKR.status, percent: payload.marsbaseCommissionKR.percent },
      offerMakerValidationKR: payload.offerMakerValidationKR && { status: payload.offerMakerValidationKR.status },
      telegramChatKR: payload.telegramChatKR && { status: payload.telegramChatKR.status, url: payload.telegramChatKR.url },
      transactionPaymentKR: payload.transactionPaymentKR && { status: payload.transactionPaymentKR.status },
    });

    const deal = await this.lotManagementRpc.send('deal.getById', { id: payload.id });
    return this.fetch(deal);
  }

  async fetch(item: LotManagementSchema.Deal) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.Deal[]) {
    return items.map((m) => this.dealResourceMapper.toDeal(m));
  }

  toFilter(filter: AdminGatewaySchema.DealListFilter): LotManagementSchema.RPC.DTO.DealList.Filter {
    return compositeFilterGateway(filter, (filter) => ({
      id: filter.id,

      status: filter.status,
      offerMaker: filter.offerMaker,
      bidMaker: filter.bidMaker,

      bid: this.bidService.toFilter(filter.bid),
    }));
  }

  toInclude(include: boolean | AdminGatewaySchema.DealListInclude): LotManagementSchema.RPC.DTO.DealList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {
      bid: this.bidService.toInclude(include?.bid),
    };
  }

  toInternalIncludeLinks(items: LotManagementSchema.Deal[], include: boolean | AdminGatewaySchema.DealListInclude) {
    return includeLinks(include, async (include, links) => {
      if (include.bidMaker) {
        const userIds = LINQ.from(items)
          .selectMany((m) => m.bidMakers)
          .map((m) => m.userId);
        const users = userIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: userIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);
        links.push(...userResult);
      }

      if (include.offerMaker) {
        const userIds = LINQ.from(items)
          .selectMany((m) => m.offerMakers)
          .map((m) => m.userId);
        const users = userIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: userIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);
        links.push(...userResult);
      }
    });
  }

  async toExternalIncludeLinks(links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.DealList.Include>[]): Promise<CoreSchema.IncludeLink<AdminGatewaySchema.DealListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<AdminGatewaySchema.DealListInclude>[] = [];

    const bids = await this.bidService.fetchMany(<LotManagementSchema.Bid[]>links.filter((m) => m.resource === 'bid'));
    externalLinks.push(...bids);

    const bidLinks = await this.bidService.toExternalIncludeLinks(<CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.BidList.Include>[]>links);
    externalLinks.push(...bidLinks);

    return externalLinks;
  }
}
