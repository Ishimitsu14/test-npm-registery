import { Migration } from '@mikro-orm/migrations';

export class Migration20240622234712 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "feedback" ("id" varchar(255) not null, "text" text not null, "page" varchar(255) not null, "rating" numeric(10,0) not null, "user_pk" varchar(255) not null, "created_at" timestamptz not null, constraint "feedback_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "feedback" cascade;');
  }
}
