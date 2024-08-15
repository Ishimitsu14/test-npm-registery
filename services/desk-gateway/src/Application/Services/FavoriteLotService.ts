import { forwardRef, Inject } from '@nestjs/common';
import { CoreSchema } from '@schema/core';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { useAuthApi } from '../Contexts';
import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { FavoriteLotResourceMapper } from '../ResourceMapper';

export class FavoriteLotService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => FavoriteLotResourceMapper))
  private favoriteLotResourceMapper: FavoriteLotResourceMapper;

  get onlyMyFilter(): LotManagementSchema.RPC.DTO.FavoriteLotList.Filter {
    const { userId, isAuthorized } = useAuthApi();
    return (
      isAuthorized && {
        user: [userId],
      }
    );
  }

  async create(payload: DeskGatewaySchema.FavoriteLotCreatePayload): Promise<DeskGatewaySchema.FavoriteLotCreateResult> {
    const { userId } = useAuthApi();

    const favoriteLot = await this.lotManagementRpc.send('favoriteLot.create', {
      lot: payload.lot,
      user: userId,
    });

    return favoriteLot;
  }

  async delete(payload: DeskGatewaySchema.FavoriteLotDeletePayload): Promise<DeskGatewaySchema.FavoriteLotDeleteResult> {
    await this.lotManagementRpc.send('favoriteLot.delete', {
      id: payload.id,
    });
  }

  async list(payload: DeskGatewaySchema.FavoriteLotListPayload): Promise<DeskGatewaySchema.FavoriteLotListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    // return {
    //   total: 0,
    //   links: [],
    //   items: [],
    // };

    const { items, total, links } = await this.lotManagementRpc.send('favoriteLot.list', {
      filter,
      include,
      page: payload.page,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links);

    return {
      total,
      links: internalLinks.concat(externalLinks),
      items: await this.fetchMany(items),
    };
  }

  async fetch(item: LotManagementSchema.FavoriteLot) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.FavoriteLot[]) {
    return items.map((m) => this.favoriteLotResourceMapper.toFavoriteLot(m));
  }

  toFilter(filter: DeskGatewaySchema.FavoriteLotListFilter): LotManagementSchema.RPC.DTO.FavoriteLotList.Filter {
    const { userId, ensureIsAuthorized } = useAuthApi();

    return compositeFilterGateway(filter, (filter) => {
      ensureIsAuthorized();

      return {
        id: filter.id,
        user: [userId],
      };
    });
  }

  toInclude(include: boolean | DeskGatewaySchema.FavoriteLotListInclude): LotManagementSchema.RPC.DTO.FavoriteLotList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {};
  }

  toInternalIncludeLinks(items: LotManagementSchema.FavoriteLot[], include: boolean | DeskGatewaySchema.FavoriteLotListInclude) {
    return includeLinks(include, async (include, links) => {});
  }

  async toExternalIncludeLinks(
    links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.FavoriteLotList.Include>[],
  ): Promise<CoreSchema.IncludeLink<DeskGatewaySchema.FavoriteLotListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<DeskGatewaySchema.FavoriteLotListInclude>[] = [];

    return externalLinks;
  }
}
