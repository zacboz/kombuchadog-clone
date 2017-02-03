select merchandise.title, merchandise.image, merchandise.price, orderitems.size, orderitems.quantity
from orders
  join orderItems on orderItems.orderId = orders.id
  join merchandise on orderItems.productId = merchandise.id
where orders.id = $1;
