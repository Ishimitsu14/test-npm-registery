import { Migration } from '@mikro-orm/migrations';

export class Migration20240409153743 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "notification" add column "created_at" date not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "notification" drop column "created_at";');
  }
}
