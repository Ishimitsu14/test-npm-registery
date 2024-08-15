import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { CommonSchema, LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { Country } from '@shared/common-internal';
import { isEnumSchema, isNumberAsStringSchema, isNumberSchema, isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { Bid, BidMakerPK, InvestorType, LotPK, MediatorType, Precision, Price, StablecoinQuantity, Telegram, UnitQuantity } from '../../../Domain';
import { BID_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { BidResourceMapper } from '../../ResourceMappers';

export type BidCreateProps = LotManagementSchema.RPC.DTO.BidCreate.Payload;
export type BidCreateResult = LotManagementSchema.RPC.DTO.BidCreate.Result;

export class BidCreate implements UseCase<BidCreateProps, BidCreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(BidResourceMapper)
  private bidResourceMapper: BidResourceMapper;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: BidCreateProps): Promise<void> {
    validateRoot(payload, {
      lot: [isRequiredSchema, isNumberSchema],
      bidMaker: [isRequiredSchema, isStringWithValueSchema],
      bidMakerType: [isRequiredSchema, isEnumSchema(LotManagementSchema.InvestorType)],
      location: [isRequiredSchema, isEnumSchema(CommonSchema.Country)],
      readyForVerification: [isRequiredSchema],
      telegram: [isRequiredSchema, isStringWithValueSchema],
      isDirect: [isRequiredSchema],
      deadline: [isNumberSchema],
      summary: [isRequiredSchema, isNumberAsStringSchema],
      units: [isNumberAsStringSchema],
      price: [isNumberAsStringSchema],
      fdv: [isRequiredSchema, isNumberAsStringSchema],
    });
  }

  async execute(payload: BidCreateProps): Promise<BidCreateResult> {
    const uow = await this.uow();
    const lotRepository = await this.lotRepository();
    const bidRepository = await this.bidRepository();

    const lotPK = new LotPK(payload.lot);
    const lot = await lotRepository.get(lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.lot);

    const bidPK = await bidRepository.nextPK();
    const bidMaker = BidMakerPK.create(payload.bidMaker);

    const bidMakerType = InvestorType.getById(payload.bidMakerType);
    const location = Country.getById(payload.location);
    const readyForVerification = !!payload.readyForVerification;
    const deadline = NullableObject.map(payload.deadline, (m) => new Date(m));

    const telegram = Telegram.fromString(payload.telegram);
    const mediatorType = payload.isDirect ? MediatorType.DIRECT : MediatorType.OTC_AGENT;

    const summary = StablecoinQuantity.fromNumber(payload.summary);
    const units = NullableObject.map(payload.units, (m) => UnitQuantity.fromNumber(m, Precision.DYNAMIC));
    const price = NullableObject.map(payload.price, (m) => Price.fromNumber(m, Precision.DYNAMIC));
    const fdv = StablecoinQuantity.fromNumber(payload.fdv);

    const bid = Bid.createNewFromLot(bidPK, lot, bidMaker, bidMakerType, mediatorType, location, readyForVerification, telegram, deadline, summary, units, price, fdv);

    bidRepository.add(bid);
    await uow.commit();

    return this.bidResourceMapper.toBidKey(bid.primaryKey);
  }
}
