import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { RpcServerExpressAdapter } from '@packages/berish-rpc-express';
import { RpcServerNatsAdapter } from '@packages/berish-rpc-nats';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';
import { UserIdentityConfig } from '@shared/config';
import { CONNECTORS } from '@shared/connectors';
import * as nats from 'nats';

import { MicroserviceModule } from './module';

async function bootstrap() {
  Logger.log(logFlatConfig(UserIdentityConfig), 'UserIdentityConfig');

  const app = await NestFactory.create(MicroserviceModule);
  await app.get(NestShutdownRoot).registerApp(app);

  const rpcExpressAdapter =
    UserIdentityConfig.dev.rpc.useRPC &&
    new RpcServerExpressAdapter({
      mountPath: UserIdentityConfig.dev.rpc.mountPath,
      port: UserIdentityConfig.dev.rpc.port,
    });

  const rpcNatsAdapter = new RpcServerNatsAdapter({
    namespace: UserIdentityConfig.namespace,
    connection: async () => {
      return nats.connect({
        servers: UserIdentityConfig.connectors.nats.servers,
      });
    },
  });

  const rpcMicroservice = CONNECTORS.COMPONENTS.RPC.createServer({
    adapters: [rpcExpressAdapter, rpcNatsAdapter].filter(Boolean),
    level: UserIdentityConfig.logger.level,
  });
  app.connectMicroservice(rpcMicroservice, { inheritAppConfig: true });

  await app.init();
  await app.startAllMicroservices();
}

NestShutdownRoot.bootstrapRun(bootstrap);
