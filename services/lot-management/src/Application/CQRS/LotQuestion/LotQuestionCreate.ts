import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { LotPK, LotQuestion, LotQuestionPK, UserPK } from '../../../Domain';
import { LOT_QUESTION_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { LotQuestionResourceMapper } from '../../ResourceMappers';

type CreateProps = LotManagementSchema.RPC.DTO.LotQuestionCreate.Payload;
type CreateResult = LotManagementSchema.RPC.DTO.LotQuestionCreate.Result;

export class LotQuestionCreate implements UseCase<CreateProps, CreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(LOT_QUESTION_REPOSITORY_INJECT_TOKEN)
  private readonly lotQuestionRepository: InjectContext<LOT_QUESTION_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private readonly lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @Inject(LotQuestionResourceMapper)
  private lotQuestionResourceMapper: LotQuestionResourceMapper;

  async validate(payload: CreateProps): Promise<void> {
    validateRoot(payload, {
      lot: [isRequiredSchema, isNumberSchema],
      user: [isRequiredSchema, isStringWithValueSchema],
      text: [isRequiredSchema, isStringWithValueSchema],
      parentLotQuestion: [isStringWithValueSchema],
    });
  }

  async execute(payload: CreateProps): Promise<CreateResult> {
    const uow = await this.uow();
    const lotQuestionRepository = await this.lotQuestionRepository();
    const lotRepository = await this.lotRepository();

    const lotPK = new LotPK(payload.lot);
    const lot = await lotRepository.get(lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.lot);

    const lotQuestionPK = await lotQuestionRepository.nextPK();
    const userPK = UserPK.raw(payload.user);

    const parentLotQuestionPK = NullableObject.map(payload.parentLotQuestion, (v) => LotQuestionPK.raw(v));

    const lotQuestion = LotQuestion.createNew(lotQuestionPK, userPK, lotPK, payload.text, parentLotQuestionPK);

    lotQuestionRepository.add(lotQuestion);
    await uow.commit();

    return this.lotQuestionResourceMapper.toLotQuestion(lotQuestion);
  }
}
