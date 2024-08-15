export type QueryResult<TInclude, TProps = {}> = {
  include: TInclude[];
} & TProps;
