import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { AssetFaq } from '../AssetFaq';
import { AssetFaqPK } from '../AssetFaqPK';

export interface IAssetFaqRepository extends IRepository<AssetFaq>, IQueryRepository<AssetFaq> {
  nextPK(): Promise<AssetFaqPK>;
}
