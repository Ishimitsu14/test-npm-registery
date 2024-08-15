import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

import { Percent } from './Percent';
import { StablecoinQuantity } from './StablecoinQuantity';

export class ContractShare extends ValueObject {
  static fromFDVAndShare(fdv: StablecoinQuantity, share: Percent) {
    const contractValue = fdv.mul(share);
    return new ContractShare(fdv, contractValue, share);
  }

  static fromContractValueAndShare(contractValue: StablecoinQuantity, share: Percent) {
    const fdv = contractValue.div(share);
    return new ContractShare(fdv, contractValue, share);
  }

  static fromFDVAndContractValue(fdv: StablecoinQuantity, contractValue: StablecoinQuantity) {
    const share = Percent.fromTwoValues(fdv.value, contractValue.value, Percent.TWO_DECIMALS);
    return new ContractShare(fdv, contractValue, share);
  }

  private constructor(
    readonly fdv: StablecoinQuantity,
    readonly contractValue: StablecoinQuantity,
    readonly share: Percent,
  ) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.fdv, this.contractValue, this.share];
  }
}
