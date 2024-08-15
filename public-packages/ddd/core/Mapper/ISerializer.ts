export interface ISerializer<Income, Outcome> {
  serialize(income: Income): Outcome;
}
