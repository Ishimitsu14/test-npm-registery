import { forwardRef, Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { FileService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class FileController {
  @Inject(forwardRef(() => FileService))
  private readonly fileService: FileService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('file.getById'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async getById() {
    const { params } = useRpcRequestInfo();

    return this.fileService.getById(params);
  }
}
