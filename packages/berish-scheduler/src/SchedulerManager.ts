import LINQ from '@berish/linq';

import { SchedulerDataContext, SchedulerNextContext } from './contexts';
import { ISchedulerAdapter, ISchedulerManager, SchedulerRegisterGroupParams, SchedulerRegisterParams } from './interfaces';
import { SchedulerAdapterWorker, SchedulerWorker } from './types';
import { emptyNext } from './utils';

export interface SchedulerManagerOptions {
  adapter: ISchedulerAdapter;
  namespace: string;

  middlewares?: SchedulerWorker[];
}

export class SchedulerManager implements ISchedulerManager {
  private readonly _adapter: ISchedulerAdapter;
  private readonly _namespace: string;
  private readonly _middlwares: SchedulerWorker[];

  private _connectPromise: Promise<void>;

  constructor(options: SchedulerManagerOptions) {
    this._adapter = options.adapter;
    this._namespace = options.namespace;
    this._middlwares = options.middlewares || [];
  }

  get namespace(): string {
    return this._namespace;
  }

  get adapter(): ISchedulerAdapter {
    return this._adapter;
  }

  connect() {
    if (!this._connectPromise) this._connectPromise = this._adapter.connect();
    return this._connectPromise;
  }

  async close() {
    if (!this._connectPromise) return void 0;
    await this._connectPromise;

    await this._adapter.close();
  }

  async registerWorker(schedulerName: string, ...workers: SchedulerWorker[]): Promise<void> {
    await this.connect();

    await this.unregisterWorker(schedulerName);

    if (workers.length <= 0) return void 0;

    const fullSchedulerName = this.getFullSchedulerName(schedulerName);
    const adapterWorker = this.wrapAdapterWorker(workers);
    return this.adapter.registerWorker(fullSchedulerName, adapterWorker);
  }

  async unregisterWorker(schedulerName: string): Promise<void> {
    await this.connect();

    const fullSchedulerName = this.getFullSchedulerName(schedulerName);
    await this.adapter.unregisterWorker(fullSchedulerName);
  }

  async registerScheduler<Data>(schedulerName: string, options: SchedulerRegisterParams<Data> | SchedulerRegisterGroupParams<Data>[], ...workers: SchedulerWorker[]): Promise<void> {
    await this.connect();

    // Unregister prev schedulers
    await this.unregisterScheduler(schedulerName);

    // Register workers
    if (workers.length > 0) await this.registerWorker(schedulerName, ...workers);

    const fullSchedulerName = this.getFullSchedulerName(schedulerName);
    const distinctOptions = Array.isArray(options)
      ? LINQ.from(options)
          .reverse()
          .distinct((m) => m.key)
          .reverse()
          .toArray()
      : [options && { ...options, key: schedulerName }].filter(Boolean);
    await this.adapter.registerScheduler(fullSchedulerName, distinctOptions);
  }

  async unregisterScheduler(schedulerName: string): Promise<void> {
    await this.connect();

    const fullSchedulerName = this.getFullSchedulerName(schedulerName);
    await this.adapter.unregisterScheduler(fullSchedulerName);
  }

  private wrapAdapterWorker(workers: SchedulerWorker[]): SchedulerAdapterWorker {
    const middlewares = this._middlwares.slice();
    const allWorkers = middlewares.concat(workers);
    const mainWorker = this.combineWorkers(allWorkers);

    return (data) => SchedulerDataContext.run(data, mainWorker);
  }

  private combineWorkers(workers: SchedulerWorker[]): SchedulerWorker {
    return () => workers.reduceRight<() => Promise<void>>((next, middleware) => () => SchedulerNextContext.run(next, middleware), emptyNext())();
  }

  private getFullSchedulerName(schedulerName: string) {
    return `${this.namespace}.${schedulerName}`;
  }
}
