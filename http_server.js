const express = require('express');
const app = express();
const low = require('lowdb');
const fs = require('lowdb/adapters/FileSync');
const adapter = new fs('db.json');
const accAdapter = new fs('accountsDB.json');
const db = low(adapter);
const accDB = low(accAdapter)
const cors = require('cors');

// allow cross-origin resource sharing (CORS)
app.use(cors());

// data parser - used to parse post data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files from public directory
// -------------------------------------------
app.use(express.static('public'));

// init the data store
db.defaults({ users: [] }).write();
accDB.defaults({ accounts: [] }).write();

let port = process.env.PORT || 3000;

// return all users
app.get('/data', function (req, res) {
    res.send(db.get('users').value());
});

// add user
app.post('/add', function (req, res) {
    var user = {
        'name': req.body.name,
        'dob': req.body.dob,
        'email': req.body.email,
        'username': req.body.username,
        'password': req.body.password,
        'phone': req.body.phone,
        'streetaddress': req.body.streetaddress,
        'citystatezip': req.body.citystatezip,
        'latitude': req.body.latitude,
        'longitude': req.body.longitude,
        'avatar': req.body.avatar
    }
    db.get('users').push(user).write();
    console.log(db.get('users').value());
    res.send(db.get('users').value());
});

app.get('/accounts', function (req, res) {
  res.send(accDB.get('accounts').value());
});

// add 10 accounts
app.post('/accounts', function (req, res) {
  var account = {
      'accountNumber': req.body.accountNumber,
      'accountName': req.body.accountName,
      'routingNumber': req.body.routingNumber,
      'amount': req.body.amount,
      'dateCreated': req.body.dateCreated,
  }
  accDB.get('accounts').push(account).write();
  console.log(accDB.get('accounts').value());
  res.send(`Account ${account.accountNumber} has been created succesfully!`);
});

// start server
// -----------------------
app.listen(port, function () {
    console.log(`Running on port ${port}`);
});
