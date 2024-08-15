import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotQuestionNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { LotQuestionPK } from '../../../Domain';
import { LOT_QUESTION_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

type RejectProps = LotManagementSchema.RPC.DTO.LotQuestionApprove.Payload;
type RejectResult = LotManagementSchema.RPC.DTO.LotQuestionApprove.Result;

export class LotQuestionReject implements UseCase<RejectProps, RejectResult> {
  @InjectContext(LOT_QUESTION_REPOSITORY_INJECT_TOKEN)
  private lotQuestionRepository: InjectContext<LOT_QUESTION_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  async validate(payload: RejectProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: RejectProps): Promise<RejectResult> {
    const uow = await this.uow();
    const lotQuestionRepository = await this.lotQuestionRepository();

    const lotQuestion = await lotQuestionRepository.get(LotQuestionPK.raw(payload.id));
    if (NullableObject.isEmpty(lotQuestion)) throw new LotQuestionNotFoundError(payload.id);

    lotQuestion.reject();
    lotQuestionRepository.update(lotQuestion);

    await uow.commit();
  }
}
