import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NotificationSchema } from '@schema/notification';
import { isArraySchema, isBooleanSchema, isRequiredSchema, isStringWithValueSchema, minSchema, validateRoot } from '@shared/validation';

import { Notification, NotificationType } from '../../../Domain';
import { NOTIFICATION_REPOSITORY, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { NotificationList } from './NotificationList';

export type NotificationMakeReadProps = NotificationSchema.RPC.DTO.NotificationMakeRead.Payload;
export type NotificationMakeReadResult = NotificationSchema.RPC.DTO.NotificationMakeRead.Result;

export class NotificationMakeRead implements UseCase<NotificationMakeReadProps, NotificationMakeReadResult> {
  @InjectContext(NOTIFICATION_REPOSITORY)
  private notificationRepository: InjectContext<NOTIFICATION_REPOSITORY>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(NotificationList)
  private notificationList: NotificationList;

  async validate(payload: NotificationMakeReadProps): Promise<void> {
    validateRoot(payload, {
      filter: {
        AND: [],
        OR: [],
        NOT: [],

        notificationIds: [isArraySchema(isStringWithValueSchema, minSchema(0))],
        recipientsIds: [isArraySchema(isStringWithValueSchema, minSchema(0))],
        type: [isArraySchema(NotificationType.validator(), minSchema(1))],
        isReaded: [isBooleanSchema],
      },
      isReaded: [isRequiredSchema, isBooleanSchema],
    });
  }

  async execute(payload: NotificationMakeReadProps): Promise<NotificationMakeReadResult> {
    const notificationRepository = await this.notificationRepository();
    const uow = await this.uow();

    let query = Query.create(Notification);
    if (NullableObject.hasValue(payload.filter)) {
      query = query.addSpecification(this.notificationList.filter(payload.filter));
    }

    await this.forEach(
      async (skip) => {
        const pageableQuery = query.addPageable(skip);
        const notificationResult = await notificationRepository.find(pageableQuery);

        return { total: notificationResult.count, items: notificationResult.items };
      },
      async (items) => {
        for (const item of items) {
          item.makeReaded(payload.isReaded);
        }
        notificationRepository.updateMany(items);
      },
    );
    await uow.commit();
  }

  async forEach<T>(requestCallback: (skip: number) => Promise<{ total: number; items: T[] }>, callback: (items: T[]) => Promise<void>) {
    let _total = 0;
    let _skip = 0;

    do {
      const _prevSkip = _skip;
      const { total, items } = await requestCallback(_prevSkip);

      _total = total;
      _skip = _skip + items.length;

      if (_prevSkip === _skip) break;

      await callback(items);
    } while (_skip >= _total);
  }
}
