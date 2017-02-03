INSERT INTO orders
(customerName, shippingAddress, email, amount)
VALUES ($1, $2, $3, $4)
returning id;
