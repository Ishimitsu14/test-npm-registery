import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { FeedbackNotFoundError } from '@schema/common';
import { FeedbackSchema } from '@schema/feedback';
import { isRequiredSchema, isStringSchema, validateRoot } from '@shared/validation';

import { FeedbackPK } from '../../Domain';
import { FEEDBACK_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { FeedbackResourceMapper } from '../ResourceMappers';

export type FeedbackGetByIdQueryProps = FeedbackSchema.RPC.DTO.FeedbackGetById.Payload;
export type FeedbackGetByIdQueryResult = FeedbackSchema.RPC.DTO.FeedbackGetById.Result;

export class FeedbackGetByIdQuery implements UseCase<FeedbackGetByIdQueryProps, FeedbackGetByIdQueryResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(FeedbackResourceMapper)
  private feedbackResourceMapper: FeedbackResourceMapper;

  @InjectContext(FEEDBACK_REPOSITORY_INJECT_TOKEN)
  private feedbackRepository: InjectContext<FEEDBACK_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: FeedbackGetByIdQueryProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringSchema],
    });
  }

  async execute(payload: FeedbackGetByIdQueryProps): Promise<FeedbackGetByIdQueryResult> {
    const uow = await this.uow();
    const feedbackRepository = await this.feedbackRepository();

    const feedbackPK = FeedbackPK.create(payload.id);
    const feedback = await feedbackRepository.get(feedbackPK);

    if (NullableObject.isEmpty(feedback)) {
      throw new FeedbackNotFoundError(feedbackPK.id);
    }

    await uow.commit();

    return this.feedbackResourceMapper.toFeedback(feedback);
  }
}
