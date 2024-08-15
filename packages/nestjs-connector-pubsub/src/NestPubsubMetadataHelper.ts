import { Inject, Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CONSUMER_CUSTOM_METADATA_MAP_METADATA, CONSUMER_EVENT_HANDLER_METADATA, CONSUMER_WORKER_HANDLER_METADATA } from './const';
import { INestConsumerEventEveryTopicHandler } from './NestConsumerEventEveryTopicHandler';
import { INestConsumerEventHandler, NestConsumerEventHandlerMetadata } from './NestConsumerEventHandler';
import { INestConsumerWorkerHandler, NestConsumerWorkerHandlerMetadata } from './NestConsumerWorkerHandler';

@Injectable()
export class NestPubsubMetadataHelper {
  @Inject(Reflector)
  private reflector: Reflector;

  // ConsumerHandler

  hasConsumerHandlerMetadata(target: Type<any>): boolean {
    if (!target) return false;

    return this.reflector.get(CONSUMER_WORKER_HANDLER_METADATA, target);
  }

  isConsumerHandlerClass(value: any): value is INestConsumerWorkerHandler<any> {
    if (typeof value === 'object' && Boolean(value) && 'execute' in value && typeof value['execute'] === 'function') return true;
    return false;
  }

  getConsumerHandlerMetadata(target: Type<any> | Function): NestConsumerWorkerHandlerMetadata | undefined {
    return this.reflector.get(CONSUMER_WORKER_HANDLER_METADATA, target);
  }

  // ConsumerEventHandler

  hasConsumerEventHandlerMetadata(target: Type<any> | Function): boolean {
    if (!target) return false;

    return this.reflector.get(CONSUMER_EVENT_HANDLER_METADATA, target);
  }

  isConsumerEventHandlerClass(value: any): value is INestConsumerEventHandler<any, any> | INestConsumerEventEveryTopicHandler<any, any> {
    if (typeof value === 'object' && Boolean(value) && 'execute' in value && typeof value['execute'] === 'function') return true;
    return false;
  }

  getConsumerEventHandlerMetadata(target: Type<any> | Function): NestConsumerEventHandlerMetadata | undefined {
    return this.reflector.get(CONSUMER_EVENT_HANDLER_METADATA, target);
  }

  // Consumer custom metadata
  hasConsumerCustomMetadataMapMetadata(target: Type<any> | Function, prop?: string | symbol): boolean {
    if (!target) return false;

    return Reflect.hasMetadata(CONSUMER_CUSTOM_METADATA_MAP_METADATA, target, prop);
  }

  getConsumerCustomMetadataMapMetadata(target: Type<any> | Function, prop?: string | symbol): Record<string | symbol, any> | undefined {
    return Reflect.getMetadata(CONSUMER_CUSTOM_METADATA_MAP_METADATA, target, prop);
  }
}
