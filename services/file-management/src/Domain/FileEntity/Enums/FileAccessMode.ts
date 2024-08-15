import { Enumeration } from '@ddd/domain';
import { FileManagementSchema } from '@schema/file-management';

export class FileAccessMode extends Enumeration<FileManagementSchema.FileAccessMode> {
  static PUBLIC = new FileAccessMode('PUBLIC');
}
