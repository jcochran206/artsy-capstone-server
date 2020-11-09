BEGIN;

TRUNCATE
    users,
    posts,
    comments,
    likes
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, pwd, email)
VALUES
    ('joeb', 'joebpassword', 'joeb@email.com'),
    ('josht', 'joshtpassword', 'josht@email.com'),
    ('satchmo', '$2a$12$HVLCtFkXdAURl8qLp7uam.3a9.k3lxadLV3PDGgGBLGGhpUstXxWq', 'satchmo@email.com');

INSERT INTO posts (user_id, title, pic, desc_post)
VALUES
    ('1', 'test', 'url', 'test post need image'),
    ('2', 'test2', 'url2', 'test post need image2');

INSERT INTO comments (post_id, user_id, desc_comment)
VALUES
    ('1', '1', 'here goes comment for one'),
    ('2', '2', 'here goes comment for two');

INSERT INTO likes (post_id, user_id, isLiked)
VALUES
    ('1', '1', 'true'),
    ('2', '2', 'true');

COMMIT;

-- NOTE TO SELF
-- bcrypt.hash('aaAA11!!', 12).then(hash => console.log({ hash }
-- hash: '$2a$12$HVLCtFkXdAURl8qLp7uam.3a9.k3lxadLV3PDGgGBLGGhpUstXxWq'