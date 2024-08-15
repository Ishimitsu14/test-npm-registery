import { applyDecorators, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { API_RPC_CONTROLLER_OPTIONS_METADATA, API_RPC_METHOD_OPTIONS_METADATA } from '../const';
import { NestRpcControllerOptions, NestRpcMethodOptions } from '../internal.types';

export function NestRpcController(options: NestRpcControllerOptions = {}): ClassDecorator {
  const metadataDecorator: ClassDecorator = (target) => {
    Reflect.defineMetadata(API_RPC_CONTROLLER_OPTIONS_METADATA, options, target);
  };
  const messagePatternPropertiesDecorator: ClassDecorator = (target) => {
    const proto = target.prototype;
    const validMethods = Object.getOwnPropertyNames(proto)
      .filter((key) => key !== 'constructor')
      .filter((key) => typeof proto[key] === 'function')
      .map<NestRpcMethodOptions>((key) => {
        return Reflect.getMetadata(API_RPC_METHOD_OPTIONS_METADATA, proto[key]);
      })
      .filter(Boolean);
    for (const method of validMethods) {
      const patternName = [options?.namespace, `${method.methodName?.toString() || method.propertyName?.toString()}`].filter(Boolean).join('.');
      const messagePatternDecorator = MessagePattern(patternName);
      messagePatternDecorator(proto, method.propertyName, Object.getOwnPropertyDescriptor(proto, method.propertyName));
    }
  };
  return applyDecorators(metadataDecorator, messagePatternPropertiesDecorator, Controller());
}
