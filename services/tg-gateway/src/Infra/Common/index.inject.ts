import { ModuleMetadata } from '@nestjs/common';
import { APP_INTERCEPTOR, DiscoveryService } from '@nestjs/core';
import { NestContextExplorer, NestContextInterceptor, NestContextManager } from '@packages/nestjs-request-context';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';

export const COMMON_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  NestShutdownRoot,
  DiscoveryService,
  NestContextManager,
  NestContextExplorer,
  { provide: APP_INTERCEPTOR, useClass: NestContextInterceptor },
];
