import { ConstructorType, ListCollection, NullableObject, ReadonlyListCollection } from '@ddd/core';
import { isEnumSchema, isStringWithValueSchema, Validator } from '@ddd/validation';
import { inspect } from 'util';

import { EnumerationID } from './EnumerationInferIdentificator';
import { IEnumeration } from './IEnumeration';

const ENUMERATION_WEAK_MAP_PROP = Symbol('ENUMERATION_WEAK_MAP_PROP');

export abstract class Enumeration<Identificator extends string> implements IEnumeration<Identificator> {
  private static [ENUMERATION_WEAK_MAP_PROP]: WeakMap<ConstructorType<any, typeof Enumeration>, Enumeration<any>[]> = new WeakMap();

  static getCollection<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>): ReadonlyListCollection<T> {
    const items = this.getAll();
    return new ListCollection(items);
  }

  static getAll<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>): T[] {
    const weakMap: WeakMap<ConstructorType<T, typeof Enumeration>, T[]> = this[ENUMERATION_WEAK_MAP_PROP];

    if (!weakMap.has(this)) weakMap.set(this, []);
    return weakMap.get(this);
  }

  static getAllIds<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>): EnumerationID<T>[] {
    return this.getAll().map((m) => m.id);
  }

  static getById<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>, id: EnumerationID<T>): T {
    const all = this.getAll();
    return all.find((m) => m.id === id);
  }

  static getByIds<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>, ids: EnumerationID<T>[]): T[] {
    ids = ids || [];

    const all = this.getAll();

    return all.filter((item) => ids.find((id) => item.id === id));
  }

  static get size(): number {
    return this.getAll().length;
  }

  static validator<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>): Validator<EnumerationID<T>> {
    const ids = this.getAllIds();
    return {
      type: `${this.name}(${ids.join(',')})`,
      validate: [isStringWithValueSchema, isEnumSchema(ids)],
    };
  }

  static {
    Object.defineProperty(this, 'length', { get: () => this.size });
  }

  static getType<T extends ConstructorType<Enumeration<any>, typeof Enumeration>>(this: T): T {
    return this;
  }

  static isExtends<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>, instance: any): instance is T {
    return !!instance && instance instanceof this;
  }

  static isEquals<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>, first: T, second: T): boolean {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;

    if (!this.isExtends(first) || !this.isExtends(second)) return false;
    if (!this.isEqualsTypes(first, second)) return false;

    // Одна и та же ссылка
    if (first === second) return true;

    return first.id === second.id;
  }

  static isEqualsTypes<T extends Enumeration<any>>(this: ConstructorType<T, typeof Enumeration>, first: T, second: T): boolean {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;
    if (!this.isExtends(first) || !this.isExtends(second)) return false;

    const firstStaticClass = <typeof Enumeration>first.constructor;
    const secondStaticClass = <typeof Enumeration>second.constructor;

    return firstStaticClass === secondStaticClass;
  }

  private readonly _id: Identificator;

  protected constructor(id: Identificator) {
    this._id = id;

    this._registerEnumItem();
  }

  get id() {
    return this._id;
  }

  isEquals(other: any): boolean {
    return this.getStaticType().isEquals(this, other);
  }

  protected getStaticType() {
    const staticType = <ConstructorType<this, typeof Enumeration>>this.constructor;
    return staticType.getType();
  }

  private _registerEnumItem() {
    const staticType = this.getStaticType();
    const weakMap: WeakMap<ConstructorType<this, typeof Enumeration>, this[]> = staticType[ENUMERATION_WEAK_MAP_PROP];
    const values = weakMap.get(staticType) ?? [];
    if (values.indexOf(this) === -1) {
      values.push(this);
      weakMap.set(staticType, values);
    }
  }

  [inspect.custom]() {
    return `${this.constructor.name} [${inspect(this.id, false, 0, true)}]`;
  }
}
