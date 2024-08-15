import { DbContextTriggers } from '../DbContext/DbContextTriggers';
import { DbTriggerInferArgs } from '../DbTriggers';

export interface IDbContextHook {
  onEnabledHook?(): Promise<void>;
  onDisabledHook?(): Promise<void>;

  onBefore?(...args: DbTriggerInferArgs<DbContextTriggers['onBefore']>): Promise<void>;
  onSuccess?(...args: DbTriggerInferArgs<DbContextTriggers['onSuccess']>): Promise<void>;
  onFail?(...args: DbTriggerInferArgs<DbContextTriggers['onFail']>): Promise<void>;
  onThrow?(...args: DbTriggerInferArgs<DbContextTriggers['onThrow']>): Promise<void>;
}
