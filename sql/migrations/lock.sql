WITH rows as (
    UPDATE migrations_lock SET is_locked = true WHERE is_locked = false RETURNING 1
) SELECT COUNT(*) FROM rows;
