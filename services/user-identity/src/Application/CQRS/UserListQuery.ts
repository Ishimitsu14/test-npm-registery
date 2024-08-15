import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { AndSpecification, Query, QueryResult, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CoreSchema } from '@schema/core';
import { UserIdentitySchema } from '@schema/user-identity';
import { CommonInternal, CoreResourceMapper, EvmPublicAddress, includeLinks } from '@shared/common-internal';
import { CompositeFilterSchema, isArraySchema, isBooleanSchema, isStringWithValueSchema, minSchema, PaginationPropsSchema, Schema, validateRoot } from '@shared/validation';

import {
  User,
  UserByAddressSpecification,
  UserByIsVerifiedSpecification,
  UserByNicknameSpecification,
  UserBySearchSpecification,
  UserNickname,
  UserPK,
  UserRole,
  UserRoleByTypeSpecification,
  UserRoleByUserSpecification,
  UserRoleType,
} from '../../Domain';
import { UserByRoleSpecification } from '../../Domain/User/Specs/UserByRoleSpecification';
import { USER_REPOSITORY_INJECT_TOKEN, USER_ROLE_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';
import { CommonResourceMapper, UserResourceMapper } from '../ResourceMappers';

export type UserListQueryProps = UserIdentitySchema.RPC.DTO.UserList.Payload;
export type UserListQueryResult = UserIdentitySchema.RPC.DTO.UserList.Result;

export class UserListQuery implements UseCase<UserListQueryProps, UserListQueryResult> {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(USER_ROLE_REPOSITORY_INJECT_TOKEN)
  private readonly userRoleRepository: InjectContext<USER_ROLE_REPOSITORY_INJECT_TOKEN>;

  readonly schema: Schema<UserListQueryProps> = {
    page: PaginationPropsSchema,
    filter: CompositeFilterSchema(() => ({
      id: [isArraySchema(isStringWithValueSchema, minSchema(1))],

      nickname: [isArraySchema(isStringWithValueSchema, minSchema(1))],
      address: [isArraySchema(isStringWithValueSchema, minSchema(1))],
      isVerified: [isBooleanSchema],
      search: [isStringWithValueSchema],
      roleType: [isArraySchema(UserRoleType.validator(), minSchema(1))],
    })),
    include: [],
  };

  async validate(payload: UserListQueryProps): Promise<any> {
    validateRoot(payload, this.schema);
  }

  async execute(payload: UserListQueryProps): Promise<UserListQueryResult> {
    let query = Query.create(User);

    if (NullableObject.hasValue(payload.filter)) {
      query = query.addSpecification(this.filter(payload.filter));
    }

    if (NullableObject.hasValue(payload.page)) {
      query = query.addPageable(payload.page.skip, payload.page.limit);
    }

    const { items, total, links } = await this.find(query);

    return {
      items,
      links,
      total,
    };
  }

  async find(
    query: Query<User>,
    include: boolean | UserListQueryProps['include'] = {},
  ): Promise<{ queryResult: QueryResult<User> } & CoreSchema.WithPaginationResult<UserIdentitySchema.User> & CoreSchema.WithIncludeLinks<UserIdentitySchema.RPC.DTO.UserList.Include>> {
    const userRepository = await this.userRepository();
    const userRoleRepository = await this.userRoleRepository();

    const queryResult = await userRepository.find(query);

    const userRoleQuery = Query.create(UserRole).addSpecification(new UserRoleByUserSpecification(queryResult.items.map((user) => user.primaryKey)));
    const roleResult = await userRoleRepository.find(userRoleQuery);

    const { items, total } = this.coreResourceMapper.withPaginationResult(queryResult.items, queryResult.count, (m) =>
      this.userResourceMapper.toUser(
        m,
        roleResult.items.filter((role) => m.primaryKey.isEquals(role.userPK)),
      ),
    );

    const links = await this.includeLinks(queryResult.items, include);

    return {
      queryResult,
      items,
      total,
      links,
    };
  }

  async fetchUser(value: User): Promise<UserIdentitySchema.User>;
  async fetchUser(value: User[]): Promise<UserIdentitySchema.User[]>;
  async fetchUser(value: User | User[]): Promise<UserIdentitySchema.User | UserIdentitySchema.User[]> {
    const userRoleRepository = await this.userRoleRepository();

    const items = Array.isArray(value) ? value : [value];

    const query = Query.create(UserRole).addSpecification(new UserRoleByUserSpecification(items.map((user) => user.primaryKey)));
    const roleResult = await userRoleRepository.find(query);

    return items.map((user) =>
      this.userResourceMapper.toUser(
        user,
        roleResult.items.filter((role) => user.primaryKey.isEquals(role.userPK)),
      ),
    );
  }

  async includeLinks(items: User[], include: boolean | UserListQueryProps['include']) {
    return includeLinks(include, async (include, links) => {});
  }

  filter(filter: UserListQueryProps['filter']): Specification<User> {
    return CommonInternal.compositeFilter(filter, (filter, specs) => {
      const roleSpecs: Specification<UserRole>[] = [];

      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter?.id.map((id) => UserPK.raw(id))));
      }

      if (NullableObject.hasValue(filter.nickname)) {
        specs.push(new UserByNicknameSpecification(filter.nickname.map((id) => UserNickname.raw(id))));
      }

      if (NullableObject.hasValue(filter.address)) {
        specs.push(new UserByAddressSpecification(filter.address.map((id) => EvmPublicAddress.raw(id))));
      }

      if (NullableObject.hasValue(filter.isVerified)) {
        specs.push(new UserByIsVerifiedSpecification(filter.isVerified));
      }

      if (NullableObject.hasValue(filter.search)) {
        specs.push(new UserBySearchSpecification(filter.search));
      }

      if (NullableObject.hasValue(filter.roleType)) {
        roleSpecs.push(new UserRoleByTypeSpecification(UserRoleType.getByIds(filter.roleType)));
      }

      if (roleSpecs.length > 0) specs.push(new UserByRoleSpecification(roleSpecs.length === 1 ? roleSpecs[0] : AndSpecification.create(roleSpecs)));
    });
  }
}
