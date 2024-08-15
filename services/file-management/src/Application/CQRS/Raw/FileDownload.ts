import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { FileNotFoundError } from '@schema/common';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { FileEntity, FileEntityPK, FileStatus } from '../../../Domain';
import { FILE_ENTITY_REPOSITORY, S3_FILE_STORE } from '../../InjectTokens';

export type FileDownloadProps = {
  id: string;
  signature: string;
};
export type FileDownloadResult = {
  file: FileEntity;

  getBuffer: () => Promise<Buffer>;
};

export class FileDownload implements UseCase<FileDownloadProps, FileDownloadResult> {
  @InjectContext(FILE_ENTITY_REPOSITORY)
  private fileEntityRepository: InjectContext<FILE_ENTITY_REPOSITORY>;

  @Inject(S3_FILE_STORE)
  private s3FileStore: S3_FILE_STORE;

  async validate(payload: FileDownloadProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
      signature: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: FileDownloadProps): Promise<FileDownloadResult> {
    const fileEntityRepository = await this.fileEntityRepository();

    const filePK = FileEntityPK.create(payload.id);
    const fileEntity = await fileEntityRepository.get(filePK);
    if (NullableObject.isEmpty(fileEntity)) throw new FileNotFoundError(filePK.id);

    if (fileEntity.status.isEquals(FileStatus.TEMP)) throw new FileNotFoundError(filePK.id);

    const s3File = await this.s3FileStore.get(fileEntity.s3FilePK);
    if (NullableObject.isEmpty(s3File)) throw new FileNotFoundError(filePK.id);

    const getBuffer = () => s3File.getContentAsBuffer();

    return {
      file: fileEntity,
      getBuffer,
    };
  }
}
