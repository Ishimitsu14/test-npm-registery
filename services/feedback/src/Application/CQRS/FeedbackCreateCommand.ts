import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { FeedbackSchema } from '@schema/feedback';
import { isNumberSchema, isRequiredSchema, isStringSchema, validateRoot } from '@shared/validation';

import { Feedback } from '../../Domain';
import { FEEDBACK_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { FeedbackResourceMapper } from '../ResourceMappers/FeedbackResourceMapper';

export type FeedbackCreateCommandProps = FeedbackSchema.RPC.DTO.FeedbackCreate.Payload;
export type FeedbackCreateCommandResult = FeedbackSchema.RPC.DTO.FeedbackCreate.Result;

export class FeedbackCreateCommand implements UseCase<FeedbackCreateCommandProps, FeedbackCreateCommandResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(FeedbackResourceMapper)
  private feedbackResourceMapper: FeedbackResourceMapper;

  @InjectContext(FEEDBACK_REPOSITORY_INJECT_TOKEN)
  private feedbackRepository: InjectContext<FEEDBACK_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: FeedbackCreateCommandProps): Promise<void> {
    validateRoot(payload, {
      text: [isStringSchema, isRequiredSchema],
      page: [isStringSchema, isRequiredSchema],
      rating: [isNumberSchema, isRequiredSchema],
      userPk: [isStringSchema, isRequiredSchema],
    });
  }

  async execute(payload: FeedbackCreateCommandProps): Promise<FeedbackCreateCommandResult> {
    const uow = await this.uow();
    const feedbackRepository = await this.feedbackRepository();

    const feedbackPK = feedbackRepository.nextIdentity();
    const feedback = Feedback.create(feedbackPK, payload.text, payload.page, payload.rating, payload.userPk);

    feedbackRepository.add(feedback);

    await uow.commit();

    return this.feedbackResourceMapper.toFeedbackPK(feedback);
  }
}
