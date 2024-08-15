import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { FileEntity } from '../FileEntity';
import { FileEntityPK } from '../FileEntityPK';

export interface IFileEntityRepository extends IRepository<FileEntity>, IQueryRepository<FileEntity> {
  generateNextPK(): FileEntityPK;
}
