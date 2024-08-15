import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { NoteSchema } from '@schema/note';

import { NoteCreateCommand, NoteGetByIdQuery, NoteListQuery, NoteRemoveCommand, NoteUpdateCommand } from '../Application';

@NestRpcController()
export class NoteController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(NoteSchema.RPC.MethodName('note.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NoteCreateCommand);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(NoteSchema.RPC.MethodName('note.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NoteUpdateCommand);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(NoteSchema.RPC.MethodName('note.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NoteGetByIdQuery);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(NoteSchema.RPC.MethodName('note.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NoteListQuery);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(NoteSchema.RPC.MethodName('note.remove'))
  async remove() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NoteRemoveCommand);

    await handler.validate(params);
    return handler.execute(params);
  }
}
