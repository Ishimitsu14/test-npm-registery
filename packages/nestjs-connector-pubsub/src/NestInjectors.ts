import { ModuleMetadata } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { NestPubsubExplorer } from './NestPubsubExplorer';
import { NestPubsubMetadataHelper } from './NestPubsubMetadataHelper';
import { NestPubsubRegistrator } from './NestPubsubRegistrator';

export const NestPubsubModuleImports: ModuleMetadata['imports'] = [DiscoveryModule];
export const NestPubsubModuleProviders: ModuleMetadata['providers'] = [NestPubsubExplorer, NestPubsubMetadataHelper, NestPubsubRegistrator];
