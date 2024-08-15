import { Migration } from '@mikro-orm/migrations';

export class Migration20240404212218 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "lot" drop constraint if exists "lot_attributes_invest_doc_round_type_check";');

    this.addSql('alter table "bid" drop constraint if exists "bid_bidMakerType_check";');
    this.addSql('alter table "bid" alter column "bid_maker_type" type text using ("bid_maker_type"::text);');
    this.addSql('update "bid" set "bid_maker_type" = \'PRIVATE_INVESTOR\' where "bid_maker_type" = \'INDIVIDUAL\';');
    this.addSql("update \"bid\" set \"bid_maker_type\" = 'VENTURE_FUND' where \"bid_maker_type\" in ('VC', 'HEDGE_FUND', 'FAMILY_OFFICE');");
    this.addSql('update "bid" set "bid_maker_type" = \'COMMUNITY_FUND\' where "bid_maker_type" = \'DAO\';');
    this.addSql("alter table \"bid\" add constraint \"bid_maker_type_check\" check (\"bid_maker_type\" in ('PRIVATE_INVESTOR', 'VENTURE_FUND', 'COMMUNITY_FUND', 'PROJECT_TEAM'));");
  }

  async down(): Promise<void> {
    this.addSql('alter table "lot" drop constraint if exists "lot_attributes_invest_doc_round_type_check";');

    this.addSql('alter table "bid" drop constraint if exists "bid_bid_maker_type_check";');

    this.addSql('alter table "bid" alter column "bid_maker_type" type text using ("bid_maker_type"::text);');
    this.addSql("alter table \"bid\" add constraint \"bid_bid_maker_type_check\" check (\"bid_maker_type\" in ('INDIVIDUAL', 'VC', 'HEDGE_FUND', 'FAMILY_OFFICE', 'DAO'));");
  }
}
