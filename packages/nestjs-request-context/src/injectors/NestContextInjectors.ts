import { ModuleMetadata } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { NestContextExplorer, NestContextManager } from '../core';
import { NestContextInterceptor } from './NestContextInterceptor';

export const NestContextInjectors: ModuleMetadata['providers'] = [{ provide: APP_INTERCEPTOR, useClass: NestContextInterceptor }, NestContextManager, NestContextExplorer];
