import LINQ from '@berish/linq';
import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { faker } from '@faker-js/faker';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { SeedUtils } from '@shared/db';

import { LOT_REPOSITORY_INJECT_TOKEN, LotCreate, LotMakeActive, LotSendOnModeration } from '../../Application';
import { Bid, Lot } from '../../Domain';
import { ActorSeed } from './ActorSeed';
import { AssetSeed } from './AssetSeed';

export class LotSeed {
  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  @Inject(ActorSeed)
  private actorSeed: ActorSeed;

  @Inject(AssetSeed)
  private assetSeed: AssetSeed;

  @Inject(LotCreate)
  private lotCreate: LotCreate;

  @Inject(LotSendOnModeration)
  private lotSendOnModeration: LotSendOnModeration;

  @Inject(LotMakeActive)
  private lotMakeActive: LotMakeActive;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private readonly lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async createDemo() {
    const activeLotsProps = await Promise.all([this.createTWSell(), this.createTWBuy(), this.createSAFTSell(), this.createSAFTBuy(), this.createSAFESell(), this.createSAFEBuy()]).then((data) =>
      LINQ.from(data)
        .selectMany((m) => m)
        .toArray(),
    );
    await this.createActiveLots(activeLotsProps);
  }

  async createTWBuy(): Promise<LotManagementSchema.RPC.DTO.LotCreate.Payload[]> {
    // COMMON_UNITS = (COMMON_SUMMARY / INVEST_DOC_FDV) * 10000
    // COMMON_PRICE = COMMON_SUMMARY / COMMON_UNITS
    // COMMON_MIN_FILTER_UNITS = (COMMON_MIN_FILTER_SUMMARY / INVEST_DOC_FDV) * 10000

    const offerMaker = await this.actorSeed.getDemoOfferMaker().then((m) => m.userId);
    return [
      {
        offerMaker,
        type: 'TOKEN_WARRANT',
        inputs: {
          COMMON_DIRECTION: 'BUY',
          COMMON_BADGE: 'VIP',
          INVEST_DOC_ASSET_PK: 'layer_zero',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'PRIVATE_INVESTOR',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'crazycattoday',
          INVEST_DOC_FDV: '3000000000',
          COMMON_SUMMARY: '300000',
          COMMON_UNITS: '1',
          COMMON_PRICE: '300000',
          COMMON_MIN_FILTER_SUMMARY: '50000',
          COMMON_MIN_FILTER_UNITS: '0.1666666667',
          INVEST_DOC_REASSIGNMENT_TYPE: 'SPV',
        },
      },
      {
        offerMaker,
        type: 'TOKEN_WARRANT',
        inputs: {
          COMMON_DIRECTION: 'BUY',
          INVEST_DOC_ASSET_PK: 'layer_zero',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'PRIVATE_INVESTOR',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'olegmigu',
          INVEST_DOC_FDV: '3000000000',
          COMMON_SUMMARY: '200000',
          COMMON_UNITS: '0.6666666667',
          COMMON_PRICE: '300000',
          COMMON_MIN_FILTER_SUMMARY: '20000',
          COMMON_MIN_FILTER_UNITS: '0.06666666667',
          INVEST_DOC_REASSIGNMENT_TYPE: 'SPV',
        },
      },
      {
        offerMaker,
        type: 'TOKEN_WARRANT',
        inputs: {
          COMMON_DIRECTION: 'BUY',

          INVEST_DOC_ASSET_PK: 'layer_zero',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'PRIVATE_INVESTOR',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'olegmigu',
          INVEST_DOC_FDV: '2400000000',
          COMMON_SUMMARY: '250000',
          COMMON_UNITS: '1.041666667',
          COMMON_PRICE: '240000',
          COMMON_MIN_FILTER_SUMMARY: '25000',
          COMMON_MIN_FILTER_UNITS: '0.1041666667',
          INVEST_DOC_REASSIGNMENT_TYPE: 'DIRECT',
        },
      },
    ];
  }

