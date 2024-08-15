import { Migration } from '@mikro-orm/migrations';

export class Migration20240408120043 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "favorite_lot" ("id" varchar(255) not null, "user_id" varchar(255) not null, "lot_id" int not null, "created_at" timestamptz not null, constraint "favorite_lot_pkey" primary key ("id"));',
    );

    this.addSql('alter table "favorite_lot" add constraint "favorite_lot_lot_id_foreign" foreign key ("lot_id") references "lot" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "favorite_lot" cascade;');
  }
}
