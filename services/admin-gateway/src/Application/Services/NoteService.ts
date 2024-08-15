import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { useAuthApi } from '../Contexts';
import { NOTE_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';

export class NoteService {
  @Inject(NOTE_RPC_COMPONENT_INJECT_TOKEN)
  private readonly noteRPC: NOTE_RPC_COMPONENT_INJECT_TOKEN;

  private readonly noteNameSpace = 'admin-gateway';

  async create(payload: AdminGatewaySchema.NoteCreatePayload): Promise<AdminGatewaySchema.NoteCreateResult> {
    const { userId } = useAuthApi();

    const notePK = this.noteRPC.send('note.create', {
      ownerId: userId,
      namespace: this.noteNameSpace,
      entity: payload.entity,
      entityPk: payload.entityPk,
      text: payload.text,
    });

    return notePK;
  }

  async update(payload: AdminGatewaySchema.NoteUpdatePayload): Promise<AdminGatewaySchema.NoteUpdateResult> {
    await this.noteRPC.send('note.update', {
      id: payload.id,
      text: payload.text,
    });
  }

  async getById(payload: AdminGatewaySchema.NoteGetByIdPayload): Promise<AdminGatewaySchema.NoteGetByIdResult> {
    return await this.noteRPC.send('note.getById', {
      id: payload.id,
    });
  }

  async list(payload: AdminGatewaySchema.NoteListPayload): Promise<AdminGatewaySchema.NoteListResult> {
    return await this.noteRPC.send('note.list', {
      namespace: this.noteNameSpace,
      entity: payload.entity,
      entityPk: payload.entityPk,
    });
  }

  async remove(payload: AdminGatewaySchema.NoteRemovePayload): Promise<AdminGatewaySchema.NoteRemoveResult> {
    await this.noteRPC.send('note.remove', {
      id: payload.id,
    });
  }
}
