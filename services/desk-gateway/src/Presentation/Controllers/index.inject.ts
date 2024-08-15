import { ModuleMetadata } from '@nestjs/common';

import { AccountController } from './AccountController';
import { AssetController } from './AssetController';
import { AssetFaqController } from './AssetFaqController';
import { AuthController } from './AuthController';
import { BidController } from './BidController';
import { DealController } from './DealController';
import { FavoriteLotController } from './FavoriteLotController';
import { FeedbackController } from './FeedbackController';
import { FileController } from './FileController';
import { LotController } from './LotController';
import { LotQustionController } from './LotQustionController';
import { NotificationConfigController } from './NotificationConfigController';
import { NotificationController } from './NotificationController';
import { SumsubController } from './SumsubController';
import { SumsubWebhooksController } from './SumsubWebhooksController';
import { SystemController } from './SystemController';
import { UserController } from './UserController';
import { ViewLotController } from './ViewLotController';

export const INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [
  AccountController,
  AssetController,
  DealController,
  AuthController,
  BidController,
  LotController,
  SystemController,
  UserController,
  NotificationConfigController,
  NotificationController,
  FavoriteLotController,
  FileController,
  FeedbackController,
  SumsubController,
  SumsubWebhooksController,
  LotQustionController,
  AssetFaqController,
  ViewLotController,
];
