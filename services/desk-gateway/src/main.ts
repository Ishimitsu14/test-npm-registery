import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { RpcServerExpressAdapter } from '@packages/berish-rpc-express';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';
import { DeskGatewayConfig } from '@shared/config';
import { CONNECTORS } from '@shared/connectors';

import { MicroserviceModule } from './module';

async function bootstrap() {
  Logger.log(logFlatConfig(DeskGatewayConfig), 'DeskGatewayConfig');

  const app = await NestFactory.create(MicroserviceModule);
  await app.get(NestShutdownRoot).registerApp(app);

  const rpcExpressAdapter = new RpcServerExpressAdapter({ mountPath: DeskGatewayConfig.rpc.mountPath, port: DeskGatewayConfig.rpc.httpPort });

  // Rpc connect
  const rpcMicroservice = CONNECTORS.COMPONENTS.RPC.createServer({
    adapters: [rpcExpressAdapter],
    level: DeskGatewayConfig.logger.level,
  });
  app.connectMicroservice(rpcMicroservice, { inheritAppConfig: true });

  await app.listen(DeskGatewayConfig.rest.port, async () => Logger.log(`Started at ${DeskGatewayConfig.rest.port} port with public host: ${DeskGatewayConfig.rest.publicHost}`, 'NestRest'));
  await app.init();
  await app.startAllMicroservices();
}

NestShutdownRoot.bootstrapRun(bootstrap);
