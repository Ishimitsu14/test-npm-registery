import { Logger } from '@nestjs/common';
import { inspect } from 'util';

export function loggerCriticalHookWrapper(wrapperName: string) {
  return (err: any, context: string) => {
    Logger.error(inspect(err), `CRITICAL - ${wrapperName}.${context}`);

    if (!err?.stack) {
      const stack = {};
      Error.captureStackTrace(stack);

      Logger.error(stack, `CRITICAL - ${wrapperName}.${context}`);
    }
  };
}
