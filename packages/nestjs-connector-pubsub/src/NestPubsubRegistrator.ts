import { Injectable, InjectionToken } from '@nestjs/common';
import { IConsumer, IProducer } from '@packages/berish-connector-pubsub';

@Injectable()
export class NestPubsubRegistrator {
  private producers: Map<InjectionToken, IProducer<any>> = new Map();
  private consumers: Map<InjectionToken, IConsumer<any>> = new Map();

  registerProducer<TProducer extends IProducer<any>>(token: InjectionToken, producer: TProducer): TProducer {
    this.producers.set(token, producer);
    return producer;
  }

  registerConsumer<TConsumer extends IConsumer<any>>(token: InjectionToken, consumer: TConsumer): TConsumer {
    this.consumers.set(token, consumer);
    return consumer;
  }

  getProducer<TProducer extends IProducer<any>>(token: InjectionToken): TProducer {
    return this.producers.get(token) as TProducer;
  }

  getConsumer<TConsumer extends IConsumer<any>>(token: InjectionToken): TConsumer {
    return this.consumers.get(token) as TConsumer;
  }

  getProducers(): IProducer<any>[] {
    return [...this.producers.values()];
  }

  getConsumers(): IConsumer<any>[] {
    return [...this.consumers.values()];
  }
}
