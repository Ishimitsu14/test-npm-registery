import { CoreSchema } from '@schema/core';

export interface WithIncludeResult<TInclude extends CoreSchema.Include<any, any>> {
  items: CoreSchema.IncludeInferOwner<TInclude>[];
  links: CoreSchema.IncludeLink<TInclude>[];
}

export async function withInclude<TInclude extends CoreSchema.Include<any, any>>(
  include: boolean | TInclude,
  callback: (include: Partial<TInclude>, links: CoreSchema.IncludeLink<TInclude>[], items: CoreSchema.IncludeInferOwner<TInclude>[]) => Promise<void>,
): Promise<WithIncludeResult<TInclude>> {
  const items: CoreSchema.IncludeInferOwner<TInclude>[] = [];
  const links: CoreSchema.IncludeLink<TInclude>[] = [];

  if (include) {
    await callback(include === true ? {} : include, links, items);
  }

  return { items, links };
}

export async function includeLinks<T extends CoreSchema.Resource<any>, TInclude extends CoreSchema.Include<T, any>>(
  include: boolean | TInclude,
  callback: (include: Partial<TInclude>, links: CoreSchema.IncludeLink<TInclude>[]) => Promise<void>,
): Promise<CoreSchema.IncludeLink<TInclude>[]> {
  const links: CoreSchema.IncludeLink<TInclude>[] = [];

  if (typeof include === 'object') {
    await callback(include || {}, links);
  }

  return links;
}
