import { ModuleMetadata } from '@nestjs/common';

import { AccountController } from './AccountController';
import { AssetController } from './AssetController';
import { AssetFaqController } from './AssetFaqController';
import { AuthController } from './AuthController';
import { BidController } from './BidController';
import { DealController } from './DealController';
import { FeedbackController } from './FeedbackController';
import { LotBadgeController } from './LotBadgeController';
import { LotController } from './LotController';
import { LotQustionController } from './LotQustionController';
import { NoteController } from './NoteController';
import { NotificationController } from './NotificationController';
import { SystemController } from './SystemController';
import { UserController } from './UserController';
import { UserRoleController } from './UserRoleController';

export const INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [
  AccountController,
  AssetController,
  DealController,
  AuthController,
  BidController,
  LotController,
  SystemController,
  UserController,
  UserRoleController,
  NoteController,
  NotificationController,
  FeedbackController,
  LotQustionController,
  AssetFaqController,
  LotBadgeController,
];
