import { Migration } from '@mikro-orm/migrations';

export class Migration20240307013144 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "notification_config" ("id" varchar(255) not null, "settings" jsonb not null default \'{}\', constraint "notification_config_pkey" primary key ("id"));');

    this.addSql(
      'create table "notification_request" ("id" varchar(255) not null, "type" text check ("type" in (\'SYSTEM_INFO\', \'DEAL_CREATED\', \'DEAL_STATUS_CHANGED\', \'LOT_CREATED\', \'LOT_STATUS_CHANGED\', \'BID_RECEIVED\', \'BID_STATUS_CHANGED\', \'USER_REGISTERED\', \'USER_PROFILE_CHANGED\')) not null, "created_at" date not null, "force" boolean not null, "recipient_type" text check ("recipient_type" in (\'PUBLIC\', \'OWNER_ID\')) not null, "recipients" text[] not null, "payload" jsonb not null, constraint "notification_request_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "notification" ("recipient_id" varchar(255) not null, "notification_request_id" varchar(255) not null, "is_readed" boolean not null, constraint "notification_pkey" primary key ("recipient_id", "notification_request_id"));',
    );

    this.addSql(
      'alter table "notification" add constraint "notification_notification_request_id_foreign" foreign key ("notification_request_id") references "notification_request" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "notification" drop constraint "notification_notification_request_id_foreign";');

    this.addSql('drop table if exists "notification_config" cascade;');

    this.addSql('drop table if exists "notification_request" cascade;');

    this.addSql('drop table if exists "notification" cascade;');
  }
}
