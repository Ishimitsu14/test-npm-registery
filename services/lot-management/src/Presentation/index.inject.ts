import { ModuleMetadata } from '@nestjs/common';

import { AssetController } from './AssetController';
import { AssetFaqController } from './AssetFaqController';
import { BidController } from './BidController';
import { DealController } from './DealController';
import { FavoriteLotController } from './FavoriteLotController';
import { LotBadgeController } from './LotBadgeController';
import { LotController } from './LotController';
import { LotQuestionController } from './LotQuestionController';
import { ViewLotController } from './ViewLotController';

export const PRESENTATION_INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [
  AssetController,
  LotController,
  BidController,
  DealController,
  FavoriteLotController,
  LotQuestionController,
  AssetFaqController,
  ViewLotController,
  LotBadgeController,
];
