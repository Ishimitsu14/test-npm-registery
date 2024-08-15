import { ISchedulerAdapter, SchedulerAdapterWorker, SchedulerRegisterGroupParams } from '@packages/berish-scheduler';
import cron from 'node-cron';

interface CronSchedulerTask {
  schedulerName: string;
  taskKey: string;
  status: 'INITIALIZED' | 'PROCESS' | 'COMPLETED' | 'FAILED';
  unregister: () => void;
}

export class CronSchedulerAdapter implements ISchedulerAdapter {
  private readonly schdulerNameToWorkerMap: Map<string, SchedulerAdapterWorker> = new Map();
  private readonly tasks: CronSchedulerTask[] = [];

  constructor() {}

  connect(): Promise<void> {
    return void 0;
  }

  async close(): Promise<void> {
    const tasks = this.tasks.slice();

    for (const task of tasks) {
      task.unregister();
    }
  }

  async registerWorker(scheduleName: string, callback: SchedulerAdapterWorker): Promise<void> {
    this.schdulerNameToWorkerMap.set(scheduleName, callback);
  }

  async unregisterWorker(schedulerName: string): Promise<void> {
    this.schdulerNameToWorkerMap.delete(schedulerName);
  }

  async registerScheduler<Data>(schedulerName: string, options: SchedulerRegisterGroupParams<Data>[]): Promise<void> {
    for (const option of options) {
      const taskKey = `${schedulerName}.${option.key}`;
      const worker = this.getWorker(schedulerName, taskKey);

      let unregister: () => void = null;

      if (option.every) {
        const timer = setInterval(() => worker(option.data), option.every);
        unregister = () => clearInterval(timer);
      }

      if (option.cron) {
        const cronTask = cron.schedule(option.cron, () => worker(option.data));
        unregister = () => cronTask.stop();
      }

      if (unregister) {
        this.tasks.push({ taskKey, schedulerName, status: 'INITIALIZED', unregister });
      }
    }
  }

  async unregisterScheduler(schedulerName: string): Promise<void> {
    const schedulerTasks = this.tasks.filter((m) => m.schedulerName === schedulerName);

    for (const task of schedulerTasks) {
      this.tasks.splice(
        this.tasks.findIndex((m) => m === task),
        1,
      );

      task.unregister();
    }
  }

  getWorker(schedulerName: string, taskKey: string): SchedulerAdapterWorker {
    return async (data) => {
      const task = this.tasks.find((m) => m.taskKey === taskKey);
      if (!task) return void 0;

      if (task.status === 'PROCESS') return void 0;

      try {
        task.status = 'PROCESS';

        if (this.schdulerNameToWorkerMap.has(schedulerName)) {
          const worker = this.schdulerNameToWorkerMap.get(schedulerName);
          await worker(data);
        }

        task.status = 'COMPLETED';
      } catch (err) {
        task.status = 'FAILED';
        throw err;
      }
    };
  }
}
