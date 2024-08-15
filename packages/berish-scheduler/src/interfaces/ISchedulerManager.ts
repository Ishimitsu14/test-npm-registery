import { ISchedulerAdapter } from './ISchedulerAdapter';

export interface ISchedulerManager {
  readonly namespace: string;
  readonly adapter: ISchedulerAdapter;

  connect(): Promise<void>;
  close(): Promise<void>;

  // registerSchedulerWorker(schedulerName: string, ...workers: SchedulerWorker[]): Promise<void>;

  // /** На один поток - 1 задача */
  // registerTask<Data>(taskId: string, options: SchedulerRegisterTaskParams<Data>, callback: SchedulerHandler): Promise<void>;

  // /** На один поток - несколько самостоятельных задач */
  // registerTaskGroup<Data>(taskGroupId: string, options: SchedulerRegisterTaskInGroupParams<Data>[], callback: SchedulerHandler): Promise<void>;
}
