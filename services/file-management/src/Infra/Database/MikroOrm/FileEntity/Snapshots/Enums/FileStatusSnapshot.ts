import { EnumSnapshot } from '@shared/db';

import { FileStatus } from '../../../../../../Domain';

export type FileStatusSnapshot = EnumSnapshot<FileStatus>;
export const FileStatusSnapshot = EnumSnapshot(FileStatus);
