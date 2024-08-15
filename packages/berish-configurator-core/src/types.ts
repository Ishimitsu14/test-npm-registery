export type ConfigParser<T> = (value: string) => T | null | undefined;
export type ConfigParserResult<T> = T extends ConfigParser<infer Result> ? Result : T;
