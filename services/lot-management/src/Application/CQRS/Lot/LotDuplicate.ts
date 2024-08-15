import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { LotPK } from '../../../Domain';
import { LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { LotResourceMapper } from '../../ResourceMappers';

export type LotDuplicateProps = LotManagementSchema.RPC.DTO.LotDuplicate.Payload;
export type LotDuplicateResult = LotManagementSchema.RPC.DTO.LotDuplicate.Result;

export class LotDuplicate implements UseCase<LotDuplicateProps, LotDuplicateResult> {
  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  async validate(payload: LotDuplicateProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: LotDuplicateProps): Promise<LotDuplicateResult> {
    const uow = await this.uow();
    const lotRepository = await this.lotRepository();

    const lotPK = new LotPK(payload.id);
    const lot = await lotRepository.get(lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.id);

    const newLotPK = await lotRepository.nextPK();
    const newLot = lot.duplicate(newLotPK);
    lotRepository.add(newLot);

    await uow.commit();

    return this.lotResourceMapper.toLotKey(newLot.primaryKey);
  }
}
