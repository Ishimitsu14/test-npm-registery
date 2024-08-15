import { IEnumeration } from './IEnumeration';

export type EnumerationID<T extends IEnumeration<any>> = T['id'];
