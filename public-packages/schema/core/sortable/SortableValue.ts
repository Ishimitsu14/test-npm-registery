export const SortableValue = ['ASC', 'ASC_NULLS_LAST', 'ASC_NULLS_FIRST', 'DESC', 'DESC_NULLS_LAST', 'DESC_NULLS_FIRST'] as const;
export type SortableValue = (typeof SortableValue)[number];
