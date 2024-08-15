import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';

export class ViewLotService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  async create(payload: DeskGatewaySchema.RPC.DTO.ViewLotCreate.Payload): Promise<DeskGatewaySchema.RPC.DTO.ViewLotCreate.Result> {
    await this.lotManagementRpc.send('viewLot.create', {
      lotId: payload.lotId,
    });
  }

  async getByLotId(payload: DeskGatewaySchema.RPC.DTO.ViewLotGetByLotId.Payload): Promise<DeskGatewaySchema.RPC.DTO.ViewLotGetByLotId.Result> {
    return await this.lotManagementRpc.send('viewLot.getByLotId', {
      lotId: payload.lotId,
    });
  }
}
