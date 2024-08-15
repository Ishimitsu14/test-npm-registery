import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { RpcServerExpressAdapter } from '@packages/berish-rpc-express';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';
import { TgGatewayConfig } from '@shared/config';
import { CONNECTORS } from '@shared/connectors';

import { MicroserviceModule } from './module';

async function bootstrap() {
  Logger.log(logFlatConfig(TgGatewayConfig), 'TgBotGatewayConfig');

  const app = await NestFactory.create(MicroserviceModule);
  await app.get(NestShutdownRoot).registerApp(app);

  const rpcExpressAdapter =
    TgGatewayConfig.dev.rpc.useRPC &&
    new RpcServerExpressAdapter({
      mountPath: TgGatewayConfig.dev.rpc.mountPath,
      port: TgGatewayConfig.dev.rpc.port,
    });

  const rpcMicroservice = CONNECTORS.COMPONENTS.RPC.createServer({
    adapters: [rpcExpressAdapter].filter(Boolean),
    level: TgGatewayConfig.logger.level,
  });
  app.connectMicroservice(rpcMicroservice, { inheritAppConfig: true });

  await app.init();
  await app.startAllMicroservices();
}

NestShutdownRoot.bootstrapRun(bootstrap);
