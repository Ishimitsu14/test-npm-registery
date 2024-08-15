export const FileAccessMode = ['PUBLIC'] as const;
export type FileAccessMode = (typeof FileAccessMode)[number];
