import { Migration } from '@mikro-orm/migrations';

export class Migration20240415113657 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "lot" alter column "attributes_common_offer_maker_types" type text using ("attributes_common_offer_maker_types"[1]::text);');
    this.addSql(
      "alter table \"lot\" add constraint \"lot_attributes_common_offer_maker_types_check\" check (\"attributes_common_offer_maker_types\" in ('PRIVATE_INVESTOR', 'VENTURE_FUND', 'COMMUNITY_FUND', 'PROJECT_TEAM'));",
    );
    this.addSql('alter table "lot" alter column "attributes_common_bid_maker_types" type text using ("attributes_common_bid_maker_types"[1]::text);');
    this.addSql(
      "alter table \"lot\" add constraint \"lot_attributes_common_bid_maker_types_check\" check (\"attributes_common_bid_maker_types\" in ('PRIVATE_INVESTOR', 'VENTURE_FUND', 'COMMUNITY_FUND', 'PROJECT_TEAM'));",
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "lot" drop constraint if exists "lot_attributes_common_offer_maker_types_check";');
    this.addSql('alter table "lot" drop constraint if exists "lot_attributes_common_bid_maker_types_check";');

    this.addSql(
      'alter table "lot" alter column "attributes_common_offer_maker_types" type text[] using case when "attributes_common_offer_maker_types" is null then \'{}\' else ARRAY["attributes_common_offer_maker_types"] end;',
    );
    this.addSql(
      'alter table "lot" alter column "attributes_common_bid_maker_types" type text[] using case when "attributes_common_bid_maker_types" is null then \'{}\' else ARRAY["attributes_common_bid_maker_types"] end;',
    );
  }
}
