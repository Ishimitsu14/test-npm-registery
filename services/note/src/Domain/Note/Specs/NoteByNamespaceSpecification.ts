import { ValueObjectAtomicValue } from '@ddd/domain';
import { mapManyArray, Specification } from '@ddd/specifications';

import { Note } from '../Note';

export class NoteByNamespaceSpecification extends Specification<Note> {
  readonly namespaces: string[];

  constructor(...namespaces: (string | string[])[]) {
    super();
    this.namespaces = mapManyArray(namespaces);

    this.addFilter((note) => !!this.namespaces.find((namespace) => note.namespace === namespace));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.namespaces];
  }
}
