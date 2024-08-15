import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { NotificationSchema } from '@schema/notification';

import { BidResourceMapper } from './BidResourceMapper';
import { DealResourceMapper } from './DealResourceMapper';
import { LotResourceMapper } from './LotResourceMapper';
import { UserResourceMapper } from './UserResourceMapper';

export class NotificationResourceMapper {
  @Inject(BidResourceMapper)
  private bidResourceMapper: BidResourceMapper;

  @Inject(DealResourceMapper)
  private dealResourceMapper: DealResourceMapper;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  toNotificationKey(item: NotificationSchema.NotificationPK): Required<AdminGatewaySchema.NotificationKey> {
    return {
      resource: 'notification_key',
      notificationId: item.notificationRequestKey.notificationRequestId,
    };
  }

  toNotification(item: NotificationSchema.Notification): Required<AdminGatewaySchema.Notification> {
    return {
      resource: 'notification',
      notificationId: item.notificationRequestKey.notificationRequestId,
      type: item.type,
      createdAt: item.createdAt,
      isReaded: item.isReaded,
      payload: this.toNotificationPayload(item),
    };
  }

  toNotificationPayload(item: NotificationSchema.Notification<NotificationSchema.NotificationType>): Required<AdminGatewaySchema.NotificationPayload<AdminGatewaySchema.NotificationType>> {
    if (item.type === 'BID_RECEIVED') {
      const payload = <NotificationSchema.NotificationPayload<'BID_RECEIVED'>>item.payload;

      return {
        bid: this.bidResourceMapper.toBid(payload.bid),
      };
    } else if (item.type === 'BID_STATUS_CHANGED') {
      const payload = <NotificationSchema.NotificationPayload<'BID_STATUS_CHANGED'>>item.payload;

      return {
        bid: this.bidResourceMapper.toBid(payload.bid),
      };
    } else if (item.type === 'DEAL_CREATED') {
      const payload = <NotificationSchema.NotificationPayload<'DEAL_CREATED'>>item.payload;

      return {
        deal: this.dealResourceMapper.toDeal(payload.deal),
      };
    } else if (item.type === 'DEAL_STATUS_CHANGED') {
      const payload = <NotificationSchema.NotificationPayload<'DEAL_STATUS_CHANGED'>>item.payload;

      return {
        deal: this.dealResourceMapper.toDeal(payload.deal),
      };
    } else if (item.type === 'LOT_CREATED') {
      const payload = <NotificationSchema.NotificationPayload<'LOT_CREATED'>>item.payload;

      return {
        lot: this.lotResourceMapper.toLot(payload.lot),
      };
    } else if (item.type === 'LOT_STATUS_CHANGED') {
      const payload = <NotificationSchema.NotificationPayload<'LOT_STATUS_CHANGED'>>item.payload;

      return {
        lot: this.lotResourceMapper.toLot(payload.lot),
      };
    } else if (item.type === 'SYSTEM_INFO') {
      const payload = <NotificationSchema.NotificationPayload<'SYSTEM_INFO'>>item.payload;

      return {
        text: payload.text,
      };
    } else if (item.type === 'USER_PROFILE_CHANGED') {
      const payload = <NotificationSchema.NotificationPayload<'USER_PROFILE_CHANGED'>>item.payload;

      return {
        user: this.userResourceMapper.toUser(payload.user),
      };
    } else if (item.type === 'USER_REGISTERED') {
      const payload = <NotificationSchema.NotificationPayload<'USER_REGISTERED'>>item.payload;

      return {
        user: this.userResourceMapper.toUser(payload.user),
      };
    }

    return {} as any;
  }
}
