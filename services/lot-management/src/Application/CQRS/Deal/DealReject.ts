import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { DealNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';
import { DealPK } from 'services/lot-management/src/Domain';

import { DEAL_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type DealRejectProps = LotManagementSchema.RPC.DTO.DealReject.Payload;
export type DealRejectResult = LotManagementSchema.RPC.DTO.DealReject.Result;

export class DealReject implements UseCase<DealRejectProps, DealRejectResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: DealRejectProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: DealRejectProps): Promise<DealRejectResult> {
    const uow = await this.uow();
    const dealRepository = await this.dealRepository();

    const deal = await dealRepository.get(DealPK.raw(payload.id));
    if (NullableObject.isEmpty(deal)) throw new DealNotFoundError(payload.id);

    deal.reject();
    dealRepository.update(deal);

    await uow.commit();
  }
}
