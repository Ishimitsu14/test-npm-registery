import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { isSymbol } from '@nestjs/common/utils/shared.utils';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { InjectorDependency, InjectorDependencyContext } from '@nestjs/core/injector/injector';
import { Module } from '@nestjs/core/injector/module';

export class DeprecatedNestRequestScopeInjectException extends RuntimeException {
  constructor(type: string | symbol, module?: Module, dep?: InjectorDependencyContext) {
    super(getMessage(type, module, dep));
  }
}

const getInstanceName = (instance: unknown): string => {
  if ((instance as ForwardReference)?.forwardRef) {
    return (instance as ForwardReference).forwardRef()?.name;
  }

  if ((instance as DynamicModule)?.module) {
    return (instance as DynamicModule).module?.name;
  }

  return (instance as Type)?.name;
};

const getDependencyName = (dependency: InjectorDependency): string =>
  // use class name
  getInstanceName(dependency) ||
  // use injection token (symbol)
  (isSymbol(dependency) && dependency.toString()) ||
  // use string directly
  (dependency as string) ||
  // otherwise
  '+';

const getModuleName = (module: Module) => (module && getInstanceName(module.metatype)) || 'current';

const getMessage = (type: string | symbol, module: Module, dep?: InjectorDependencyContext) => {
  const depName = dep?.name && getDependencyName(dep.name);
  const moduleName = getModuleName(module);

  if (depName) {
    return `\n
Module ${moduleName} has Nest deprecated request-scoped injection.
Please check ${type.toString()} and replace @Inject(${depName.toString()})[${dep.key.toString()}] to @InjectContext(${depName.toString()})[${dep.key.toString()}] for request-scoped providers
    `;
  }

  return `\n
Module ${moduleName} has Nest deprecated request-scoped injection.
Please check ${type.toString()} and replace @Inject(...) to @InjectContext(...) for request-scoped providers
  `;
};
