import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { Asset } from '../Asset';

export interface IAssetRepository extends IRepository<Asset>, IQueryRepository<Asset> {}
