import { Migration } from '@mikro-orm/migrations';

export class Migration20240605104238 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "asset_faq" ("id" varchar(255) not null, "asset_id" varchar(255) not null, "question" text not null, "answer" text not null, "created_at" timestamptz not null, constraint "asset_faq_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "lot_question" ("id" varchar(255) not null, "user_id" varchar(255) not null, "lot_id" int not null, "parent_lot_question_id" varchar(255) null, "text" text not null, "status" text check ("status" in (\'ON_MODERATION\', \'ACTIVE\', \'REJECTED\')) not null, "created_at" timestamptz not null, constraint "lot_question_pkey" primary key ("id"));',
    );

    this.addSql('alter table "asset_faq" add constraint "asset_faq_asset_id_foreign" foreign key ("asset_id") references "asset" ("id") on update cascade;');

    this.addSql('alter table "lot_question" add constraint "lot_question_lot_id_foreign" foreign key ("lot_id") references "lot" ("id") on update cascade;');
    this.addSql(
      'alter table "lot_question" add constraint "lot_question_parent_lot_question_id_foreign" foreign key ("parent_lot_question_id") references "lot_question" ("id") on update cascade on delete set null;',
    );

    this.addSql('alter table "asset" add column "status" text default \'ACTIVE\' check ("status" in (\'ACTIVE\', \'ARCHIVED\')) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lot_question" drop constraint "lot_question_parent_lot_question_id_foreign";');

    this.addSql('drop table if exists "asset_faq" cascade;');

    this.addSql('drop table if exists "lot_question" cascade;');

    this.addSql('alter table "asset" drop column "status";');
  }
}
