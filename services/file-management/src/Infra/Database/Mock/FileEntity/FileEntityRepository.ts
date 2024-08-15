import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { FileEntity, FileEntityPK, IFileEntityRepository } from '../../../../Domain';

export class FileEntityRepository extends MockRepository<FileEntity> implements IFileEntityRepository {
  readonly EntityType = FileEntity;

  generateNextPK(): FileEntityPK {
    return FileEntityPK.create(`${v4()}${v4()}`);
  }
}
