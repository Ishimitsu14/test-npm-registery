import { Enumeration } from '../../domain';

export const SortableValueScalar = ['ASC', 'ASC_NULLS_LAST', 'ASC_NULLS_FIRST', 'DESC', 'DESC_NULLS_LAST', 'DESC_NULLS_FIRST'] as const;
export type SortableValueScalar = (typeof SortableValueScalar)[number];

export class SortableValue extends Enumeration<SortableValueScalar> {
  static ASC = new SortableValue('ASC');
  static ASC_NULLS_FIRST = new SortableValue('ASC_NULLS_FIRST');
  static ASC_NULLS_LAST = new SortableValue('ASC_NULLS_LAST');
  static DESC = new SortableValue('DESC');
  static DESC_NULLS_FIRST = new SortableValue('DESC_NULLS_FIRST');
  static DESC_NULLS_LAST = new SortableValue('DESC_NULLS_LAST');
}
