import { ModuleMetadata, Scope } from '@nestjs/common';

import { NOTIFICATION_REPOSITORY } from '../../../../Application';
import { NotificationRepository } from './NotificationRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const NOTIFICATION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: NotificationRepository,
    useClass: NotificationRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: NOTIFICATION_REPOSITORY,
    useExisting: NotificationRepository,
    scope: Scope.REQUEST,
  },
];
