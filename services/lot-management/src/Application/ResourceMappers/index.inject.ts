import { ModuleMetadata } from '@nestjs/common';
import { CoreResourceMapper } from '@shared/common-internal';

import { ActorResourceMapper } from './ActorResourceMapper';
import { AssetFaqResourceMapper } from './AssetFaqResourceMapper';
import { AssetResourceMapper } from './AssetResourceMapper';
import { BidResourceMapper } from './BidResourceMapper';
import { CommonResourceMapper } from './CommonResourceMapper';
import { DealResourceMapper } from './DealResourceMapper';
import { FavoriteLotResourceMapper } from './FavoriteLotResourceMapper';
import { FileResourceMapper } from './FileResourceMapper';
import { LotBadgeResourceMapper } from './LotBadgeResourceMapper';
import { LotQuestionResourceMapper } from './LotQuestionResourceMapper';
import { LotResourceMapper } from './LotResourceMapper';

export const RESOURCE_MAPPERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ActorResourceMapper,
  AssetResourceMapper,
  BidResourceMapper,
  DealResourceMapper,
  FileResourceMapper,
  CoreResourceMapper,
  CommonResourceMapper,
  LotResourceMapper,
  LotQuestionResourceMapper,
  FavoriteLotResourceMapper,
  AssetFaqResourceMapper,
  LotBadgeResourceMapper,
];
