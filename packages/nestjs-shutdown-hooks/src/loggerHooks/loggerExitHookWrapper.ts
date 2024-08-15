import { Logger } from '@nestjs/common';

export function loggerExitHookWrapper(wrapperName: string) {
  return (code: number) => {
    Logger.warn(`Process exited with code: ${code}`, wrapperName);
  };
}
