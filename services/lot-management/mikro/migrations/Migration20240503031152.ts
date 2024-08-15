import { Migration } from '@mikro-orm/migrations';

export class Migration20240503031152 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "lot" add column "attributes_invest_doc_asset_request_pitch_deck" varchar(255) null, add column "attributes_invest_doc_asset_request_tokenomics" varchar(255) null, add column "attributes_booster_info_round_type" text check ("attributes_booster_info_round_type" in (\'FUNDING_ROUND\', \'PRESALE\', \'PRESEED\', \'PRIVATE\', \'ROUND_A\', \'ROUND_B\', \'ROUND_C\', \'SEED\')) null, add column "attributes_booster_info_fdv" numeric(10,0) null, add column "attributes_booster_info_round_price" numeric(10,0) null, add column "attributes_booster_info_future_round_price" numeric(10,0) null, add column "attributes_booster_info_previous_round_price" numeric(10,0) null, add column "attributes_booster_info_listing_timeline" timestamptz null, add column "attributes_booster_info_additional_info" text null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "lot" drop column "attributes_invest_doc_asset_request_pitch_deck";');
    this.addSql('alter table "lot" drop column "attributes_invest_doc_asset_request_tokenomics";');
    this.addSql('alter table "lot" drop column "attributes_booster_info_round_type";');
    this.addSql('alter table "lot" drop column "attributes_booster_info_fdv";');
    this.addSql('alter table "lot" drop column "attributes_booster_info_round_price";');
    this.addSql('alter table "lot" drop column "attributes_booster_info_previous_round_price";');
    this.addSql('alter table "lot" drop column "attributes_booster_info_future_round_price";');
    this.addSql('alter table "lot" drop column "attributes_booster_info_listing_timeline";');
    this.addSql('alter table "lot" drop column "attributes_booster_info_additional_info";');
  }
}
