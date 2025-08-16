ALTER TABLE "creators" DROP CONSTRAINT "creators_creator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "hits" DROP CONSTRAINT "hits_creator_id_creators_id_fk";
--> statement-breakpoint
ALTER TABLE "hits" DROP CONSTRAINT "hits_fan_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rewards" DROP CONSTRAINT "rewards_fan_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "creator_address" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "hits" ADD COLUMN "user_address" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "hits" ADD COLUMN "normal_points" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rewards" ADD COLUMN "user_address" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "hits" ADD CONSTRAINT "hits_user_address_users_wallet_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."users"("wallet_address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_address_users_wallet_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."users"("wallet_address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creators" DROP COLUMN "creator_id";--> statement-breakpoint
ALTER TABLE "hits" DROP COLUMN "creator_id";--> statement-breakpoint
ALTER TABLE "hits" DROP COLUMN "fan_id";--> statement-breakpoint
ALTER TABLE "rewards" DROP COLUMN "fan_id";