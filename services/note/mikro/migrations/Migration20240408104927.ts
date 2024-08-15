import { Migration } from '@mikro-orm/migrations';

export class Migration20240408104927 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "note" ("id" varchar(255) not null, "namespace" varchar(255) not null, "entity" varchar(255) not null, "entity_pk" varchar(255) not null, "owner_pk" varchar(255) null, "text" text not null, "parent_note_id" varchar(255) null, "created_at" timestamptz not null, constraint "note_pkey" primary key ("id"));',
    );

    this.addSql('alter table "note" add constraint "note_parent_note_id_foreign" foreign key ("parent_note_id") references "note" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "note" drop constraint "note_parent_note_id_foreign";');

    this.addSql('drop table if exists "note" cascade;');
  }
}
