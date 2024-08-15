import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { Logger } from '@nestjs/common';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';
import { BullMQGatewayConfig } from '@shared/config';
import express from 'express';
import IORedis from 'ioredis';

import { fetchQueues } from './fetchQueues';

export async function main() {
  const redisClient = new IORedis({
    host: BullMQGatewayConfig.bullmq.host,
    port: BullMQGatewayConfig.bullmq.port,
    db: BullMQGatewayConfig.bullmq.db,
    username: BullMQGatewayConfig.bullmq.user,
    password: BullMQGatewayConfig.bullmq.password,

    tls: BullMQGatewayConfig.bullmq.useTLS ? {} : undefined,
  });

  const serverExpressAdapter = new ExpressAdapter();
  const { setQueues } = createBullBoard({
    queues: [],
    serverAdapter: serverExpressAdapter,
  });

  const list = await fetchQueues(redisClient);
  Logger.log(`Fetched keys from redis: ${list.map((m) => m.key).join(', ')}`, 'IORedis');
  setQueues(list.map((m) => m.adapter));

  setInterval(async () => {
    try {
      const list = await fetchQueues(redisClient);
      Logger.log(`Fetched keys from redis: ${list.map((m) => m.key).join(', ')}`, 'IORedis');
      setQueues(list.map((m) => m.adapter));
    } catch (err) {
      Logger.error(err);
    }
  }, 10000);

  const app = express();
  app.use(serverExpressAdapter.getRouter());

  app.listen(BullMQGatewayConfig.port, () => {
    Logger.log(`bull-board is started http://localhost:${BullMQGatewayConfig.port}/`, 'SERVER');
    Logger.log(`bull-board is fetching queue list, please wait...`, 'SERVER');
  });
}

NestShutdownRoot.bootstrapRun(main);
