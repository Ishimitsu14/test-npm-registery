import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { FavoriteLot, LotPK, UserPK } from '../../../Domain';
import { FAVORITE_LOT_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { FavoriteLotResourceMapper } from '../../ResourceMappers';

export type FavoriteRoleCreateProps = LotManagementSchema.RPC.DTO.FavoriteLotCreate.Payload;
export type FavoriteRoleCreateResult = LotManagementSchema.RPC.DTO.FavoriteLotCreate.Result;

export class FavoriteLotCreate implements UseCase<FavoriteRoleCreateProps, FavoriteRoleCreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(FAVORITE_LOT_REPOSITORY_INJECT_TOKEN)
  private readonly favoriteLotRepository: InjectContext<FAVORITE_LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private readonly lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @Inject(FavoriteLotResourceMapper)
  private favoriteLotResourceMapper: FavoriteLotResourceMapper;

  async validate(payload: FavoriteRoleCreateProps): Promise<void> {
    validateRoot(payload, {
      lot: [isRequiredSchema, isNumberSchema],
      user: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: FavoriteRoleCreateProps): Promise<FavoriteRoleCreateResult> {
    const uow = await this.uow();
    const favoriteLotRepository = await this.favoriteLotRepository();
    const lotRepository = await this.lotRepository();

    const lotPK = new LotPK(payload.lot);
    const lot = await lotRepository.get(lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.lot);

    const favoriteLotPK = await favoriteLotRepository.nextPK();
    const userPK = UserPK.raw(payload.user);

    const favoriteLot = FavoriteLot.createNew(favoriteLotPK, userPK, lotPK);

    favoriteLotRepository.add(favoriteLot);
    await uow.commit();

    return this.favoriteLotResourceMapper.toFavoriteLot(favoriteLot);
  }
}
