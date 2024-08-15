import { Migration } from '@mikro-orm/migrations';

export class Migration20231218092003 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" varchar(255) not null, "registered_at" timestamptz not null, "verification_is_verified" boolean not null, "auth_data_address" varchar(255) not null, "nickname" varchar(255) not null, constraint "user_pkey" primary key ("id"));',
    );
    this.addSql('alter table "user" add constraint "user_auth_data_address_unique" unique ("auth_data_address");');
    this.addSql('alter table "user" add constraint "user_nickname_unique" unique ("nickname");');
  }
}
