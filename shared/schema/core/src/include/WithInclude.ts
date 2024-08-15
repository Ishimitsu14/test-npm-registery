import { Include } from './Include';

export type WithInclude<TInclude extends Include<any, any>> = { include?: TInclude };
