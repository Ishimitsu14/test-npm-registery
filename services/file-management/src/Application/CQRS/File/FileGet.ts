import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { FileNotFoundError } from '@schema/common';
import { FileManagementSchema } from '@schema/file-management';
import { isBooleanSchema, isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { FileEntityPK } from '../../../Domain';
import { FileURLResolver } from '../../Helpers';
import { FILE_ENTITY_REPOSITORY } from '../../InjectTokens';
import { FileResourceMapper } from '../../ResourceMappers';

export type FileGetProps = FileManagementSchema.RPC.DTO.FileGet.Payload;
export type FileGetResult = FileManagementSchema.RPC.DTO.FileGet.Result;

export class FileGet implements UseCase<FileGetProps, FileGetResult> {
  @InjectContext(FILE_ENTITY_REPOSITORY)
  private fileEntityRepository: InjectContext<FILE_ENTITY_REPOSITORY>;

  @Inject(FileURLResolver)
  private fileURLResolver: FileURLResolver;

  @Inject(FileResourceMapper)
  private fileResourceMapper: FileResourceMapper;

  async validate(payload: FileGetProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
      asAttachment: [isBooleanSchema],
    });
  }

  async execute(payload: FileGetProps): Promise<FileGetResult> {
    const fileEntityRepository = await this.fileEntityRepository();

    const filePK = FileEntityPK.create(payload.id);
    const fileEntity = await fileEntityRepository.get(filePK);
    if (NullableObject.isEmpty(fileEntity)) throw new FileNotFoundError(filePK.id);

    const url = this.fileURLResolver.getDownloadURL(fileEntity.primaryKey, { attachment: NullableObject(payload.asAttachment) });
    return this.fileResourceMapper.toFile(fileEntity, url);
  }
}
