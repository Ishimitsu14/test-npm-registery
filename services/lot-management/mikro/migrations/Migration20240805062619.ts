import { Migration } from '@mikro-orm/migrations';

export class Migration20240805062619 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "lot_badge" ("id" varchar(255) not null, "sort" int not null, "created_at" timestamptz not null, constraint "lot_badge_pkey" primary key ("id"));');

    this.addSql('alter table "lot" add column "attributes_common_badge_id" varchar(255) null;');
    this.addSql(
      'alter table "lot" add constraint "lot_attributes_common_badge_id_foreign" foreign key ("attributes_common_badge_id") references "lot_badge" ("id") on update cascade on delete set null;',
    );

    this.addSql(`INSERT INTO "lot_badge" (id, sort, created_at) VALUES ('VIP', 1, NOW()), ('Promo', 2, NOW()), ('HOT', 3, NOW())`);
  }

  async down(): Promise<void> {
    this.addSql('alter table "lot" drop constraint "lot_attributes_common_badge_id_foreign";');

    this.addSql('drop table if exists "lot_badge" cascade;');

    this.addSql('alter table "lot" drop column "attributes_common_badge_id";');
  }
}
