import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class FilePK extends EntityKey {
  readonly id: string;

  constructor(id: string) {
    super();

    this.id = id;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.id];
  }
}
