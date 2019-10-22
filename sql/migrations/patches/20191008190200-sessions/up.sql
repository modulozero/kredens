CREATE TABLE "sessions" (
    "sid" text NOT NULL COLLATE "default",
	"session" jsonb NOT NULL,
    "expires_at" timestamptz NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE TRIGGER "set_sessions_updated" BEFORE UPDATE ON "sessions" FOR EACH ROW EXECUTE PROCEDURE set_updated_timestamp();
