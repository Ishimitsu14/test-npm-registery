export interface IConfigurator<Schema extends Record<string, any>> {
  raw<Key extends keyof Schema & string>(key: Key): string | undefined;
  get<Key extends keyof Schema & string>(key: Key): (Schema[Key] extends string ? Schema[Key] : string) | undefined;
  get<Key extends keyof Schema & string>(key: Key, parser: (value: string) => Schema[Key]): Schema[Key] | undefined;
  defaults<T>(value: T | null | undefined, defaultValueFactory: () => T): T;
  use<T, K>(value: T | null | undefined, useCallback: (value: T) => K): K | undefined;
  has<Key extends keyof Schema & string>(key: Key): boolean;
}
