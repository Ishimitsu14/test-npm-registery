import { ModuleMetadata } from '@nestjs/common';

import { AuthController } from './AuthController';
import { SumsubController } from './SumsubController';
import { UserController } from './UserController';
import { UserRoleController } from './UserRoleController';

export const PRESENTATION_INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [AuthController, UserController, UserRoleController, SumsubController];
