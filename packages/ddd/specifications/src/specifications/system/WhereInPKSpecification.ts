import { NullableObject } from '@ddd/core';
import { Entity, EntityInferPrimaryKey, ValueObjectAtomicValue } from '@ddd/domain';

import { mapManyArray } from '../../utils';
import { Specification } from '../Specification';

export class WhereInPKSpecification<TEntity extends Entity> extends Specification<TEntity> {
  static create<TEntity extends Entity<any>>(...primaryKeys: (EntityInferPrimaryKey<TEntity> | EntityInferPrimaryKey<TEntity>[])[]) {
    const _primaryKeys = mapManyArray(primaryKeys);
    return new WhereInPKSpecification(_primaryKeys);
  }

  private constructor(readonly primaryKeys: EntityInferPrimaryKey<TEntity>[]) {
    super();

    this.addFilter((entity) => {
      const inPK = primaryKeys.find((pk) => pk.isEquals(<EntityInferPrimaryKey<TEntity>>entity.primaryKey));
      if (NullableObject.hasValue(inPK)) return true;

      return false;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.primaryKeys];
  }
}
