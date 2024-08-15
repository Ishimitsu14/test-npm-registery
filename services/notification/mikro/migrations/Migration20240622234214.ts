import { Migration } from '@mikro-orm/migrations';

export class Migration20240622234214 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "notification_request" drop constraint if exists "notification_request_type_check";');

    this.addSql('alter table "notification_request" alter column "type" type text using ("type"::text);');
    this.addSql(
      "alter table \"notification_request\" add constraint \"notification_request_type_check\" check (\"type\" in ('SYSTEM_INFO', 'DEAL_CREATED', 'DEAL_STATUS_CHANGED', 'LOT_CREATED', 'LOT_STATUS_CHANGED', 'BID_RECEIVED', 'BID_STATUS_CHANGED', 'USER_REGISTERED', 'USER_PROFILE_CHANGED', 'LOT_QUESTION_RECEIVED', 'LOT_QUESTION_PUBLISHED'));",
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "notification_request" drop constraint if exists "notification_request_type_check";');

    this.addSql('alter table "notification_request" alter column "type" type text using ("type"::text);');
    this.addSql(
      "alter table \"notification_request\" add constraint \"notification_request_type_check\" check (\"type\" in ('SYSTEM_INFO', 'DEAL_CREATED', 'DEAL_STATUS_CHANGED', 'LOT_CREATED', 'LOT_STATUS_CHANGED', 'BID_RECEIVED', 'BID_STATUS_CHANGED', 'USER_REGISTERED', 'USER_PROFILE_CHANGED'));",
    );
  }
}
