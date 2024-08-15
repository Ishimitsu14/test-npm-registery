import { ModuleMetadata, Scope } from '@nestjs/common';

import { NOTIFICATION_REQUEST_REPOSITORY } from '../../../../Application';
import { NotificationRequestRepository } from './NotificationRequestRepository';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const NOTIFICATION_REQUEST_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: NotificationRequestRepository,
    useClass: NotificationRequestRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: NOTIFICATION_REQUEST_REPOSITORY,
    useExisting: NotificationRequestRepository,
    scope: Scope.REQUEST,
  },
];
