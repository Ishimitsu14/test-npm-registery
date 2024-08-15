import { Inject, InjectionToken, Logger, OnModuleInit, Scope, Type } from '@nestjs/common';
import { PROPERTY_DEPS_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, ModuleRef, Reflector } from '@nestjs/core';
import { UnknownDependenciesException } from '@nestjs/core/errors/exceptions/unknown-dependencies.exception';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { INJECT_CONTEXT_METADATA } from '../const';
import { DeprecatedNestRequestScopeInjectException } from '../exceptions';
import { InjectContextMetadata, InjectNestMetadata } from '../types';
import { NestContextManager } from './NestContextManager';

export class NestContextExplorer implements OnModuleInit {
  @Inject(DiscoveryService)
  private discoveryService: DiscoveryService;

  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(NestContextManager)
  private nestContextManager: NestContextManager;

  private _logger: Logger = new Logger(NestContextExplorer.name);

  onModuleInit() {
    const moduleProviders = this.discoveryService.getProviders();
    const moduleControllers = this.discoveryService.getControllers();
    const moduleWrappers = [...moduleProviders, ...moduleControllers];

    this.injectContext(moduleWrappers, moduleProviders);
    this.detectDefaultInjectionForRequestScoped(moduleWrappers);
  }

  private injectContext(moduleWrappers: InstanceWrapper[], moduleProviders: InstanceWrapper[]) {
    const injectContextWrappers = moduleWrappers.filter((wrapper) => this.contextGetInjectMetadata(this.getWrapperClass(wrapper)));

    for (const injectContextWrapper of injectContextWrappers) {
      const injectorClass = this.getWrapperClass(injectContextWrapper);
      const injectorPrototype = injectorClass?.prototype;
      const injectContextMetadata = this.contextGetInjectMetadata(injectorClass);

      for (const injectContextItem of injectContextMetadata) {
        const token = this.contextResolveParamToken(injectContextItem.token);
        const tokenWrapper = moduleProviders.find((m) => m.token === token);
        if (!tokenWrapper) {
          throw new UnknownDependenciesException(injectContextWrapper.name, { key: injectContextItem.key, name: token }, injectContextWrapper.host);
        }

        const isRequestScoped = !tokenWrapper.isDependencyTreeStatic();
        if (!isRequestScoped) {
          this._logger.warn(
            `Try to inject context for [${injectContextWrapper.name}.${String(injectContextItem.key)}], but it is not request scoped. Used default Inject for ${tokenWrapper.name}. CHANGE TO @INJECT!`,
          );

          Object.defineProperty(injectorPrototype, injectContextItem.key, { value: () => this.moduleRef.get(token) });
        } else {
          Object.defineProperty(injectorPrototype, injectContextItem.key, { value: this.nestContextManager.createResolver(token) });
        }
      }
    }
  }

  private detectDefaultInjectionForRequestScoped(moduleWrappers: InstanceWrapper[]) {
    const injectDefaultWrappers = moduleWrappers.filter((wrapper) => this.nestGetInjectMetadata(!wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype));

    for (const injectDefaultWrapper of injectDefaultWrappers) {
      const injectorClass = this.getWrapperClass(injectDefaultWrapper);
      const injectorNestInjectMetadata = this.nestGetInjectMetadata(injectorClass);
      // const injectorInjectableScope = this.nestGetInjectableScope(injectorClass);
      const injectorInjectableScope = injectDefaultWrapper.scope ?? Scope.DEFAULT;
      const isRequestScopedInjector = !injectDefaultWrapper.isDependencyTreeStatic();

      for (const injectContextItem of injectorNestInjectMetadata) {
        const token = this.nestResolveParamToken(injectContextItem.type);
        const tokenWrapper = moduleWrappers.find((m) => m.token === token);
        if (!tokenWrapper) continue;

        const isRequestScoped = !tokenWrapper.isDependencyTreeStatic();

        if (injectorInjectableScope === Scope.DEFAULT && isRequestScoped) {
          throw new DeprecatedNestRequestScopeInjectException(injectDefaultWrapper.name, injectDefaultWrapper.host, {
            key: injectContextItem.key,
            name: token,
          });
        }
      }

      if (injectorInjectableScope === Scope.DEFAULT && isRequestScopedInjector) {
        throw new DeprecatedNestRequestScopeInjectException(injectDefaultWrapper.name, injectDefaultWrapper.host);
      }
    }
  }

  private contextGetInjectMetadata(target: Type<any>): InjectContextMetadata[] {
    if (!target) return null;

    return this.reflector.get(INJECT_CONTEXT_METADATA, target);
  }

  private contextResolveParamToken(token: InjectContextMetadata['token']): InjectionToken {
    if (typeof token === 'object' && typeof token.forwardRef === 'function') {
      return token.forwardRef();
    }
    return token as InjectionToken;
  }

  private nestGetInjectMetadata(target: Type<any>): InjectNestMetadata[] {
    if (!target) return null;

    return this.reflector.get(PROPERTY_DEPS_METADATA, target);
  }

  private nestResolveParamToken(token: InjectNestMetadata['type']): InjectionToken {
    if (typeof token === 'object' && token.forwardRef) {
      return token.forwardRef();
    }
    return token as InjectionToken;
  }

  private getWrapperClass(wrapper: InstanceWrapper) {
    return !wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype;
  }
}
