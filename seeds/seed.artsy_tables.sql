BEGIN;

TRUNCATE
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, pwd, email)
VALUES
    ('joeb', 'joebpassword', 'joeb@email.com'),
    ('josht', 'joshtpassword', 'josht@email.com');

COMMIT;