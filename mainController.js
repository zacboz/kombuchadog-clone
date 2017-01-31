const app = require('./index');
const db = app.get('db');

module.exports = {

getUpForAdoption: (req, res) => {
  db.read_upForAdoption((err, response) => {
    if(err) {
      console.log(err);
      res.status(200).json(err);
    } else {
      console.log('getting our dogs', response)
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
      console.log('getting success stories', response)
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
      console.log('getting dog by name', response)
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
      console.log('getting merchandise', response)
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
      console.log('getting merchandise details', response)
      res.status(200).json(response);
    }
  });
},

addToCart: (req, res) => {
  var cart = req.body;
  var values = [cart.id, cart.productId, cart.title, cart.price, cart.image, cart.size, cart.quantity];
  db.add_toCart(values, (err, response) => {
    if(err) {
      console.log(err);
    } else {
      console.log('adding to cart', response);
      res.status(200).json(response);
    }
  });
}

};
