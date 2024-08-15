import { ConstructorType, NullableObject } from '@ddd/core';
import { inspect } from 'util';

import { EntityKey } from '../EntityKey';
import { IEntity } from './IEntity';

export type EntityInferPrimaryKey<TEntity extends Entity<any> | IEntity<any>> = TEntity extends Entity<infer PrimaryKey> | IEntity<infer PrimaryKey> ? PrimaryKey : never;

export abstract class Entity<PrimaryKey extends EntityKey = EntityKey> implements IEntity<PrimaryKey> {
  static isExtends<T extends Entity<any>>(this: ConstructorType<T, typeof Entity>, instance: any): instance is T {
    return !!instance && instance instanceof this;
  }

  static isEquals<TEntity extends Entity>(first: TEntity, second: TEntity) {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;

    if (!this.isExtends(first) || !this.isExtends(second)) return false;
    if (!this.isEqualsTypes(first, second)) return false;

    if (first === second) return true;
    return EntityKey.isEquals(first.primaryKey, second.primaryKey);
  }

  static getType<T extends Entity<any>>(this: ConstructorType<T, typeof Entity>): ConstructorType<T, typeof Entity> {
    return this as EntityConstructor<T>;
  }

  static getTypeOfInstance<T extends Entity>(instance: T): EntityConstructor<T> {
    return <EntityConstructor<T>>instance?.constructor;
  }

  static isEqualsTypes<TEntity extends Entity>(first: TEntity, second: TEntity): boolean {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;
    if (!this.isExtends(first) || !this.isExtends(second)) return false;

    return this.getTypeOfInstance(first) === this.getTypeOfInstance(second);
  }

  abstract get primaryKey(): PrimaryKey;

  hasPrimaryKey(): boolean {
    return this.primaryKey.hasKey();
  }

  isEquals(value: any): boolean {
    const staticClass = <typeof Entity>this.constructor;
    return staticClass.isEquals(this, value);
  }

  [inspect.custom]() {
    return `${this.constructor.name} { ${inspect(this.primaryKey, { showHidden: false, colors: true, compact: true, depth: 0 })} }`;
  }
}

// export interface EntityConstructor<TEntity extends Entity> extends Function {
//   new (...args: any[]): TEntity;
// }

export type EntityConstructor<TEntity extends Entity> = ConstructorType<TEntity, typeof Entity>;
