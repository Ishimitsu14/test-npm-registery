import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { LotPK } from '../../../Domain';
import { LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type LotSendOnModerationProps = LotManagementSchema.RPC.DTO.LotSendOnModeration.Payload;
export type LotSendOnModerationResult = LotManagementSchema.RPC.DTO.LotSendOnModeration.Result;

export class LotSendOnModeration implements UseCase<LotSendOnModerationProps, LotSendOnModerationResult> {
  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  async validate(payload: LotSendOnModerationProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: LotSendOnModerationProps): Promise<LotSendOnModerationResult> {
    const uow = await this.uow();
    const lotRepository = await this.lotRepository();

    const lotPK = new LotPK(payload.id);
    const lot = await lotRepository.get(lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.id);

    lot.sendOnModeration();
    lotRepository.update(lot);

    await uow.commit();
  }
}
