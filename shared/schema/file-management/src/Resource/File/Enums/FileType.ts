export const FileType = ['IMAGE'] as const;
export type FileType = (typeof FileType)[number];
