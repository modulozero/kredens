CREATE TABLE users (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email text NOT NULL UNIQUE,
    encrypted_password text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP   
);

CREATE TRIGGER set_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE set_updated_timestamp();