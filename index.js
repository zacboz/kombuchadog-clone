const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const session = require('express-session');
const config = require('./config')
const port = 3023;

const app = module.exports = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// console.log(__dirname);
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false
}));

const conn = massive.connectSync({
  connectionString : "postgres://postgres:@localhost/kombuchadog-clone"
});
app.set('db', conn);
const db = app.get('db');
const mainController = require('./mainController');

app.get('/our-dogs-index', mainController.getUpForAdoption);
app.get('/success-stories-index', mainController.getAdopted);
app.get('/our-dogs/:name', mainController.getDogProfile);
app.get('/merchandise-index', mainController.getMerchandise);
app.get('/merchandise/:id', mainController.getMerchandiseDetails);
app.post('/cart', mainController.addToCart);
app.get('/cart', mainController.getCart);
app.put('/cart/:id', mainController.updateQuantity);
app.delete('/cart/:id', mainController.removeFromCart);




app.listen(3023, () => {
  console.log('Connected on port', port)
});
