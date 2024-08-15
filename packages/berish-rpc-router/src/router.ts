import LINQ from '@berish/linq';
import { combineHandlersMiddleware, notFoundMiddleware, RpcHandler, useRpcRequestInfo } from '@packages/berish-rpc-server';

import { ROUTER_CONTEXT } from './contexts';

export interface Router extends RpcHandler {
  getMap(): RouterMapItem[];
  use(...handlers: RpcHandler[]): void;

  add(...handlers: RpcHandler[]): void;
  add(method: string, ...handlers: RpcHandler[]): void;
}

export interface RouterMapItem {
  path: string;
  handlers: RpcHandler[];
}

export function Router(): Router {
  const routerMap: LINQ<RouterMapItem> = LINQ.from([]);

  const routerHandler: Router = (next) => {
    const request = useRpcRequestInfo();

    const context = ROUTER_CONTEXT.getValue();

    const methodToFind = context?.routeMethod != null ? context?.routeMethod : request.method;
    const methodGroups = LINQ.from(methodToFind?.split('.'));

    const _handlers: RpcHandler[] = [];
    for (const routerMapItem of routerMap) {
      const { path, handlers } = routerMapItem;
      if (path === '*') _handlers.push(...handlers);
      else {
        const pathGroups = path.split('.');
        if (path === methodGroups.take(pathGroups.length).join('.')) {
          const methodLast = methodGroups.skip(pathGroups.length).join('.') || '*';
          _handlers.push(...handlers.map((handler) => ROUTER_CONTEXT.bind({ routeMethod: methodLast }, handler)));
        }
      }
    }

    const baseHandler = combineHandlersMiddleware([..._handlers, notFoundMiddleware()]);
    return baseHandler(next);
  };

  const add = (arg1: string | RpcHandler, ...args: RpcHandler[]) => {
    const isFirstArgString = typeof arg1 === 'string';
    if (isFirstArgString) {
      routerMap.push({ path: arg1, handlers: args });
    } else {
      routerMap.push({ path: '*', handlers: [arg1, ...args] });
    }
  };

  const use = (...handlers: RpcHandler[]) => {
    return add('*', ...handlers);
  };

  routerHandler.add = add;
  routerHandler.use = use;
  routerHandler.getMap = () => {
    return routerMap;
  };
  return routerHandler;
}
