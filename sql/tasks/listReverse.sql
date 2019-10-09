SELECT 
    id,
    name,
    notes,
    schedule,
    min_frequency,
    max_frequency,
    created_at
FROM
    tasks
WHERE
    owner = $1 AND ($2 IS NULL OR id > $2) AND ($3 IS NULL OR id < $3)
ORDER BY created_at DESC
LIMIT $4;
