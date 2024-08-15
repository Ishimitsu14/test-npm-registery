import { ModuleMetadata } from '@nestjs/common';

import { NotificationRequestByTypeSpecificationResolver } from './NotificationRequestByTypeSpecificationResolver';
import { NotificationRequestMatchesNotificationSpecificationResolver } from './NotificationRequestMatchesNotificationSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [NotificationRequestByTypeSpecificationResolver, NotificationRequestMatchesNotificationSpecificationResolver];
