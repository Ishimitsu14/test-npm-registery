import { ModuleMetadata } from '@nestjs/common';

import { AuthController } from './AuthController';
import { AuthWizardTelegramController } from './AuthWizardTelegramController';
import { TelegramController } from './TelegramController';

export const PRESENTATION_INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [AuthController];
export const PRESENTATION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [TelegramController, AuthWizardTelegramController];
