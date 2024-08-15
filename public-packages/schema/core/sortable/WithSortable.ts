import { SortableValue } from './SortableValue';

export type WithSortable<TSort extends Record<string, SortableValue | WithSortable<any>>> = { sort?: TSort };
