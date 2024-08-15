import { UseCase } from '@ddd/application';
import { Query, SortableValue } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NoteSchema } from '@schema/note';
import { isRequiredSchema, isStringSchema, validateRoot } from '@shared/validation';

import { Note, NoteByEntityPkSpecification, NoteByEntitySpecification, NoteByNamespaceSpecification, NoteCreatedAtSortable } from '../../Domain';
import { NOTE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { NoteResourceMapper } from '../ResourceMappers';

export type NoteListQueryProps = NoteSchema.RPC.DTO.NoteList.Payload;
export type NoteListQueryResult = NoteSchema.RPC.DTO.NoteList.Result;

export class NoteListQuery implements UseCase<NoteListQueryProps, NoteListQueryResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(NoteResourceMapper)
  private noteResourceMapper: NoteResourceMapper;

  @InjectContext(NOTE_REPOSITORY_INJECT_TOKEN)
  private noteRepository: InjectContext<NOTE_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: NoteListQueryProps): Promise<void> {
    validateRoot(payload, {
      namespace: [isStringSchema, isRequiredSchema],
      entity: [isStringSchema, isRequiredSchema],
      entityPk: [isStringSchema, isRequiredSchema],
    });
  }

  async execute(payload: NoteListQueryProps): Promise<NoteListQueryResult> {
    const uow = await this.uow();
    const noteRepository = await this.noteRepository();

    const noteQuery = Query.create(Note)
      .addSpecification(new NoteByNamespaceSpecification(payload.namespace))
      .addSpecification(new NoteByEntitySpecification(payload.entity))
      .addSpecification(new NoteByEntityPkSpecification(payload.entityPk))
      .addSortable(new NoteCreatedAtSortable(SortableValue.getById('DESC')));

    const notes = await noteRepository.find(noteQuery);

    await uow.commit();

    return notes.items.map((note) => this.noteResourceMapper.toNote(note));
  }
}
