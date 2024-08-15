import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { RpcServerExpressAdapter } from '@packages/berish-rpc-express';
import { RpcServerNatsAdapter } from '@packages/berish-rpc-nats';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';
import { NoteConfig } from '@shared/config';
import { CONNECTORS } from '@shared/connectors';
import * as nats from 'nats';

import { MicroserviceModule } from './module';

async function bootstrap() {
  Logger.log(logFlatConfig(NoteConfig), 'NoteConfig');

  const app = await NestFactory.create(MicroserviceModule);
  await app.get(NestShutdownRoot).registerApp(app);

  const rpcExpressAdapter =
    NoteConfig.dev.rpc.useRPC &&
    new RpcServerExpressAdapter({
      mountPath: NoteConfig.dev.rpc.mountPath,
      port: NoteConfig.dev.rpc.port,
    });

  const rpcNatsAdapter = new RpcServerNatsAdapter({
    namespace: NoteConfig.namespace,
    connection: async () => {
      return nats.connect({
        servers: NoteConfig.connectors.nats.servers,
      });
    },
  });

  const rpcMicroservice = CONNECTORS.COMPONENTS.RPC.createServer({
    adapters: [rpcExpressAdapter, rpcNatsAdapter].filter(Boolean),
    level: NoteConfig.logger.level,
  });
  app.connectMicroservice(rpcMicroservice, { inheritAppConfig: true });

  await app.init();
  await app.startAllMicroservices();
}

NestShutdownRoot.bootstrapRun(bootstrap);
