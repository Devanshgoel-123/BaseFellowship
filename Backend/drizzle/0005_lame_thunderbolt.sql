ALTER TABLE "users" ADD COLUMN "user_pfp" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_pfp_unique" UNIQUE("user_pfp");