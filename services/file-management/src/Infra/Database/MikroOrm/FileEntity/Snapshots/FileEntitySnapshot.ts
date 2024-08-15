import { createSnapshotFromDomain, ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core';

import { FileAccessMode, FileEntity, FileEntityPK, FileStatus, FileType } from '../../../../../Domain';
import { FileAccessModeSnapshot, FileStatusSnapshot, FileTypeSnapshot } from './Enums';
import { S3FilePKSnapshot } from './S3FilePKSnapshot';

@Entity({ tableName: 'file' })
export class FileEntitySnapshot extends BaseEntity implements ISnapshotEntity<FileEntity> {
  private constructor() {
    super();
  }

  @PrimaryKey({ fieldName: 'id', type: 'varchar' })
  id: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date;

  @Embedded({ entity: () => S3FilePKSnapshot })
  s3_file: S3FilePKSnapshot;

  @FileStatusSnapshot({ fieldName: 'status' })
  status: FileStatusSnapshot;

  @FileTypeSnapshot({ fieldName: 'type' })
  type: FileTypeSnapshot;

  @Property({ fieldName: 'mime_type', type: 'varchar' })
  mimeType: string;

  @FileAccessModeSnapshot({ fieldName: 'mode' })
  mode: FileAccessModeSnapshot;

  @Property({ fieldName: 'original_name', type: 'varchar' })
  originalName: string;

  @Property({ fieldName: 'size', type: 'int' })
  size: number;

  applyPK(primaryKey: FileEntityPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: FileEntity): void {
    this.id = domain.primaryKey.id;
    this.createdAt = domain.createdAt;
    this.s3_file = createSnapshotFromDomain(S3FilePKSnapshot, domain.s3FilePK);
    this.status = domain.status.id;
    this.type = domain.type.id;
    this.mimeType = domain.mimeType;
    this.mode = domain.mode.id;
    this.originalName = domain.originalName;
    this.size = domain.size;
  }

  toDomain(): FileEntity {
    const pk = FileEntityPK.fromSnapshot(this.id);
    const createdAt = this.createdAt;
    const s3File = this.s3_file.toDomain();
    const status = FileStatus.getById(this.status);
    const type = FileType.getById(this.type);
    const mimeType = this.mimeType;
    const mode = FileAccessMode.getById(this.mode);
    const originalName = this.originalName;
    const size = this.size;

    return FileEntity.fromSnapshot(pk, createdAt, s3File, status, type, mimeType, mode, originalName, size);
  }
}
