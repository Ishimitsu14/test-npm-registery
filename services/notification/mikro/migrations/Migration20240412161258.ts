import { Migration } from '@mikro-orm/migrations';

export class Migration20240412161258 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "notification_request" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');

    this.addSql('alter table "notification" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "notification_request" alter column "created_at" type date using ("created_at"::date);');

    this.addSql('alter table "notification" alter column "created_at" type date using ("created_at"::date);');
  }
}
