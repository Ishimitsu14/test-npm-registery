import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NoteSchema } from '@schema/note';
import { isRequiredSchema, isStringSchema, validateRoot } from '@shared/validation';

import { Note } from '../../Domain';
import { NOTE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { NoteResourceMapper } from '../ResourceMappers';

export type NoteCreateCommandProps = NoteSchema.RPC.DTO.NoteCreate.Payload;
export type NoteCreateCommandResult = NoteSchema.RPC.DTO.NoteCreate.Result;

export class NoteCreateCommand implements UseCase<NoteCreateCommandProps, NoteCreateCommandResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(NoteResourceMapper)
  private noteResourceMapper: NoteResourceMapper;

  @InjectContext(NOTE_REPOSITORY_INJECT_TOKEN)
  private noteRepository: InjectContext<NOTE_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: NoteCreateCommandProps): Promise<void> {
    validateRoot(payload, {
      ownerId: [isStringSchema, isRequiredSchema],
      namespace: [isStringSchema, isRequiredSchema],
      entity: [isStringSchema, isRequiredSchema],
      entityPk: [isStringSchema, isRequiredSchema],
      text: [isStringSchema, isRequiredSchema],
    });
  }

  async execute(payload: NoteCreateCommandProps): Promise<NoteCreateCommandResult> {
    const uow = await this.uow();
    const noteRepository = await this.noteRepository();

    const notePK = noteRepository.nextIdentity();
    const note = Note.create(notePK, payload.namespace, payload.entity, payload.entityPk, payload.text, payload.ownerId);

    noteRepository.add(note);

    await uow.commit();

    return this.noteResourceMapper.toNotePK(note);
  }
}
