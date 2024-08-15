import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { FavoriteLotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';
import { FavoriteLotPK } from 'services/lot-management/src/Domain';

import { FAVORITE_LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type FavoriteLotDeleteProps = LotManagementSchema.RPC.DTO.FavoriteLotDelete.Payload;
export type FavoriteLotResult = LotManagementSchema.RPC.DTO.FavoriteLotDelete.Result;

export class FavoriteLotDelete implements UseCase<FavoriteLotDeleteProps, FavoriteLotResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(FAVORITE_LOT_REPOSITORY_INJECT_TOKEN)
  private readonly favoriteLotRepository: InjectContext<FAVORITE_LOT_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: FavoriteLotDeleteProps) {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: FavoriteLotDeleteProps): Promise<FavoriteLotResult> {
    const uow = await this.uow();
    const favoriteLotRepository = await this.favoriteLotRepository();

    const pk = FavoriteLotPK.raw(payload.id);

    const favoriteLot = await favoriteLotRepository.get(pk);

    if (NullableObject.isEmpty(favoriteLot)) throw new FavoriteLotNotFoundError(payload.id);

    favoriteLotRepository.removeByPK(pk);

    await uow.commit();
  }
}
