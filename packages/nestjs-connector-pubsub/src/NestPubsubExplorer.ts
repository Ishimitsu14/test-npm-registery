import { Inject, Injectable, InjectionToken, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, ModuleRef } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { IConsumer } from '@packages/berish-connector-pubsub';
import { NestContextManager } from '@packages/nestjs-request-context';

import { INestConsumerEventEveryTopicHandlerMethod } from './NestConsumerEventEveryTopicHandler';
import { INestConsumerEventHandlerMethod, NestConsumerEventHandlerMetadata } from './NestConsumerEventHandler';
import { INestConsumerWorkerHandler, INestConsumerWorkerHandlerMethod, NestConsumerWorkerHandlerMetadata } from './NestConsumerWorkerHandler';
import { NestPubsubMetadataHelper } from './NestPubsubMetadataHelper';
import { NestPubsubRegistrator } from './NestPubsubRegistrator';

@Injectable()
export class NestPubsubExplorer implements OnModuleInit, OnApplicationBootstrap {
  @Inject(DiscoveryService)
  private discoveryService: DiscoveryService;

  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @Inject(MetadataScanner)
  private metadataScanner: MetadataScanner;

  @Inject(NestPubsubMetadataHelper)
  private queueMetadataHelper: NestPubsubMetadataHelper;

  @Inject(NestPubsubRegistrator)
  private queueManagerRegistrator: NestPubsubRegistrator;

  @Inject(NestContextManager)
  private nestContextManager: NestContextManager;

  private readonly logger: Logger = new Logger(this.constructor.name);

  async onModuleInit() {
    this.registerConsumerHandlersClasses();
    this.registerConsumerHandlersMethods();

    this.registerConsumerEventHandlersClasses();
    this.registerConsumerEventHandlersMethods();
  }

  async onApplicationBootstrap() {
    const consumers = this.queueManagerRegistrator.getConsumers();
    Promise.all(consumers.map((consumer) => consumer.start()));
  }

  registerConsumerHandlersClasses() {
    const consumerWorkerHandlers = this.discoveryService
      .getProviders()
      .filter((wrapper) => this.queueMetadataHelper.hasConsumerHandlerMetadata(!wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype));

    consumerWorkerHandlers.forEach((wrapper: InstanceWrapper<INestConsumerWorkerHandler<any>>) => {
      const { instance, metatype, name } = wrapper;
      const consumerHandlerMetadata = this.queueMetadataHelper.getConsumerHandlerMetadata(instance.constructor || metatype);
      if (!consumerHandlerMetadata) return undefined;
      if (!this.queueMetadataHelper.isConsumerHandlerClass(instance)) {
        this.logger.warn(`Incorrect consumer handler class: ${name}`);
        return undefined;
      }

      const key: keyof INestConsumerWorkerHandler<any> = 'execute';
      this.registerConsumerHandler(wrapper, consumerHandlerMetadata, key, true);
    });
  }

  registerConsumerHandlersMethods() {
    const triggerProviderMap: Map<InstanceWrapper, (string | symbol)[]> = new Map();

    this.discoveryService.getProviders().forEach((wrapper) => {
      if (!wrapper.instance) return undefined;

      this.metadataScanner.scanFromPrototype(wrapper.instance, Object.getPrototypeOf(wrapper.instance), (key) => {
        const isTrigger = this.queueMetadataHelper.hasConsumerHandlerMetadata(wrapper.instance[key]);
        if (!isTrigger) return undefined;

        if (!triggerProviderMap.has(wrapper)) triggerProviderMap.set(wrapper, []);

        const keys = triggerProviderMap.get(wrapper);
        keys.push(key);
      });
    });

    if (triggerProviderMap.size <= 0) return undefined;

    triggerProviderMap.forEach((keys, wrapper) => {
      keys.forEach((key) => {
        const consumerHandlerMetadata = this.queueMetadataHelper.getConsumerHandlerMetadata(wrapper.instance[key]);
        if (!consumerHandlerMetadata) return undefined;

        this.registerConsumerHandler(wrapper, consumerHandlerMetadata, key, false);
      });
    });
  }

  registerConsumerEventHandlersClasses() {
    const consumerWorkerHandlers = this.discoveryService
      .getProviders()
      .filter((wrapper) => this.queueMetadataHelper.hasConsumerEventHandlerMetadata(!wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype));

    consumerWorkerHandlers.forEach((wrapper: InstanceWrapper<INestConsumerWorkerHandler<any>>) => {
      const { instance, metatype, name } = wrapper;
      const consumerEventHandlerMetadata = this.queueMetadataHelper.getConsumerEventHandlerMetadata(instance.constructor || metatype);
      if (!consumerEventHandlerMetadata) return undefined;

      if (!this.queueMetadataHelper.isConsumerEventHandlerClass(instance)) {
        this.logger.warn(`Incorrect consumer event handler class: ${name}`);
        return undefined;
      }

      const key: keyof INestConsumerWorkerHandler<any> = 'execute';
      if (consumerEventHandlerMetadata.topic === true) {
        this.registerConsumerEventEveryTopicHandler(wrapper, consumerEventHandlerMetadata, key, true);
      } else {
        this.registerConsumerEventHandler(wrapper, consumerEventHandlerMetadata, key, true);
      }
    });
  }

