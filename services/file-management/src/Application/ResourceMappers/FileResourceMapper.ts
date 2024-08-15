import { FileManagementSchema } from '@schema/file-management';

import { FileEntity, FileEntityPK } from '../../Domain';

export class FileResourceMapper {
  toFileKey(pk: FileEntityPK): Required<FileManagementSchema.FileKey> {
    return {
      resource: 'file_key',
      id: pk.id,
    };
  }

  toFile(value: FileEntity, url: string): Required<FileManagementSchema.File> {
    return {
      resource: 'file',
      id: value.primaryKey.id,

      createdAt: +value.createdAt,
      status: value.status.id,
      type: value.type.id,
      mimeType: value.mimeType,
      mode: value.mode.id,
      originalName: value.originalName,
      size: value.size,
      url,
    };
  }

  toFileUploader(filePK: FileEntityPK, uploadURL: string): Required<FileManagementSchema.FileUploader> {
    return {
      resource: 'file_uploader',
      id: filePK.id,
      uploadURL,
    };
  }
}
