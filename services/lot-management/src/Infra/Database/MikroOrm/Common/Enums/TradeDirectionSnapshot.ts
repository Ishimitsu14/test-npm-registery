import { EnumSnapshot } from '@shared/db';

import { TradeDirection } from '../../../../../Domain';

export type TradeDirectionSnapshot = EnumSnapshot<TradeDirection>;
export const TradeDirectionSnapshot = EnumSnapshot(TradeDirection);
