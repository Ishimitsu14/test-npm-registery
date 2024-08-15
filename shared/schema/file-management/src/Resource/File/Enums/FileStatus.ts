export const FileStatus = ['TEMP', 'UPLOADED'] as const;
export type FileStatus = (typeof FileStatus)[number];
