import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { RpcServerExpressAdapter } from '@packages/berish-rpc-express';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';
import { AdminGatewayConfig } from '@shared/config';
import { CONNECTORS } from '@shared/connectors';

import { MicroserviceModule } from './module';

async function bootstrap() {
  Logger.log(logFlatConfig(AdminGatewayConfig), 'AdminGatewayConfig');

  const app = await NestFactory.create(MicroserviceModule);
  await app.get(NestShutdownRoot).registerApp(app);

  const rpcExpressAdapter = new RpcServerExpressAdapter({ mountPath: AdminGatewayConfig.rpc.mountPath, port: AdminGatewayConfig.rpc.httpPort });

  // Rpc connect
  const rpcMicroservice = CONNECTORS.COMPONENTS.RPC.createServer({
    adapters: [rpcExpressAdapter],
    level: AdminGatewayConfig.logger.level,
  });
  app.connectMicroservice(rpcMicroservice, { inheritAppConfig: true });

  await app.init();
  await app.startAllMicroservices();
}

NestShutdownRoot.bootstrapRun(bootstrap);
