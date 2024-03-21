/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// config
dotenv.config();

// const
const app = express();

// DATABASE CONNECTION
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DEV_DATABASE, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors());

// Require APIs
// implement required apis here

// local APIs
app.use('/v1/api', async (req, res) => {
  res.send('use `npm run crud:operation` to implement crud');
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on PORT ${PORT}`);
  }
});

module.exports = app;
