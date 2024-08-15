import { CoreSchema } from '@schema/core';

import { File, FileKey, FileStatus } from '../../Resource';

export namespace FileList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: FileKey['id'][];
    status?: FileStatus[];
  }>;

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithPagination & { asAttachment?: boolean };
  export type Result = CoreSchema.WithPaginationResult<File>;
}
