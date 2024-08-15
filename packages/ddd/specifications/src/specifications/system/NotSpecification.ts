import { Entity, ValueObjectAtomicValue } from '@ddd/domain';

import { Specification } from '../Specification';

export class NotSpecification<TEntity extends Entity> extends Specification<TEntity> {
  static create<TEntity extends Entity>(innerSpecification: Specification<TEntity>) {
    return new NotSpecification(innerSpecification);
  }

  private constructor(readonly notSpecification: Specification<TEntity>) {
    super();

    this.addFilter((entity) => !notSpecification.isSatisfied(entity));

    if (this.notSpecification.isLockedLocalSpecify) {
      this.lockLocalSpecify();
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.notSpecification];
  }
}
