const dotenv = require('dotenv');
dotenv.config();

const  mongoose = require('mongoose');
mongoose.connect(process.env.DB_SRV, { useNewUrlParser: false });

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const router = require('./routes');

app.use(bodyParser.json())

app.use('/api/', router);
module.exports = app;