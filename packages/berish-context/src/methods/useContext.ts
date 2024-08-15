import { Context } from '../Context';

export function useContext<Value>(context: Context<Value>) {
  return context.getValue();
}
