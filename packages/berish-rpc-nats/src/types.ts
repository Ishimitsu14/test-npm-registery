import type { NatsConnection } from 'nats';

type Factory<T> = T | Promise<T> | (() => T) | (() => Promise<T>);
export type NatsConnectionFactory = Factory<NatsConnection>;
