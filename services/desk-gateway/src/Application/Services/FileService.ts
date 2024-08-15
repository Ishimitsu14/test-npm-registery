import { forwardRef, Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { FileManagementResourceMapper } from '../ResourceMapper';

export class FileService {
  @Inject(FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private fileManagementRpc: FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => FileManagementResourceMapper))
  private fileManagementResourceMapper: FileManagementResourceMapper;

  async getById(payload: DeskGatewaySchema.FileGetByIdPayload): Promise<DeskGatewaySchema.FileGetByIdResult> {
    const file = await this.fileManagementRpc.send('file.get', {
      id: payload.id,
    });

    return {
      url: this.fileManagementResourceMapper.toFileURL(file),
    };
  }
}
