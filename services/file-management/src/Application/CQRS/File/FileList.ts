import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query, Specification, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { FileManagementSchema } from '@schema/file-management';
import { compositeFilter } from '@shared/common-internal';
import { isArraySchema, isBooleanSchema, isEnumSchema, isNumberSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import { FileEntity, FileEntityPK, FileStatus } from '../../../Domain';
import { FileURLResolver } from '../../Helpers';
import { FILE_ENTITY_REPOSITORY } from '../../InjectTokens';
import { CommonResourceMapper, FileResourceMapper } from '../../ResourceMappers';

export type FileListProps = FileManagementSchema.RPC.DTO.FileList.Payload;
export type FileListResult = FileManagementSchema.RPC.DTO.FileList.Result;

export class FileList implements UseCase<FileListProps, FileListResult> {
  @InjectContext(FILE_ENTITY_REPOSITORY)
  private fileEntityRepository: InjectContext<FILE_ENTITY_REPOSITORY>;

  @Inject(FileURLResolver)
  private fileURLResolver: FileURLResolver;

  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  @Inject(FileResourceMapper)
  private fileResourceMapper: FileResourceMapper;

  async validate(payload: FileListProps): Promise<void> {
    validateRoot(payload, {
      page: {
        skip: [isNumberSchema, minSchema(0)],
        limit: [isNumberSchema, minSchema(1), maxSchema(5000)],
      },
      filter: {
        AND: [],
        OR: [],
        NOT: [],

        id: [isArraySchema([isStringWithValueSchema], minSchema(1))],
        status: [isArraySchema(isEnumSchema(FileStatus.getAllIds()), minSchema(1))],
      },
      asAttachment: [isBooleanSchema],
    });
  }

  async execute(payload: FileListProps): Promise<FileListResult> {
    const fileEntityRepository = await this.fileEntityRepository();

    let query = Query.create(FileEntity);

    if (NullableObject.hasValue(payload.filter)) {
      query = query.addSpecification(this.filter(payload.filter));
    }

    if (NullableObject.hasValue(payload.page)) {
      query = query.addPageable(payload.page.skip, payload.page.limit);
    }

    const fileResult = await fileEntityRepository.find(query);

    return this.commonResourceMapper.toPagination(fileResult, (fileEntity) => {
      const url = this.fileURLResolver.getDownloadURL(fileEntity.primaryKey, { attachment: NullableObject(payload.asAttachment) });
      return this.fileResourceMapper.toFile(fileEntity, url);
    });
  }

  filter(filter: FileListProps['filter']): Specification<FileEntity> {
    return compositeFilter(filter, (filter, specs) => {
      if (NullableObject.hasValue(filter.id)) {
        specs.push(WhereInPKSpecification.create(filter.id.map((id) => FileEntityPK.create(id))));
      }
    });
  }
}
