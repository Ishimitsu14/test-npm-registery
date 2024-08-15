import { ValueObjectAtomicValue } from '@ddd/domain';
import { mapManyArray, Specification } from '@ddd/specifications';

import { Note } from '../Note';

export class NoteByEntityPkSpecification extends Specification<Note> {
  readonly entityPks: string[];

  constructor(...entityPks: (string | string[])[]) {
    super();
    this.entityPks = mapManyArray(entityPks);

    this.addFilter((note) => !!this.entityPks.find((entityPk) => note.entityPk === entityPk));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.entityPks];
  }
}
