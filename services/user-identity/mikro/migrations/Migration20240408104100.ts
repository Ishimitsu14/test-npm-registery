import { Migration } from '@mikro-orm/migrations';

export class Migration20240408104100 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "auth_telegram_code" ("code" varchar(255) not null, "expires_at" timestamptz not null, "user_pk_id" varchar(255) null, constraint "auth_telegram_code_pkey" primary key ("code"));',
    );

    this.addSql('alter table "auth_telegram_code" add constraint "auth_telegram_code_user_pk_id_foreign" foreign key ("user_pk_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "auth_telegram_code" cascade;');
  }
}
