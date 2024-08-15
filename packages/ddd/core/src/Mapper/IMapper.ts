import { IDeserializer } from './IDeserializer';
import { ISerializer } from './ISerializer';

export interface IMapper<Income, Outcome> extends ISerializer<Income, Outcome>, IDeserializer<Outcome, Income> {}
