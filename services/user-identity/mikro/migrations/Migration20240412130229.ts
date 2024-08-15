import { Migration } from '@mikro-orm/migrations';

export class Migration20240412130229 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_auth_data_address_unique";');

    this.addSql('alter table "user" alter column "auth_data_address" type varchar(255) using ("auth_data_address"::varchar(255));');
    this.addSql('alter table "user" alter column "auth_data_address" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "auth_data_address" type varchar(255) using ("auth_data_address"::varchar(255));');
    this.addSql('alter table "user" alter column "auth_data_address" set not null;');
    this.addSql('alter table "user" add constraint "user_auth_data_address_unique" unique ("auth_data_address");');
  }
}
