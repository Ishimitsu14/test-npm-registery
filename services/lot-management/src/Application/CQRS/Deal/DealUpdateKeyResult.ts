import { UseCase } from '@ddd/application';
import { NullableObject, VoidableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { DealNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberAsStringSchema, isNumberSchema, isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';
import { DealPK, IKeyResult, KeyResultStatus, Percent } from 'services/lot-management/src/Domain';

import { DEAL_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type DealUpdateKeyResultProps = LotManagementSchema.RPC.DTO.DealUpdateKeyResult.Payload;
export type DealUpdateKeyResultResult = LotManagementSchema.RPC.DTO.DealUpdateKeyResult.Result;

export class DealUpdateKeyResult implements UseCase<DealUpdateKeyResultProps, DealUpdateKeyResultResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: DealUpdateKeyResultProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
      agentCommissionKR: { status: [KeyResultStatus.validator()] },
      agentValidationKR: { status: [KeyResultStatus.validator()] },
      amlValidationKR: { status: [KeyResultStatus.validator()] },
      bidMakerValidationKR: { status: [KeyResultStatus.validator()] },
      documentOwnershipKR: { status: [KeyResultStatus.validator()] },
      documentResignedKR: { status: [KeyResultStatus.validator()] },
      kybValidationKR: { status: [KeyResultStatus.validator()] },
      kycValidationKR: { status: [KeyResultStatus.validator()] },
      marsbaseCommissionKR: {
        status: [KeyResultStatus.validator()],
        percent: [isNumberAsStringSchema],
      },
      offerMakerValidationKR: { status: [KeyResultStatus.validator()] },
      telegramChatKR: {
        status: [KeyResultStatus.validator()],
        url: [isStringWithValueSchema],
      },
      transactionPaymentKR: { status: [KeyResultStatus.validator()] },
    });
  }

  async execute(payload: DealUpdateKeyResultProps): Promise<DealUpdateKeyResultResult> {
    const uow = await this.uow();
    const dealRepository = await this.dealRepository();

    const deal = await dealRepository.get(DealPK.raw(payload.id));
    if (NullableObject.isEmpty(deal)) throw new DealNotFoundError(payload.id);

    deal.updateKeyResult((keyResults) => {
      if (VoidableObject.hasValue(payload.agentCommissionKR)) {
        keyResults = keyResults.updateAgentCommissionKR((kr) => {
          kr = this.updateKRStatus(payload.agentCommissionKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.agentValidationKR)) {
        keyResults = keyResults.updateAgentValidationKR((kr) => {
          kr = this.updateKRStatus(payload.agentValidationKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.amlValidationKR)) {
        keyResults = keyResults.updateAMLValidationKR((kr) => {
          kr = this.updateKRStatus(payload.amlValidationKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.bidMakerValidationKR)) {
        keyResults = keyResults.updateBidMakerValidationKR((kr) => {
          kr = this.updateKRStatus(payload.bidMakerValidationKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.documentOwnershipKR)) {
        keyResults = keyResults.updateDocumentOwnershipKR((kr) => {
          kr = this.updateKRStatus(payload.documentOwnershipKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.documentResignedKR)) {
        keyResults = keyResults.updateDocumentResignedKR((kr) => {
          kr = this.updateKRStatus(payload.documentResignedKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.kybValidationKR)) {
        keyResults = keyResults.updateKYBValidationKR((kr) => {
          kr = this.updateKRStatus(payload.kybValidationKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.kycValidationKR)) {
        keyResults = keyResults.updateKYCValidationKR((kr) => {
          kr = this.updateKRStatus(payload.kycValidationKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.marsbaseCommissionKR)) {
        keyResults = keyResults.updateMarsbaseCommissionKR((kr) => {
          kr = kr.updateCommission(Percent.fromFloat(payload.marsbaseCommissionKR.percent, Percent.TWO_DECIMALS));
          kr = this.updateKRStatus(payload.marsbaseCommissionKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.offerMakerValidationKR)) {
        keyResults = keyResults.updateOfferMakerValidationKR((kr) => {
          kr = this.updateKRStatus(payload.offerMakerValidationKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.telegramChatKR)) {
        keyResults = keyResults.updateTelegramChatKR((kr) => {
          kr = kr.updateURL(NullableObject(payload.telegramChatKR.url));
          kr = this.updateKRStatus(payload.telegramChatKR, kr);
          return kr;
        });
      }

      if (VoidableObject.hasValue(payload.transactionPaymentKR)) {
        keyResults = keyResults.updateTransactionPaymentKR((kr) => {
          kr = this.updateKRStatus(payload.transactionPaymentKR, kr);
          return kr;
        });
      }

      return keyResults;
    });
    dealRepository.update(deal);

    await uow.commit();
  }

  private updateKRStatus<T extends IKeyResult>(payload: LotManagementSchema.DealKeyResultUpdateBase<{}>, kr: T) {
    if (NullableObject.hasValue(payload.status)) {
      if (payload.status === 'PROCESS' || payload.status === 'NEW') {
        kr = kr.inProcess() as T;
      } else if (payload.status === 'COMPLETED') {
        kr = kr.complete() as T;
      } else if (payload.status === 'FAILED') {
        kr = kr.fail() as T;
      }
    }

    return kr as T;
  }
}
