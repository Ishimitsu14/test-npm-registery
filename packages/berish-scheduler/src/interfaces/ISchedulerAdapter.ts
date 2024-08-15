import { SchedulerRegisterGroupParams } from './SchedulerRegisterTaskInGroupParams';

export interface ISchedulerAdapter {
  connect(): Promise<void>;
  close(): Promise<void>;

  registerWorker(schedulerName: string, callback: (data: any) => Promise<void>): Promise<void>;
  registerScheduler<Data>(schedulerName: string, options: SchedulerRegisterGroupParams<Data>[]): Promise<void>;

  unregisterWorker(schedulerName: string): Promise<void>;
  unregisterScheduler(schedulerName: string): Promise<void>;
}
