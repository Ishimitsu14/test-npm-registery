import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { FileManagementSchema } from '@schema/file-management';
import { isStringWithValueSchema, validateRoot } from '@shared/validation';

import { FileURLResolver } from '../../Helpers';
import { FILE_ENTITY_REPOSITORY } from '../../InjectTokens';
import { FileResourceMapper } from '../../ResourceMappers';

export type FileGetUploadURLProps = FileManagementSchema.RPC.DTO.FileGetUploadURL.Payload;
export type FileGetUploadURLResult = FileManagementSchema.RPC.DTO.FileGetUploadURL.Result;

export class FileGetUploadURL implements UseCase<FileGetUploadURLProps, FileGetUploadURLResult> {
  @InjectContext(FILE_ENTITY_REPOSITORY)
  private fileEntityRepository: InjectContext<FILE_ENTITY_REPOSITORY>;

  @Inject(FileURLResolver)
  private fileURLResolver: FileURLResolver;

  @Inject(FileResourceMapper)
  private fileResourceMapper: FileResourceMapper;

  async validate(payload: FileGetUploadURLProps): Promise<void> {
    validateRoot(payload, {
      prefix: [isStringWithValueSchema],
    });
  }

  async execute(payload: FileGetUploadURLProps): Promise<FileGetUploadURLResult> {
    const fileEntityRepository = await this.fileEntityRepository();

    const filePK = fileEntityRepository.generateNextPK();
    const uploadUrl = this.fileURLResolver.getUploadURL(filePK, NullableObject(payload.prefix));

    return this.fileResourceMapper.toFileUploader(filePK, uploadUrl);
  }
}
