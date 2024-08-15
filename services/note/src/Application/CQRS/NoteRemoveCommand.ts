import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { NoteNotFoundError } from '@schema/common';
import { NoteSchema } from '@schema/note';
import { isRequiredSchema, isStringSchema, validateRoot } from '@shared/validation';

import { NotePK } from '../../Domain';
import { NOTE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';

export type NoteRemoveCommandProps = NoteSchema.RPC.DTO.NoteRemove.Payload;
export type NoteRemoveCommandResult = NoteSchema.RPC.DTO.NoteRemove.Result;

export class NoteRemoveCommand implements UseCase<NoteRemoveCommandProps, NoteRemoveCommandResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(NOTE_REPOSITORY_INJECT_TOKEN)
  private noteRepository: InjectContext<NOTE_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: NoteRemoveCommandProps): Promise<void> {
    validateRoot(payload, {
      id: [isStringSchema, isRequiredSchema],
    });
  }

  async execute(payload: NoteRemoveCommandProps): Promise<NoteRemoveCommandResult> {
    const uow = await this.uow();
    const noteRepository = await this.noteRepository();

    const notePK = NotePK.create(payload.id);
    const note = await noteRepository.get(notePK);

    if (NullableObject.isEmpty(note)) throw new NoteNotFoundError(payload.id);

    noteRepository.remove(note);

    await uow.commit();
  }
}
