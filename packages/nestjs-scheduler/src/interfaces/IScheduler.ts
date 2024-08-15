export interface IScheduler {
  execute(): Promise<void>;
}
