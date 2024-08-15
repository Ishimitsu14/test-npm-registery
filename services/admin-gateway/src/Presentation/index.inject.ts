import { ModuleMetadata } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { INJECT_CONTROLLERS } from './Controllers';
import { AuthLoaderInterceptor } from './Interceptors';

export const PRESENTATION_INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [...INJECT_CONTROLLERS];
export const PRESENTATION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [{ provide: APP_INTERCEPTOR, useClass: AuthLoaderInterceptor }];
