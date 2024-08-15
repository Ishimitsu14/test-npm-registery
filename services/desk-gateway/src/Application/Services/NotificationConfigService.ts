import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { useAuthApi } from '../Contexts';
import { NOTIFICATION_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { NotificationConfigResourceMapper } from '../ResourceMapper';

export class NotificationConfigService {
  @Inject(NOTIFICATION_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private readonly notificationManagementRPC: NOTIFICATION_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(NotificationConfigResourceMapper)
  private notificationConfigResourceMapper: NotificationConfigResourceMapper;

  async get(payload: DeskGatewaySchema.RPC.DTO.NotificationConfigGet.Payload): Promise<DeskGatewaySchema.RPC.DTO.NotificationConfigGet.Result> {
    const { userId } = useAuthApi();

    const item = await this.notificationManagementRPC.send('notificationConfig.get', {
      recipientId: userId,
    });

    return this.notificationConfigResourceMapper.toNotificationConfig(item);
  }

  async update(payload: DeskGatewaySchema.RPC.DTO.NotificationConfigUpdate.Payload): Promise<DeskGatewaySchema.RPC.DTO.NotificationConfigUpdate.Result> {
    const { userId } = useAuthApi();

    await this.notificationManagementRPC.send('notificationConfig.update', {
      recipientId: userId,
      settings: payload.settings,
    });
  }
}
