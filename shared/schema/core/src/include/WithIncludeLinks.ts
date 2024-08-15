import { Include } from './Include';
import { IncludeLink } from './IncludeLink';

export type WithIncludeLinks<TInclude extends Include<any, any>> = { links: IncludeLink<TInclude>[] };
