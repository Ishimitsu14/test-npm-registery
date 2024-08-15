import { FileManagementSchema } from '@schema/file-management';

export class FileManagementResourceMapper {
  toFileURL(file: FileManagementSchema.File): string {
    return file?.url;
  }
}
