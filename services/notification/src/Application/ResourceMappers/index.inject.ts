import { ModuleMetadata } from '@nestjs/common';

import { CommonResourceMapper } from './CommonResourceMapper';
import { NotificationConfigResourceMapper } from './NotificationConfigResourceMapper';
import { NotificationResourceMapper } from './NotificationResourceMapper';

export const RESOURCE_MAPPERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [CommonResourceMapper, NotificationResourceMapper, NotificationConfigResourceMapper];
