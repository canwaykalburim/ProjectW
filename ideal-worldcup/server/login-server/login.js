const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const mongoose = require('mongoose');

const database, UserSchema, UserModel;

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/public', serveStatic(path.join(__dirname, 'index')));

http.createServer(app).listen(PORT, function() {
  console.log('Server listening on:', `http://localhost:${PORT}`);
  connectDB();
});

function connectDB() {
  const databaseUrl = 'mongodb://localhost:8080/local';

  console.log('Try to connect to the database.');

  mongoose.set('userCreateIndex', true);
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl, {userNewUrlParser: true});

  database.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.on('open', function() {
    console.log('Connected to database.')
  })
}

function addUser(database, nickname, id, password, callback) {
  console.log('addUser called.');

  const user = new UserModel({"nickname": nickname, "id": id, "password": password});
  user.save(function(err) {
    if(err) {
      callback(err, null);
      return;
    }

    console.log("User data added.")
    callback(null, user)
  })
}
