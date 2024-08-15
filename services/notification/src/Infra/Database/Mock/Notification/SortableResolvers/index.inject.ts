import { ModuleMetadata } from '@nestjs/common';

import { NotificationCreatedAtSortableResolver } from './NotificationCreatedAtSortableResolver';
import { NotificationIsReadedSortableResolver } from './NotificationIsReadedSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [NotificationIsReadedSortableResolver, NotificationCreatedAtSortableResolver];
