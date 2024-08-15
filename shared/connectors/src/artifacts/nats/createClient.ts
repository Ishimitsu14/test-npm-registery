import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import nats from 'nats';

export interface CreateProducerOptions {
  servers: string[];
  namespace: string;
}

export async function createClient({ servers, namespace }: CreateProducerOptions) {
  const connection = await nats.connect({ servers });
  const natsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: namespace });

  const rpcClient = new RpcClient({ adapter: natsAdapter });

  return ClientProxyFactory.create({
    transport: Transport.NATS,
    options: {
      servers,
    },
  });
}
