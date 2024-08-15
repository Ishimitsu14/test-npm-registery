import { RpcHandler, RpcNextFunction } from '../external.types';

// Удачный ответ, если хоть один middleware ответил с успехом
export function oneOfHandlersMiddleware(...handlers: RpcHandler[]): RpcHandler {
  return async (next) => {
    if (!handlers || handlers.length <= 0) return next();

    let isCalledNext = false;
    let error = null;

    const callNext: RpcNextFunction = () => {
      isCalledNext = true;
      return next();
    };

    let index = 0;
    do {
      try {
        const handler = handlers[index];
        const result = await handler(callNext);

        return result;
      } catch (err) {
        error = err;
      }
      index++;
    } while (error && handlers[index] && !isCalledNext);

    if (error) throw error;

    return next();
  };
}
