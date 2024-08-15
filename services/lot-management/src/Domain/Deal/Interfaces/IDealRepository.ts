import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { Deal } from '../Deal';

export interface IDealRepository extends IRepository<Deal>, IQueryRepository<Deal> {}
