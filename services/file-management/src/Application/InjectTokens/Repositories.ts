import { IFileEntityRepository, IS3FileStore } from '../../Domain';

export const FILE_ENTITY_REPOSITORY = Symbol('FILE_ENTITY_REPOSITORY');
export type FILE_ENTITY_REPOSITORY = IFileEntityRepository;

export const S3_FILE_STORE = Symbol('S3_FILE_STORE');
export type S3_FILE_STORE = IS3FileStore;
