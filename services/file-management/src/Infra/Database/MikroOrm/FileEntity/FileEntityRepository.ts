import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { FileEntity, FileEntityPK, IFileEntityRepository } from '../../../../Domain';
import { FileEntitySnapshot } from './Snapshots';

export class FileEntityRepository extends MikroOrmRepository<FileEntity, FileEntitySnapshot> implements IFileEntityRepository {
  readonly EntityType = FileEntity;
  readonly SnapshotType = FileEntitySnapshot;

  generateNextPK(): FileEntityPK {
    return FileEntityPK.create(`${v4()}${v4()}`);
  }
}
