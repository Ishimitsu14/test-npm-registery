import { Migration } from '@mikro-orm/migrations';

export class Migration20240307010824 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_role" ("id" varchar(255) not null, "user_id" varchar(255) not null, "type" text check ("type" in (\'MODERATOR\', \'ADMIN\')) not null, "created_at" timestamptz not null, constraint "user_role_pkey" primary key ("id"));',
    );

    this.addSql('alter table "user_role" add constraint "user_role_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql(
      "alter table \"user\" add column \"profile_first_name\" varchar(255) null, add column \"profile_last_name\" varchar(255) null, add column \"profile_telegram\" varchar(255) null, add column \"profile_email\" varchar(255) null, add column \"profile_location\" text check (\"profile_location\" in ('UNKNOWN', 'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'AN', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'SH', 'KN', 'LC', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'CS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW')) null;",
    );
    this.addSql('alter table "user" add constraint "user_profile_telegram_unique" unique ("profile_telegram");');
    this.addSql('alter table "user" add constraint "user_profile_email_unique" unique ("profile_email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_role" cascade;');

    this.addSql('alter table "user" drop constraint "user_profile_telegram_unique";');
    this.addSql('alter table "user" drop constraint "user_profile_email_unique";');
    this.addSql('alter table "user" drop column "profile_first_name";');
    this.addSql('alter table "user" drop column "profile_last_name";');
    this.addSql('alter table "user" drop column "profile_telegram";');
    this.addSql('alter table "user" drop column "profile_email";');
    this.addSql('alter table "user" drop column "profile_location";');
  }
}
