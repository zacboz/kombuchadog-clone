CREATE TABLE dogs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  description TEXT,
  image TEXT,
  adopted BOOLEAN
);


CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  store VARCHAR(30),
  address TEXT,
  phone VARCHAR(30),
  hours TEXT,
  website TEXT
);

CREATE TABLE merchandise (
  id SERIAL PRIMARY KEY,
  item VARCHAR(30),
  description TEXT,
  image TEXT
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  id INT reference from merchandise,
  item VARCHAR(30),
  description TEXT,
  image TEXT,
  size TEXT,
  quantity INT
);

-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(30),
--   location TEXT,
--   imageurl TEXT
-- );
