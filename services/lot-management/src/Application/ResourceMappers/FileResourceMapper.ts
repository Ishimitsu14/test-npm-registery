import { FileManagementSchema } from '@schema/file-management';

import { FilePK } from '../../Domain';

export class FileResourceMapper {
  toFileKey(value: FilePK): Required<FileManagementSchema.FileKey> {
    return {
      resource: 'file_key',
      id: value.id,
    };
  }
}
