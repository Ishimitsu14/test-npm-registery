export type Pagination<Props extends Record<string, any> = {}> = Props & {
  skip?: number;
  limit?: number;
};
