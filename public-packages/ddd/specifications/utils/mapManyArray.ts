import LINQ from '@berish/linq';

export function mapManyArray<T>(specs: (T | T[])[]) {
  return LINQ.from(specs)
    .selectMany((items) => (Array.isArray(items) ? items : [items]))
    .toArray();
}
