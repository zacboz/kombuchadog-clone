INSERT INTO cart
(productId, item, title, price, description, image, size, quantity)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, productId, title, price, image, size, quantity;
