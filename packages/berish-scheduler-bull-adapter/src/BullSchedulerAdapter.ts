import { ISchedulerAdapter, SchedulerAdapterWorker, SchedulerRegisterGroupParams } from '@packages/berish-scheduler';
import { Queue, QueueEventsOptions, QueueOptions, Worker, WorkerOptions } from 'bullmq';

export interface BullSchedulerAdapterOptions extends Omit<QueueOptions, keyof Pick<QueueOptions, 'settings'>>, WorkerOptions, QueueEventsOptions {}

export class BullSchedulerAdapter implements ISchedulerAdapter {
  private readonly baseConnectionOptions: BullSchedulerAdapterOptions;
  private readonly schedulerNameToWorkerMap: Map<string, Worker> = new Map();
  private readonly schedulerNameToQueueMap: Map<string, Queue> = new Map();

  constructor(options: BullSchedulerAdapterOptions) {
    this.baseConnectionOptions = options;
  }

  connect(): Promise<void> {
    return void 0;
  }

  async close(): Promise<void> {
    const workers = [...this.schedulerNameToWorkerMap.values()].slice();
    const queues = [...this.schedulerNameToQueueMap.values()].slice();

    await Promise.all(workers.map((worker) => worker.close()));
    await Promise.all(queues.map((queue) => queue.close()));
  }

  async registerWorker(schedulerName: string, callback: SchedulerAdapterWorker): Promise<void> {
    if (this.schedulerNameToWorkerMap.has(schedulerName)) this.schedulerNameToWorkerMap.delete(schedulerName);

    const worker = new Worker(
      schedulerName,
      async (job) => {
        await callback(job.data);
      },
      { ...this.baseConnectionOptions },
    );

    this.schedulerNameToWorkerMap.set(schedulerName, worker);
  }

  async unregisterWorker(schedulerName: string): Promise<void> {
    const worker = this.schedulerNameToWorkerMap.get(schedulerName);
    if (worker) {
      this.schedulerNameToWorkerMap.delete(schedulerName);
      await worker.close();
    }
  }

  async registerScheduler<Data>(schedulerName: string, options: SchedulerRegisterGroupParams<Data>[]): Promise<void> {
    if (this.schedulerNameToQueueMap.has(schedulerName)) this.schedulerNameToQueueMap.delete(schedulerName);

    const queue = new Queue(schedulerName, { ...this.baseConnectionOptions });
    this.schedulerNameToQueueMap.set(schedulerName, queue);

    // Добавить единожды, по ключу
    await Promise.all(
      options.map(async (option) => {
        const taskKey = option.key;

        await queue.add(taskKey, option.data ?? null, { jobId: taskKey, repeat: { jobId: taskKey, key: taskKey, every: option.every, pattern: option.cron } });
      }),
    );
  }

  async unregisterScheduler(schedulerName: string): Promise<void> {
    const queue = new Queue(schedulerName, { ...this.baseConnectionOptions });
    const repeatableJobs = await queue.getRepeatableJobs();

    await Promise.all(repeatableJobs.map((job) => queue.removeRepeatableByKey(job.key)));
  }

  // async registerRepeat<Data>(namespace: string, taskGroupId: string, options: SchedulerRegisterGroupParams<Data>[], callback: (data: Data) => Promise<void>): Promise<void> {
  //   const queueName = this.getGlobalQueueName(namespace, taskGroupId);
  //   const queue = this.registerQueue(queueName);

  //   const nextRepeatableJobs = options.map((option) => {
  //     // Версия текущей задачи
  //     const jobId = SHA256(JSON.stringify(option)).toString();
  //     // return { repeatJobName: option.taskId, jobId, every: option.every, cron: option.cron, data: option.data || {} };
  //     return null;
  //   });
  //   const prevRepeatableJobs = await queue.getRepeatableJobs();
  //   console.log(prevRepeatableJobs);

  //   // Список ключей повторяющихся задач, которые уже не актуальны, либо изменены
  //   const removeKeys: string[] = [];
  //   for (const prevJob of prevRepeatableJobs) {
  //     const nextJobFind = nextRepeatableJobs.find((nextJob) => nextJob.repeatJobName === prevJob.name && nextJob.jobId === prevJob.id);
  //     if (!nextJobFind) {
  //       removeKeys.push(prevJob.key);
  //     }
  //   }

  //   const addJobs: typeof nextRepeatableJobs = [];
  //   for (const newJob of nextRepeatableJobs) {
  //     const prevJobFind = prevRepeatableJobs.find((prevJob) => prevJob.name === newJob.repeatJobName && prevJob.id === newJob.jobId);
  //     if (!prevJobFind) addJobs.push(newJob);
  //   }

  //   if (removeKeys.length >= 0) {
  //     // await queue.drain(true);
  //     await Promise.all(removeKeys.map((key) => queue.removeRepeatableByKey(key)));
  //   }

  //   this.registerWorker2(queueName, async (job) => {
  //     try {
  //       await callback(<Data>(job.data || {}));
  //     } catch (err) {
  //       console.error(`[${queueName}.${job.name}] Scheduler repeat handler is catched.`, err);
  //       throw err;
  //     }
  //   });

  //   await Promise.all(
  //     addJobs.map((nextJob) =>
  //       queue.add(nextJob.repeatJobName, nextJob.data, { repeat: { every: nextJob.every, pattern: nextJob.cron }, removeOnComplete: 100, removeOnFail: 1000, jobId: nextJob.jobId }),
  //     ),
  //   );
  // }
}
