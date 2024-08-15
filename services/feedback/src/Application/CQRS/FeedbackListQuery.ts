import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query, Sortable, SortableValue } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { FeedbackSchema } from '@schema/feedback';
import { CoreResourceMapper } from '@shared/common-internal';
import { validateRoot } from '@shared/validation';

import { Feedback, FeedbackCreatedAtSortable, FeedbackRatingSortable } from '../../Domain';
import { FEEDBACK_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { FeedbackResourceMapper } from '../ResourceMappers';

export type FeedbackListQueryProps = FeedbackSchema.RPC.DTO.FeedbackList.Payload;
export type FeedbackListQueryResult = FeedbackSchema.RPC.DTO.FeedbackList.Result;

export class FeedbackListQuery implements UseCase<FeedbackListQueryProps, FeedbackListQueryResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(FeedbackResourceMapper)
  private feedbackResourceMapper: FeedbackResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @InjectContext(FEEDBACK_REPOSITORY_INJECT_TOKEN)
  private feedbackRepository: InjectContext<FEEDBACK_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: FeedbackListQueryProps): Promise<void> {
    validateRoot(payload, {
      page: { skip: [], limit: [] },
      sort: [],
    });
  }

  async execute(payload: FeedbackListQueryProps): Promise<FeedbackListQueryResult> {
    const uow = await this.uow();
    const feedbackRepository = await this.feedbackRepository();

    let query = Query.create(Feedback);

    if (NullableObject.hasValue(payload.sort)) {
      query = query.addSortable(this.withSortable(payload.sort));
    }

    const feedbackList = await feedbackRepository.find(query);

    const feedbackWithPagination = this.coreResourceMapper.withPaginationResult(feedbackList.items, feedbackList.count);

    await uow.commit();

    return this.coreResourceMapper.toPagination(feedbackWithPagination, (m) => this.feedbackResourceMapper.toFeedback(m));
  }

  private withSortable(payload: FeedbackListQueryProps['sort']): Sortable<Feedback>[] {
    const sorts: Sortable<Feedback>[] = [];

    if (NullableObject.hasValue(payload.createdAt)) {
      sorts.push(new FeedbackCreatedAtSortable(SortableValue.getById(payload.createdAt)));
    }

    if (NullableObject.hasValue(payload.rating)) {
      sorts.push(new FeedbackRatingSortable(SortableValue.getById(payload.rating)));
    }

    return sorts;
  }
}
