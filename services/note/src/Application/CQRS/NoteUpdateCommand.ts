import { UseCase } from '@ddd/application';
import { NullableObject, VoidableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NoteNotFoundError } from '@schema/common';
import { NoteSchema } from '@schema/note';
import { isRequiredSchema, isStringSchema, validateRoot } from '@shared/validation';

import { NotePK } from '../../Domain';
import { NOTE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { NoteResourceMapper } from '../ResourceMappers';

export type NoteUpdateCommandProps = NoteSchema.RPC.DTO.NoteUpdate.Payload;
export type NoteUpdateCommandResult = NoteSchema.RPC.DTO.NoteUpdate.Result;

export class NoteUpdateCommand implements UseCase<NoteUpdateCommandProps, NoteUpdateCommandResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(NoteResourceMapper)
  private noteResourceMapper: NoteResourceMapper;

  @InjectContext(NOTE_REPOSITORY_INJECT_TOKEN)
  private noteRepository: InjectContext<NOTE_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: NoteUpdateCommandProps): Promise<void> {
    validateRoot(payload, {
      id: [isStringSchema, isRequiredSchema],
      text: [isStringSchema],
    });
  }

  async execute(payload: NoteUpdateCommandProps): Promise<NoteUpdateCommandResult> {
    const uow = await this.uow();
    const noteRepository = await this.noteRepository();

    const notePK = NotePK.create(payload.id);
    const note = await noteRepository.get(notePK);

    if (NullableObject.isEmpty(note)) throw new NoteNotFoundError(payload.id);

    if (!VoidableObject.isEmpty(payload.text)) {
      note.setText(payload.text);
    }

    noteRepository.update(note);

    await uow.commit();
  }
}
