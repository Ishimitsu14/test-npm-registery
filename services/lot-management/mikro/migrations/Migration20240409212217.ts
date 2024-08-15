import { Migration } from '@mikro-orm/migrations';

export class Migration20240409212217 extends Migration {
  async up(): Promise<void> {
    // Offer maker types
    this.addSql(`create type lot_attributescommonoffermakertypes_enum_new AS ENUM ('PRIVATE_INVESTOR', 'VENTURE_FUND', 'COMMUNITY_FUND', 'PROJECT_TEAM')`);
    this.addSql(`alter table "lot" alter column "attributes_common_offer_maker_types" type text[] using ("attributes_common_offer_maker_types"::text[]);`);
    this.addSql(
      `update "lot" set "attributes_common_offer_maker_types" = array_replace("attributes_common_offer_maker_types", 'INDIVIDUAL', 'PRIVATE_INVESTOR') where 'INDIVIDUAL' = any("attributes_common_offer_maker_types");`,
    );
    this.addSql(
      `update "lot" set "attributes_common_offer_maker_types" = array_replace("attributes_common_offer_maker_types", 'VC', 'VENTURE_FUND') where 'VC' = any("attributes_common_offer_maker_types");`,
    );
    this.addSql(
      `update "lot" set "attributes_common_offer_maker_types" = array_replace("attributes_common_offer_maker_types", 'HEDGE_FUND', 'VENTURE_FUND') where 'HEDGE_FUND' = any("attributes_common_offer_maker_types");`,
    );
    this.addSql(
      `update "lot" set "attributes_common_offer_maker_types" = array_replace("attributes_common_offer_maker_types", 'FAMILY_OFFICE', 'VENTURE_FUND') where 'FAMILY_OFFICE' = any("attributes_common_offer_maker_types");`,
    );
    this.addSql(
      `update "lot" set "attributes_common_offer_maker_types" = array_replace("attributes_common_offer_maker_types", 'DAO', 'COMMUNITY_FUND') where 'DAO' = any("attributes_common_offer_maker_types");`,
    );
    this.addSql(
      `alter table "lot" alter column "attributes_common_offer_maker_types" type lot_attributescommonoffermakertypes_enum_new[] using ("attributes_common_offer_maker_types"::lot_attributescommonoffermakertypes_enum_new[]);`,
    );
    this.addSql(`drop type if exists lot_attributescommonoffermakertypes_enum;`);
    this.addSql(`alter type "lot_attributescommonoffermakertypes_enum_new" rename to "lot_attributescommonoffermakertypes_enum";`);

    // Bid maker types
    this.addSql(`create type lot_attributescommonbidmakertypes_enum_new AS ENUM ('PRIVATE_INVESTOR', 'VENTURE_FUND', 'COMMUNITY_FUND', 'PROJECT_TEAM')`);
    this.addSql(`alter table "lot" alter column "attributes_common_bid_maker_types" type text[] using ("attributes_common_bid_maker_types"::text[]);`);
    this.addSql(
      `update "lot" set "attributes_common_bid_maker_types" = array_replace("attributes_common_bid_maker_types", 'INDIVIDUAL', 'PRIVATE_INVESTOR') where 'INDIVIDUAL' = any("attributes_common_bid_maker_types");`,
    );
    this.addSql(
      `update "lot" set "attributes_common_bid_maker_types" = array_replace("attributes_common_bid_maker_types", 'VC', 'VENTURE_FUND') where 'VC' = any("attributes_common_bid_maker_types");`,
    );
    this.addSql(
      `update "lot" set "attributes_common_bid_maker_types" = array_replace("attributes_common_bid_maker_types", 'HEDGE_FUND', 'VENTURE_FUND') where 'HEDGE_FUND' = any("attributes_common_bid_maker_types");`,
    );
    this.addSql(
      `update "lot" set "attributes_common_bid_maker_types" = array_replace("attributes_common_bid_maker_types", 'FAMILY_OFFICE', 'VENTURE_FUND') where 'FAMILY_OFFICE' = any("attributes_common_bid_maker_types");`,
    );
    this.addSql(
      `update "lot" set "attributes_common_bid_maker_types" = array_replace("attributes_common_bid_maker_types", 'DAO', 'COMMUNITY_FUND') where 'DAO' = any("attributes_common_bid_maker_types");`,
    );
    this.addSql(
      `alter table "lot" alter column "attributes_common_bid_maker_types" type lot_attributescommonbidmakertypes_enum_new[] using ("attributes_common_bid_maker_types"::lot_attributescommonbidmakertypes_enum_new[]);`,
    );
    this.addSql(`drop type if exists lot_attributescommonbidmakertypes_enum;`);
    this.addSql(`alter type "lot_attributescommonbidmakertypes_enum_new" rename to "lot_attributescommonbidmakertypes_enum";`);
  }

  async down(): Promise<void> {}
}
