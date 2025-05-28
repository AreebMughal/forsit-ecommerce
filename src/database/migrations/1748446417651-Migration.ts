import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748446417651 implements MigrationInterface {
    name = 'Migration1748446417651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sales_platform_enum" AS ENUM('amazon', 'walmart')`);
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "quantity" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "total_revenue" numeric(10,2) NOT NULL, "total_cost" numeric(10,2), "platform" "public"."sales_platform_enum" NOT NULL, "sale_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_473b4a7ae735a4705b3bf3f64a" ON "sales" ("platform") `);
        await queryRunner.query(`CREATE INDEX "IDX_5015e2759303d7baaf47fc53cc" ON "sales" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8defdb66f54797635db3fa0126" ON "sales" ("sale_date") `);
        await queryRunner.query(`CREATE TYPE "public"."products_category_enum" AS ENUM('electronics', 'clothing', 'home', 'books', 'sports', 'beauty', 'toys', 'automotive')`);
        await queryRunner.query(`CREATE TYPE "public"."products_platform_enum" AS ENUM('amazon', 'walmart')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "category" "public"."products_category_enum" NOT NULL, "price" numeric(10,2) NOT NULL, "cost" numeric(10,2), "platform" "public"."products_platform_enum" NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c44ac33a05b144dd0d9ddcf932" ON "products" ("sku") `);
        await queryRunner.query(`CREATE INDEX "IDX_4ce080d1ddcafd34099e3e101d" ON "products" ("platform") `);
        await queryRunner.query(`CREATE INDEX "IDX_c3932231d2385ac248d0888d95" ON "products" ("category") `);
        await queryRunner.query(`CREATE TYPE "public"."inventory_change_type_enum" AS ENUM('restock', 'sale', 'adjustment', 'return')`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "quantity_before" integer NOT NULL, "quantity_change" integer NOT NULL, "quantity_after" integer NOT NULL, "change_type" "public"."inventory_change_type_enum" NOT NULL, "reason" character varying, "change_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f768258b9c00f7052694cde219" ON "inventory" ("change_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_732fdb1f76432d65d2c136340d" ON "inventory" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_5015e2759303d7baaf47fc53cc8" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_732fdb1f76432d65d2c136340dc" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_732fdb1f76432d65d2c136340dc"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_5015e2759303d7baaf47fc53cc8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_732fdb1f76432d65d2c136340d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f768258b9c00f7052694cde219"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_change_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c3932231d2385ac248d0888d95"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ce080d1ddcafd34099e3e101d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c44ac33a05b144dd0d9ddcf932"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_platform_enum"`);
        await queryRunner.query(`DROP TYPE "public"."products_category_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8defdb66f54797635db3fa0126"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5015e2759303d7baaf47fc53cc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_473b4a7ae735a4705b3bf3f64a"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TYPE "public"."sales_platform_enum"`);
    }

}
