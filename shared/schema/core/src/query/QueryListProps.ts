import { Pagination } from '../pagination';

export type QueryListProps<TFilter extends Record<string, any>, TProps extends Record<string, any> = {}> = {
  page?: Pagination;
  filter?: TFilter;
} & TProps;
