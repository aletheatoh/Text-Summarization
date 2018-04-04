-- create articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  title varchar(255),
  url varchar(255),
  summary TEXT
);

-- create writing_pieces table
CREATE TABLE IF NOT EXISTS writing_pieces (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  title varchar(255),
  original TEXT,
  summary TEXT
);

-- create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name varchar(255),
  email varchar(255),
  password varchar(255)
);

CREATE TABLE IF NOT EXISTS folders (
  id SERIAL PRIMARY KEY,
  name varchar(255)
)

CREATE TABLE IF NOT EXISTS organized_articles (
  id SERIAL PRIMARY KEY,
  folder_id INTEGER,
  article_id INTEGER
)

CREATE TABLE IF NOT EXISTS organized_writing (
  id SERIAL PRIMARY KEY,
  folder_id INTEGER,
  writing_id INTEGER
)
