import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { RpcServerExpressAdapter } from '@packages/berish-rpc-express';
import { RpcServerNatsAdapter } from '@packages/berish-rpc-nats';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';
import { LotManagementConfig } from '@shared/config';
import { CONNECTORS } from '@shared/connectors';
import * as nats from 'nats';

import { MicroserviceModule } from './module';

async function bootstrap() {
  Logger.log(logFlatConfig(LotManagementConfig), 'LotManagementConfig');

  const app = await NestFactory.create(MicroserviceModule);
  await app.get(NestShutdownRoot).registerApp(app);

  const rpcExpressAdapter =
    LotManagementConfig.dev.rpc.useRPC &&
    new RpcServerExpressAdapter({
      mountPath: LotManagementConfig.dev.rpc.mountPath,
      port: LotManagementConfig.dev.rpc.port,
    });

  const rpcNatsAdapter = new RpcServerNatsAdapter({
    namespace: LotManagementConfig.namespace,
    connection: async () => {
      return nats.connect({
        servers: LotManagementConfig.connectors.nats.servers,
      });
    },
  });

  // Rpc connect
  const rpcMicroservice = CONNECTORS.COMPONENTS.RPC.createServer({
    adapters: [rpcExpressAdapter, rpcNatsAdapter].filter(Boolean),
    level: LotManagementConfig.logger.level,
  });
  app.connectMicroservice(rpcMicroservice, { inheritAppConfig: true });

  await app.init();
  await app.startAllMicroservices();
}

NestShutdownRoot.bootstrapRun(bootstrap);
