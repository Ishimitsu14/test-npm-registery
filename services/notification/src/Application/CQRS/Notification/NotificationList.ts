import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { AndSpecification, Query, Sortable, SortableValue, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NotificationSchema } from '@schema/notification';
import { compositeFilter } from '@shared/common-internal';
import { isArraySchema, isBooleanSchema, isStringWithValueSchema, minSchema, validateRoot } from '@shared/validation';

import {
  Notification,
  NotificationByIsReadedSpecification,
  NotificationByNotificationRequestSpecification,
  NotificationByRecipientSpecification,
  NotificationCreatedAtSortable,
  NotificationIsReadedSortable,
  NotificationRecipientPK,
  NotificationRequest,
  NotificationRequestByTypeSpecification,
  NotificationRequestPK,
  NotificationType,
} from '../../../Domain';
import { NOTIFICATION_REPOSITORY, NOTIFICATION_REQUEST_REPOSITORY } from '../../InjectTokens';
import { CommonResourceMapper, NotificationResourceMapper } from '../../ResourceMappers';

export type NotificationListProps = NotificationSchema.RPC.DTO.NotificationList.Payload;
export type NotificationListResult = NotificationSchema.RPC.DTO.NotificationList.Result;

export class NotificationList implements UseCase<NotificationListProps, NotificationListResult> {
  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  @InjectContext(NOTIFICATION_REPOSITORY)
  private notificationRepository: InjectContext<NOTIFICATION_REPOSITORY>;

  @InjectContext(NOTIFICATION_REQUEST_REPOSITORY)
  private notificationRequestRepository: InjectContext<NOTIFICATION_REQUEST_REPOSITORY>;

  @Inject(NotificationResourceMapper)
  private notificationResourceMapper: NotificationResourceMapper;

  async validate(payload: NotificationListProps): Promise<void> {
    validateRoot(payload, {
      page: { skip: [], limit: [] },
      filter: {
        AND: [],
        OR: [],
        NOT: [],

        notificationIds: [isArraySchema(isStringWithValueSchema, minSchema(0))],
        recipientsIds: [isArraySchema(isStringWithValueSchema, minSchema(0))],
        type: [isArraySchema(NotificationType.validator(), minSchema(1))],
        isReaded: [isBooleanSchema],
      },
      sort: [],
    });
  }

  async execute(payload: NotificationListProps): Promise<NotificationListResult> {
    const notificationRepository = await this.notificationRepository();
    const notificationRequestRepository = await this.notificationRequestRepository();

    let query = Query.create(Notification);

    if (NullableObject.hasValue(payload.filter)) {
      query = query.addSpecification(this.filter(payload.filter));
    }

    if (NullableObject.hasValue(payload.page)) {
      query = query.addPageable(payload.page.skip, payload.page.limit);
    }

    if (NullableObject.hasValue(payload.sort)) {
      query = query.addSortable(this.withSortable(payload.sort));
    }

    const notificationResult = await notificationRepository.find(query);

    const notificationRequestIncludeSpec = WhereInPKSpecification.create<NotificationRequest>(notificationResult.mapTo((m) => m.primaryKey.notificationRequestPK).items);
    const notificationRequestResult = await notificationRequestRepository.find(Query.create(NotificationRequest).addSpecification(notificationRequestIncludeSpec));
    return this.commonResourceMapper.toPagination(notificationResult, (m) =>
      this.notificationResourceMapper.toNotification(
        m,
        notificationRequestResult.items.find((k) => k.primaryKey.isEquals(m.primaryKey.notificationRequestPK)),
      ),
    );
  }

  filter(filter: NotificationSchema.RPC.DTO.NotificationList.Filter): Specification<Notification> {
    return compositeFilter(filter, (filter, specs) => {
      const notificationRequestSpecs: Specification<NotificationRequest>[] = [];

      if (NullableObject.hasValue(filter.isReaded)) {
        specs.push(new NotificationByIsReadedSpecification(filter.isReaded));
      }

      if (NullableObject.hasValue(filter.recipientsIds)) {
        specs.push(new NotificationByRecipientSpecification(filter.recipientsIds.map((id) => NotificationRecipientPK.create(id))));
      }

      if (NullableObject.hasValue(filter.notificationIds)) {
        notificationRequestSpecs.push(WhereInPKSpecification.create(filter.notificationIds.map((id) => NotificationRequestPK.create(id))));
      }

      if (NullableObject.hasValue(filter.type)) {
        notificationRequestSpecs.push(new NotificationRequestByTypeSpecification(filter.type.map((type) => NotificationType.getById(type))));
      }

      if (notificationRequestSpecs.length > 0) {
        specs.push(new NotificationByNotificationRequestSpecification(AndSpecification.create(notificationRequestSpecs)));
      }
    });
  }

  withSortable(payload: NotificationListProps['sort']): Sortable<Notification>[] {
    const sorts: Sortable<Notification>[] = [];

    if (NullableObject.hasValue(payload.createdAt)) {
      sorts.push(new NotificationCreatedAtSortable(SortableValue.getById(payload.createdAt)));
    }

    if (NullableObject.hasValue(payload.isReaded)) {
      sorts.push(new NotificationIsReadedSortable(SortableValue.getById(payload.isReaded)));
    }

    return sorts;
  }
}
