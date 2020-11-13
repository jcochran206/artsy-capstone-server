BEGIN;

TRUNCATE
    users,
    posts,
    comments,
    likes
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, pwd, email, bio)
VALUES
    ('joeb', 'joebpassword', 'joeb@email.com', null),
    ('josht', 'joshtpassword', 'josht@email.com', null),
    ('testy3', 'testypassword', 'testy@email.com', null),
    ('satchmo', '$2a$12$HVLCtFkXdAURl8qLp7uam.3a9.k3lxadLV3PDGgGBLGGhpUstXxWq', 'satchmo@email.com', 'still waiting for my 15 minutes of fame ;P');

INSERT INTO posts (user_id, title, pic, desc_post)
VALUES
    ('1', 'Warholia', 'https://res.cloudinary.com/thinkful/image/upload/v1604880998/imagepool/dsdzhpfz21hm9bhbv65g.jpg', '15 minutes of fame'),
    ('2', 'Ocean View', 'https://res.cloudinary.com/thinkful/image/upload/v1604877945/imagepool/pmia5osmnz9or0f2jpph.jpg', 'a homage to Diebenkorn'),
    ('3', 'Signal vs Noise', 'https://res.cloudinary.com/thinkful/image/upload/v1604876790/imagepool/ngznhebncn5ztibempwg.jpg', 'while gazing at a Cy Twombly');

INSERT INTO comments (post_id, user_id, comment)
VALUES
    ('1', '1', 'here goes comment for one'),
    ('2', '2', 'here goes comment for two');

INSERT INTO likes (post_id, user_id)
VALUES
    ('1', '1'),
    ('2', '2');

INSERT INTO followers(followed_user_id, follower_user_id)
VALUES
    ('1', '2'),
    ('1', '3'),
    ('2', '1');


COMMIT;
