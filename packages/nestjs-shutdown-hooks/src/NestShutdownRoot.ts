import { INestApplicationContext, Inject, Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

import { loggerCriticalHookWrapper, loggerExitHookWrapper } from './loggerHooks';
import { NestOnRegisterShutdownHook } from './types';

@Injectable({})
export class NestShutdownRoot {
  private static readonly loggerExitHook = loggerExitHookWrapper(NestShutdownRoot.name);
  private static readonly loggerCriticalHook = loggerCriticalHookWrapper(NestShutdownRoot.name);

  static bootstrapRun(callback: () => any): void {
    (async function () {
      process.on('exit', NestShutdownRoot.loggerExitHook);

      try {
        await callback();
      } catch (err) {
        NestShutdownRoot.loggerCriticalHook(err, 'bootstrap');
        process.exit(1);
      }
    })();
  }

  @Inject(DiscoveryService)
  private readonly _discoveryService: DiscoveryService;

  async registerApp(app: INestApplicationContext) {
    process.on('uncaughtException', async (err) => {
      NestShutdownRoot.loggerCriticalHook(err, 'uncaughtException');
      await app.close();
      process.exit(1);
    });
    process.on('unhandledRejection', async (reason) => {
      NestShutdownRoot.loggerCriticalHook(reason, 'unhandledRejection');
      await app.close();
      process.exit(1);
    });

    if (!process.listeners('exit').find((m) => m === NestShutdownRoot.loggerExitHook)) {
      process.on('exit', NestShutdownRoot.loggerExitHook);
    }

    await this.registerHooks(app);
  }

  private async registerHooks(app: INestApplicationContext) {
    const hookName: keyof NestOnRegisterShutdownHook = 'onRegisterShutdownHook';
    const wrappers = [...this._discoveryService.getControllers(), ...this._discoveryService.getProviders()].filter(
      (wrapper) => wrapper.isDependencyTreeStatic() && (!wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype) && wrapper.instance && wrapper.instance[hookName],
    );
    for (const wrapper of wrappers) {
      const hook: NestOnRegisterShutdownHook['onRegisterShutdownHook'] = wrapper.instance[hookName];
      if (typeof hook === 'function') {
        await hook.call(wrapper.instance, app);
      } else {
        throw new RuntimeException(`${wrapper.name} has hook ${hookName}, but it is not function`);
      }
    }
  }
}