  async createTWSell(): Promise<LotManagementSchema.RPC.DTO.LotCreate.Payload[]> {
    // INVEST_DOC_ROUND_UNITS = (INVEST_DOC_ROUND_SUMMARY / INVEST_DOC_ROUND_FDV) * 10000
    // INVEST_DOC_ROUND_PRICE = INVEST_DOC_ROUND_SUMMARY / INVEST_DOC_ROUND_UNITS
    // COMMON_UNITS = (COMMON_SUMMARY / INVEST_DOC_FDV) * 10000
    // COMMON_PRICE = COMMON_SUMMARY / COMMON_UNITS
    // COMMON_MIN_FILTER_UNITS = (COMMON_MIN_FILTER_SUMMARY / INVEST_DOC_FDV) * 10000

    const offerMaker = await this.actorSeed.getDemoOfferMaker().then((m) => m.userId);

    return [
      {
        offerMaker,
        type: 'TOKEN_WARRANT',
        inputs: {
          COMMON_DIRECTION: 'SELL',

          INVEST_DOC_ASSET_PK: 'layer_zero',
          COMMON_DEADLINE: this.seedUtils.parseDate('31.09.2023').valueOf(),
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'OTC_AGENT',
          COMMON_TELEGRAM: 'dobro0o',

          INVEST_DOC_ROUND_TYPE: 'ROUND_A',

          TOKEN_TGE: 'TBD',
          TOKEN_LOCKUP_PERIOD: '1 year',
          TOKEN_VESTING_PERIOD: '2 year',

          INVEST_DOC_ROUND_FDV: '1000000000',
          INVEST_DOC_ROUND_SUMMARY: '333000',
          INVEST_DOC_ROUND_UNITS: '3.33',
          INVEST_DOC_ROUND_PRICE: '100000',

          INVEST_DOC_FDV: '3000000000',
          COMMON_SUMMARY: '1000000',
          COMMON_UNITS: '3.333333333',
          COMMON_PRICE: '300000',
          COMMON_MIN_FILTER_SUMMARY: '250000',
          COMMON_MIN_FILTER_UNITS: '0.8333333333',
          INVEST_DOC_REASSIGNMENT_TYPE: 'FORWARD_CONTRACT',
        },
      },
    ];
  }

  async createSAFEBuy(): Promise<LotManagementSchema.RPC.DTO.LotCreate.Payload[]> {
    // COMMON_UNITS = (COMMON_SUMMARY / INVEST_DOC_FDV) * 10000
    // COMMON_PRICE = COMMON_SUMMARY / COMMON_UNITS
    // COMMON_MIN_FILTER_UNITS = (COMMON_MIN_FILTER_SUMMARY / INVEST_DOC_FDV) * 10000

    const offerMaker = await this.actorSeed.getDemoOfferMaker().then((m) => m.userId);

    return [
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'BUY',

          INVEST_DOC_ASSET_PK: 'aleo',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'uchihaichizoku',
          INVEST_DOC_FDV: '800000000',
          COMMON_SUMMARY: '500000',
          COMMON_UNITS: '6.25',
          COMMON_PRICE: '80000',
          COMMON_MIN_FILTER_SUMMARY: '500000',
          COMMON_MIN_FILTER_UNITS: '6.25',
          INVEST_DOC_REASSIGNMENT_TYPE: 'FORWARD_CONTRACT',
        },
      },
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'BUY',

