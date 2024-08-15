import { ValueObjectAtomicValue } from '../ValueObject';
import { StateObject } from './StateObject';

export class StateObjectDTO<State extends ValueObjectAtomicValue> extends StateObject<State> {
  public constructor(state: State) {
    super();

    this.initState(state);
  }
}
