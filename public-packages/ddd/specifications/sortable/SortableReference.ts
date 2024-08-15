import { Entity } from '../../domain';
import { Sortable } from './Sortable';
import { SortableValue } from './SortableValue';

export abstract class SortableReference<TEntity, TReference extends Entity<any>> extends Sortable<TEntity> {
  private _refs: Sortable<TReference>[] = [];
  private _sort: (item: TEntity) => TReference;

  constructor(reference: Sortable<TReference> | Sortable<TReference>[]) {
    super(SortableValue.ASC);

    this._refs = Array.isArray(reference) ? reference : [reference];
  }

  protected abstract initialize(): void;

  override sort(items: TEntity[], refs?: TReference[]): TEntity[] {
    // if (!refs) {
    //   this.lockLocalSort();
    // }
    return items;
  }

  //   addReference(callback: item);
}
