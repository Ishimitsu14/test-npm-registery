import { WithPaginationResult } from '../pagination';

export type QueryListResult<T, IncludeResult> = WithPaginationResult<T> & { include: IncludeResult[] };
