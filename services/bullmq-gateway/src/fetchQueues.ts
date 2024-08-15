import LINQ from '@berish/linq';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullMQGatewayConfig } from '@shared/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export async function fetchQueues(redisClient: IORedis) {
  const keys = await redisClient.keys(`${BullMQGatewayConfig.bullmq.prefix}:*`);
  const uniqueKeys = LINQ.from(keys)
    .map((key) => key.replace(/^.+?:(.+?):.+?$/, '$1'))
    .distinct()
    .orderByAscending()
    .toArray();

  return uniqueKeys.map((key) => {
    const queue = new Queue(key, { connection: redisClient, prefix: BullMQGatewayConfig.bullmq.prefix });
    const adapter = new BullMQAdapter(queue);
    return {
      key,
      queue,
      adapter,
    };
  });
}
