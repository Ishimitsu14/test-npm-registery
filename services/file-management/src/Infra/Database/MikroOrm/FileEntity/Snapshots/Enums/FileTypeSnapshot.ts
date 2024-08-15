import { EnumSnapshot } from '@shared/db';

import { FileType } from '../../../../../../Domain';

export type FileTypeSnapshot = EnumSnapshot<FileType>;
export const FileTypeSnapshot = EnumSnapshot(FileType);
