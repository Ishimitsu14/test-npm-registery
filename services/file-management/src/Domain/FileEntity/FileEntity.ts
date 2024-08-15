import { AggregateRoot } from '@ddd/domain';

import { S3FilePK } from '../S3File';
import { FileAccessMode, FileStatus, FileType } from './Enums';
import { FileEntityPK } from './FileEntityPK';

export class FileEntity extends AggregateRoot<FileEntityPK> {
  static createTemp(pk: FileEntityPK, s3FilePK: S3FilePK, type: FileType, mimeType: string, mode: FileAccessMode, originalName: string, size: number) {
    return new FileEntity(pk, new Date(), s3FilePK, FileStatus.TEMP, type, mimeType, mode, originalName, size);
  }

  static fromSnapshot(pk: FileEntityPK, createdAt: Date, s3FilePK: S3FilePK, status: FileStatus, type: FileType, mimeType: string, mode: FileAccessMode, originalName: string, size: number) {
    return new FileEntity(pk, createdAt, s3FilePK, status, type, mimeType, mode, originalName, size);
  }

  readonly primaryKey: FileEntityPK;
  readonly createdAt: Date;

  private _s3FilePK: S3FilePK;

  private _status: FileStatus;
  private _type: FileType;
  private _mimeType: string;
  private _mode: FileAccessMode;
  private _originalName: string;
  private _size: number;

  constructor(pk: FileEntityPK, createdAt: Date, s3FilePK: S3FilePK, status: FileStatus, type: FileType, mimeType: string, mode: FileAccessMode, originalName: string, size: number) {
    super();

    this.primaryKey = pk;
    this.createdAt = createdAt;

    this._s3FilePK = s3FilePK;

    this._status = status;
    this._type = type;
    this._mimeType = mimeType;
    this._mode = mode;
    this._originalName = originalName;
    this._size = size;
  }

  get s3FilePK() {
    return this._s3FilePK;
  }

  get mode() {
    return this._mode;
  }

  get status() {
    return this._status;
  }

  get type() {
    return this._type;
  }

  get mimeType() {
    return this._mimeType;
  }

  get originalName() {
    return this._originalName;
  }

  get size() {
    return this._size;
  }

  setUploaded() {
    if (this._status.isEquals(FileStatus.UPLOADED)) return;
    this._status = FileStatus.UPLOADED;
  }
}
