const dotenv = require('dotenv');
dotenv.config();

const  mongoose = require('mongoose');
mongoose.connect(process.env.DB_SRV, { useNewUrlParser: false })
  .catch(error => console.error("Didn't connect", error));;

mongoose.connection.on('error', err => {
  console.error("Already Connected", err);
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const router = require('./routes');

app.use(bodyParser.json())

app.use('/api/', router);
module.exports = app;