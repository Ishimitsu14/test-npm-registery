export const TradeDirection = ['BUY', 'SELL'] as const;
export type TradeDirection = (typeof TradeDirection)[number];
