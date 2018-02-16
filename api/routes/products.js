const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const router = express.Router();

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs);
      if(docs.length > 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: 'No entries found',
        })
      }

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
        message: 'Handling POST request to /products',
        createdProduct: result,
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
      .exec()
      .then(doc => {
        console.log('From database:', doc);
        if(doc) {
          res.status(200).json(doc);
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
        console.log(result);
        res.status(200).json(result);
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
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({
          error: err,
        })
      })
  })

module.exports = router;
