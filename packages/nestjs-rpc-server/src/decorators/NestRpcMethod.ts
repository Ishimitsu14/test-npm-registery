import { UseFilters } from '@nestjs/common';

import { API_RPC_METHOD_OPTIONS_METADATA } from '../const';
import { NestRpcExceptionFilter } from '../core';
import { NestRpcMethodOptions } from '../internal.types';

export function NestRpcMethod(methodName: string): MethodDecorator {
  return (proto: any, propertyName, descriptor) => {
    const options: NestRpcMethodOptions = {
      methodName,
      propertyName,
      methodFunc: proto[propertyName],
    };
    Reflect.defineMetadata(API_RPC_METHOD_OPTIONS_METADATA, options, proto[propertyName]);

    const useFiltersDecorator = UseFilters(new NestRpcExceptionFilter());
    useFiltersDecorator(proto, propertyName, descriptor);
  };
}
