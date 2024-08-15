import { Enumeration } from '@ddd/domain';
import { FileManagementSchema } from '@schema/file-management';

export class FileStatus extends Enumeration<FileManagementSchema.FileStatus> {
  static TEMP = new FileStatus('TEMP');
  static UPLOADED = new FileStatus('UPLOADED');
}
