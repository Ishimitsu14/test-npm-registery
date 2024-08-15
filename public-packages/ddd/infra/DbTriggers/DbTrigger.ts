export type DbTriggerAction<Args extends any[]> = (...args: Args) => Promise<void>;

export interface DbTrigger<Args extends any[] = []> {
  readonly size: number;

  getActions: () => readonly DbTriggerAction<Args>[];
  getActionsMap: () => readonly [string, DbTriggerAction<Args>][];

  addAction: (callback: DbTriggerAction<Args>) => string;
  onceAction: (callback: DbTriggerAction<Args>) => string;
  removeAction: (callback: DbTriggerAction<Args> | string) => void;

  cleanActions: () => void;
  executeActions: (...args: Args) => Promise<number>;
}

export type DbTriggerInferArgs<T> = T extends DbTrigger<infer Args> ? Args : never;
