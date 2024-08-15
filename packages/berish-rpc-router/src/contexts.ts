import { Context } from '@packages/berish-context';

export interface RpcRouterContextMetadata {
  routeMethod: string;
}

export const ROUTER_CONTEXT = new Context<RpcRouterContextMetadata>();
