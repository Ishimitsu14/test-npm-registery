import { forwardRef, Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { NotificationSchema } from '@schema/notification';
import { compositeFilterGateway } from '@shared/common-internal';

import { useAuthApi } from '../Contexts';
import { NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { CoreResourceMapper, NotificationResourceMapper } from '../ResourceMapper';

export class NotificationService {
  @Inject(NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN)
  private readonly notificationManagementRPC: NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @Inject(forwardRef(() => NotificationResourceMapper))
  private notificationResourceMapper: NotificationResourceMapper;

  async getById(payload: AdminGatewaySchema.NotificationGetByIdPayload): Promise<AdminGatewaySchema.NotificationGetByIdResult> {
    const { userId } = useAuthApi();
    const notification = await this.notificationManagementRPC.send('notification.getById', {
      recipientId: userId,
      notificationId: payload.notificationId,
    });

    return this.fetch(notification);
  }

  async list(payload: AdminGatewaySchema.NotificationListPayload): Promise<AdminGatewaySchema.NotificationListResult> {
    const notificationResult = await this.notificationManagementRPC.send('notification.list', {
      page: payload.page,
      filter: this.filterList(payload.filter),
      sort: payload.sort,
    });

    const notifications = await this.fetchMany(notificationResult.items);
    return this.coreResourceMapper.withPaginationResult(notifications, notificationResult.total);
  }

  async makeReaded(payload: AdminGatewaySchema.RPC.DTO.NotificationMakeRead.Payload): Promise<AdminGatewaySchema.RPC.DTO.NotificationMakeRead.Result> {
    await this.notificationManagementRPC.send('notification.makeRead', {
      isReaded: payload.isReaded,
      filter: this.filterList(payload.filter),
    });
  }

  async fetch(item: NotificationSchema.Notification): Promise<AdminGatewaySchema.Notification> {
    return this.fetchMany([item]).then(([item]) => item);
  }

  async fetchMany(items: NotificationSchema.Notification[]): Promise<AdminGatewaySchema.Notification[]> {
    return Promise.all(
      items.map(async (item) => {
        return this.notificationResourceMapper.toNotification(item);
      }),
    );
  }

  filterList(filter: AdminGatewaySchema.NotificationListFilter): NotificationSchema.RPC.DTO.NotificationList.Filter {
    const { userId } = useAuthApi();

    return compositeFilterGateway(filter, (filter) => {
      return {
        notificationIds: filter.notificationIds,
        recipientsIds: [userId],
        isReaded: filter.isReaded,
        type: filter.type,
      };
    });
  }
}
