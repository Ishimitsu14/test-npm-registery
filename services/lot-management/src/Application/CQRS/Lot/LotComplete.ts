import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { LotCompletedReasonType, LotPK } from '../../../Domain';
import { LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type LotCompleteProps = LotManagementSchema.RPC.DTO.LotComplete.Payload;
export type LotCompleteResult = LotManagementSchema.RPC.DTO.LotComplete.Result;

export class LotComplete implements UseCase<LotCompleteProps, LotCompleteResult> {
  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  async validate(payload: LotCompleteProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
      reason: [isRequiredSchema, LotCompletedReasonType.validator()],
    });
  }

  async execute(payload: LotCompleteProps): Promise<LotCompleteResult> {
    const uow = await this.uow();
    const lotRepository = await this.lotRepository();

    const lotPK = new LotPK(payload.id);
    const lot = await lotRepository.get(lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.id);

    const completedReason = LotCompletedReasonType.getById(payload.reason);
    lot.complete(completedReason);

    lotRepository.update(lot);

    await uow.commit();
  }
}
