export type Schema<T> = {
  [key: string]: Schema<T> | T;
};
