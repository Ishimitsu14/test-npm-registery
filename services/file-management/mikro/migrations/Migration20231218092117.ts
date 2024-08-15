import { Migration } from '@mikro-orm/migrations';

export class Migration20231218092117 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "file" ("id" varchar(255) not null, "created_at" timestamptz not null, "s3_file_bucket" varchar(255) not null, "s3_file_key" varchar(255) not null, "status" text check ("status" in (\'TEMP\', \'UPLOADED\')) not null, "type" text check ("type" in (\'IMAGE\')) not null, "mime_type" varchar(255) not null, "mode" text check ("mode" in (\'PUBLIC\')) not null, "original_name" varchar(255) not null, "size" int not null, constraint "file_pkey" primary key ("id"));',
    );
  }
}
