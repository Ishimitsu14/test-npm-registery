import { ForwardReference, InjectionToken } from '@nestjs/common';

import { INJECT_CONTEXT_METADATA } from '../const';
import { InjectContextMetadata } from '../types';

export function InjectContext(token?: InjectionToken | ForwardReference): (target: object, key: string | symbol) => void {
  return (target, key) => {
    token = token || Reflect.getMetadata('design:type', target, key);

    let properties: InjectContextMetadata[] = Reflect.getMetadata(INJECT_CONTEXT_METADATA, target.constructor) || [];

    properties = [...properties, { key, token }];
    Reflect.defineMetadata(INJECT_CONTEXT_METADATA, properties, target.constructor);
  };
}

export type InjectContext<T> = () => Promise<T>;
