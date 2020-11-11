CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  username varchar(50) NOT NULL UNIQUE,
  pwd varchar(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  bio varchar(255),
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER references users (id) ON DELETE CASCADE,
  title varchar(50) NOT NULL,
  pic varchar(200) NOT NULL,
  desc_post varchar(144) NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  post_id INTEGER references posts (id) ON DELETE CASCADE,
  user_id INTEGER references users (id) ON DELETE CASCADE,
  "comment" varchar(144) NOT NULL
);

CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  post_id INTEGER references posts (id) ON DELETE CASCADE,
  user_id INTEGER references users (id) ON DELETE CASCADE,
);

CREATE TABLE IF NOT EXISTS followers (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
  user_id INTEGER references users (id) ON DELETE CASCADE,
  follower_id INTEGER references users (id) ON DELETE CASCADE,
)

-- NOTE:
-- Need to increase the char length of 'pwd' to accomodate bcrypt hash