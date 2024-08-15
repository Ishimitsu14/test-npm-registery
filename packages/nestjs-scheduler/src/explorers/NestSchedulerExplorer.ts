import LINQ from '@berish/linq';
import { Inject, Logger, OnModuleInit, Type } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { SchedulerRegisterGroupParams, SchedulerRegisterParams, SchedulerWorker } from '@packages/berish-scheduler';

import { SCHDULER_WORKER_METADATA, SCHEDULER_INJECT_TOKEN, SCHEDULER_METADATA } from '../const';

export interface NestSchedulerExplorerWorker {
  instance: any;
  wrapper: InstanceWrapper;
  type: 'CLASS' | 'METHOD';
  methodName: string;

  schedulerName: string;
  execute: SchedulerWorker;
}

export interface NestSchedulerExplorerScheduler {
  instance: any;
  wrapper: InstanceWrapper;
  type: 'CLASS' | 'METHOD';
  methodName: string;

  schedulerName: string;
  options: SchedulerRegisterParams<any> | SchedulerRegisterGroupParams<any>[];
  execute: SchedulerWorker;
}

export class NestSchedulerExplorer implements OnModuleInit {
  @Inject(DiscoveryService)
  private discoveryService: DiscoveryService;

  @Inject(MetadataScanner)
  private metadataScanner: MetadataScanner;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(SCHEDULER_INJECT_TOKEN)
  private schedulerManager: SCHEDULER_INJECT_TOKEN;

  private readonly logger: Logger = new Logger(NestSchedulerExplorer.name);

  async onModuleInit() {
    const { workers, schedulers } = await this.discovery();

    await this.registerWorkers(workers);
    await this.registerSchedulers(schedulers);

    await this.schedulerManager.connect();
  }

  async discovery() {
    const wrappers = this.discoveryService.getProviders();

    const workerClasses = this.detectClasses<NestSchedulerExplorerWorker>(wrappers, ({ wrapper, instance, metatype }) => {
      const metadata = this.reflector.get<SCHDULER_WORKER_METADATA>(SCHDULER_WORKER_METADATA, metatype);
      if (!metadata) return false;

      const isWorkerClass = typeof instance === 'object' && Boolean(instance) && 'execute' in instance && typeof instance['execute'] === 'function';
      if (!isWorkerClass) return false;

      return {
        wrapper,
        instance,
        type: 'CLASS',
        methodName: 'execute',

        schedulerName: metadata.schedulerName,
        execute: instance.execute.bind(instance),
      };
    });
    const workerMethods = this.detectMethods<NestSchedulerExplorerWorker>(wrappers, ({ wrapper, method, methodName, instance }) => {
      const metadata = this.reflector.get<SCHDULER_WORKER_METADATA>(SCHDULER_WORKER_METADATA, method);
      if (!metadata) return false;

      return {
        wrapper,
        instance,
        type: 'CLASS',
        methodName,

        schedulerName: metadata.schedulerName,
        execute: method.bind(instance),
      };
    });
    const workers = workerClasses.concat(workerMethods);

    const schedulerClasses = this.detectClasses<NestSchedulerExplorerScheduler>(wrappers, ({ wrapper, instance, metatype }) => {
      const metadata = this.reflector.get<SCHEDULER_METADATA>(SCHEDULER_METADATA, metatype);
      if (!metadata) return false;

      const isWorkerClass = typeof instance === 'object' && Boolean(instance) && 'execute' in instance && typeof instance['execute'] === 'function';
      if (!isWorkerClass) return false;

      return {
        wrapper,
        instance,
        type: 'CLASS',
        methodName: 'execute',

        schedulerName: metadata.schedulerName,
        options: metadata.options,
        execute: instance.execute.bind(instance),
      };
    });

    const schedulerMethods = this.detectMethods<NestSchedulerExplorerScheduler>(wrappers, ({ wrapper, method, methodName, instance }) => {
      const metadata = this.reflector.get<SCHEDULER_METADATA>(SCHEDULER_METADATA, method);
      if (!metadata) return false;

      return {
        wrapper,
        instance,
        type: 'METHOD',
        methodName,

        schedulerName: metadata.schedulerName,
        options: metadata.options,
        execute: method.bind(instance),
      };
    });
    const schedulers = schedulerClasses.concat(schedulerMethods);

    return { workers, schedulers };
  }

  async registerWorkers(items: NestSchedulerExplorerWorker[]) {
    const groupBy = LINQ.from(items)
      .groupBy((m) => m.schedulerName)
      .toArray();

    await Promise.all(
      groupBy.map(async ([schedulerName, workersData]) => {
        await this.schedulerManager.registerWorker(schedulerName, ...workersData.map((data) => data.execute));

        this.logger.log(`Workers[${workersData.length}] "${schedulerName}" registered by ${workersData.map((data) => `"${data.wrapper.name}.${data.methodName}"`).join(', ')}`);
      }),
    );
  }

  async registerSchedulers(items: NestSchedulerExplorerScheduler[]) {
    const groupBy = LINQ.from(items)
      .groupBy((m) => m.schedulerName)
      .toArray();

    groupBy.forEach(([schedulerName, workersData]) => {
      if (workersData.length > 1) {
        throw new TypeError(`Registered >= 2 scheduler, but required only one: ${workersData.map((data) => `"${data.wrapper.name}.${data.methodName}"`).join(', ')}`);
      }
    });

    await Promise.all(
      groupBy.map(async ([schedulerName, [workerData]]) => {
        await this.schedulerManager.registerScheduler(schedulerName, workerData.options, workerData.execute);

        this.logger.log(`Scheduler "${schedulerName}" registered by "${workerData.wrapper.name}.${workerData.methodName}"`);
      }),
    );
  }

  // TODO Вынести в общие пакеты (способ удобной детекции)
  private detectClasses<Payload>(
    wrappers: InstanceWrapper<any>[],
    payloadCallback: (data: { wrapper: InstanceWrapper; instance: any; metatype: Type | Function }) => false | Payload | Payload[],
  ): Payload[] {
    return LINQ.from(wrappers)
      .selectMany((wrapper) => {
        if (!wrapper) return null;

        const metatype: Function = !wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype;
        if (!metatype) return null;

        const instance = wrapper.instance;
        if (!instance) return null;

        const payload = payloadCallback({ wrapper, instance, metatype });
        if (!payload) return null;

        if (Array.isArray(payload)) return payload;
        return [payload];
      })
      .filter(Boolean)
      .toArray();
  }

  // TODO Вынести в общие пакеты (способ удобной детекции)
  private detectMethods<Payload>(
    wrappers: InstanceWrapper<any>[],
    payloadCallback: (data: { wrapper: InstanceWrapper; method: (...args: any[]) => any; methodName: string; instance: any; metatype: Type | Function }) => false | Payload | Payload[],
  ): Payload[] {
    return LINQ.from(wrappers)
      .selectMany((wrapper) => {
        if (!wrapper) return null;

        const metatype: Function = !wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype;
        if (!metatype) return null;

        const instance = wrapper.instance;
        if (!instance) return null;

        const methods = this.metadataScanner.getAllMethodNames(instance);

        return LINQ.from(methods)
          .selectMany((methodName) => {
            const method = instance[methodName];
            if (typeof method !== 'function') return null;

            const payload = payloadCallback({ wrapper, method, methodName, instance, metatype });
            if (!payload) return null;

            if (Array.isArray(payload)) return payload;
            return [payload];
          })
          .filter(Boolean)
          .toArray();
      })
      .filter(Boolean)
      .toArray();
  }
}
