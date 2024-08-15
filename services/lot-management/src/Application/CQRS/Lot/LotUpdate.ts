import { UseCase } from '@ddd/application';
import { NullableObject, VoidableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';

import { LotPK, LotType } from '../../../Domain';
import { ASSET_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { LotCreate } from './LotCreate';

export type LotUpdateProps = LotManagementSchema.RPC.DTO.LotUpdate.Payload;
export type LotUpdateResult = LotManagementSchema.RPC.DTO.LotUpdate.Result;

export class LotUpdate implements UseCase<LotUpdateProps, LotUpdateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  @Inject(LotCreate)
  private lotCreate: LotCreate;

  async validate(payload: LotUpdateProps): Promise<void> {}

  async execute(payload: LotUpdateProps): Promise<LotUpdateResult> {
    const uow = await this.uow();
    const lotRepository = await this.lotRepository();

    const lotPK = new LotPK(payload.id);
    const lot = await lotRepository.get(lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.id);

    const attributes = await this.lotCreate.getAttributesFromInput(payload.inputs);

    if (VoidableObject.hasValue(payload.type)) {
      lot.changeCategoryStrategy(LotType.getById(payload.type), attributes);
    } else {
      lot.updateAttributes(attributes);
    }

    lotRepository.update(lot);
    await uow.commit();
  }
}
