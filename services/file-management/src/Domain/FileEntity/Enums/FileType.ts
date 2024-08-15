import { Enumeration } from '@ddd/domain';
import { FileManagementSchema } from '@schema/file-management';

export class FileType extends Enumeration<FileManagementSchema.FileType> {
  static IMAGE = new FileType('IMAGE');
}
