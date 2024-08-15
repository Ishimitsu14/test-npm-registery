import { Migration } from '@mikro-orm/migrations';

export class Migration20240307013754 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "bid" drop constraint if exists "bid_status_check";');
    this.addSql('alter table "bid" alter column "status" type text using ("status"::text);');
    this.addSql("alter table \"bid\" add constraint \"bid_status_check\" check (\"status\" in ('ON_MODERATION', 'ACTIVE', 'DEAL', 'REJECTED', 'ARCHIVED'));");

    this.addSql('alter table "lot" add column "attributes_invest_doc_reassignment_type" text check ("attributes_invest_doc_reassignment_type" in (\'DIRECT\', \'SPV\', \'FORWARD_CONTRACT\')) null;');
    this.addSql('update "lot" set "attributes_invest_doc_reassignment_type" = \'DIRECT\' where "attributes_invest_doc_with_reassign" = true');
    this.addSql('update "lot" set "attributes_invest_doc_reassignment_type" = \'FORWARD_CONTRACT\' where "attributes_invest_doc_with_reassign" = false');
    this.addSql('alter table "lot" drop column "attributes_invest_doc_with_reassign";');

    this.addSql('alter table "lot" drop constraint if exists "lot_type_check";');
    this.addSql('alter table "lot" alter column "type" type text using ("type"::text);');
    this.addSql("alter table \"lot\" add constraint \"lot_type_check\" check (\"type\" in ('SAFE', 'SAFT', 'TOKEN_WARRANT', 'EQUITY', 'UNLOCKED_TOKENS'));");
  }

  async down(): Promise<void> {
    this.addSql('alter table "bid" drop constraint if exists "bid_status_check";');
    this.addSql('alter table "bid" alter column "status" type text using ("status"::text);');
    this.addSql("alter table \"bid\" add constraint \"bid_status_check\" check (\"status\" in ('ON_MODERATION', 'ACTIVE', 'DEAL', 'REJECTED'));");

    this.addSql('alter table "lot" add column "attributes_invest_doc_with_reassign" bool null;');
    this.addSql('update "lot" set "attributes_invest_doc_with_reassign" = true where "attributes_invest_doc_with_reassign" = \'DIRECT\'');
    this.addSql('update "lot" set "attributes_invest_doc_with_reassign" = false where "attributes_invest_doc_with_reassign" = \'FORWARD_CONTRACT\' or "attributes_invest_doc_with_reassign" = \'SPV\'');
    this.addSql('alter table "lot" drop column "attributes_invest_doc_reassignment_type";');

    this.addSql('alter table "lot" drop constraint if exists "lot_type_check";');
    this.addSql('alter table "lot" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "lot" add constraint "lot_type_check" check ("type" in (\'SAFE\', \'SAFT\', \'TOKEN_WARRANT\'));');
  }
}
