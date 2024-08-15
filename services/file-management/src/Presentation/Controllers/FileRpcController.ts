import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { FileManagementSchema } from '@schema/file-management';

import { FileGet, FileGetUploadURL, FileList } from '../../Application';

@NestRpcController()
export class FileRpcController {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @NestRpcMethod(FileManagementSchema.RPC.MethodName('file.getUploadURL'))
  async getUploadURL() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FileGetUploadURL);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(FileManagementSchema.RPC.MethodName('file.get'))
  async get() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FileGet);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(FileManagementSchema.RPC.MethodName('file.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FileList);

    await handler.validate(params);
    return handler.execute(params);
  }
}
