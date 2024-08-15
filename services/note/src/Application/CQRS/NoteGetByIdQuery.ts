import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NoteNotFoundError } from '@schema/common';
import { NoteSchema } from '@schema/note';
import { isRequiredSchema, isStringSchema, validateRoot } from '@shared/validation';

import { NotePK } from '../../Domain';
import { NOTE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { NoteResourceMapper } from '../ResourceMappers';

export type NoteGetByIdQueryProps = NoteSchema.RPC.DTO.NoteGetById.Payload;
export type NoteGetByIdQueryResult = NoteSchema.RPC.DTO.NoteGetById.Result;

export class NoteGetByIdQuery implements UseCase<NoteGetByIdQueryProps, NoteGetByIdQueryResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(NoteResourceMapper)
  private noteResourceMapper: NoteResourceMapper;

  @InjectContext(NOTE_REPOSITORY_INJECT_TOKEN)
  private noteRepository: InjectContext<NOTE_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: NoteGetByIdQueryProps): Promise<void> {
    validateRoot(payload, {
      id: [isStringSchema, isRequiredSchema],
    });
  }

  async execute(payload: NoteGetByIdQueryProps): Promise<NoteGetByIdQueryResult> {
    const uow = await this.uow();
    const noteRepository = await this.noteRepository();

    const notePk = NotePK.create(payload.id);
    const note = await noteRepository.get(notePk);

    if (NullableObject.isEmpty(note)) throw new NoteNotFoundError(notePk.id);

    await uow.commit();

    return this.noteResourceMapper.toNote(note);
  }
}
