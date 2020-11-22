BEGIN;

TRUNCATE
    users,
    posts,
    comments,
    likes
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, pwd, email, bio)
VALUES
    ('jonathan', '$2a$12$HVLCtFkXdAURl8qLp7uam.3a9.k3lxadLV3PDGgGBLGGhpUstXxWq', 'jon@email.com', null),
    ('jerrad', '$2a$12$HVLCtFkXdAURl8qLp7uam.3a9.k3lxadLV3PDGgGBLGGhpUstXxWq', 'jerrad@email.com', null),
    ('michaela', '$2a$12$HVLCtFkXdAURl8qLp7uam.3a9.k3lxadLV3PDGgGBLGGhpUstXxWq', 'michaela@email.com', null),
    ('sacha', '$2a$12$HVLCtFkXdAURl8qLp7uam.3a9.k3lxadLV3PDGgGBLGGhpUstXxWq', 'sacha@email.com', 'still waiting for my 15 minutes of fame'),
    ('demo', '$2a$12$kHB0b/2Uaq.Qnq/mTCI4XuCj1vUX9cEJCqLVMbk6GMuajSkDor7Gm', 'demo@email.com', 'invasion of the body snatchers');

INSERT INTO posts (user_id, title, pic, desc_post)
VALUES
    ('3', 'Head bang', 'https://res.cloudinary.com/thinkful/image/upload/v1605819628/imagepool/x0aqevreipsjg811umks.jpg', 'oh no'),
    ('4', 'Signal vs Noise', 'https://res.cloudinary.com/thinkful/image/upload/v1605819515/imagepool/mr613p0lhru07b66xruh.jpg', 'while gazing at a Cy Twombly'),
    ('1', 'Homage to Diebenkorn', 'https://res.cloudinary.com/thinkful/image/upload/v1604880998/imagepool/j80qluchryfhz5gqsvee.jpg', 'the view outside my window... sorta'),
    ('2', 'Ocean Park', 'https://res.cloudinary.com/thinkful/image/upload/v1605819644/imagepool/rh4xtetgt7jzzgdkeafo.jpg', 'entering my aquamarine period'),
    ('3', 'Namaste', 'https://res.cloudinary.com/thinkful/image/upload/v1605819617/imagepool/lpu33rh5nx0fm2ufrlue.jpg', 'outside the mosh pit'),
    ('4', 'Frank~lin', 'https://res.cloudinary.com/thinkful/image/upload/v1605819560/imagepool/fvr5uk06bdxtnvk6veir.jpg', 'as a broken record ai bot?'),
    ('3', 'Purple Haze', 'https://res.cloudinary.com/thinkful/image/upload/v1605819604/imagepool/z33rmk9vzieztrsqh7lk.jpg', 'my friend Laura striking a pose'),
    ('1', 'Warholia', 'https://res.cloudinary.com/thinkful/image/upload/v1605819667/imagepool/bxodagysi5qhqdhdbfex.jpg', 'He has certainly had more than his alotted 15 minutes of fame'),
    ('4', 'Flat Eric', 'https://res.cloudinary.com/thinkful/image/upload/v1605819573/imagepool/ezxrz9w9zrkhcayik5yt.jpg', 'my spirit animal');

INSERT INTO comments (post_id, user_id, desc_comment)
VALUES
    ('9', '3', 'Awwwwww'),
    ('1', '4', 'Lovely shot, but my head hurts just looking at it (haha)');

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
