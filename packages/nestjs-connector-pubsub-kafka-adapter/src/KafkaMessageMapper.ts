import { PubsubMessage, PubsubMessageKey, PubsubMessageNamespaceInput } from '@packages/berish-connector-pubsub';
import { KafkaJSError, Message } from 'kafkajs';

import { KAFKA_CONNECTOR_HEADER_KEY, KAFKA_CONNECTOR_HEADER_METADATA, KAFKA_CONNECTOR_VERSION } from './const';
import { KafkaMessageInputOptions } from './types';

export class KafkaMessageMapper {
  serialize(income: PubsubMessageNamespaceInput<any, any, KafkaMessageInputOptions>): Message {
    const { key, content, metadata } = income;

    return {
      key: income.messageOptions.uniqueKey && this.encode(income.messageOptions.uniqueKey, false),
      value: this.encode(content, true),
      timestamp: income.messageOptions.timestamp && String(+new Date(income.messageOptions.timestamp)),
      headers: this.encodeDeep({
        [KAFKA_CONNECTOR_VERSION]: '1.0.0',
        [KAFKA_CONNECTOR_HEADER_KEY]: key,
        [KAFKA_CONNECTOR_HEADER_METADATA]: metadata,
      }),
    };
  }

  deserialize(income: Message): PubsubMessage {
    const headers = this.decodeDeep(income.headers as any);
    const version = headers[KAFKA_CONNECTOR_VERSION];

    if (version === '1.0.0') {
      const key = headers[KAFKA_CONNECTOR_HEADER_KEY] as PubsubMessageKey;
      const metadata = headers[KAFKA_CONNECTOR_HEADER_METADATA] as Record<string, any>;
      const content = this.decode(income.value, true) as Record<string, any>;

      return {
        key,
        metadata,
        content,
      };
    }

    throw new KafkaJSError(`[KAFKA_CONNECTOR] Wrong message version. ${JSON.stringify(headers)}`);
  }

  public decode(value: string | Buffer | null, jsonString: boolean): string | number | boolean | symbol | bigint | Buffer | Record<string, any> | null | undefined {
    if ((value ?? null) === null) return null;

    if (Buffer.isBuffer(value)) value = value.toString();
    if (typeof value === 'string') return jsonString ? JSON.parse(value) : value;

    return JSON.parse(value);
  }

  public decodeDeep(value: Record<string, Buffer | string>): Record<string, string | number | boolean | symbol | bigint | Buffer | Record<string, any> | null | undefined> {
    if ((value ?? null) === null) return {};
    if (typeof value !== 'object') return {};

    const keys = Object.keys(value);
    return keys.reduce((prev, key) => ({ ...prev, [key]: this.decode(value[key], true) }), {});
  }

  public encode(value: string | number | boolean | symbol | bigint | Buffer | Record<string, any> | null | undefined, jsonString: boolean): string | Buffer | null {
    if ((value ?? null) === null) return null;
    if (Buffer.isBuffer(value)) return value;
    if (typeof value === 'string') return jsonString ? JSON.stringify(value) : value;

    return JSON.stringify(value);
  }

  public encodeDeep(
    value: Record<string, string | number | boolean | symbol | bigint | Buffer | Record<string, any> | null | undefined>,
  ): Record<string, Buffer | string | (Buffer | string)[] | null> {
    if ((value ?? null) === null) return {};
    if (typeof value !== 'object') return {};

    const keys = Object.keys(value);
    return keys.reduce((prev, key) => ({ ...prev, [key]: this.encode(value[key], true) }), {});
  }
}
