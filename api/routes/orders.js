const express = require('express');
const router = express.Router();

// Handle incoming GET requests to /orders
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Orders were fetched',
  });
});

router.post('/', (req, res) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };

  res.status(201).json({
    message: 'Orders was created',
    order
  });
});

router.route('/:orderId')
  .get((req, res) => {
    res.status(200).json({
      message: 'Order details',
      orderId: req.params.orderId,
    });
  })
  .delete((req, res) => {
    res.status(200).json({
      message: 'Order deleted',
    });
  })

module.exports = router;
