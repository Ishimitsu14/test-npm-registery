import { EnumSnapshot } from '@shared/db';

import { Country } from '../../Domain';

export type CountrySnapshot = EnumSnapshot<Country>;
export const CountrySnapshot = EnumSnapshot(Country);
