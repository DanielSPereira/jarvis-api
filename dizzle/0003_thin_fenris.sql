CREATE TABLE "transactions" (
	"userId" uuid NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"status" text NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"operationType" text
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;