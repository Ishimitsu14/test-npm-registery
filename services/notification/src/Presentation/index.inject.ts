import { ModuleMetadata } from '@nestjs/common';

import { NotificationConfigController, NotificationController, NotificationRequestController } from './Controllers';

export const PRESENTATION_INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [NotificationController, NotificationConfigController, NotificationRequestController];
