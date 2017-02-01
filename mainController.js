const app = require('./index');
const db = app.get('db');

module.exports = {

getUpForAdoption: (req, res) => {
  db.read_upForAdoption((err, response) => {
    if(err) {
      console.log(err);
      res.status(200).json(err);
    } else {
      // console.log('getting our dogs', response)
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
      // console.log('getting success stories', response)
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
      // console.log('getting dog by name', response)
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
      // console.log('getting merchandise', response)
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
      // console.log('getting merchandise details', response)
      res.status(200).json(response);
    }
  });
},

addToCart: (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
    req.session.cart.push(req.body);
    // console.log('adding to cart', req.session.cart)
    res.json(req.session.cart)
},

getCart: (req, res) => {
  console.log('getting cart', req.session.cart);
  res.json(req.session.cart);
},

removeFromCart: (req, res) => {
  // console.log(req.params.id)
  console.log('trying to remove', req.session.cart);
  for (var i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].productId == req.params.id) {
      req.session.cart.splice(i, 1);
    }
  }
  res.json(req.session.cart);
},

updateQuantity: (req, res) => {

}


};
