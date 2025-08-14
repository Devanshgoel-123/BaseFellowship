CREATE TABLE "creators" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"total_hits" integer DEFAULT 0,
	"rewards_balance" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"coin_address" varchar(100) NOT NULL,
	"creator_pfp" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hits" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL,
	"fan_id" integer NOT NULL,
	"color" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL,
	"fan_id" integer,
	"amount" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"claimed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"wallet_address" varchar(100) NOT NULL,
	"points" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"coin_balances" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
ALTER TABLE "creators" ADD CONSTRAINT "creators_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hits" ADD CONSTRAINT "hits_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hits" ADD CONSTRAINT "hits_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_fan_id_users_id_fk" FOREIGN KEY ("fan_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;