          INVEST_DOC_ASSET_PK: 'eigenlayer',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'yildirimesad',
          INVEST_DOC_FDV: '1500000000',
          COMMON_SUMMARY: '500000',
          COMMON_UNITS: '3.333333333',
          COMMON_PRICE: '150000',
          COMMON_MIN_FILTER_SUMMARY: '500000',
          COMMON_MIN_FILTER_UNITS: '3.333333333',
          INVEST_DOC_REASSIGNMENT_TYPE: 'DIRECT',
        },
      },
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'BUY',

          INVEST_DOC_ASSET_PK: 'ripple',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'r_m_evdokimov',
          INVEST_DOC_FDV: '3500000000',
          COMMON_SUMMARY: '300000',
          COMMON_UNITS: '0.8571428571',
          COMMON_PRICE: '350000',
          COMMON_MIN_FILTER_SUMMARY: '300000',
          COMMON_MIN_FILTER_UNITS: '0.8571428571',
          INVEST_DOC_REASSIGNMENT_TYPE: 'SPV',
        },
      },
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'BUY',

          INVEST_DOC_ASSET_PK: 'starkware',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'crazycattoday',
          INVEST_DOC_FDV: '2500000000',
          COMMON_SUMMARY: '200000',
          COMMON_UNITS: '0.8',
          COMMON_PRICE: '250000',
          COMMON_MIN_FILTER_SUMMARY: '50000',
          COMMON_MIN_FILTER_UNITS: '0.2',
          INVEST_DOC_REASSIGNMENT_TYPE: 'FORWARD_CONTRACT',
        },
      },
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'BUY',

          INVEST_DOC_ASSET_PK: 'hyperlane',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'jjlay',
          INVEST_DOC_FDV: '2000000000',
          COMMON_SUMMARY: '500000',
          COMMON_UNITS: '2.5',
          COMMON_PRICE: '200000',
          COMMON_MIN_FILTER_SUMMARY: '500000',
          COMMON_MIN_FILTER_UNITS: '2.5',
          INVEST_DOC_REASSIGNMENT_TYPE: 'FORWARD_CONTRACT',
        },
      },
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'BUY',

          INVEST_DOC_ASSET_PK: 'flashbots',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'uchihaichizoku',
          INVEST_DOC_FDV: '500000000',
          COMMON_SUMMARY: '500000',
          COMMON_UNITS: '10',
          COMMON_PRICE: '50000',
          COMMON_MIN_FILTER_SUMMARY: '500000',
          COMMON_MIN_FILTER_UNITS: '10',
          INVEST_DOC_REASSIGNMENT_TYPE: 'DIRECT',
        },
      },
    ];
  }

  async createSAFESell(): Promise<LotManagementSchema.RPC.DTO.LotCreate.Payload[]> {
    // INVEST_DOC_ROUND_UNITS = (INVEST_DOC_ROUND_SUMMARY / INVEST_DOC_ROUND_FDV) * 10000
    // INVEST_DOC_ROUND_PRICE = INVEST_DOC_ROUND_SUMMARY / INVEST_DOC_ROUND_UNITS
    // COMMON_UNITS = (COMMON_SUMMARY / INVEST_DOC_FDV) * 10000
    // COMMON_PRICE = COMMON_SUMMARY / COMMON_UNITS
    // COMMON_MIN_FILTER_UNITS = (COMMON_MIN_FILTER_SUMMARY / INVEST_DOC_FDV) * 10000

    const offerMaker = await this.actorSeed.getDemoOfferMaker().then((m) => m.userId);

    return [
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'SELL',

          INVEST_DOC_ASSET_PK: 'ledger',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'PRIVATE_INVESTOR',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'isaev_vc',

          INVEST_DOC_ROUND_TYPE: 'ROUND_A',

          INVEST_DOC_ROUND_FDV: '1400000000',
          INVEST_DOC_ROUND_SUMMARY: '49000',
          INVEST_DOC_ROUND_UNITS: '0.35',
          INVEST_DOC_ROUND_PRICE: '140000',

          INVEST_DOC_FDV: '1930000000',
          COMMON_SUMMARY: '50000',
          COMMON_UNITS: '0.2590673575',
          COMMON_PRICE: '193000',
          COMMON_MIN_FILTER_SUMMARY: '10000',
          COMMON_MIN_FILTER_UNITS: '0.0518134715',
          INVEST_DOC_REASSIGNMENT_TYPE: 'FORWARD_CONTRACT',
        },
      },
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'SELL',

          INVEST_DOC_ASSET_PK: 'aleo',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'MonsieurMAX',

          INVEST_DOC_ROUND_TYPE: 'ROUND_A',

          INVEST_DOC_ROUND_FDV: '500000000',
          INVEST_DOC_ROUND_SUMMARY: '312000',
          INVEST_DOC_ROUND_UNITS: '6.24',
          INVEST_DOC_ROUND_PRICE: '50000',

          INVEST_DOC_FDV: '2000000000',
          COMMON_SUMMARY: '1000000',
          COMMON_UNITS: '5',
          COMMON_PRICE: '200000',
          COMMON_MIN_FILTER_SUMMARY: '1000000',
          COMMON_MIN_FILTER_UNITS: '5',
          INVEST_DOC_REASSIGNMENT_TYPE: 'DIRECT',
        },
      },
      {
        offerMaker,
        type: 'SAFE',
        inputs: {
          COMMON_DIRECTION: 'SELL',

          INVEST_DOC_ASSET_PK: 'zksync',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'PRIVATE_INVESTOR',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'isaev_vc',

          INVEST_DOC_ROUND_TYPE: 'ROUND_A',

          INVEST_DOC_ROUND_FDV: '500000000',
          INVEST_DOC_ROUND_SUMMARY: '150000',
          INVEST_DOC_ROUND_UNITS: '3',
          INVEST_DOC_ROUND_PRICE: '50000',

          INVEST_DOC_FDV: '3250000000',
          COMMON_SUMMARY: '1000000',
          COMMON_UNITS: '3.076923077',
          COMMON_PRICE: '325000',
          COMMON_MIN_FILTER_SUMMARY: '1000000',
          COMMON_MIN_FILTER_UNITS: '3.076923077',
          INVEST_DOC_REASSIGNMENT_TYPE: 'SPV',
        },
      },
    ];
  }

  async createSAFTBuy(): Promise<LotManagementSchema.RPC.DTO.LotCreate.Payload[]> {
    const offerMaker = await this.actorSeed.getDemoOfferMaker().then((m) => m.userId);

    return [
      {
        offerMaker,
        type: 'SAFT',
        inputs: {
          COMMON_DIRECTION: 'BUY',

          INVEST_DOC_ASSET_PK: 'manta_network',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          INVEST_DOC_REASSIGNMENT_TYPE: 'DIRECT',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'vladislabshad',
          INVEST_DOC_FDV: '400000000',
          COMMON_SUMMARY: '100000',
          COMMON_UNITS: '250000',
          COMMON_PRICE: '0.4',
          COMMON_MIN_FILTER_UNITS: '250000',
          COMMON_MIN_FILTER_SUMMARY: '100000',
        },
      },
    ];
  }

  async createSAFTSell(): Promise<LotManagementSchema.RPC.DTO.LotCreate.Payload[]> {
    // INVEST_DOC_ROUND_PRICE = INVEST_DOC_ROUND_SUMMARY / INVEST_DOC_ROUND_UNITS
    // COMMON_PRICE = COMMON_SUMMARY / COMMON_UNITS
    // COMMON_MIN_FILTER_UNITS = (COMMON_MIN_FILTER_SUMMARY / INVEST_DOC_FDV) * 10000
    const offerMaker = await this.actorSeed.getDemoOfferMaker().then((m) => m.userId);

    return [
      {
        offerMaker,
        type: 'SAFT',
        inputs: {
          COMMON_DIRECTION: 'SELL',

          INVEST_DOC_ASSET_PK: 'manta_network',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'scoinaldo',

          INVEST_DOC_ROUND_TYPE: 'FUNDING_ROUND',
          TOKEN_TGE: 'TBD',
          TOKEN_LOCKUP_PERIOD: '5 month',
          TOKEN_VESTING_PERIOD: '31 month',
          INVEST_DOC_ROUND_FDV: '25000000',
          INVEST_DOC_ROUND_SUMMARY: '50000',
          INVEST_DOC_ROUND_UNITS: '2000000',
          INVEST_DOC_ROUND_PRICE: '0.025',
          INVEST_DOC_REASSIGNMENT_TYPE: 'DIRECT',
          INVEST_DOC_FDV: '500000000',
          COMMON_SUMMARY: '1000000',
          COMMON_UNITS: '2000000',
          COMMON_PRICE: '0.5',
          COMMON_MIN_FILTER_SUMMARY: '250000',
          COMMON_MIN_FILTER_UNITS: '500000',
        },
      },
      {
        offerMaker,
        type: 'SAFT',
        inputs: {
          COMMON_DIRECTION: 'SELL',

          INVEST_DOC_ASSET_PK: 'angelic',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'scoinaldo',

          TOKEN_TGE: 'TBD',
          TOKEN_LOCKUP_PERIOD: '6 month',
          TOKEN_VESTING_PERIOD: '20 month',

          INVEST_DOC_ROUND_TYPE: 'FUNDING_ROUND',
          INVEST_DOC_ROUND_FDV: '50000000',
          INVEST_DOC_ROUND_SUMMARY: '50000',
          INVEST_DOC_ROUND_UNITS: '1000000',
          INVEST_DOC_ROUND_PRICE: '0.05000',

          INVEST_DOC_FDV: '85000000',
          COMMON_SUMMARY: '85000',
          COMMON_UNITS: '1000000',
          COMMON_PRICE: '0.085',
          COMMON_MIN_FILTER_SUMMARY: '85000',
          COMMON_MIN_FILTER_UNITS: '1000000',
          INVEST_DOC_REASSIGNMENT_TYPE: 'FORWARD_CONTRACT',
        },
      },
      {
        offerMaker,
        type: 'SAFT',
        inputs: {
          COMMON_DIRECTION: 'SELL',

          INVEST_DOC_ASSET_PK: 'xdao',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'akosmach',

          INVEST_DOC_ROUND_TYPE: 'SEED',
          TOKEN_TGE: this.seedUtils.parseDate('30.11.2022').valueOf(),
          TOKEN_LOCKUP_PERIOD: '1 month',
          TOKEN_VESTING_PERIOD: '36 month',
          INVEST_DOC_ROUND_FDV: '50000000',
          INVEST_DOC_ROUND_SUMMARY: '150000',
          INVEST_DOC_ROUND_UNITS: '2444444',
          INVEST_DOC_ROUND_PRICE: '0.06136',

          INVEST_DOC_FDV: '300000000',
          COMMON_SUMMARY: '850000',
          COMMON_UNITS: '2444444',
          COMMON_PRICE: '0.348',
          COMMON_MIN_FILTER_SUMMARY: '150000',
          COMMON_MIN_FILTER_UNITS: '428571',
          INVEST_DOC_REASSIGNMENT_TYPE: 'SPV',
        },
      },
      {
        offerMaker,
        type: 'SAFT',
        inputs: {
          COMMON_DIRECTION: 'SELL',

          INVEST_DOC_ASSET_PK: 'unicoin',
          COMMON_DEADLINE: null,
          COMMON_OFFER_MAKER_TYPES: 'VENTURE_FUND',
          COMMON_BID_MAKER_TYPES: null,
          COMMON_MEDIATOR: 'DIRECT',
          COMMON_TELEGRAM: 'UranoKapitalGZ',

          INVEST_DOC_ROUND_TYPE: 'FUNDING_ROUND',
          TOKEN_TGE: 'TBD',
          TOKEN_LOCKUP_PERIOD: '0 month',
          TOKEN_VESTING_PERIOD: '12 month',
          INVEST_DOC_ROUND_FDV: '1000000000',
          INVEST_DOC_ROUND_SUMMARY: '8000',
          INVEST_DOC_ROUND_UNITS: '200000',
          INVEST_DOC_ROUND_PRICE: '0.04000',

          INVEST_DOC_FDV: '125000000000',
          COMMON_SUMMARY: '100000',
          COMMON_UNITS: '200000',
          COMMON_PRICE: '0.5',
          COMMON_MIN_FILTER_SUMMARY: '12500',
          COMMON_MIN_FILTER_UNITS: '25000',
          INVEST_DOC_REASSIGNMENT_TYPE: 'FORWARD_CONTRACT',
        },
      },
    ];
  }

  async createDraftLots(props: LotManagementSchema.RPC.DTO.LotCreate.Payload[]) {
    return Promise.all(
      props.map((props) =>
        this.seedUtils.newRequest('lot.createDraftLot', async () => {
          await this.lotCreate.validate(props);
          return await this.lotCreate.execute(props);
        }),
      ),
    );
  }

  async createActiveLots(props: LotManagementSchema.RPC.DTO.LotCreate.Payload[]) {
    return Promise.all(
      props.slice(0, 5).map((props) =>
        this.seedUtils.newRequest('lot.createActiveLot', async () => {
          await this.lotCreate.validate(props);
          const lotKey = await this.lotCreate.execute(props);

          await this.lotSendOnModeration.execute({ id: lotKey.id });
          await this.lotMakeActive.execute({ id: lotKey.id });

          return lotKey;
        }),
      ),
    );
  }

  async getRandomLot(): Promise<Lot> {
    const lotRepository = await this.lotRepository();

    const total = await lotRepository.count();

    const minIndex = 0;
    const maxIndex = total <= 0 ? 0 : total - 1;

    const randomSkip = faker.number.int({ min: minIndex, max: maxIndex });
    const lots = await lotRepository.find(Query.create(Lot).addPageable(randomSkip, 1));

    const lot = NullableObject(lots.items[0]);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(randomSkip);

    return lot;
  }

  async getLotByBid(bid: Bid): Promise<Lot> {
    const lotRepository = await this.lotRepository();

    const lot = await lotRepository.get(bid.lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(bid.lotPK.id);

    return lot;
  }
}
