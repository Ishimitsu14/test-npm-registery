import { inspect } from 'util';

import { ConstructorType, Equatable } from '../../core';
import { ListCollection, ReadonlyListCollection } from './ListCollection';

export interface ReadonlyListUpdatesCollection<Item> extends ReadonlyListCollection<Item>, Equatable<ReadonlyListUpdatesCollection<Item>> {
  readonly initial: Item[];
  readonly added: Item[];
  readonly removed: Item[];

  isAdded(item: Item): boolean;
  isRemoved(item: Item): boolean;
}

export class ListUpdatesCollection<Item> extends ListCollection<Item> implements ReadonlyListUpdatesCollection<Item> {
  static isExtends<T extends ListUpdatesCollection<any>>(this: ConstructorType<T, typeof ListUpdatesCollection>, instance: any): instance is T;
  static isExtends<T extends ListCollection<any>>(this: ConstructorType<T, typeof ListCollection>, instance: any): instance is T;
  static isExtends<T extends ListUpdatesCollection<any>>(this: ConstructorType<T, typeof ListUpdatesCollection>, instance: any): instance is T {
    return !!instance && instance instanceof <any>this;
  }

  private _initialItems: Item[];
  private _addedItems: Item[];
  private _removedItems: Item[];

  constructor(values?: Item[] | ReadonlyListCollection<Item>) {
    super(values);

    this._initialItems = this._currentItems.slice();
    this._addedItems = [];
    this._removedItems = [];
  }

  get initial(): Item[] {
    return this._initialItems.slice();
  }

  get added(): Item[] {
    return this._addedItems.slice();
  }

  get removed(): Item[] {
    return this._removedItems.slice();
  }

  override add(item: Item): void {
    if (this.isRemoved(item)) {
      this._removeFromRemovedItems(item);
    }
    if (!this.isAdded(item) && !this._isExistsInInitialItems(item)) {
      this._addedItems.push(item);
    }
    if (!this.isExists(item)) {
      super.add(item);
    }
  }

  override remove(item: Item): void {
    super.remove(item);

    if (this.isAdded(item)) {
      this._removeFromAddedItems(item);
    } else if (!this.isRemoved(item)) {
      this._removedItems.push(item);
    }
  }

  override clear(removeOnlyAdded?: boolean): Item[] {
    const items = removeOnlyAdded ? this._addedItems.slice() : this.items.slice();
    items.forEach((item) => this.remove(item));
    return items;
  }

  isAdded(item: Item): boolean {
    return this._addedItems.findIndex((v: Item) => this.compareItems(item, v)) !== -1;
  }

  isRemoved(item: Item): boolean {
    return this._removedItems.findIndex((v: Item) => this.compareItems(item, v)) !== -1;
  }

  // WRITE

  override asReadonly(): ReadonlyListUpdatesCollection<Item> {
    return this;
  }

  private _isExistsInInitialItems(item: Item): boolean {
    return this._initialItems.filter((v: Item) => this.compareItems(item, v)).length !== 0;
  }

  private _removeFromAddedItems(item: Item): void {
    this._addedItems = this._addedItems.filter((v) => !this.compareItems(v, item));
  }

  private _removeFromRemovedItems(item: Item): void {
    this._removedItems = this._removedItems.filter((v) => !this.compareItems(item, v));
  }

  [inspect.custom]() {
    return `${this.constructor.name} [CURRENT: ${this.items.length}. ADD: ${this.added.length}. REMOVE: ${this.removed.length}]`;
  }
}
