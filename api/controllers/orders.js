const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => ({
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:3002/orders/${doc._id}`,
            }
          })
        ),
      });
    })
    .catch(err => res.status(500).json({error: err}))
}

exports.orders_create_order = (req, res) => {
  Product.findById(req.body.productId)
    .then(product => {
      if(!product) {
        return res.status(400).json({
          message: "Product not found"
        });
      }
      const order = new Order ({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });

      return order.save()
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: 'GET',
          url: `http://localhost:3002/orders/${result._id}`,
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Product not found',
        error: err,
      })
    })
}

exports.orders_get_order = (req, res) => {
  Order.findById(req.params.orderId)
    .populate('product', '_id name price')
    .select('product quantity _id')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3002/orders',
        },
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      })
    })
}

exports.orders_delete_order = (req, res) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3002/orders',
          body: { productId: 'ID', quantity: 'Number' },
        },
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      })
    })
}