  registerConsumerEventHandlersMethods() {
    const triggerProviderMap: Map<InstanceWrapper, (string | symbol)[]> = new Map();

    this.discoveryService.getProviders().forEach((wrapper) => {
      if (!wrapper.instance) return undefined;

      this.metadataScanner.scanFromPrototype(wrapper.instance, Object.getPrototypeOf(wrapper.instance), (key) => {
        const isTrigger = this.queueMetadataHelper.hasConsumerEventHandlerMetadata(wrapper.instance[key]);
        if (!isTrigger) return undefined;

        if (!triggerProviderMap.has(wrapper)) triggerProviderMap.set(wrapper, []);

        const keys = triggerProviderMap.get(wrapper);
        keys.push(key);
      });
    });

    if (triggerProviderMap.size <= 0) return undefined;

    triggerProviderMap.forEach((keys, wrapper) => {
      keys.forEach((key) => {
        const consumerEventHandlerMetadata = this.queueMetadataHelper.getConsumerEventHandlerMetadata(wrapper.instance[key]);
        if (!consumerEventHandlerMetadata) return undefined;

        if (consumerEventHandlerMetadata.topic === true) {
          this.registerConsumerEventEveryTopicHandler(wrapper, consumerEventHandlerMetadata, key, true);
        } else {
          this.registerConsumerEventHandler(wrapper, consumerEventHandlerMetadata, key, true);
        }
      });
    });
  }

  private registerConsumerHandler(wrapper: InstanceWrapper, metadata: NestConsumerWorkerHandlerMetadata, key: string | symbol, isClass: boolean) {
    const { instance, name } = wrapper;
    const { injectionToken, topic, workerOptions } = metadata;

    const consumer = this.resolveConnectorConsumer(injectionToken);
    if (!consumer) return undefined;

    if (typeof instance[key] !== 'function') {
      this.logger.warn(`${name}.${String(key)} Consumer trigger is not function`);
      return undefined;
    }

    const callback: INestConsumerWorkerHandlerMethod<any, any> = async (data, context) => {
      return this.nestContextManager.runInContextByRequest(() => instance[key].call(instance, data, context), data);
    };

    const handler = { callback, options: workerOptions };
    consumer.registerWorkerHandler({ topic }, handler);

    const customMetadata = this.getCustomMetadata(wrapper, isClass ? undefined : key);
    if (customMetadata) {
      consumer.setMetadataMap(handler, customMetadata);
    }

    if (isClass) {
      this.logger.log(`registerConsumerHandler: [${consumer.namespace}.${topic}]. Handler [${name}]`);
    } else {
      this.logger.log(`registerConsumerHandler: [${consumer.namespace}.${topic}]. Handler [${name}.${String(key)}]`);
    }
  }

  private registerConsumerEventHandler(wrapper: InstanceWrapper, metadata: NestConsumerEventHandlerMetadata, key: string | symbol, isClass: boolean) {
    const { instance, name } = wrapper;
    const { injectionToken, topic, eventName } = metadata;
    if (topic === true) return undefined;

    const consumer = this.resolveConnectorConsumer(injectionToken);
    if (!consumer) return undefined;

    if (typeof instance[key] !== 'function') {
      this.logger.warn(`registerConsumerEventHandler: ${name}.${String(key)} is not function`);
      return undefined;
    }

    const callback: INestConsumerEventHandlerMethod<any, any> = async (...args) => {
      return this.nestContextManager.runInContext(() => instance[key].call(instance, ...args));
    };

    const handler = { callback, eventName };
    consumer.registerEventHandler({ topic }, handler);
    const customMetadata = this.getCustomMetadata(wrapper, isClass ? undefined : key);
    if (customMetadata) {
      consumer.setMetadataMap(handler, customMetadata);
    }

    if (isClass) {
      this.logger.log(`registerConsumerEventHandler: ${name} Registered event ${eventName}. Topic ${topic}`);
    } else {
      this.logger.log(`registerConsumerEventHandler: ${name}.${String(key)} Registered event ${eventName}. Topic ${topic}`);
    }
  }

  private registerConsumerEventEveryTopicHandler(wrapper: InstanceWrapper, metadata: NestConsumerEventHandlerMetadata, key: string | symbol, isClass: boolean) {
    const { instance, name } = wrapper;
    const { injectionToken, topic, eventName } = metadata;
    if (topic !== true) return undefined;

    const consumer = this.resolveConnectorConsumer(injectionToken);
    if (!consumer) return undefined;

    if (typeof instance[key] !== 'function') {
      this.logger.warn(`registerConsumerEventEveryTopicHandler: ${name}.${String(key)} is not function`);
      return undefined;
    }

    const callback: INestConsumerEventEveryTopicHandlerMethod<any, any> = async (...args) => {
      return this.nestContextManager.runInContext(() => instance[key].call(instance, ...args));
    };

    consumer.registerEventEveryTopicHandler({ callback, eventName });

    if (isClass) {
      this.logger.log(`registerConsumerEventEveryTopicHandler: ${name} Registered event ${eventName}`);
    } else {
      this.logger.log(`registerConsumerEventEveryTopicHandler: ${name}.${String(key)} Registered event ${eventName}`);
    }
  }

  private getCustomMetadata(wrapper: InstanceWrapper, key?: string | symbol) {
    if ((key ?? null) !== null) {
      return this.queueMetadataHelper.getConsumerCustomMetadataMapMetadata(wrapper.instance || wrapper.metatype?.prototype, key);
    }
    return this.queueMetadataHelper.getConsumerCustomMetadataMapMetadata(wrapper.instance.constructor || wrapper.metatype);
  }

  private resolveConnectorConsumer(consumerClass: InjectionToken): IConsumer<any> {
    const consumer = this.queueManagerRegistrator.getConsumer(consumerClass);
    if (consumer) return consumer;

    const consumerResolved = this.moduleRef.get(consumerClass);
    this.queueManagerRegistrator.registerConsumer(consumerClass, consumerResolved);
    return consumerResolved;
  }
}
