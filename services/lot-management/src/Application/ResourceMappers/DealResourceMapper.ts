import { NullableObject } from '@ddd/core';
import { forwardRef, Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';

import { Deal, DealKeyResults, DealPK } from '../../Domain';
import { ActorResourceMapper } from './ActorResourceMapper';
import { AssetResourceMapper } from './AssetResourceMapper';
import { BidResourceMapper } from './BidResourceMapper';
import { CommonResourceMapper } from './CommonResourceMapper';
import { LotResourceMapper } from './LotResourceMapper';

export class DealResourceMapper {
  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  @Inject(ActorResourceMapper)
  private actorResourceMapper: ActorResourceMapper;

  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  @Inject(forwardRef(() => BidResourceMapper))
  private bidResourceMapper: BidResourceMapper;

  toDealKey(dealPK: DealPK): Required<LotManagementSchema.DealKey> {
    return {
      resource: 'deal_key',
      id: dealPK.id,
    };
  }

  toDeal(deal: Deal): Required<LotManagementSchema.Deal> {
    return {
      resource: 'deal',
      id: deal.primaryKey.id,

      status: deal.status.id,
      createdAt: +deal.createdAt,
      keyResults: this.toDealKeyResults(deal.keyResults),
      summary: deal.summary.value.toString(),
      units: NullableObject.mapUndefined(deal.units, (m) => m.value.toString()),
      price: NullableObject.mapUndefined(deal.price, (m) => m.value.toString()),
      fdv: NullableObject.mapUndefined(deal.fdv, (m) => m.value.toString()),

      bidKey: this.bidResourceMapper.toBidKey(deal.bidPK),
      offerMakers: deal.offerMakers.items.map((item) => this.actorResourceMapper.toOfferMakerKey(item)),
      bidMakers: deal.bidMakers.items.map((item) => this.actorResourceMapper.toBidMakerKey(item)),
    };
  }

  toDealKeyResults(value: DealKeyResults): LotManagementSchema.DealKeyResults {
    return {
      agentCommissionKR: { status: value.state.agentCommissionKR.status.id, type: 'AGENT_COMMISSION' },
      agentValidationKR: { status: value.state.agentValidationKR.status.id, type: 'AGENT_VALIDATION' },
      amlValidationKR: { status: value.state.amlValidationKR.status.id, type: 'AML_VALIDATION' },
      bidMakerValidationKR: { status: value.state.bidMakerValidationKR.status.id, type: 'BID_MAKER_VALIDATION' },
      documentOwnershipKR: { status: value.state.documentOwnershipKR.status.id, type: 'DOCUMENT_OWNERSHIP' },
      documentResignedKR: { status: value.state.documentResignedKR.status.id, type: 'DOCUMENT_RESIGNED' },
      kybValidationKR: { status: value.state.kybValidationKR.status.id, type: 'KYB_VALIDATION' },
      kycValidationKR: { status: value.state.kycValidationKR.status.id, type: 'KYC_VALIDATION' },
      marsbaseCommissionKR: {
        status: value.state.marsbaseCommissionKR.status.id,
        type: 'MARSBASE_COMMISSION',
        percent: value.state.marsbaseCommissionKR.state.percent.value.toString(),
      },
      offerMakerValidationKR: { status: value.state.offerMakerValidationKR.status.id, type: 'OFFER_MAKER_VALIDATION' },
      telegramChatKR: {
        status: value.state.telegramChatKR.status.id,
        type: 'TELEGRAM_CHAT',
        url: NullableObject.mapUndefined(value.state.telegramChatKR.state.url),
      },
      transactionPaymentKR: { status: value.state.transactionPaymentKR.status.id, type: 'TRANSACTION_PAYMENT' },
    };
  }
}
