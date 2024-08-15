import { Migration } from '@mikro-orm/migrations';

export class Migration20240802112433 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "view_lot" ("id" varchar(255) not null, "lot_id" int not null, "created_at" timestamptz not null, constraint "view_lot_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "view_lot" cascade;');
  }
}
