import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { FileIsAlreadyUploadedError } from '@schema/common';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { FileAccessMode, FileEntity, FileEntityPK, S3File } from '../../../Domain';
import { FILE_ENTITY_REPOSITORY, S3_FILE_STORE, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { FILE_HELPER_INJECT_TOKEN } from '../../InjectTokens/DomainResolvers';

export type FileUploadProps = {
  id: string;
  signature: string;
  prefix?: string;

  // File
  buffer: Buffer;
  originalname: string;
  size: number;
  mimetype: string;
};
export type FileUploadResult = FileEntity;

export class FileUpload implements UseCase<FileUploadProps, FileUploadResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(FILE_ENTITY_REPOSITORY)
  private fileEntityRepository: InjectContext<FILE_ENTITY_REPOSITORY>;

  @Inject(S3_FILE_STORE)
  private s3FileStore: S3_FILE_STORE;

  @Inject(FILE_HELPER_INJECT_TOKEN)
  private fileHelper: FILE_HELPER_INJECT_TOKEN;

  async validate(payload: FileUploadProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
      prefix: [isStringWithValueSchema],
      signature: [isRequiredSchema, isStringWithValueSchema],
      buffer: [],
      originalname: [isRequiredSchema, isStringWithValueSchema],
      size: [],
      mimetype: [],
    });
  }

  async execute(payload: FileUploadProps): Promise<FileUploadResult> {
    const uow = await this.uow();
    const fileEntityRepository = await this.fileEntityRepository();

    const fileEntityPK = FileEntityPK.create(payload.id);
    const fileEntityExists = await fileEntityRepository.get(fileEntityPK);
    if (NullableObject.hasValue(fileEntityExists)) throw new FileIsAlreadyUploadedError(fileEntityPK.id);

    const extension = this.fileHelper.getExtensionFromFileName(payload.originalname);
    const s3FilePK = await this.fileHelper.generateS3FilePK(NullableObject(payload.prefix), extension);

    const fileType = this.fileHelper.getFileTypeFromMimeType(payload.mimetype);
    const fileEntity = FileEntity.createTemp(fileEntityPK, s3FilePK, fileType, payload.mimetype, FileAccessMode.PUBLIC, payload.originalname, payload.size);
    fileEntityRepository.add(fileEntity);
    await uow.commit();

    try {
      const s3File = S3File.createFromBuffer(s3FilePK, payload.buffer);
      await this.s3FileStore.add(s3File);

      fileEntity.setUploaded();
      fileEntityRepository.update(fileEntity);
    } catch (err) {
      fileEntityRepository.removeByPK(fileEntityPK);
      await uow.commit().catch(() => null);

      throw err;
    }

    await uow.commit();

    return fileEntity;
  }
}
