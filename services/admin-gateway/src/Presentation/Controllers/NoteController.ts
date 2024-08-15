import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { NoteService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class NoteController {
  @Inject(NoteService)
  private readonly noteService: NoteService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('note.create'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async create() {
    const { params } = useRpcRequestInfo();

    return this.noteService.create(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('note.update'))
  async update() {
    const { params } = useRpcRequestInfo();

    return this.noteService.update(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('note.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();

    return this.noteService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('note.list'))
  async list() {
    const { params } = useRpcRequestInfo();

    return this.noteService.list(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('note.remove'))
  async remove() {
    const { params } = useRpcRequestInfo();

    return this.noteService.remove(params);
  }
}
