import { ForwardReference, InjectionToken } from '@nestjs/common';

export interface InjectContextMetadata {
  key: string | symbol;
  token: InjectionToken | ForwardReference<() => InjectionToken>;
}

export interface InjectNestMetadata {
  key: string | symbol;
  type: InjectionToken | ForwardReference<() => InjectionToken>;
}
