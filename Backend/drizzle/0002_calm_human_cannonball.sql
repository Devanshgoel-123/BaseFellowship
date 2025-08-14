ALTER TABLE "hits" ADD COLUMN "game_id" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "hits" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "hits" ADD COLUMN "hit_scores" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "hits" DROP COLUMN "color";