import { inspect } from 'util';

import { Equatable } from '../Equatable';
import { Nullable, NullableObject } from '../NullableObject';
import { ConstructorType } from '../This';

export interface ReadonlyListCollection<Item> extends Equatable<ReadonlyListCollection<Item>> {
  readonly items: Item[];
  readonly size: number;

  forEach(callbackfn: (value: Item, index: number, set: ReadonlyListCollection<Item>) => void, thisArg?: any): void;
  isExists(value: Item): boolean;
  index(value: Item): number;
  findCallback(callback: (value: Item, index: number, collection: ReadonlyListCollection<Item>) => boolean): Nullable<Item>;
  findIndexCallback(callback: (value: Item, index: number, collection: ReadonlyListCollection<Item>) => boolean): number;

  compareItems(first: Item, second: Item): boolean;
}

export class ListCollection<Item> implements ReadonlyListCollection<Item> {
  static isExtends<T extends ListCollection<any>>(this: ConstructorType<T, typeof ListCollection>, instance: any): instance is T {
    return !!instance && instance instanceof <any>this;
  }

  constructor(values?: Item[] | ReadonlyListCollection<Item>) {
    this._currentItems = [];

    const items = NullableObject.isEmpty(values) ? [] : Array.isArray(values) ? values : values.items;
    for (const item of items) {
      this.add(item);
    }
  }

  protected _currentItems: Item[];

  get items(): Item[] {
    return this._currentItems.slice();
  }

  get size(): number {
    return this._currentItems.length;
  }

  forEach(callbackfn: (value: Item, index: number, set: ReadonlyListCollection<Item>) => void, thisArg?: any): void {
    return this._currentItems.forEach((value, index) => callbackfn(value, index, this), thisArg);
  }

  isExists(value: Item): boolean {
    return this.index(value) !== -1;
  }

  index(value: Item): number {
    return this._currentItems.findIndex((m) => this.compareItems(m, value));
  }

  // TODO: rename to find
  findCallback(callback: (value: Item, index: number, collection: ReadonlyListCollection<Item>) => boolean): Nullable<Item> {
    return NullableObject(this.items.find((item, index) => callback(item, index, this)));
  }

  // TODO: rename to findIndex
  findIndexCallback(callback: (value: Item, index: number, collection: ReadonlyListCollection<Item>) => boolean): number {
    return this.items.findIndex((item, index) => callback(item, index, this));
  }

  compareItems(first: Item, second: Item): boolean {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;

    if (first === second) return true;
    if (Equatable.isEquatable(first)) return Equatable.isEquatable(second) && first.isEquals(second);

    return this.compareItemsOverrided(first, second);
  }

  isEquals(value: any): boolean {
    const thisStatic = <typeof ListCollection>this.constructor;

    if (this === value) return true;

    if (NullableObject.isEmpty(value)) return false;
    if (!thisStatic.isExtends(value)) return false;
    if (thisStatic !== value.constructor) return false;
    if (this.size !== value.size) return false;

    return this.items.every((thisItem) => value.isExists(thisItem));
  }

  // WRITE

  asReadonly(): ReadonlyListCollection<Item> {
    return this;
  }

  clone() {
    return new ListCollection(this);
  }

  concat(collection?: ReadonlyListCollection<Item> | Item[]): ReturnType<(typeof this)['clone']> {
    const cloned = this.clone() as ReturnType<(typeof this)['clone']>;
    const items = NullableObject.isEmpty(collection) ? [] : Array.isArray(collection) ? collection : collection.items;
    for (const item of items) {
      cloned.add(item);
    }
    return cloned;
  }

  add(item: Item): void {
    if (!this.isExists(item)) {
      this._currentItems.push(item);
    }
  }

  remove(item: Item): void {
    const index = this.index(item);
    if (index !== -1) {
      this._currentItems.splice(index, 1);
    }
  }

  clear() {
    const prevItems = this._currentItems.slice();
    this._currentItems = [];
    return prevItems;
  }

  [inspect.custom]() {
    return `${this.constructor.name} [${this.items.length}]`;
  }

  /** Can be protected overrided (extends by Collection) */
  protected compareItemsOverrided(first: Item, second: Item): boolean {
    return Object.is(first, second);
  }
}
