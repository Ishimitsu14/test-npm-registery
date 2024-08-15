import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { NatsOptions, Transport } from '@nestjs/microservices';

export interface CreateConsumerOptions {
  servers: string[];
  currentNamespace: string;
}

export function createServer({ servers, currentNamespace }: CreateConsumerOptions): NestMicroserviceOptions & NatsOptions {
  return {
    transport: Transport.NATS,
    options: {
      servers,
      queue: currentNamespace,
    },
  };
}
