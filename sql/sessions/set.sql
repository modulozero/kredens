INSERT INTO "sessions" AS s ("sid", "session", "expires_at") VALUES ($1, $2, $3)
    ON CONFLICT ON CONSTRAINT "session_pkey"
    DO UPDATE SET "session"=$2, "expires_at"=$3 WHERE "s"."sid"=$1;
