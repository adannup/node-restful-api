const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect(`mongodb://adannup:${process.env.MONGO_ATLAS_PWD}@node-rest-shop-shard-00-00-fvtie.mongodb.net:27017,node-rest-shop-shard-00-01-fvtie.mongodb.net:27017,node-rest-shop-shard-00-02-fvtie.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin`);
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS CONFIG
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  });

  if (req.method === 'OPTIONS') {
    // res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.set('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({})
  }

  next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    }
  })
});

module.exports = app;
