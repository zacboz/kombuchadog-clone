const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const session = require('express-session');
const port = 3023;

const app = module.exports = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// console.log(__dirname);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

const conn = massive.connectSync({
  connectionString : "postgres://postgres:@localhost/kombuchadog-clone"
});
app.set('db', conn);
const db = app.get('db');
const mainController = require('./mainController');

app.get('/our-dogs-up-for-adoption-index', mainController.getUpForAdoption);
app.get('/success-stories-adopted-index', mainController.getAdopted);
app.get('/our-dogs/:name', mainController.getDogProfile);




app.listen(3023, () => {
  console.log('Connected on port', port)
});