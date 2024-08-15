import { EnumSnapshot } from '@shared/db';

import { FileAccessMode } from '../../../../../../Domain';

export type FileAccessModeSnapshot = EnumSnapshot<FileAccessMode>;
export const FileAccessModeSnapshot = EnumSnapshot(FileAccessMode);
