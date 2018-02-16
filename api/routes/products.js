const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const router = express.Router();

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => ({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3002/products/' + doc._id
          }
        }))
      };

      // if(docs.length > 0) {
        res.status(200).json(response);
      // } else {
      //   res.status(404).json({
      //     message: 'No entries found',
      //   })
      // }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      })
    })
});

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created product sucessfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: 'http://localhost:3002/products/' + result._id
          }
        },
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      })
    });
});

router.route('/:productId')
  .get((req, res) => {
    const id = req.params.productId;
    Product.findById(id)
      .select("name price _id")
      .exec()
      .then(doc => {
        console.log('From database:', doc);
        if(doc) {
          res.status(200).json({
            product: doc,
            request: {
              type: 'GET',
              url: 'http://localhost:3002/products/' + doc._id
            }
          });
        } else {
          res.status(404).json({ message: 'No valid entry found for provided ID'});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
  })
  .patch((req, res) => {
    const id = req.params.productId;
    const updateOps = {};
    for(let ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Product updated',
          request: {
            type: 'GET',
            url: 'http://localhost:3002/products/' + id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
    // Product.update({ _id: id }, { $set: { name: req.body.name, req.body.price }})
  })
  .delete((req, res) => {
    const id = req.params.productId;
    Product.remove({_id: id})
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Product deleted',
          request: {
            type: 'POST',
            url: 'http://localhost:3002/products',
            body: { name: 'String', price: 'Number' },
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err,
        })
      })
  })

module.exports = router;
