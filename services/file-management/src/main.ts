import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { RpcServerExpressAdapter } from '@packages/berish-rpc-express';
import { RpcServerNatsAdapter } from '@packages/berish-rpc-nats';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';
import { FileManagementConfig } from '@shared/config';
import { CONNECTORS } from '@shared/connectors';
import * as nats from 'nats';
import * as process from 'process';

import { MicroserviceModule } from './module';

async function bootstrap() {
  Logger.log(logFlatConfig(FileManagementConfig), 'FileManagementConfig');

  const options =
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          cors: {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://localhost:5173'],
          },
        };

  const app = await NestFactory.create(MicroserviceModule, options);
  await app.get(NestShutdownRoot).registerApp(app);

  const rpcExpressAdapter =
    FileManagementConfig.dev.rpc.useRPC &&
    new RpcServerExpressAdapter({
      mountPath: FileManagementConfig.dev.rpc.mountPath,
      port: FileManagementConfig.dev.rpc.port,
    });

  const rpcNatsAdapter = new RpcServerNatsAdapter({
    namespace: FileManagementConfig.namespace,
    connection: async () => {
      return nats.connect({
        servers: FileManagementConfig.connectors.nats.servers,
      });
    },
  });

  // Rpc connect
  const rpcMicroservice = CONNECTORS.COMPONENTS.RPC.createServer({
    adapters: [rpcExpressAdapter, rpcNatsAdapter].filter(Boolean),
    level: FileManagementConfig.logger.level,
  });
  app.connectMicroservice(rpcMicroservice, { inheritAppConfig: true });

  await app.listen(FileManagementConfig.rest.port, async () => Logger.log(`Started at ${FileManagementConfig.rest.port} port with public host: ${FileManagementConfig.rest.publicHost}`, 'NestRest'));
  await app.init();
  await app.startAllMicroservices();
}

NestShutdownRoot.bootstrapRun(bootstrap);
