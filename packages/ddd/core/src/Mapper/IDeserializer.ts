export interface IDeserializer<Income, Outcome> {
  deserialize(income: Income): Outcome;
}
