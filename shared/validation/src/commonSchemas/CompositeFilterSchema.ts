import { isArraySchema, ObjectSchema, refSchema } from '@ddd/validation';
import { CoreSchema } from '@schema/core';

export function CompositeFilterSchema<TRawFilter extends Record<string, any>>(callback: () => ObjectSchema<TRawFilter>): ObjectSchema<CoreSchema.CompositeFilter<TRawFilter>> {
  const schema = {
    AND: [isArraySchema(refSchema(() => schema))],
    OR: [isArraySchema(refSchema(() => schema))],
    NOT: refSchema(() => schema),

    ...callback(),
  };

  return schema;
}
