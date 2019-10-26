
SELECT 
    id,
    owner,
    name,
    notes,
    schedule,
    created_at
FROM
    tasks
WHERE
    owner = $1
ORDER BY created_at ASC, id ASC
LIMIT $2 OFFSET $3;
