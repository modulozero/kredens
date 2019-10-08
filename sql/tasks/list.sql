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
    owner = $1
ORDER BY created_at ASC
LIMIT $2 OFFSET $3;
