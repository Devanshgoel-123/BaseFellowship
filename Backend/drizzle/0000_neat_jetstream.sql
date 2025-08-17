CREATE TABLE "creators" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_address" varchar NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"total_hits" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"coin_address" varchar(100) NOT NULL,
	"creator_pfp" varchar(100) NOT NULL,
	"message" varchar(100) DEFAULT '' NOT NULL,
	CONSTRAINT "creators_creator_address_unique" UNIQUE("creator_address"),
	CONSTRAINT "creators_coin_address_unique" UNIQUE("coin_address")
);
--> statement-breakpoint
CREATE TABLE "hits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_address" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"hit_scores" jsonb DEFAULT '{}'::jsonb,
	"normal_points" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"coin_address" varchar NOT NULL,
	"user_address" varchar NOT NULL,
	"amount" integer NOT NULL,
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
	"user_pfp" varchar(150) NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address"),
	CONSTRAINT "users_user_pfp_unique" UNIQUE("user_pfp")
);
--> statement-breakpoint
ALTER TABLE "hits" ADD CONSTRAINT "hits_user_address_users_wallet_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."users"("wallet_address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_coin_address_creators_coin_address_fk" FOREIGN KEY ("coin_address") REFERENCES "public"."creators"("coin_address") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_address_users_wallet_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."users"("wallet_address") ON DELETE no action ON UPDATE no action;