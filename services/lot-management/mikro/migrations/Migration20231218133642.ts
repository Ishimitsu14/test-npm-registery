import { Migration } from '@mikro-orm/migrations';

export class Migration20231218133642 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "lot" add column "attributes_common_additional_info" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lot" drop column "attributes_common_additional_info";');
  }
}
