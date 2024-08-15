import { ValueObjectAtomicValue } from '@ddd/domain';
import { mapManyArray, Specification } from '@ddd/specifications';

import { Note } from '../Note';

export class NoteByEntitySpecification extends Specification<Note> {
  readonly entities: string[];

  constructor(...entities: (string | string[])[]) {
    super();
    this.entities = mapManyArray(entities);

    this.addFilter((note) => !!this.entities.find((entity) => note.entity === entity));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.entities];
  }
}
