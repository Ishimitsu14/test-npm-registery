import { isNumberSchema, maxSchema, minSchema, ObjectSchema } from '@ddd/validation';
import { CoreSchema } from '@schema/core';

export const PaginationPropsSchema: ObjectSchema<CoreSchema.Pagination> = {
  skip: [isNumberSchema, minSchema(0)],
  limit: [isNumberSchema, minSchema(1), maxSchema(5000)],
};
