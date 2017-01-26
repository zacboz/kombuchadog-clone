CREATE TABLE dogs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  story TEXT,
  image TEXT,
  adopted BOOLEAN
);

CREATE TABLE merchandise (
  id SERIAL PRIMARY KEY,
  item VARCHAR(30),
  price VARCHAR(10),
  description TEXT,
  image TEXT
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  productId INT references merchandise,
  item VARCHAR(30),
  price VARCHAR(10),
  description TEXT,
  image TEXT,
  size VARCHAR(10),
  quantity INT
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  store VARCHAR(30),
  address TEXT,
  phone VARCHAR(30),
  hours TEXT,
  website TEXT
);


-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(30),
--   location TEXT,
--   imageurl TEXT
-- );
