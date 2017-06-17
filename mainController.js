const app = require('./index');
var stripe = require("stripe")("sk_test_YWeRVnmViJfikag0T9Z4QH6m");
const db = app.get('db');

module.exports = {

getUpForAdoption: (req, res) => {
  db.read_upForAdoption((err, response) => {
    if(err) {
      console.log(err);
      res.status(200).json(err);
    } else {
      res.status(200).json(response);
    }
  });
},

getAdopted: (req, res) => {
  db.read_adopted((err, response) => {
    if(err) {
      console.log(err);
      res.status(200).json(err);
    } else {
      res.status(200).json(response);
    }
  });
},

getDogProfile: (req, res) => {
  db.read_dogProfile(req.params.name, (err, response) => {
    if(err) {
      console.log(err);
      res.status(200).json(err);
    } else {
      res.status(200).json(response);
    }
  });
},

getMerchandise: (req, res) => {
  db.read_merchandise((err, response) => {
    if(err) {
      console.log(err);
      res.status(200).json(err);
    } else {
      res.status(200).json(response);
    }
  });
},

getMerchandiseDetails: (req, res) => {
  db.read_merchandiseDetails(req.params.id, (err, response) => {
    if(err) {
      console.log(err);
      res.status(200).json(err);
    } else {
      res.status(200).json(response);
    }
  });
},

addToCart: (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
    req.session.cart.push(req.body);
    res.json(req.session.cart)
},

getCart: (req, res) => {
  // console.log('getting cart', req.session.cart);
  res.json(req.session.cart);
},

removeFromCart: (req, res) => {
  // console.log(req.params.id)
  // console.log('trying to remove', req.session.cart);
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].productId == req.params.id) {
      req.session.cart.splice(i, 1);
    }
  }
  res.json(req.session.cart);
},

updateQuantity: (req, res) => {
  // console.log('trying to update', req.body);
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].productId == req.params.productId) {
      // console.log('original quantity', req.session.cart[i].productQuantity);
      req.session.cart[i].productQuantity = req.body.productQuantity;
      // console.log('new quantity', req.session.cart[i].productQuantity);
      res.json(req.session.cart);
    }
  }
},

postOrder: (req, res) => {
  // console.log('BODY', req.body);
  var token = req.body.token.id; // Using Express
// Charge the user's card:
stripe.customers.create({
  email: req.body.token.email,
  source: token,
}).then(function(customer) {
  return stripe.charges.create({
    amount: req.body.total,
    currency: "usd",
    description: "Example charge",
    customer: customer.id,
  })
}).then(function(charge){
//     // asynchronously called
    // console.log('CHARGE', charge);
    var order = req.body.token;
    var backcart = req.body.cart;
    var address = order.card.address_line1 + ' ' + order.card.address_city + ' ' + order.card.address_zip;
    // console.log('ADDRESS!!!', address);
    var values = [order.card.name, address, order.email, req.body.total];
    db.create_order(values, (err, response) => {
      // console.log('creating order');
      if (err) {
        console.log('ORDER ERROR!!!!!!!', err);
      } else {
        // console.log('ORDER', response);
       for (let i = 0; i < backcart.length; i++) {
        //  console.log(backcart[i].productId, backcart[i].productSize, backcart[i].productQuantity);
         db.create_orderitems(response[0].id, backcart[i].productId, backcart[i].productSize, backcart[i].productQuantity, (err, response) => {
           if (err) {
             console.log('ORDERITEMS ERROR!!!!!!!', err);
           }
         });
       }
      //  console.log('ORDERITEMS', response);
       res.status(200).json(response);
      }
      });
    });
},




};
