import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { CoreSchema } from '@schema/core';
import { UserIdentitySchema } from '@schema/user-identity';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { UserResourceMapper } from '../ResourceMapper';

export class UserService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  async getById(payload: AdminGatewaySchema.UserGetByIdPayload): Promise<AdminGatewaySchema.UserGetByIdResult> {
    const user = await this.userIdentityRPC.send('user.getByKey', { id: payload.id });

    return this.fetch(user);
  }

  async list(payload: AdminGatewaySchema.UserListPayload): Promise<AdminGatewaySchema.UserListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.userIdentityRPC.send('user.list', {
      page: payload.page,
      filter,
      include,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links);

    return {
      total,
      items: await this.fetchMany(items),
      links: internalLinks.concat(externalLinks),
    };
  }

  async fetch(item: UserIdentitySchema.User): Promise<AdminGatewaySchema.User> {
    return this.fetchMany([item]).then(([item]) => item);
  }

  async fetchMany(items: UserIdentitySchema.User[]): Promise<AdminGatewaySchema.User[]> {
    return items.map((item) => this.userResourceMapper.toUser(item));
  }

  toFilter(filter: AdminGatewaySchema.UserListFilter): UserIdentitySchema.RPC.DTO.UserList.Filter {
    return compositeFilterGateway(filter, (filter) => ({
      id: filter.id,
      nickname: filter.nickname,
      isVerified: filter.isVerified,
      address: filter.address,
      search: filter.search,
      roleType: null,
    }));
  }

  toInclude(include: boolean | AdminGatewaySchema.UserListInclude): UserIdentitySchema.RPC.DTO.UserList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {};
  }

  toInternalIncludeLinks(items: UserIdentitySchema.User[], include: boolean | AdminGatewaySchema.UserListInclude) {
    return includeLinks(include, async (include, links) => {});
  }

  async toExternalIncludeLinks(links: CoreSchema.IncludeLink<UserIdentitySchema.RPC.DTO.UserList.Include>[]): Promise<CoreSchema.IncludeLink<AdminGatewaySchema.UserListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<AdminGatewaySchema.UserListInclude>[] = [];

    return externalLinks;
  }
}
